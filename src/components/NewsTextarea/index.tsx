import React from 'react';
import styles from './NewsTextarea.scss';

export default function NewsTextarea() {
    return (
        <div className={styles.frame}>
            <div className={styles.placeholder}>请输入新闻内容</div>
        </div>
    );
}