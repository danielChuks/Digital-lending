import { Select, ConfigProvider } from "antd";
import styles from "./customSelector.module.css";

interface SelectorProps {
    onChange?: (
        value: React.MouseEvent<Element, MouseEvent>,
        option?:
            | { label: string; value: string }
            | { label: string; value: string }[]
    ) => void;
    optionsList: any;
    value?: any;
    label?: string;
    name?: any;
    FormItemName?: any;
    readonly?: boolean;
    stylesprops?: string;
}

const filterOption = (
    input: string,
    option?: { label: string; value: string }
) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

const CustomSelector: React.FC<SelectorProps> = ({
    onChange,
    value,
    optionsList,
    label,
    name,
    FormItemName,
    readonly,
    stylesprops,
}: SelectorProps) => (
    <div className={styles["select-container"]}>
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#d9d9d9",
                },
            }}
        >
            <div className={`${styles["label"]} ${stylesprops}`}>{label}</div>
            <Select
                showSearch
                filterOption={filterOption}
                optionFilterProp='children'
                onChange={onChange}
                value={value}
                options={optionsList}
                disabled={readonly}
            />
        </ConfigProvider>
    </div>
);

export default CustomSelector;
