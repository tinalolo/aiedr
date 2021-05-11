import { useState } from 'react';

const useModal = () => {
    const [visible, setVisible] = useState(false);

    const openModal = () => {
        setVisible(true);
    }

    const closeModal = (callback: Function) => {
        setVisible(false);
        if (callback && typeof callback === 'function') callback();
    }

    return {
        visible,
        openModal,
        closeModal
    };
};

export default useModal;