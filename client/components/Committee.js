import React from 'react'
import styles from './Committee.module.css'

function Committee({committee}) {
    return(
        <div className={styles.item}>
          <p className={styles.committee_name}>{committee.display_name}</p>
          <p>{committee.description}</p>
        </div>
      );
}

export default Committee