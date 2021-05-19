export const polygonArea = (polygons: { x: number, y: number }[]): number => {
    let j = 0;
    let area = 0;

    for (let i = 0;i < polygons.length;i++) {
        j = (i + 1) % polygons.length;

        area += polygons[i].x * polygons[j].y;
        area -= polygons[i].y * polygons[j].x;
    }

    area /= 2;
    return (area < 0 ? -area : area);
};

export const flattenObject = (obj: any) => {
    const flattened: { [k: string]: any } = {};

    Object.keys(obj).forEach((key: string) => {

        if (obj[key] && typeof obj[key] === 'object') {
            flattened[key] = Object.keys(obj[key]).includes('value') ? obj[key]['value'] : flattenObject(obj[key]);
        } else {
            flattened[key] = obj[key];
        }
    });
    return Array.isArray(obj) ? Object.values(flattened) : flattened;
};