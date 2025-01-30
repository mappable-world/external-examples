import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type JSX,
} from "react";
import { Sheet } from "react-modal-sheet";

import type {
  MapEventUpdateHandler,
  MMapLocationRequest,
  MMapZoomLocation,
} from "@mappable-world/mappable-types";
import {
  Map,
  MapControl,
  MapControls,
  MapDefaultFeaturesLayer,
  MapDefaultMarker,
  MapDefaultSchemeLayer,
  MapListener,
  MapZoomControl,
} from "../lib";

import { GeocoderContext } from "../providers/GeocoderProvider";
import { Button, Card, Hint, Input } from "../ui";

import CloseIcon from "../icons/close.svg";
import KeyIcon from "../icons/key.svg";
import MappableLogo from "../icons/mappable.svg";
import RefreshIcon from "../icons/refresh.svg";
import SuccessIcon from "../icons/success.svg";
import { MobileContext } from "../providers/MobileProvider";

import UploadIcon from "../icons/upload.svg";
import DownloadIcon from "../icons/download.svg";

import {
  GROUP_COLORS,
  GROUP_TITLES,
  MAP_MARGIN,
  MARKER_COLORS,
  PRECISION_COLORS,
} from "../constants/constants";

import classNames from "classnames/bind";
import styles from "../styles/components/ResultComponent.module.css";
import {
  GroupsEnum,
  PrecisionEnum,
  type GeocodingResult,
} from "../types/geocoding-result";
import { getBounds } from "../utils/getBounds";

const cx = classNames.bind(styles);

export const ResultComponent: FC = () => {
  const { apiKey, setApiKey, outputBuffer, result, setResult } =
    useContext(GeocoderContext);
  const { isMobiles } = useContext(MobileContext);

  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState<MMapLocationRequest>({
    center: [0, 0],
    zoom: 1,
  });
  const [activeId, setActiveId] = useState<GeocodingResult["id"]>();

  const groupedResult = useMemo<Record<GroupsEnum, number>>(() => {
    return result.reduce<Record<GroupsEnum, number>>(
      (previousValue, currentValue) => {
        if (currentValue.precision === PrecisionEnum.EXACT) {
          previousValue.building += 1;
          return previousValue;
        } else if (
          [
            PrecisionEnum.NUMBER,
            PrecisionEnum.NEAR,
            PrecisionEnum.RANGE,
          ].includes(currentValue.precision)
        ) {
          previousValue.closeBuilding += 1;
          return previousValue;
        } else if (
          [PrecisionEnum.STREET, PrecisionEnum.OTHER].includes(
            currentValue.precision
          )
        ) {
          previousValue.streetOrCity += 1;
          return previousValue;
        } else {
          previousValue.wasntDefined += 1;
          return previousValue;
        }
      },
      {
        building: 0,
        closeBuilding: 0,
        streetOrCity: 0,
        wasntDefined: 0,
      }
    );
  }, [result]);

  const onXLSXDownloadClick = () => {
    if (outputBuffer) {
      const blob = new Blob([outputBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "result.xlsx";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    }
  };

  const onJSONDownloadClick = () => {
    const jsonString = JSON.stringify(result, null, 2);

    const blob = new Blob([jsonString], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "result.json";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  };

  const onUpdate: MapEventUpdateHandler = useCallback((state) => {
    setLocation(state.location);
  }, []);

  const onMarkerClick = useCallback((marker: GeocodingResult) => {
    if (marker.precision !== "other") {
      setLocation({
        center: marker.coordinates,
        zoom: 16,
        easing: "ease-in-out",
        duration: 2000,
      });
    }
  }, []);

  const onChangeViewClick = useCallback(() => {
    setOpen((openState) => !openState);
  }, []);

  const onNewUpload = useCallback(() => {
    setResult([]);
  }, [setResult]);

  const onRefreshClick = useCallback(() => {
    setApiKey("");
    setResult([]);
  }, [setResult, setApiKey]);

  const onZoomToAll = useCallback(() => {
    const bounds = getBounds(
      result.map((item) => item.coordinates).filter(Boolean) as number[][]
    );
    setLocation({ bounds, duration: 2000, easing: "ease-in-out" });
  }, [result]);

  const onListItemClick = (markerProp: GeocodingResult) => {
    if (isMobiles) {
      setOpen(true);
    }
    if (markerProp.coordinates) {
      setLocation({
        center: markerProp.coordinates,
        zoom: 16,
        easing: "ease-in-out",
        duration: 2000,
      });
    }
  };

  const onMouseOver = useCallback((geocodingResult: GeocodingResult) => {
    if (geocodingResult.coordinates) {
      setActiveId(geocodingResult.id);
    }
  }, []);

  const onMouseOut = useCallback(() => {
    setActiveId(undefined);
  }, []);

  useEffect(() => {
    if (result.length) {
      const bounds = getBounds(
        result.map((item) => item.coordinates).filter(Boolean) as number[][]
      );
      setLocation({ bounds, duration: 2000, easing: "ease-in-out" });
    }
  }, [result]);

  const PopupContent = (markerProp: GeocodingResult): JSX.Element => {
    return (
      <div className={styles.popup}>
        {markerProp.precision !== "exact" ? (
          <>
            <div className={styles.strokedText}>
              <s>{markerProp.input}</s>
            </div>
            <span className={styles.text}>{markerProp.address}</span>
          </>
        ) : (
          <span className={styles.text}>{markerProp.input}</span>
        )}
      </div>
    );
  };

  const mapContent = (
    <Map location={location} margin={MAP_MARGIN}>
      <MapDefaultSchemeLayer />

      <MapDefaultFeaturesLayer />

      <MapControls position="right">
        <MapZoomControl />
      </MapControls>

      {isMobiles && (
        <MapControls position="top right">
          <MapControl transparent>
            <div className={styles.closeButton} onClick={onChangeViewClick}>
              <CloseIcon />
            </div>
          </MapControl>
        </MapControls>
      )}

      {result
        .filter((markerProp) => markerProp.precision)
        .map((markerProp) => {
          const markerColor =
            MARKER_COLORS[
              PRECISION_COLORS[markerProp.precision] as "green" | "orange"
            ];

          return (
            <MapDefaultMarker
              title={String(markerProp.id)}
              key={markerProp.id}
              size="normal"
              iconName="fallback"
              coordinates={markerProp.coordinates}
              disableRoundCoordinates
              onClick={() => onMarkerClick(markerProp)}
              color={
                !activeId
                  ? markerColor.active
                  : activeId && activeId === markerProp.id
                  ? markerColor.active
                  : markerColor.disabled
              }
              popup={{
                content: () => PopupContent(markerProp),
                show: (location as MMapZoomLocation).zoom > 15,
                position: "bottom",
              }}
            />
          );
        })}

      {isMobiles && (location as MMapZoomLocation).zoom > 15 && (
        <MapControls position="bottom">
          <MapControl transparent>
            <div className={styles.zoomOutButton} onClick={onZoomToAll}>
              Zoom out to all
            </div>
          </MapControl>
        </MapControls>
      )}

      <MapListener onUpdate={onUpdate} />
    </Map>
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.inputContainer}>
          <div className={styles.title}>
            <MappableLogo />
            Address to coordinates
          </div>
          <div className={styles.inputContent}>
            <div className={styles.input}>
              {isMobiles ? (
                <div className={styles.iconWrapper}>
                  <KeyIcon />
                  <SuccessIcon />
                </div>
              ) : (
                <Input disabled success={true} error={false} value={apiKey} />
              )}
              <Button size="big" onClick={onRefreshClick}>
                <RefreshIcon />
              </Button>
            </div>

            <Button size="big" onClick={onNewUpload}>
              <div className={styles.button}>
                <UploadIcon />
                <div>New upload</div>
              </div>
            </Button>
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.cardsTop}>
          <div className={styles.cardsHeader}>
            <div className={styles.cardsTitle}>
              <div>Result of a defining</div>
              {!isMobiles && <Hint />}
            </div>
            <div className={styles.cardsSubtitle}>
              <div className={styles.buttons}>
                <Button onClick={onXLSXDownloadClick} fontSize="small">
                  <div className={styles.button}>
                    <DownloadIcon />
                    <div>XSLX</div>
                  </div>
                </Button>
                <Button onClick={onJSONDownloadClick} fontSize="small">
                  <div className={styles.button}>
                    <DownloadIcon />
                    <div>JSON</div>
                  </div>
                </Button>
              </div>

              {isMobiles && <Hint popupContent />}
            </div>
          </div>

          <div className={styles.cardsBlock}>
            {Object.entries(groupedResult).map(([key, value], index) => (
              <Card
                key={index}
                title={GROUP_TITLES[key as GroupsEnum]}
                color={GROUP_COLORS[key as GroupsEnum]}
                count={value}
              />
            ))}
          </div>
        </div>

        {isMobiles && (
          <Button size="big" onClick={onChangeViewClick}>
            Open on a map
          </Button>
        )}

        <ul className={styles.resultList}>
          {result.map((geocodingResult) => (
            <li
              key={geocodingResult.id}
              onMouseOver={() => onMouseOver(geocodingResult)}
              onMouseOut={onMouseOut}
              onClick={() => onListItemClick(geocodingResult)}
            >
              <div className={styles.listItemTitle}>
                <span>{geocodingResult.id}.</span>
                <span>{geocodingResult.input}</span>
              </div>
              <div className={styles.listItemContent}>
                {geocodingResult.precision !== "exact" && (
                  <span
                    className={cx(
                      "text",
                      PRECISION_COLORS[geocodingResult.precision] || "red"
                    )}
                  >
                    {geocodingResult.precision || "error"}
                  </span>
                )}
                <div
                  className={`circle ${
                    PRECISION_COLORS[geocodingResult.precision] || "red"
                  }`}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isMobiles ? (
        <Sheet isOpen={open} onClose={() => setOpen(false)} disableDrag>
          <Sheet.Container
            style={{ borderTopRightRadius: 24, borderTopLeftRadius: 24 }}
          >
            <Sheet.Content className="modal-content">
              <div className={styles.mapWrapper}>{mapContent}</div>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop />
        </Sheet>
      ) : (
        <div className={styles.mapContainer}>{mapContent}</div>
      )}
    </div>
  );
};
