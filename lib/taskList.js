const fs = require('fs');
const DATA_STORE_PATH = './data/todoList.json';
const INDENT = 2;

const readDataStore = () =>
  JSON.parse(fs.readFileSync(DATA_STORE_PATH, 'utf8'));

const writeToDataStore = data => {
  fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(data, null, INDENT), 'utf8');
};

const deleteTaskFromList = function(deletionId) {
  const todos = readDataStore();
  delete todos[deletionId];
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
    const id = todos[todoId].listId;
    const title = todos[todoId].title;
    taskList.push({ id, title });
  }

  return JSON.stringify(taskList);
};

module.exports = { listTasks, appendTaskToList, deleteTaskFromList };
