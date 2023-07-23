const fs = require("fs");

// Define the source and destination paths
const sourcePath = "./rules.json";
const destPath = "./dist/rules.json";

function createDirectory(dirPath) {
  fs.mkdir(dirPath, { recursive: true }, (err) => {
    if (err) {
      console.log(`Error creating directory: ${err}`);
    } else {
      console.log("Directory created successfully!");
    }
  });
}

createDirectory("./dist/mydata");

// Read the source file
fs.readFile(sourcePath, "utf8", function (err, data) {
  if (err) {
    console.log(`Error reading file from disk: ${err}`);
  } else {
    // Write the file to the destination path
    fs.writeFile(destPath, data, function (err) {
      if (err) {
        console.log(`Error writing file to disk: ${err}`);
      } else {
        console.log("File copied successfully!");
      }
    });
  }
});
