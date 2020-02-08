const { Item } = require('./item');

class Todo {
  constructor(id, title) {
    this.listId = id;
    this.title = title;
    this.items = [];
  }

  getId() {
    return this.listId;
  }

  setTitle(newTitle) {
    this.title = newTitle;
  }

  generateItemId() {
    let itemsLength = this.items.length;
    if (!itemsLength) {
      return itemsLength;
    }
    let lastId = +this.items[--itemsLength].getId();
    return this.id + ++lastId;
  }

  findItem(idToMatch) {
    const index = this.items.findIndex(item => item.getId() === idToMatch);
    return { found: this.items[index], index };
  }

  addItem(task, id, isDone = false) {
    const itmId = id || '' + this.generateItemId();
    this.items.push(new Item(itmId, task, isDone));
  }

  deleteItem(id) {
    const { index } = this.findItem(id);
    const removal = 1;
    this.items.splice(index, removal);
  }

  markItem(id) {
    const { found } = this.findItem(id);
    found.mark();
  }

  editTask(id, newTask) {
    const { found } = this.findItem(id);
    found.setTask(newTask);
  }

  static load({ listId, title, items }) {
    const todo = new Todo(listId, title);

    items.forEach(({ itemId, task, done }) => {
      todo.addItem(task, itemId, done);
    });

    return todo;
  }
}

module.exports = { Todo };
