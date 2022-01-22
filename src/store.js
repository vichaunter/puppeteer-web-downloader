const fs = require("fs-extra");
const config = require("../config");

const QUEUE_FILE = "queue.json";
const EXTRACTED_FILE = "extracted.json";

let queue = [];
let saved = [];

const addToSaved = (url) => {
  saved.push(url);

  fs.writeJSONSync(`${config.rootFolder}/${EXTRACTED_FILE}`, saved);
  fs.writeJSONSync(`${config.rootFolder}/${QUEUE_FILE}`, queue);
};

const restoreSaved = async () => {
  try {
    const extracted = fs.readJSONSync(
      `${config.rootFolder}/${EXTRACTED_FILE}`,
      { throws: false }
    );
    if (extracted) {
      saved = extracted;
    }

    const queued = fs.readJSONSync(`${config.rootFolder}/${QUEUE_FILE}`, {
      throws: false,
    });
    if (queued) {
      queue = queued;
    }
  } catch (e) {
    console.log(e);
  }

  return true;
};

const addToQueue = (urls) => {
  urls.forEach((url) => {
    const ignoreRegex = new RegExp(config.ignore);
    const forbidden = ignoreRegex.test(url);
    if (!saved.includes(url) && !queue.includes(url) && !forbidden) {
      queue.push(url);
    }
  });
};

const shiftQueue = () => {
    return queue.shift()
}

module.exports = {
  addToQueue,
  addToSaved,
  restoreSaved,
  shiftQueue
};
