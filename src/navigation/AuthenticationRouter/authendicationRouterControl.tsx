import { Outlet } from "react-router-dom";
import styles from "./authendicationRouterControl.module.css";
import PalmsLogo from '../../assets/icons/bank_logo.png';

export const AuthendicationRouterControl = () => {
  return (
    <>
      <div className={styles["leftContainer"]}>
        <div className={styles.bgImg}>
        <img className={styles.palmsLogo} src={PalmsLogo} alt="palms logo" />
        </div>
      </div>
      <div className={styles["rightContainer"]}>
        <Outlet />
      </div>
    </>
  );
};
