import React from 'react';
import { Spin } from 'antd';
import { useStore } from 'src/contexts/globalContext';
import Mask from 'src/atoms/styledMask';




const Loading = () => {
    const { isLoading } = useStore();
    return(
        <>
            {   isLoading &&
                <Mask>
                    <Spin style={{zIndex: 10}} tip="Loading..."></Spin> 
                </Mask>
            }
            
        </>

    )
    
}


export default Loading;