import React, { useState, createContext, useContext } from 'react';

export const Context = createContext();

export const useStore = () => useContext(Context);



export const CameraProvider = ({ children }) => {
    
    const [currentRangeIndex, setCurrentRangeIndex] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const [showCameraTotalTag, setShowCameraTotalTag] = useState(false);
    const [baseCamera, setBaseCamera] = useState('');

    return (
        <Context.Provider
            value={{
                showCameraTotalTag,
                setShowCameraTotalTag,
                currentRangeIndex,
                setCurrentRangeIndex,
                totalRows,
                setTotalRows,
                baseCamera,
                setBaseCamera
            }}
        >
            {children}
        </Context.Provider>
    );
};
