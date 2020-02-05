const fs = require('fs');
const DATA_STORE_PATH = './data/todoList.json';
const INDENT = 2;

const readDataStore = () =>
  JSON.parse(fs.readFileSync(DATA_STORE_PATH, 'utf8'));

const writeToDataStore = data => {
  fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(data, null, INDENT), 'utf8');
};

const markItemOnList = function({ from, toMark }) {
  const todos = readDataStore();
  const itemToMark = todos[from].items[toMark];
  itemToMark.done = !itemToMark.done;
  writeToDataStore(todos);
};

const deleteItemFromList = function({ from, toDelete }) {
  const todos = readDataStore();
  let { items } = todos[from];
  items.splice(toDelete, '1');
  items = items.map((item, index) => {
    item.itemId = item.itemId.replace(/(\d+)_(\d+)/, `$1_${index}`);
    return item;
  });
  writeToDataStore(todos);
};

const deleteTaskFromList = function({ toDelete }) {
  const todos = readDataStore();
  delete todos[toDelete];
  writeToDataStore(todos);
};

const appendItemToList = function({ title, to }) {
  const todos = readDataStore();
  const { items } = todos[to];
  const itemId = `${to}_${items.length}`;
  items.push({ itemId, task: title, done: false });
  writeToDataStore(todos);
};

const appendTaskToList = function({ title }) {
  const todos = readDataStore();
  const listId = new Date().getTime();
  const items = [];
  todos[listId] = { listId, title, items };
  writeToDataStore(todos);
};

const listTasks = function() {
  const todos = readDataStore();
  const taskList = [];

  for (const todoId in todos) {
    const { listId, title, items } = todos[todoId];

    taskList.push({ listId, title, items });
  }

  return JSON.stringify(taskList);
};

module.exports = {
  listTasks,
  appendTaskToList,
  appendItemToList,
  deleteTaskFromList,
  deleteItemFromList,
  markItemOnList
};
