const { assert } = require('chai');
const { Item } = require('../lib/item');

describe('Item', function() {
  let item;

  beforeEach(function() {
    item = new Item('123', 'hello', false);
  });

  context('.mark', function() {
    it('should mark done as true if it is already false', function() {
      item.done = true;
      item.mark();
      assert.isFalse(item.done);
    });

    it('should mark done as false if it is already true', function() {
      item.mark();
      assert.isTrue(item.done);
    });
  });

  context('.getId', function() {
    it('should get the id of the give', function() {
      assert.strictEqual(item.getId(), '123');
    });
  });

  describe('.setTask', function() {
    it('should update the title with the given title', function() {
      item.setTask('world');
      assert.strictEqual(item.title, 'world');
    });
  });
});
