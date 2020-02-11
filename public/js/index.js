const CODE_OK = 200;
let TODO_LIST = [];

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

const addTaskListToBody = function(taskList = TODO_LIST) {
  const taskListArea = document.querySelector('.task-list');
  const taskListHtml = createHtml(taskList);
  taskListArea.innerHTML = taskListHtml;
};

const searchItems = function(searchSection) {
  if (searchSection.value === '') {
    addTaskListToBody();
    return;
  }
  const matcher = new RegExp(searchSection.value, 'i');
  const matchedList = TODO_LIST.filter(todo =>
    todo.items.some(item => item.task.match(matcher))
  );
  addTaskListToBody(matchedList);
};

const searchTodo = function(searchSection) {
  const matcher = new RegExp(searchSection.value, 'i');

  const matchedList = TODO_LIST.filter(todo => todo.title.match(matcher));

  addTaskListToBody(matchedList);
};

const sendXHR = function(method, url, message) {
  const xhr = new XMLHttpRequest();

  xhr.onerror = () => {
    document.body.innerHTML = '<h3>error while processing please reload</h3>';
  };

  xhr.onload = () => {
    if (xhr.status === CODE_OK) {
      TODO_LIST = JSON.parse(xhr.response);
      addTaskListToBody();
      return;
    }
    document.body.innerHTML = '<h3>Bad Request</h3>';
  };

  xhr.open(method, url);
  if (message) {
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  }
  xhr.send(message);
};

const editItem = function(editedSection) {
  document.getSelection().empty();
  const { innerText, id } = editedSection;
  const [, , itemId] = id.split('-');
  sendXHR('POST', '/editItem', `title=${innerText}&id=${itemId}`);
};

const editTodoTitle = function(editedSection) {
  document.getSelection().empty();
  const { innerText, id } = editedSection;
  const [, , todoId] = id.split('-');
  sendXHR('POST', '/editTodo', `title=${innerText}&id=${todoId}`);
};

const blurActive = function() {
  if (event.key === 'Escape') {
    document.activeElement.blur();
  }
};

const markItem = function(clickedOn) {
  const [, toMark] = clickedOn.id.match(/.*_(\d+_\d+)/);
  sendXHR('POST', '/markItem', `toMark=${toMark}`);
};

const deleteItem = function(clickedOn) {
  const [, toDelete] = clickedOn.id.match(/.*_(\d+_\d+)/);
  sendXHR('DELETE', '/deleteItem', `toDelete=${toDelete}`);
};

const addNewItem = function(clickedOn) {
  const [, todoId] = clickedOn.id.match(/.*-(\d+)/);
  const itemTitle = document.querySelector(`#itm-ip-${todoId}`).value;
  document.querySelector(`#itm-ip-${todoId}`).value = '';

  if (itemTitle.match(/^\s*$/)) {
    alert('enter the task');
    return;
  }

  sendXHR('POST', '/addNewItem', `title=${itemTitle}&to=${todoId}`);
};

const deleteTodo = function(clickedOn) {
  const idToDelete = clickedOn.id.split('_').pop();
  sendXHR('DELETE', '/deleteTodo', `toDelete=${idToDelete}`);
};

const addNewTodo = function() {
  const title = document.querySelector('.new-title').value;
  document.querySelector('.new-title').value = '';

  if (title.match(/^\s*$/)) {
    alert('enter the todo title');
    return;
  }

  sendXHR('POST', '/addNewTodo', `title=${title}`);
};

const loadTaskList = function() {
  sendXHR('GET', '/taskList');
};

window.onload = loadTaskList;
