import { Modal, ConfigProvider } from "antd";

export interface DialogueBoxProps {
    title?: string;
    content: string | any;
    okText?: string;
    cancelText?: string;
    onOk?: any;
    onCancel?: any;
}
const DialogueBox: React.FC<any> = ({ DialogueBoxProps, open, setOpen }) => {
    const hideModal = () => {
        setOpen(false);
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#39C594",
                },
            }}
        >
            <Modal
                title={DialogueBoxProps.title}
                open={open}
                onOk={DialogueBoxProps.onOk}
                onCancel={hideModal}
                okText={DialogueBoxProps.okText}
                cancelText={DialogueBoxProps.cancelText}
                style={{ left: 0 }}
            >
                <p>{DialogueBoxProps.content}</p>
            </Modal>
        </ConfigProvider>
    );
};

export default DialogueBox;
