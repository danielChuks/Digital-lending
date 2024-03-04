import styles from "./fundPartnersInforCards.module.css";

interface FundPartnersInfoCardProps {
    name: string;
    linkedInformation: string;
    onclick: () => void;
}

export const FundPartnersInfoCard = ({
    name,
    linkedInformation,
    onclick,
}: FundPartnersInfoCardProps) => {
    return (
        <div className={styles["card-container"]} onClick={onclick}>
            <div className={styles["top-section"]}>
                <div className={styles["header"]}>{name}</div>
            </div>
            <div className={styles["buttom-section"]}>
                <span>{linkedInformation}</span>
            </div>
        </div>
    );
};
