const fs = require('fs');
const DATA_STORE_PATH = './data/todoList.json';

const listTasks = function() {
  const todos = JSON.parse(fs.readFileSync(DATA_STORE_PATH, 'utf8'));
  const taskList = [];

  for (const todoId in todos) {
    const id = todos[todoId].listId;
    const title = todos[todoId].title;
    taskList.push({ id, title });
  }

  return JSON.stringify(taskList);
};

module.exports = { listTasks };
