import { Select, ConfigProvider } from "antd";
import styles from "./customSelector.module.css";

interface SelectorProps {
  onChange?: (
    value: React.MouseEvent<Element, MouseEvent>,
    option?: ({ label: string; value: string } | { label: string; value: string }[])
  ) => void;
  optionsList: any;
  value?: any;
  label?: string;
  name?: any;
  FormItemName?: any;
  readonly?:boolean
}

const filterOption = (
  input: string,
  option?: { label: string; value: string }
) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

const CustomSelector: React.FC<SelectorProps> = (props: SelectorProps) => (
  <div className={styles["select-container"]}>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#d9d9d9",
        },
      }}
    >
       <div className={styles["label"]}>{props.label}</div>
      <Select
        showSearch
        filterOption={filterOption}
        optionFilterProp="children"
        onChange={props.onChange}
        value={props.value}
        options={props.optionsList}
        disabled={props.readonly}
      />
    </ConfigProvider>
  </div>
);

export default CustomSelector;
