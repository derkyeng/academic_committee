import React from "react";
import { useState, useEffect } from "react";
import styles from "./Modal.module.css";

const MODAL_STYLES = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#FFF",
    padding: "50px",
    zIndex: 1000,
};

const OVERLAY_STYLES = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, .7)",
    zIndex: 1000,
};

export default function Modal({ open, onClose, onSubmit }) {
    const [committeeName, setCommitteeName] = useState("");
    const [committeeDescription, setCommitteeDescription] = useState("");

    const validateForm = (title, description) => {
        if (title.length === 0 || description.length === 0) {
            return;
        } else {
            onSubmit({ committeeName, committeeDescription });
            setCommitteeName("");
            setCommitteeDescription("");
        }
    };

    if (!open) return null;

    return (
        <>
            <div style={OVERLAY_STYLES} onClick={onClose} />
            <div style={MODAL_STYLES}>
                <form>
                    <label>
                        Name:
                        <input
                            className={styles.name}
                            type="text"
                            name="name"
                            required
                            value={committeeName}
                            onChange={(e) => {
                                setCommitteeName(e.target.value);
                            }}
                        />
                    </label>
                    <br />
                    <label>
                        Description:
                        <textarea
                            className={styles.description}
                            type="text"
                            required
                            value={committeeDescription}
                            onChange={(e) => setCommitteeDescription(e.target.value)}
                        ></textarea>
                    </label>
                    <br />
                    <button
                        type="button"
                        onClick={() => {
                            validateForm(committeeName, committeeDescription);
                        }}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </>
    );
}
