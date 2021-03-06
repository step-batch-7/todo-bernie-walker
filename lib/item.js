class Item {
  constructor(id, task, isDone) {
    this.itemId = id;
    this.task = task;
    this.done = isDone;
  }

  mark() {
    this.done = !this.done;
  }

  getId() {
    return this.itemId;
  }

  setTask(newTask) {
    this.task = newTask;
  }
}

module.exports = { Item };
