const taskInput = document.querySelector(".task-input input"),
filters = document.querySelectorAll(".filters span"),
clearAll = document.querySelector(".clear-btn"),
taskBox = document.querySelector(".task-box") ;

let editId;
let isEditedTask = false;

//getting localStorage todolist
let todos = JSON.parse(localStorage.getItem('todo-list'));

filters.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    //to update list view
    showTodo(btn.id);
    
  });
});

function showTodo(filter) {
  let li = "";
  if (todos) {
      todos.forEach((todo, id) => {
        // if the todostatus is completed, set the isCompleted value to checked
          let isCompleted = todo.status == "completed" ? "checked" : "";
          if(filter == todo.status || filter == "all") {
            li += `<li class="task">
            <label for="${id}">
              <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
              <p class="${isCompleted}">${todo.name}</p>
            </label>
            <div class="settings">
              <i onclick = "showMenu(this)"  class="bx bx-dots-horizontal-rounded"></i>
              <ul class="task-menu">
                <li onclick="editTask(${id}, '${todo.name}')"><i class='bx bx-edit-alt'></i>Edit</li>
                <li onclick="deleteTask(${id})"><i class='bx bx-trash-alt'></i>Delete</li>
              </ul>
            </div>
           </li>`;
          }
      });
  }
  // if li isn't empty, insert the value inside the taskBox else insert span
  taskBox.innerHTML = li || `<span>You don't have any task here</span>`;
}
showTodo("all"); // this display all upon opening the app and even after you have refreshed

function showMenu(selectedTask) {
  // get task menu div
  let taskMenu = selectedTask.parentElement.lastElementChild;
  taskMenu.classList.add("show");
  document.addEventListener("click", e => {
    // removing show class from the task menu on the document click
    if(e.target.tagName != "I" || e.target != selectedTask) {
      taskMenu.classList.remove("show");
    }
  });
}

function editTask(taskId, taskName) {
  editId = taskId;
  isEditedTask = true;
  taskInput.value = taskName;
}

function deleteTask(deleteId) {
  // removing the selected task from array todos
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo("all");
}

clearAll.addEventListener("click", () => {
  // removing all items of array/todos
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo("all");
})

function updateStatus(selectedTask) {
  // getting paragraph that contains taskname
  let taskName = selectedTask.parentElement.lastElementChild;
  if(selectedTask.checked) {
    taskName.classList.add('checked');
    // updating the status of selected task to complete
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove('checked');
    // updating the status of selected task to pending
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}


taskInput.addEventListener("keyup", e => {
  let userTask = taskInput.value.trim(); // with .trim you prevent storing empty value to userTask when the user press enter.
  if(e.key == 'Enter' && userTask) {
    // this work only when enter key us press + userTank 
    if (!isEditedTask) { // if isEditedTask is not true
      if(!todos) { // if todos isn't exist, pass an empty array
      todos = [];
      }
      let taskInfo = {name: userTask, status: "pending"};
      todos.push(taskInfo); // adding new task to todos
    } else {
      isEditedTask = false;
      todos[editId].name = userTask;
    }
    taskInput.value = '';
    
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
  }
});