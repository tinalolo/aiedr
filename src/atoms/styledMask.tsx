import styled  from 'styled-components';


const Mask = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position:absolute;
    z-index:9;
    top:0;
    right:0;
    bottom:0;
    left:0;
    background:rgba(0, 0, 0, 0.2);
    width:100%;
    height:100%;
`

export default Mask;
