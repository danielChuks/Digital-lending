type NotificationType = "success" | "info" | "warning" | "error";

export interface CommonnotificationProps {
    type: NotificationType;
    msgtitle: string;
    msgDesc: string;
    api: any;
}

const openNotificationWithIcon = (params: CommonnotificationProps) => {
    params.api[params.type]({
        message: params.msgtitle,
        description: params.msgDesc,
    });
};

export default openNotificationWithIcon;
