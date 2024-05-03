import React, { useState } from 'react';
import styles from './Steps.module.scss';

export interface StepsProps {
  step: number;    
}

export default function Steps(props: StepsProps) {
  const items = [
    {
      title: "输入原文",
    },
    {
      title: "编辑新闻",
    },
    {
      title: "完成",
    }
  ]
  return (
    <div className={styles.steps_frame}>
      {
        items.map((item, index) => (
          <div className={`${styles.steps_item} ${index + 1 === items.length && styles.last}`} key={item.title}>
            <div className={`${styles.icon} ${props.step > index + 1 ? styles.success : props.step === index + 1 ? styles.active : ''}`}>
              {
                props.step > index + 1 ? <i className="material-icons done"></i> : <span className={styles.num}>{index + 1}</span>
              }
            </div>
            <div className={styles.title}>{item.title}</div>
          </div>
        ))
      }
      
    </div>
  )
}