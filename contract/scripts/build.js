const fs = require("fs").promises;
const path = require("path");

// Define the source and destination paths
const sourceDir = "./";
const destDir = "./dist/";
const mydataDir = "./dist/mydata";

const filesToCopy = ["rules.json", "hp.cfg.override", "credentials.json"]; // Add your files here

async function createDirectory(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    console.log("Directory created successfully!");
  } catch (err) {
    console.log(`Error creating directory: ${err}`);
  }
}

async function copyFiles(sourceDir, destDir, files) {
  await createDirectory(destDir);
  await createDirectory(mydataDir);

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);

    try {
      const data = await fs.readFile(sourcePath, "utf8");
      await fs.writeFile(destPath, data);
      console.log(`File ${file} copied successfully!`);
    } catch (err) {
      console.log(`Error copying file ${file}: ${err}`);
    }
  }
}

copyFiles(sourceDir, destDir, filesToCopy);
