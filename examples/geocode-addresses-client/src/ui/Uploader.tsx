import { ChangeEvent, DragEvent, useCallback, useRef, useState } from "react";

import InfoIcon from "../icons/info.svg";
import UploadIcon from "../icons/upload.svg";
import zipSample from "../files/mappable-addresses-sample.zip";

import { ALLOWED_FILE_TYPES } from "../constants/constants";

import { Button } from "./Button";

import classNames from "classnames/bind";
import styles from "../styles/ui/Uploader.module.css";

type Props = {
  onLoad: (buffer: Buffer) => void;
  error: boolean;
  loading: boolean;
  buttonMode: boolean;
};

const cx = classNames.bind(styles);
const ALLOWED_FILE_TYPES_STR = ALLOWED_FILE_TYPES.join(", ");

export function Uploader({ onLoad, error, loading, buttonMode }: Props) {
  const [fileError, setFileError] = useState(false);
  const fileInputRef = useRef(null);

  const readFileToBuffer = (file: File) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setFileError(true);
      return;
    }
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      const buffer = reader.result;
      onLoad(buffer as unknown as Buffer);
      setFileError(false);
    };
    reader.onerror = () => {
      setFileError(true);
    };
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      readFileToBuffer(file);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files?.length > 0) {
      const file = files?.[0];
      if (file) {
        readFileToBuffer(file);
      }
    }
  };

  const onDownloadButtonClick = useCallback(() => {
    const a = document.createElement("a");
    a.href = zipSample;
    a.download = "addresses-sample.zip";
    a.click();
    a.remove();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Processing ...</div>;
  }

  return (
    <div className={cx({ mobile: buttonMode })}>
      {(error || fileError) && (
        <div className={styles.error}>
          <InfoIcon />
          Uploaded format is not correct. Try again
        </div>
      )}
      <div
        className={cx("fileInput", "dropzone")}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {buttonMode ? (
          <Button
            size="big"
            color="yellow"
            onClick={() => (fileInputRef.current as any).click()}
          >
            <UploadIcon />
            Upload file from library
          </Button>
        ) : (
          <div className={styles.title}>
            <UploadIcon />
            <span>
              Drop your file here or open a
              <button
                className={styles.button}
                onClick={() => (fileInputRef.current as any).click()}
              >
                Library
              </button>
            </span>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={ALLOWED_FILE_TYPES_STR}
        />
        <span className={styles.subtitle}>
          File should have 50 rows or less. Format xls, xslx, csv
        </span>
      </div>
      <div className={cx("examples", { compact: buttonMode })}>
        {buttonMode ? (
          <Button onClick={onDownloadButtonClick} color="transparent">
            Download an example
          </Button>
        ) : (
          <Button onClick={onDownloadButtonClick} color="gray">
            Download an example
          </Button>
        )}
      </div>
    </div>
  );
}
