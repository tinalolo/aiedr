import { notification } from 'antd';

const useNotification = () => {
    const openNotificationInfo = (config: any) => {
        notification.info({
            ...config
        });
    };

    const openNotificationSuccess = (config: any) => {
        notification.success({
            ...config
        });
    };

    const openNotificationError = (config: any) => {
        notification.error({
            ...config
        });
    };

    return ({
        openNotificationInfo,
        openNotificationSuccess,
        openNotificationError
    });
};

export default useNotification;

