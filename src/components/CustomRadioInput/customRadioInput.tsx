import React, { useState } from "react";
import { Radio, RadioChangeEvent, ConfigProvider } from "antd";
import styles from "./customRadioInput.module.css";

interface radioTypeProps {
    onChange?: (e: RadioChangeEvent) => void;
    value?: boolean;
    options?: any;
    title?: string;
    name?: string | void;
    readonly?: boolean;
}
const CustomRadioInput: React.FC<radioTypeProps> = ({
    title,
    value,
    options,
    name,
    readonly,
    onChange,
}: radioTypeProps) => {
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
                {title ? (
                    <div className={styles["radio-title"]}>{title}</div>
                ) : (
                    ""
                )}
                <Radio.Group onChange={onChange} value={value}>
                    {options?.map((option: any, index: number) => (
                        <Radio
                            key={index}
                            value={option.value}
                            disabled={readonly}
                        >
                            {option.label}
                        </Radio>
                    ))}
                </Radio.Group>
            </div>
        </ConfigProvider>
    );
};

export default CustomRadioInput;
