import {useState} from 'react';
import {Sheet} from 'react-modal-sheet';

import InfoIcon from '../icons/info.svg';

import styles from '../styles/ui/Hint.module.css';

type Props = {
    popupContent?: boolean;
};

export function Hint({popupContent = false}: Props) {
    const [active, setActive] = useState(false);
    const [open, setOpen] = useState(false);

    const onClick = () => {
        if (popupContent) {
            setOpen(!open);
        } else {
            setActive(true);
        }
    };

    const onMouseEnter = () => {
        if (!popupContent) {
            setActive(true);
        }
    };

    const onMouseLeave = () => {
        if (!popupContent) {
            setActive(false);
        }
    };

    const content = (
        <>
            First of all, the Geocoder API converts addresses into coordinates, which you can see in the XLSX file
            available for download. Then, that file is converted into JSON.
            <br />
            <br />
            The API may offer you the closest building if possible, as it takes into account common misspellings. In
            some cases, it can only identify a street or city; this might be due to a mistake, or because a building is
            new or has been demolished.
        </>
    );

    return (
        <div className={styles.hint} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick}>
            <InfoIcon />
            <span className={styles.button}>How it works</span>

            <Sheet isOpen={open} detent="content-height" onClose={() => setOpen(false)}>
                <Sheet.Container style={{borderTopRightRadius: 24, borderTopLeftRadius: 24}}>
                    <Sheet.Header>
                        <div className="modal-container">
                            <div className="modal-control" />
                        </div>
                    </Sheet.Header>
                    <Sheet.Content>
                        <div className={styles.info}>{content}</div>
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet>

            {active && <div className={styles.content}>{content}</div>}
        </div>
    );
}
