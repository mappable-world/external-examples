import {ChangeEvent, useCallback, useContext, useEffect, useState} from 'react';
import {Button, Input, Spinner, Uploader} from '../ui';

import MappableLogo from '../icons/mappable.svg';
import RefreshLogo from '../icons/refresh.svg';

import {GeocoderContext} from '../providers/GeocoderProvider';
import {MobileContext} from '../providers/MobileProvider';

import styles from '../styles/components/InputComponent.module.css';

export function InputComponent() {
    const {
        error: geocodingError,
        loading: geocodingLoading,
        setApiKey: setContextApiKey,
        apiKey: contextApiKey,
        testApiKey,
        onLoadFile
    } = useContext(GeocoderContext);
    const {isMobiles} = useContext(MobileContext);
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [apiKey, setApiKey] = useState<string>('');
    const [apiKeySuccess, setApiKeySuccess] = useState<boolean>(false);

    const onApiKeyInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setApiKey(value);
        setError(false);
    }, []);

    const onClearClick = useCallback(() => {
        setApiKey('');
        setError(false);
    }, []);

    const onSubmitClick = useCallback(async () => {
        setLoading(true);
        try {
            await testApiKey(apiKey);
            setApiKeySuccess(true);
            setContextApiKey(apiKey);
        } catch (err) {
            setError(true);
            setApiKeySuccess(false);
        } finally {
            setLoading(false);
        }
    }, [apiKey, testApiKey, setContextApiKey]);

    const onRefreshClick = useCallback(() => {
        setApiKeySuccess(false);
        setApiKey('');
    }, []);

    useEffect(() => {
        if (contextApiKey) {
            setApiKey(contextApiKey);
            setApiKeySuccess(true);
        }
    }, [contextApiKey]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.title}>
                    <MappableLogo />
                    Address to coordinates
                </div>
                <div className={styles.content}>
                    <div className={styles.inputWrapper}>
                        <Input
                            success={apiKeySuccess}
                            error={error}
                            onInput={onApiKeyInput}
                            value={apiKey}
                            onClearClick={onClearClick}
                        />
                        {apiKeySuccess && (
                            <Button size="big" disabled={!apiKey || error} onClick={onRefreshClick}>
                                <RefreshLogo />
                            </Button>
                        )}
                    </div>
                    {!apiKeySuccess && (
                        <Button size="big" color="yellow" disabled={!apiKey || error} onClick={onSubmitClick}>
                            <div className={styles.moderateButton}>{loading ? <Spinner /> : 'Moderate'}</div>
                        </Button>
                    )}
                </div>
                {apiKeySuccess ? (
                    <Uploader
                        buttonMode={isMobiles}
                        onLoad={onLoadFile}
                        error={geocodingError}
                        loading={geocodingLoading}
                    />
                ) : (
                    <div className={styles.subtitle}>
                        Without key Geocoding is impossible. Don’t forget to put domain in your account. If you don’t
                        have API key, register in&nbsp;
                        <a className={styles.link} target="_blank" rel="noreferrer" href="https://mappable.world/">
                            Mappable
                        </a>
                        &nbsp;or maybe you already have a key in your account.
                    </div>
                )}
            </div>
        </div>
    );
}
