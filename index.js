const fs = require("fs");
const path = require("path");
const folder = "Roam-Export-1605777000343";
const dateFns = require("date-fns");

async function readFile(filePath, fileName) {
  try {
    const date = fileName.replace(".md", "");
    let formattedDate = dateFns.parse(date, "MMMM do, yyyy", new Date());
    const tag = `#journal/${dateFns.getYear(formattedDate)}/${
      dateFns.getMonth(formattedDate) + 1
    }`;

    let data = await fs.promises.readFile(filePath);

    let updatedData = data
      .toString()
      .replace(/{{[[DONE]]}}/g, "- [x]")
      .replace(/{{[[TODO]]}}/g, "- [ ]")
      .replace(/{{#[[Quick Capture]]}}/g, "#quick-capture");

    let title = `# ${date} \n\n${tag}\n`;
    updatedData = title + "\n" + updatedData;
    fs.writeFile(`${directoryPath}/${fileName}`, updatedData, (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    });
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
}

const directoryPath = path.join(__dirname, folder);
fs.readdir(directoryPath, function (err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  (async () => {
    for (const file of files) {
      await readFile(`${directoryPath}/${file}`, file);
    }
  })();
});
