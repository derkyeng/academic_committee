import styles from "./FacultySearch.module.css";

export default function Description({ children, ...props }) {
    return (
        <div className={styles.info_div} {...props}>
            <h2>Faculty Search</h2>
            <p>{children}</p>
        </div>
    );
}
