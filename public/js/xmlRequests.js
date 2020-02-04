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
