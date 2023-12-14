import React, { useState, KeyboardEvent } from "react";
import styles from "./Button.module.css";
import { FetcherSubmitFunction, useNavigate } from "react-router-dom";
import BackArrow from "../../assets/icons/back-arrow.svg";
import NextArrow from "../../assets/icons/next-arrow.svg";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from "antd";

interface ButtonProps {
  text: string;
  type: "submit" | "reset" | "button" | undefined;
  disabled?: boolean;
  buttonType?: string;
  navigatePath?: string;
  onClick?: React.MouseEventHandler;
  icon?: boolean;
  open?:boolean;
}

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const navigate = useNavigate();
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const handleTab = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Tab") {
      event.preventDefault();
    }
  };

  return (
    <>
      <button
        type={props.type}
        className={` ${
          props.buttonType === "back" ? styles.back_button : props.buttonType === "next" ? styles.next_button : styles.button_field
        }`}
        onKeyDown={(evt) => {
          handleTab(evt);
        }}
        onClick={props.onClick}
        disabled={props.disabled}
      >
        {props.icon && props.buttonType === "back" ? (
          <img
            className={styles["back-btn-icon"]}
            src={BackArrow}
            alt="back-arrow"
          />
        ) : props.buttonType === "next" ? (
          <img
            className={styles["next-btn-icon"]}
            src={NextArrow}
            alt="next-arrow"
          />
        ) : (
          ""
        )}
        <Spin indicator={antIcon}  style={{color:"#ffffff",left:"10%",position:"absolute",visibility:props.open?"visible":"hidden"}}  />
        {props.text}
      </button>
    </>
  );
};

export default Button;
