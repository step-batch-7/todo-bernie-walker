const CODE_OK = 200;

const modifyItems = function(item) {
  const innerTemplate = document.querySelector('#innerTemplate').innerHTML;
  const { itemId, done, task } = item;
  const doneClass = done ? 'done' : '';
  return innerTemplate
    .replace(/{_itmId_}/g, itemId)
    .replace(/{_item-title_}/, task)
    .replace(/{_done_}/g, doneClass);
};

const createHtml = function(taskList) {
  const template = document.querySelector('#topTemplate').innerHTML;
  const html = taskList.map(list => {
    const { listId, title } = list;
    let { items } = list;
    items = items.map(modifyItems);

    return template
      .replace(/{_id_}/g, listId)
      .replace(/{_title_}/, title)
      .replace(/{_innerHtml_}/, items.join('\n'));
  });
  return html.reverse().join('\n');
};

const addTaskListToBody = function(taskList) {
  const taskListArea = document.querySelector('.task-list');
  const taskListHtml = createHtml(JSON.parse(taskList));
  taskListArea.innerHTML = taskListHtml;
};

const markItem = function(clickedOn) {
  const [, from, toMark] = clickedOn.id.match(/.*_(\d+)_(\d+)/);
  const markItemReq = new XMLHttpRequest();

  markItemReq.onerror = function() {
    document.body.innerHTML = 'error while processing please reload';
  };

  markItemReq.onload = function() {
    if (markItemReq.status === CODE_OK) {
      addTaskListToBody(markItemReq.response);
      return;
    }
    document.body.innerHTML = 'could not mark';
  };

  markItemReq.open('POST', '/markItem');
  markItemReq.setRequestHeader(
    'Content-Type',
    'application/x-www-form-urlencoded'
  );
  markItemReq.send(`from=${from}&toMark=${toMark}`);
};

const deleteItem = function(clickedOn) {
  const [, from, toDelete] = clickedOn.id.match(/.*_(\d+)_(\d+)/);
  const dltItemReq = new XMLHttpRequest();

  dltItemReq.onerror = function() {
    document.body.innerHTML = 'error while processing please reload';
  };
  dltItemReq.onload = function() {
    if (dltItemReq.status === CODE_OK) {
      addTaskListToBody(dltItemReq.response);
      return;
    }
    document.body.innerHTML = 'not deleted';
  };
  dltItemReq.open('DELETE', '/deleteItem');
  dltItemReq.setRequestHeader(
    'Content-Type',
    'application/x-www-form-urlencoded'
  );
  dltItemReq.send(`from=${from}&toDelete=${toDelete}`);
};

const addNewItem = function(clickedOn) {
  const [, itemId] = clickedOn.id.match(/.*-(\d+)/);
  const itemTitle = document.querySelector(`#itm-ip-${itemId}`).value;
  document.querySelector(`#itm-ip-${itemId}`).value = '';
  const addItemReq = new XMLHttpRequest();

  addItemReq.onerror = function() {
    document.body.innerHTML = 'error while processing please reload';
  };

  addItemReq.onload = function() {
    if (addItemReq.status === CODE_OK) {
      addTaskListToBody(addItemReq.response);
      return;
    }

    document.body.innerHTML = 'item not added';
  };

  addItemReq.open('POST', '/addNewItem');
  addItemReq.setRequestHeader(
    'Content-Type',
    'application/x-www-form-urlencoded'
  );
  addItemReq.send(`title=${itemTitle}&to=${itemId}`);
};

const deleteTask = function(clickedOn) {
  const idToDelete = clickedOn.id.split('_').pop();
  const dltTaskReq = new XMLHttpRequest();
  dltTaskReq.onerror = function() {
    document.body.innerHTML = 'error while processing please reload';
  };
  dltTaskReq.onload = function() {
    if (dltTaskReq.status === CODE_OK) {
      addTaskListToBody(dltTaskReq.response);
      return;
    }
    document.body.innerHTML = 'not deleted';
  };
  dltTaskReq.open('DELETE', '/deleteTask');
  dltTaskReq.setRequestHeader(
    'Content-Type',
    'application/x-www-form-urlencoded'
  );
  dltTaskReq.send(`toDelete=${idToDelete}`);
};

const addNewTaskToList = function() {
  const title = document.querySelector('.new-title').value;
  document.querySelector('.new-title').value = '';
  const addTaskReq = new XMLHttpRequest();

  addTaskReq.onerror = function() {
    document.body.innerHTML = 'error while processing please reload';
  };

  addTaskReq.onload = function() {
    if (addTaskReq.status === CODE_OK) {
      addTaskListToBody(addTaskReq.response);
      return;
    }

    document.body.innerHTML = 'task not added';
  };

  addTaskReq.open('POST', '/taskListAddNew');
  addTaskReq.setRequestHeader(
    'Content-Type',
    'application/x-www-form-urlencoded'
  );
  addTaskReq.send(`title=${title}`);
};

const loadTaskList = function() {
  const taskRequest = new XMLHttpRequest();

  taskRequest.onerror = function() {
    document.body.innerHTML = 'error while processing please reload';
  };

  taskRequest.onload = function() {
    if (taskRequest.status === CODE_OK) {
      addTaskListToBody(taskRequest.response);
      return;
    }

    document.body.innerHTML = 'file not found';
  };

  taskRequest.open('GET', '/taskList');
  taskRequest.send();
};

window.onload = loadTaskList;
