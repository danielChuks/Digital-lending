import { ConfigProvider, Table } from "antd";
import styles from "./Table.module.css";

interface TableProps {
    tableTitle?: string;
    columns: any;
    data: any;
}

const CustomTable: React.FC<TableProps> = ({
    columns,
    data,
    tableTitle,
}: TableProps) => (
    <div className={styles["table-container"]}>
        {tableTitle ? (
            <div className={styles["table-sub-heading"]}>{tableTitle}</div>
        ) : (
            ""
        )}
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#0000001f",
                },
            }}
        >
            <Table columns={columns} dataSource={data} />
        </ConfigProvider>
    </div>
);

export default CustomTable;
