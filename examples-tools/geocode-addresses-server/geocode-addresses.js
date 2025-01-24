#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const argv = yargs(hideBin(process.argv))
  .option("input", {
    describe: "Input file",
    type: "string",
    demandOption: true,
  })
  .option("output", {
    describe: "Output file",
    type: "string",
    demandOption: true,
  })
  .option("geocode-option-apikey", {
    describe: "api key option",
    type: "string",
    demandOption: true,
  })
  .option("geocode-option-lang", {
    describe: "lang=<string>",
    type: "string",
  })
  .option("geocode-option-kind", {
    describe: "[kind=<string>]",
    type: "string",
  })
  .option("geocode-option-rspn", {
    describe: "[rspn=<boolean>]",
    type: "string",
  })
  .option("geocode-option-ll", {
    describe: "[ll=<number>, <number>]",
    type: "string",
  })
  .option("geocode-option-spn", {
    describe: "[spn=<number>, <number>]",
    type: "string",
  })
  .option("geocode-option-bbox", {
    describe: "[bbox=<number>,<number>~<number>,<number>]",
    type: "string",
  })
  .option("geocode-option-results", {
    describe: "[results=<integer>]",
    type: "number",
  })
  .option("geocode-option-skip", {
    describe: "[skip=<integer>]",
    type: "number",
  })
  .option("geocode-option-uri", {
    describe: "[uri=<string>]",
    type: "string",
  })
  .option("geocode-option-format", {
    describe: "[format=<string>]",
    type: "string",
  })
  .strict().argv;

const SUPPORTED_EXTENSIONS = [".xls", ".xlsx", ".csv"];

function readFileToBuffer(filePath) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    const readStream = fs.createReadStream(filePath);

    readStream.on("data", (chunk) => {
      chunks.push(chunk);
    });

    readStream.on("end", () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });

    readStream.on("error", (err) => {
      reject(err);
    });
  });
}

/**
 * Geocodes an address using the Geocoding API.
 *
 * @async
 * @function geocodeAddress
 *
 * @param {string} address - The address to be geocoded.
 * @param {Object} options - Additional options for the API request, such as the API key and any other URL parameters.
 *
 * @returns {Promise<Object>} - A promise that resolves to an object containing the geocoding result, including coordinates and precision.
 * @property {string} status - The status of the geocoding request ('OK' or 'FAIL').
 * @property {Object} [address] - The fetched address data if the geocoding was successful.
 * @property {string} [coordinates] - The latitude and longitude of the address in "longitude latitude" format if successful.
 * @property {string} [precision] - The precision of the geocoding result (e.g., 'exact', 'number', 'street').
 *
 */
async function geocodeAddress(address, options) {
  const params = new URLSearchParams({
    format: "json",
    geocode: address,
    ...options,
  }).toString();
  const url = `https://geocoder.api.mappable.world/v1?${params}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(String(response.status));
    }

    const res = await response.json();
    const featureMember = res.response.GeoObjectCollection.featureMember[0];
    if (featureMember) {
      const geoObject = featureMember.GeoObject;
      const fetchAddress =
        geoObject.metaDataProperty.GeocoderMetaData.Address.formatted;
      const precision = geoObject.metaDataProperty.GeocoderMetaData.precision;
      const coordinates = geoObject.Point.pos;

      return {
        status: "OK",
        address: fetchAddress,
        coordinates,
        precision,
      };
    }
    return {
      address,
      status: "FAIL",
    };
  } catch (error) {
    console.log("error", error);
    throw new Error(`Geocoder API error ${error.message}`);
  }
}

/**
 * Processes an Excel file buffer, geocodes addresses, and writes the results to a new file.
 *
 * @async
 * @function processFile
 *
 * @param {Buffer} buffer - The buffer containing the Excel file data to be processed.
 * @param {string} bookType - The type of workbook output (e.g., 'xlsx', 'csv', etc.).
 * @param {Object} options - Additional options for geocoding, passed to the geocodeAddress function.
 *
 * @returns {Promise<Object>} - A promise that resolves to an object containing the geocoded data and the new Excel file buffer.
 * @property {Array<Object>} data - Array of geocoded data results.
 * @property {Buffer} buffer - The buffer of the new Excel file with geocoded addresses.
 *
 */
async function processFile(buffer, bookType, options) {
  const outputData = [];

  const newWorkbook = XLSX.utils.book_new();
  const workbook = XLSX.read(buffer, { type: "buffer", codepage: 65001 });
  const sheetNames = workbook.SheetNames;

  for (const sheetName of sheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    for (let row of jsonData) {
      const geocodeResult = await geocodeAddress(row.Address, options);
      outputData.push(geocodeResult);
    }
    const newWorksheet = XLSX.utils.json_to_sheet(outputData);
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);
  }

  return {
    data: outputData,
    buffer: XLSX.write(newWorkbook, { bookType, type: "buffer" }),
  };
}

async function main() {
  const { input, output, ...rest } = argv;

  const inputExtension = path.extname(input);
  const outputExtension = path.extname(input);

  if (
    !SUPPORTED_EXTENSIONS.includes(inputExtension) ||
    !SUPPORTED_EXTENSIONS.includes(outputExtension)
  ) {
    console.error("Unsupported file extension!");
    process.exit(1);
  }
  if (!input || !output) {
    console.error("Arguments --input and --output are missing");
    process.exit(1);
  }

  const options = {};
  for (const [key, value] of Object.entries(rest)) {
    if (key.startsWith("geocode-option-")) {
      const keyOption = key.replace("geocode-option-", "");
      options[keyOption] = value;
    }
  }

  const outputFileExtension = path.extname(output).slice(1);

  try {
    const fileBuffer = await readFileToBuffer(input);

    const { buffer } = await processFile(
      fileBuffer,
      outputFileExtension,
      options
    );

    fs.writeFile(output, buffer, (err) => {
      if (err) {
        console.error("Writing file error!");
        process.exit(1);
      }
    });
  } catch (e) {
    console.error("Error:", e.message);
    process.exit(1);
  }
}

main();
