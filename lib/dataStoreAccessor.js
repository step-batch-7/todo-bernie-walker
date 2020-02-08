const fs = require('fs');
const DATA_STORE_PATH = './data/todoList.json';

const readDataStore = () => {
  try {
    return JSON.parse(fs.readFileSync(DATA_STORE_PATH, 'utf8'));
  } catch (error) {
    return [];
  }
};

const writeToDataStore = data => {
  try {
    fs.writeFileSync(DATA_STORE_PATH, data, 'utf8');
  } catch (error) {
    fs.mkdirSync('./data');
    fs.writeFileSync(DATA_STORE_PATH, data, 'utf8');
  }
};

module.exports = { readDataStore, writeToDataStore };
