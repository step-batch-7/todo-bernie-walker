const CODE_OK = 200;

const searchItems = function(searchSection) {
  const matcher = new RegExp(searchSection.value, 'i');
  const [, ...taskSections] = Array.from(
    document.querySelectorAll('.task')
  ).reverse();
  taskSections.forEach(section => {
    const [, items] = section.children;

    const itemsText = Array.from(items.children).map(itm => {
      return itm.innerText;
    });

    section.setAttribute('style', 'display:none');

    if (!itemsText.length || itemsText.some(txt => txt.match(matcher))) {
      section.removeAttribute('style');
    }
  });
};

const searchTodo = function(searchSection) {
  const matcher = new RegExp(searchSection.value, 'i');
  const [, ...taskSections] = Array.from(
    document.querySelectorAll('.task')
  ).reverse();
  taskSections.forEach(section => {
    const [taskTop] = section.children;

    if (taskTop.innerText.match(matcher)) {
      section.removeAttribute('style');
      return;
    }

    section.setAttribute('style', 'display:none');
  });
};

const editItem = function(editedSection) {
  document.getSelection().empty();
  const { innerText, id } = editedSection;
  const [, , itemId] = id.split('-');
  const editItemReq = new XMLHttpRequest();

  editItemReq.onerror = function() {
    document.body.innerHTML = 'error while processing please reload';
  };

  editItemReq.onload = function() {
    if (editItemReq.status !== CODE_OK) {
      document.body.innerHTML = 'task not added';
    }
  };

  editItemReq.open('POST', '/editItem');
  editItemReq.setRequestHeader(
    'Content-Type',
    'application/x-www-form-urlencoded'
  );
  editItemReq.send(`title=${innerText}&id=${itemId}`);
};

const editTodoTitle = function(editedSection) {
  document.getSelection().empty();
  const { innerText, id } = editedSection;
  const [, , todoId] = id.split('-');
  const editTitleReq = new XMLHttpRequest();

  editTitleReq.onerror = function() {
    document.body.innerHTML = 'error while processing please reload';
  };

  editTitleReq.onload = function() {
    if (editTitleReq.status !== CODE_OK) {
      document.body.innerHTML = 'task not added';
    }
  };

  editTitleReq.open('POST', '/editTodo');
  editTitleReq.setRequestHeader(
    'Content-Type',
    'application/x-www-form-urlencoded'
  );
  editTitleReq.send(`title=${innerText}&id=${todoId}`);
};

const blurActive = function() {
  if (event.key === 'Escape') {
    document.activeElement.blur();
  }
};

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
  const [, toMark] = clickedOn.id.match(/.*_(\d+_\d+)/);
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
  markItemReq.send(`toMark=${toMark}`);
};

const deleteItem = function(clickedOn) {
  const [, toDelete] = clickedOn.id.match(/.*_(\d+_\d+)/);
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
  dltItemReq.send(`toDelete=${toDelete}`);
};

// eslint-disable-next-line max-statements
const addNewItem = function(clickedOn) {
  const [, todoId] = clickedOn.id.match(/.*-(\d+)/);
  const itemTitle = document.querySelector(`#itm-ip-${todoId}`).value;
  document.querySelector(`#itm-ip-${todoId}`).value = '';

  if (itemTitle.match(/^\s*$/)) {
    alert('enter the task');
    return;
  }

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
  addItemReq.send(`title=${itemTitle}&to=${todoId}`);
};

const deleteTodo = function(clickedOn) {
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
  dltTaskReq.open('DELETE', '/deleteTodo');
  dltTaskReq.setRequestHeader(
    'Content-Type',
    'application/x-www-form-urlencoded'
  );
  dltTaskReq.send(`toDelete=${idToDelete}`);
};

// eslint-disable-next-line max-statements
const addNewTodo = function() {
  const title = document.querySelector('.new-title').value;
  document.querySelector('.new-title').value = '';

  if (title.match(/^\s*$/)) {
    alert('enter the todo title');
    return;
  }

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

  addTaskReq.open('POST', '/addNewTodo');
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
