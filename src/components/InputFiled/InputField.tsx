import styles from "./InputFiled.module.css";

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
    value?: string | number;
    min?: string;
    max?: string;
    name?: any;
    label?: string;
    rules?: any;
    readonly?: boolean;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

const InputField: React.FC<TextFieldProps> = ({
    outerClass,
    image,
    placeholder,
    type,
    required,
    readonly,
    pattern,
    title,
    minLength,
    maxLength,
    onChange,
    value,
    min,
    max,
    name,
    label,
    rules,
    onBlur,
}: TextFieldProps) => {
    return (
        <>
            {label !== "hidden" && (
                <>
                    {label ? (
                        <div className={styles["label"]}>{label}</div>
                    ) : (
                        ""
                    )}
                </>
            )}
            {/* {props.label?<div className={styles["label"]}>{props.label}</div>:""} */}
            {label === "hidden" && (
                <div className={styles["label"]}>
                    {" "}
                    <br></br>
                </div>
            )}
            <div className={`${styles.input_field} ${outerClass}`}>
                {image ? <img src={image} alt='' /> : ""}
                <input
                    type={type}
                    placeholder={placeholder}
                    required={required || false}
                    style={{ padding: image ? "" : "8px 15px" }}
                    pattern={pattern}
                    title={title}
                    maxLength={maxLength}
                    minLength={minLength}
                    onChange={onChange}
                    value={value}
                    min={min}
                    max={max}
                    name={name}
                    disabled={readonly}
                    onBlur={onBlur}
                />{" "}
            </div>
        </>
    );
};

export default InputField;
