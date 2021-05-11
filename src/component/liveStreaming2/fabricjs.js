import { fabric } from 'fabric';
//import { configConsumerProps } from 'antd/lib/config-provider';

export const defaultVedioWidth = 1280;
export const defaultVedioHeight = 720;

// define a function that can locate the controls.
// this function will be used both for drawing and for interaction.
function polygonPositionHandler(dim, finalMatrix, fabricObject) {
    let x = (fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x),
        y = (fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y);
    return fabric.util.transformPoint(
        { x: x, y: y },
        fabric.util.multiplyTransformMatrices(
            fabricObject.canvas.viewportTransform,
            fabricObject.calcTransformMatrix()
        )
    );
}

// define a function that will define what the control does
// this function will be called on every mouse move after a control has been
// clicked and is being dragged.
// The function receive as argument the mouse event, the current trasnform object
// and the current position in canvas coordinate
// transform.target is a reference to the current object being transformed,
// let currentControl;
function actionHandler(eventData, transform, x, y) {

    const cv = transform.target.canvas;
    const cx = x >= cv.width ? cv.width : x < 0 ? 0 : x;
    const cy = y >= cv.height ? cv.height : y < 0 ? 0 : y;
    let polygon = transform.target;
    const  currentControl = polygon.controls[polygon.__corner];//|| currentControl;
    let mouseLocalPosition = polygon.toLocalPoint(new fabric.Point(cx, cy), 'center', 'center'),
        polygonBaseSize = polygon._getNonTransformedDimensions(),
        size = polygon._getTransformedDimensions(0, 0),
        finalPointPosition = {
            x: mouseLocalPosition.x * polygonBaseSize.x / size.x + polygon.pathOffset.x,
            y: mouseLocalPosition.y * polygonBaseSize.y / size.y + polygon.pathOffset.y
        };

    if (currentControl) {
        polygon.points[currentControl.pointIndex] = finalPointPosition;
    }
    return true;
}

// define a function that can keep the polygon in the same position when we change its
// width/height/top/left.
function anchorWrapper(anchorIndex, fn) {
    return function (eventData, transform, x, y) {
        let fabricObject = transform.target;
        let absolutePoint = fabric.util.transformPoint({
            x: (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x),
            y: (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y)
        }, fabricObject.calcTransformMatrix());
        let actionPerformed = fn(eventData, transform, x, y);
        fabricObject._setPositionDimensions({});
        let polygonBaseSize = fabricObject._getNonTransformedDimensions();
        let newX = (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) / polygonBaseSize.x;
        let newY = (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) / polygonBaseSize.y;
        fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
        return actionPerformed;
    };
}

export function addCanvas(width, height) {

    const cvs = new fabric.Canvas('my-canvas');
    cvs.setDimensions({width: '100%', height: '100%', position: 'absolute'}, {cssOnly: true});
    cvs.setHeight(height);
    cvs.setWidth(width);
    return cvs;
}

export const roi = 'ROI';
export const lineCrossing = 'lineCrossing';
export function addEditablePolygon(id, name, points, canvas, type, angle, modifiedCallBack, selectedCallBack) {
    //console.log('left: ', Math.min(...points.map(o => o.x)));
    //console.log('top: ', Math.min(...points.map(o => o.y)));
    const polygon = new fabric.Polygon(points, {
        id: id,
        //angle: 90,
        //centeredRotation: true,
        name: name,
        type: type,
        //left: type === lineCrossing ? Math.min(...points.map(o => o.x)) : 0,
        //top: type === lineCrossing ? Math.min(...points.map(o => o.y)) : 0,
        fill: type === lineCrossing ? '#f81eff4d' : '#ff66004d',
        strokeWidth: 1,
        stroke: type === lineCrossing ? '#f81eff' : '#FF6024',
        objectCaching: false,
        transparentCorners: false,
        cornerColor: 'rgba(0,0,255,0.5)',
        cornerStyle: 'circle',
        lockScalingX: type === lineCrossing,
        hasControls: true,
        selectable: true
    });

    /*if (type === roi) {
        polygon.on('mousedblclick', function (e) {
            const plg = e.target
            setPolygonMode(plg, plg.hasBorders)
            console.log('plg: ',plg);
            canvas.requestRenderAll();
            
        })
        
    }*/
    polygon.on('modified', function() {
        modifiedCallBack(polygon);
    });
    polygon.on('selected', function() {
        //console.log('selected polygon: ', polygon);
        selectedCallBack(polygon);
    });

    return setPolygonMode(polygon, type === roi);
}

export function setPolygonMode(polygon, openCtrls) {

    polygon.hasBorders = !openCtrls;
    polygon.lockMovementX = openCtrls;
    polygon.lockMovementY = openCtrls;
    let lastControl = polygon.points.length - 1;
    polygon.controls = polygon.hasBorders ?
        fabric.Object.prototype.controls :
        polygon.points.reduce(function (acc, point, index) {
            acc['p' + index] = new fabric.Control({
                positionHandler: polygonPositionHandler,
                actionHandler: anchorWrapper(index > 0 ? index - 1 : lastControl, actionHandler),
                actionName: 'modifyPolygon',
                pointIndex: index
            });
            return acc;
        }, {});
    return polygon;
}

export function addUneditablePolygon(id, name, points, type) {

    const polygon = new fabric.Polygon(points, {
        id: id,
        name: name,
        type: type,
        fill: type === lineCrossing ? '#f81eff4d' : '#ff66004d',
        strokeWidth: 1,
        stroke: type === lineCrossing ? '#f81eff' : '#FF6024',
        objectCaching: false,
        transparentCorners: false,
        cornerColor: 'rgba(0,0,255,0.5)',
        cornerStyle: 'circle',
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        selectable: false,
        preserveObjectStacking: false
    });

    return polygon;
}

export function canvasReSize(canvas, clientWidth, clientHeight) {
    if(canvas) {
        const newZoom = 1 + ((clientWidth - defaultVedioWidth) / defaultVedioWidth);
        canvas.setZoom(newZoom);
        canvas.setHeight(clientHeight);
        canvas.setWidth(clientWidth);
        canvas.renderAll();
    }
}

export function canvasClear(canvas) {
    if (canvas) {
        canvas.clear();
    }
}

export function findPolygon(canvas, id) {
    return canvas?._objects?.find(obj => obj.id === id) !== undefined;
}

export function getPolygonPosition(polygon) {
    //console.log('polygon: ', polygon);
    if (polygon.type === roi) {
        return polygon.points;
    } else if(polygon.type === lineCrossing) {
        //return [polygon.aCoords.tl, polygon.aCoords.tr, polygon.aCoords.br, polygon.aCoords.bl];
        return [{x: (polygon.aCoords.tl.x + polygon.aCoords.tr.x) / 2, y: (polygon.aCoords.tl.y + polygon.aCoords.tr.y) / 2}, 
            {x: (polygon.aCoords.br.x + polygon.aCoords.bl.x) / 2, y: (polygon.aCoords.br.y + polygon.aCoords.bl.y) / 2}];
    }
}