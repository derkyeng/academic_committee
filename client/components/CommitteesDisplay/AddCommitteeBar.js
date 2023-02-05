import styles from "./AddCommittee.module.css";
import { Button } from "flowbite-react";

export default function AddCommitteeBar({ openModal }) {
    return (
        <div className={styles.add_header}>
            <h2 className={styles.header_text}>Add a new academic committee</h2>
            <Button onClick={openModal} className="button primary block">
                New Committee
            </Button>
        </div>
    );
}
