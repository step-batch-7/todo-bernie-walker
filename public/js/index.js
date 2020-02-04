const CODE_OK = 200;

const modifyItems = function(item) {
  const innerTemplate = document.querySelector('#innerTemplate').innerHTML;
  const { itemId, done, task } = item;
  const doneClass = done ? 'done' : '';
  return innerTemplate
    .replace(/{_itmId_}/g, itemId)
    .replace(/{_item-title_}/, task)
    .replace(/{_done_}/, doneClass);
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
  return html.join('\n');
};

const addTaskListToBody = function(taskList) {
  const taskListArea = document.querySelector('.task-list');
  const taskListHtml = createHtml(JSON.parse(taskList));
  taskListArea.innerHTML = taskListHtml;
};

const deleteTask = function(clickedOn) {
  const idToDelete = clickedOn.id;
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
  dltTaskReq.open('DELETE', idToDelete);
  dltTaskReq.send();
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
