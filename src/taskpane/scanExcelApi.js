"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function scanExcelApi() {
  var excelApiMethods = [];
  // Iterate over the properties of the Excel object
  for (var key in Excel) {
    if (Excel.hasOwnProperty(key)) {
      var property = Excel[key];
      if (typeof property === "function") {
        excelApiMethods.push("Function: ".concat(key));
      } else if (typeof property === "object") {
        excelApiMethods.push("Object: ".concat(key));
        // Optionally, you can dive deeper into the object's methods
        for (var subKey in property) {
          if (property.hasOwnProperty(subKey) && typeof property[subKey] === "function") {
            excelApiMethods.push("  - Method: ".concat(subKey));
          }
        }
      }
    }
  }
  // Write the methods to a text file
  fs.writeFileSync("excelApiMethods.txt", excelApiMethods.join("\n"), "utf8");
  console.log("Excel API methods have been written to excelApiMethods.txt");
}
// Run the scan
scanExcelApi();
