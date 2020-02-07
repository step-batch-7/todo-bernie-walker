class Item {
  constructor(id, title, isDone) {
    this.itemId = id;
    this.title = title;
    this.done = isDone;
  }

  mark() {
    this.done = !this.done;
  }

  getId() {
    return this.itemId;
  }

  setTitle(newTitle) {
    this.title = newTitle;
  }
}

module.exports = { Item };
