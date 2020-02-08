const { Todo } = require('./todo');
const INDENT = 2;

class List {
  constructor() {
    this.todoList = [];
  }

  generateTodoId() {
    let listLength = this.todoList.length;
    if (!listLength) {
      return listLength;
    }
    let lastId = +this.todoList[--listLength].getId();
    return ++lastId;
  }

  findTodo(idToMatch) {
    const index = this.todoList.findIndex(todo => todo.getId() === idToMatch);
    return { found: this.todoList[index], index };
  }

  addTodo(title, id) {
    const todoId = id || '' + this.generateTodoId();
    this.todoList.push(new Todo(todoId, title));
  }

  deleteTodo(id) {
    const { index } = this.findTodo(id);
    const removal = 1;
    this.todoList.splice(index, removal);
  }

  editTodo(todoId, newTitle) {
    const { found } = this.findTodo(todoId);
    found.setTitle(newTitle);
  }

  addItem(todoId, task) {
    const { found } = this.findTodo(todoId);
    found.addItem(task);
  }

  deleteItem(itemId) {
    const [todoId] = itemId.split('_');
    const { found } = this.findTodo(todoId);
    found.deleteItem(itemId);
  }

  editItem(itemId, newTitle) {
    const [todoId] = itemId.split('_');
    const { found } = this.findTodo(todoId);
    found.editTask(itemId, newTitle);
  }

  markItem(itemId) {
    const [todoId] = itemId.split('_');
    const { found } = this.findTodo(todoId);
    found.markItem(itemId);
  }

  write(writer) {
    writer(JSON.stringify(this.todoList, null, INDENT));
  }

  static load(todoList) {
    const list = new List();

    todoList.forEach(todo => {
      list.todoList.push(Todo.load(todo));
    });

    return list;
  }
}

module.exports = { List };
