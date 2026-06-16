// Regenerate data-new.js after editing data-new.json
// Run: node sync-data.js

const fs = require("fs");
const path = require("path");

const jsonPath = path.join(__dirname, "data-new.json");
const jsPath = path.join(__dirname, "data-new.js");

const json = fs.readFileSync(jsonPath, "utf8");
JSON.parse(json);

fs.writeFileSync(
    jsPath,
    "window.DAMIETTA_DATA = " + json + ";\n",
    "utf8"
);

console.log("Updated data-new.js from data-new.json");
