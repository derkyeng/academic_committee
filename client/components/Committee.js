import React from 'react'
import './Committee.module.css'

function Committee({committee}) {
    return(
        <div className="item">
          <p className="name">{committee.display_name}</p>
        </div>
      );
}

export default Committee