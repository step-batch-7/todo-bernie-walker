const { assert } = require('chai');
const { Todo } = require('../lib/todo');
const { Item } = require('../lib/item');

describe('Todo', function() {
  describe('todo.load', function() {
    const todoContent = {
      listId: '1',
      title: 'hello',
      items: [{ task: 'world', itemId: '3', done: false }]
    };
    const todo = Todo.load(todoContent);

    it('should load the list to create new instance of Todo', function() {
      assert.isTrue(todo instanceof Todo);
    });

    it('items should be instances of Item', function() {
      assert.isTrue(todo.items[0] instanceof Item);
    });
  });

  let todo;
  beforeEach(function() {
    todo = new Todo('1', 'hello');
  });

  context('.getId', function() {
    it('should get the id of the todo', function() {
      assert.strictEqual(todo.getId(), '1');
    });
  });

  context('.setTitle', function() {
    it('should set the title of the todo', function() {
      todo.setTitle('world');
      assert.strictEqual(todo.title, 'world');
    });
  });

  describe('functionToDescribe', function() {});
});
