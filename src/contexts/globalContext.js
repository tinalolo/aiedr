import React, { useState, createContext, useContext } from 'react';

export const Context = createContext();

export const useStore = () => useContext(Context);

export const ContextProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isFuncSiderCollapsed, setIsFuncSiderCollapsed] = useState(false);

    return (
        <Context.Provider
            value={{
                isLoading,
                setIsLoading,
                isFuncSiderCollapsed,
                setIsFuncSiderCollapsed
            }}
        >
            {children}
        </Context.Provider>
    );
};
