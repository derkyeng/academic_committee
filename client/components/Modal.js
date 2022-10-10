import React from 'react'
import { useState, useEffect } from "react";

const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#FFF',
  padding: '50px',
  zIndex: 1000
}

const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, .7)',
  zIndex: 1000
}

export default function Modal({ open, children, onClose }) {
  const [committeeName, setCommitteeName] = useState("");
  const [committeeDescription, setCommitteeDescription] = useState("");

  if (!open) return null

  return  (
    <>
      <div style={OVERLAY_STYLES} onClick={onClose}/>
      <div style={MODAL_STYLES}>
        <form onSubmit={console.log("submit")}>
          <label>
            Name: 
            <input 
              type="text" 
              name="name"
              required
              value={committeeName}
              onChange={(e) => {setCommitteeName(e.target.value)}}
            />
          </label>
          <br/>
          <label>
            Description:
            <textarea
              type="text"
              required
              value={committeeDescription}
              onChange={(e) => setCommitteeDescription(e.target.value)}
            >
            </textarea>        
          </label>
          <br/>
          <button className="submitBtn" type="submit" onClick={onClose}>
            Submit
          </button>
        </form>
      </div>
    </>
  )
}