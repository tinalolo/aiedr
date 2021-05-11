import React from 'react';
import { StyledModal } from 'src/atoms/StyledModal';
import styled from 'styled-components';
import { WarningOutlined } from '@ant-design/icons';

const Modal = styled(StyledModal)`

`;

interface Props {
    content: string;
    onOkHandler: Function;
    onCancelHandler: Function;
}


const ConfirmModal = (props: Props) => {
    // eslint-disable-next-line no-empty-pattern
    const { content, onOkHandler, onCancelHandler } = props;

    Modal.confirm({
        title: 'Confirm',
        icon: <WarningOutlined style={{color: 'red', fontSize: '24px'}}/>,
        content: content,
        okText: 'Yes',
        cancelText: 'No',
        onOk: onOkHandler as any,
        onCancel: onCancelHandler as any,
        style: {top: '35%'}
        
    });
    // return (
    //     <Modal
    //         title="Basic Modal"
    //         visible={visible}
    //         onOk={closeModal}
    //         onCancel={closeModal}
    //         // okButtonProps={{ disabled: true }}
    //         // cancelButtonProps={{ disabled: true }}
    //     >
    //         <p>Some contents...</p>
    //         <p>Some contents...</p>
    //         <p>Some contents...</p>
    //     </Modal>
    // );
};

export default ConfirmModal;