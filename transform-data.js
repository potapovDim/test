const fs = require('fs');
const path = require('path');

const reformatDate = (stringDate) => {
  return `${
    stringDate.split('/')[2]}-${
    stringDate.split('/')[1]}-${
    stringDate.split('/')[0]
  }`;
};

const formatDataItem = (item) => ({
    "name": item[4],
    "phone": item[5].substring(5),
    "person": {
      "firstName": item[0],
      "lastName": item[1]
    },
    "amount": item[7],
    "date": reformatDate(item[8]),
    "costCenterNum": item[6].substring(3)
});

const writeJsonFile = (pathToFile, content) => {
  fs.writeFileSync(path.join(__dirname, `${pathToFile}.json`), JSON.stringify(content), 'utf8');
}

const readFileAndChangeFormat = (pathToFile) => {
  const pathToConvertFile = process.argv.slice(2)[0] || pathToFile
  try {
    const JsonData = [];
    const lineReader = require('readline').createInterface({
      input: fs.createReadStream(path.join(__dirname, pathToConvertFile))
    });
    lineReader.on('line', function (line) {
      JsonData.push(formatDataItem(line.split('||').map(
        item => JSON.parse(item)
      )));
    }).on('close', () => {
      JsonData.shift();
      writeJsonFile(pathToConvertFile, JsonData);
    });
  } catch (error) {
    
  }
};

readFileAndChangeFormat('./users1.csv');