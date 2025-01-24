# Geocode addresses from XLS, CSV files

## Quick start

Installing packages from `npm`:

```shell
npm install
```

After you have installed everything you need, run the script using the input and output files, as well as the API-key for the [Mappable Geocoder API](https://mappable.world/docs/geocoder-api/index.html):

```shell
node ./geocode-addresses.js \
  --input mappable-addresses-sample.csv \
  --output mappable-coordinates-sample.csv \
  --geocode-option-apikey YOUR_APIKEY
```

Or activate the script with advanced options:

```shell
node ./geocode-addresses.js \
  --geocode-option-ll 1,2 \
  --geocode-option-spn 1,2 \
  --geocode-option-bbox 1,2~3,4 \
  --input mappable-addresses-sample.csv \
  --output mappable-coordinates-sample.csv \
  --geocode-option-apikey YOUR_APIKEY
```

An example of the input file can be found in [mappable-addresses-sample.csv](./mappable-addresses-sample.csv).

## Script options

| Name                     | Required         | Description                                                                                                                                                                                                                                                   |
| ------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input`                  | true             | The input data file (supported extensions: `*.xls`, `*.xlsx`, `*.csv`)                                                                                                                                                                                        |
| `output`                 | true             | The output data file (supported extensions: `*.xls`, `*.xlsx`, `*.csv`)                                                                                                                                                                                       |
| `geocode-option-apikey`  | true             | The key issued in the [Mappable Account](https://mappable.world/account).                                                                                                                                                                                     |
| `geocode-option-lang`    | default: `en_US` | Language of the response and regional settings of the map.                                                                                                                                                                                                    |
| `geocode-option-rspn`    |                  | Flag indicating whether the search scope should be restricted to the specified area. The area is defined by the ll and spn or bbox                                                                                                                            |
| `geocode-option-ll`      |                  | Longitude and latitude of the center of the search area. The span of the search area is set in the spn parameter.                                                                                                                                             |
| `geocode-option-spn`     |                  | The span of the search area. The center of the area is set in the ll parameter. Set by two numbers: the first is the difference between the maximum and minimum longitude of the area, the second is the difference between the maximum and minimum latitude. |
| `geocode-option-bbox`    |                  | An alternative method for setting the search area. The borders are defined as the geographical coordinates of the lower-left and upper-right corners of the area (in the order "longitude, latitude").                                                        |
| `geocode-option-results` |                  | Maximum number of objects to be returned. If the skip parameter is set, its value must be set explicitly.                                                                                                                                                     |
| `geocode-option-skip`    |                  | The number of objects to skip in the response, starting from the first one. If this parameter is set, the results parameter must also be set.                                                                                                                 |
