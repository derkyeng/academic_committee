import React from 'react'
import styles from './Committee.module.css'
import {
  Card
} from "flowbite-react";

function Committee({committee}) {
    return(
        <div className={styles.card}>
          <Card href="#">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white ">
              {committee.display_name}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {committee.description}
            </p>
          </Card>
        </div>
      );
}

export default Committee