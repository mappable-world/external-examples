import type {ChangeEvent} from 'react';

import ErrorIcon from '../icons/error.svg';
import InputSuffixIcon from '../icons/input-suffix.svg';
import SuccessIcon from '../icons/success.svg';

import classNames from 'classnames/bind';
import styles from '../styles/ui/Input.module.css';

type Props = {
    error?: boolean;
    value: string;
    onInput?: (e: ChangeEvent<HTMLInputElement>) => void;
    onClearClick?: () => void;
    success?: boolean;
    disabled?: boolean;
};

const cx = classNames.bind(styles);

export function Input({error, value, onInput, onClearClick, success = false, disabled}: Props) {
    return (
        <div className={styles.wrapper}>
            <input
                autoFocus={true}
                value={value}
                onInput={onInput}
                type="text"
                className={cx('input', {
                    inputError: error
                })}
                placeholder="Put your API key here"
                disabled={disabled || success}
            />
            <div
                className={cx('suffix', {
                    show: success
                })}
            >
                <SuccessIcon />
            </div>
            <button
                className={cx({
                    suffix: true,
                    show: value && !success
                })}
                onClick={onClearClick}
            >
                <InputSuffixIcon />
            </button>
            <div
                className={cx('error', {
                    show: error
                })}
            >
                <ErrorIcon />
                This api-key is not valid. Check it please
            </div>
        </div>
    );
}
