const fs = require('fs');
const DATA_STORE_PATH = './data/todoList.json';
const INDENT = 2;

const readDataStore = () => {
  try {
    return JSON.parse(fs.readFileSync(DATA_STORE_PATH, 'utf8'));
  } catch (error) {
    return [];
  }
};

const writeToDataStore = data => {
  try {
    fs.writeFileSync(
      DATA_STORE_PATH,
      JSON.stringify(data, null, INDENT),
      'utf8'
    );
  } catch (error) {
    fs.mkdirSync('./data');
    fs.writeFileSync(
      DATA_STORE_PATH,
      JSON.stringify(data, null, INDENT),
      'utf8'
    );
  }
};

const markItemOnList = function({ from, toMark }) {
  const todos = readDataStore();
  const itemToMark = todos.find(todo => todo.listId === from).items[toMark];
  itemToMark.done = !itemToMark.done;
  writeToDataStore(todos);
};

const deleteItemFromList = function({ from, toDelete }) {
  const todos = readDataStore();
  let { items } = todos.find(todo => todo.listId === from);
  items.splice(toDelete, '1');
  items = items.map((item, index) => {
    item.itemId = item.itemId.replace(/(\d+)_(\d+)/, `$1_${index}`);
    return item;
  });
  writeToDataStore(todos);
};

const deleteTaskFromList = function({ toDelete }) {
  const todos = readDataStore();
  const deletionIndex = todos.findIndex(todo => todo.listId === toDelete);
  todos.splice(deletionIndex, '1');
  writeToDataStore(todos);
};

const appendItemToList = function({ title, to }) {
  const todos = readDataStore();
  const items = todos.find(todo => todo.listId === to).items;
  const itemId = `${to}_${items.length}`;
  items.push({ itemId, task: title, done: false });
  writeToDataStore(todos);
};

const appendTaskToList = function({ title }) {
  const todos = readDataStore();
  const listId = '' + new Date().getTime();
  const items = [];
  todos.push({ listId, title, items });
  writeToDataStore(todos);
};

const listTasks = function() {
  const todos = readDataStore();

  return JSON.stringify(todos);
};

module.exports = {
  listTasks,
  appendTaskToList,
  appendItemToList,
  deleteTaskFromList,
  deleteItemFromList,
  markItemOnList
};
