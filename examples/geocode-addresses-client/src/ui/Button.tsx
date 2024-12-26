import {ReactNode} from 'react';
import classNames from 'classnames/bind';
import styles from '../styles/ui/Button.module.css';

type Props = {
    children: ReactNode;
    onClick: () => void;
    disabled?: boolean;
    size?: 'big' | 'medium';
    color?: 'gray' | 'yellow' | 'transparent';
};

const cx = classNames.bind(styles);

export function Button({children, disabled, onClick, size = 'medium', color = 'gray'}: Props) {
    return (
        <button onClick={onClick} disabled={disabled} className={cx('button', size, color)}>
            {children}
        </button>
    );
}
