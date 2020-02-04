const createHtml = function(taskList) {
  const html = taskList.map(list => {
    const { id, title } = list;
    return `<div class="item" id="click_${id}">
              ${title}
              <button class="item-delete" id="delete_${id}">dlt</button>
            </div>`;
  });

  return html.join('\n');
};

const addTaskListToBody = function(taskList) {
  const taskListArea = document.querySelector('div.task-list');
  const taskListHtml = createHtml(JSON.parse(taskList));
  taskListArea.innerHTML = taskListHtml;
};

const addNewTitle = function() {
  const title = document.querySelector('#new-title').value;
  document.querySelector('#new-title').value = '';
  const addTitleReq = new XMLHttpRequest();

  addTitleReq.onerror = function() {
    document.body.innerHTML = 'error while processing please reload';
  };

  addTitleReq.onload = function() {
    if (addTitleReq.status === codeOk) {
      addTaskListToBody(addTitleReq.response);
      return;
    }

    document.body.innerHTML = 'file not found';
  };

  addTitleReq.open('POST', '/taskListAddNew');
  addTitleReq.setRequestHeader(
    'Content-Type',
    'application/x-www-form-urlencoded'
  );
  addTitleReq.send(`title=${title}`);
};

const loadTaskList = function() {
  const codeOk = 200;
  const taskRequest = new XMLHttpRequest();

  taskRequest.onerror = function() {
    document.body.innerHTML = 'error while processing please reload';
  };

  taskRequest.onload = function() {
    if (taskRequest.status === codeOk) {
      addTaskListToBody(taskRequest.response);
      return;
    }

    document.body.innerHTML = 'file not found';
  };

  taskRequest.open('GET', '/taskList');
  taskRequest.send();
};

window.onload = loadTaskList;
