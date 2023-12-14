import { ForwardedRef } from 'react';
import styles from './InputFiled.module.css';
import { Form } from 'antd';
import { AnyTxtRecord } from 'dns';

interface TextFieldProps {
    outerClass?: string;
    image?: string;
    placeholder?: string;
    type: string;
    required?: boolean;
    pattern?: string;
    title?: string;
    minLength?: number;
    maxLength?: number;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    min?: string;
    max?: string;
    name?: any;
    label?: string;
    rules?: any;
    readonly?: boolean;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

const InputField: React.FC<TextFieldProps> = (props: TextFieldProps) => {
    return (
        <>
            {props.label !== 'hidden' && (
                <>
                    {props.label ? (
                        <div className={styles['label']}>{props.label}</div>
                    ) : (
                        ''
                    )}
                </>
            )}
            {/* {props.label?<div className={styles["label"]}>{props.label}</div>:""} */}
            {props.label === 'hidden' && (
                <div className={styles['label']}>
                    {' '}
                    <br></br>
                </div>
            )}
            <div className={`${styles.input_field} ${props.outerClass}`}>
                {props.image ? <img src={props.image} /> : ''}
                <input
                    type={props.type}
                    placeholder={props.placeholder}
                    required={props.required || false}
                    style={{ padding: props.image ? '' : '8px 15px' }}
                    pattern={props.pattern}
                    title={props.title}
                    maxLength={props.maxLength}
                    minLength={props.minLength}
                    onChange={props.onChange}
                    value={props.value}
                    min={props.min}
                    max={props.max}
                    name={props.name}
                    disabled={props.readonly}
                    onBlur={props.onBlur}
                />{' '}
                {/* </Form.Item> */}
            </div>
        </>
    );
};

export default InputField;
