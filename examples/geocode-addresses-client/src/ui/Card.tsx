import classNames from 'classnames/bind';

import styles from '../styles/ui/Card.module.css';

const cx = classNames.bind(styles);

type Props = {
    title: string;
    count: number;
    color: string;
};

export function Card({title, count, color}: Props) {
    return (
        <div className={styles.card}>
            <div className={styles.title}>{title}</div>
            <div className={styles.content}>
                <div className={styles.count}>{count}</div>
                <div className={cx('circle', color)} />
            </div>
        </div>
    );
}
