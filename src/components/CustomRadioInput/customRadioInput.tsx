import React, { useState } from "react";
import { Radio, RadioChangeEvent, ConfigProvider } from "antd";
import styles from "./customRadioInput.module.css";

interface radioTypeProps {
  onChange?: (e: RadioChangeEvent) => void;
  value?: boolean;
  options?:any;
  title?: string;
  name?: string | void;
  readonly?:boolean
}
const CustomRadioInput: React.FC<radioTypeProps> = (props: radioTypeProps) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Radio: {
            colorPrimary: "#3ac793",
          },
        },
      }}
    >
      <div className={styles["radio-container"]}>
        {props.title ? (
          <div className={styles["radio-title"]}>{props.title}</div>
        ) : (
          ""
        )}
        <Radio.Group onChange={props.onChange} value={props.value}>
          {props.options?.map((option:any, index:number) => (
            <Radio key={index} value={option.value} disabled={props.readonly}>
              {option.label}
            </Radio>
          ))}
        </Radio.Group>
      </div>
    </ConfigProvider>
  );
};

export default CustomRadioInput;
