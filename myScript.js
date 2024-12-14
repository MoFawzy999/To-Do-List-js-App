// main variables
let categoriesArr = ["All", "To-Do", "Completed"];
let arrayOfTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
let completedTasks = [];
let unCompletedTasks = [];
let taskInput = document.querySelector(".modal .modal-body input");
let tasksContainer = document.querySelector(".tasks");
let categoryTitle = document.querySelector("section .head h2");
//=========================================================================================
// Rendering Task Categories
function renderCategories() {
  categoriesArr.forEach((category, i) => {
    document.querySelector("main aside ul").innerHTML += `
      <li class="p-md-3 fs-md-4 fw-medium rounded-2" onclick="event.stopPropagation();
      selectTasksCategory(${i})">
      ${category}</li>`;
  });
}
function selectTasksCategory(indexElement) {
  categoryTitle.innerText = categoriesArr[indexElement];
  document.querySelectorAll("aside ul li").forEach((li) => {
    li.classList.remove("active");
  });
  document.querySelector(`aside ul li:nth-of-type(${indexElement + 1})`).classList.add("active");
  if (indexElement == 0) {
    renderTasks(arrayOfTasks);
  } else if (indexElement == 1) {
    renderUncompletedTasks();
  } else {
    renderCompletedTasks();
  }
}
function renderTasks(array) {
  tasksContainer.innerHTML = "";
  array.forEach((task, i) => {
    tasksContainer.innerHTML += `
         <li class="task rounded-3 p-3 d-flex justify-content-between align-items-center mb-3">
            <div class="content flex-md-grow-1">
               <h4 contenteditable=${task.isUpdated ? "true" : "false"}>${task.name}</h4> 
               <span>${task.date}</span>
            </div>
            <div class="options d-flex justify-content-center align-items-center gap-2">
              <div class="update ms-2" onclick="event.stopPropagation(); updateTask(${task.id},${i})">
                <i class="fa-solid ${task.isUpdated ? "fa-floppy-disk" : "fa-pencil"}"></i>
              </div>
              <div class="delete" onclick="event.stopPropagation(); deleteTask(${task.id})">
                <i class="fa-regular fa-trash-can"></i>
              </div>
              <div class="status">
                <input type="checkbox" id="task-${i}-status" class="rounded-circle" 
                  onchange="toggleTaskStatus(${task.id})" ${task.completed == true ? "checked" : null}/>
                <label for="task-${i}-status" class="toggle-check pe-4"></label>
              </div>
            </div>
         </li>
      `;
  });
}
function renderUncompletedTasks() {
  unCompletedTasks = arrayOfTasks.filter((task) => {
    return task.completed == false;
  });
  renderTasks(unCompletedTasks);
}
function renderCompletedTasks() {
  completedTasks = arrayOfTasks.filter((task) => {
    return task.completed == true;
  });
  renderTasks(completedTasks);
}
renderCategories();
selectTasksCategory(0);
//===============================================================================================================
// CRUD operations
function createTask() {
  let currentDate = new Date();
  let day =
    currentDate.getDate() < 10
      ? "0" + currentDate.getDate()
      : currentDate.getDate();
  let month =
    currentDate.getMonth() + 1 < 10
      ? "0" + (currentDate.getMonth() + 1)
      : currentDate.getMonth() + 1;
  let year = currentDate.getFullYear();
  let hours = currentDate.getHours() >= 12 ? currentDate.getHours() -12 : currentDate.getHours() ;
  let minutes = currentDate.getMinutes();
  let seconds = currentDate.getSeconds();
  let generateID = localStorage.getItem('tasks') ?
       JSON.parse(localStorage.getItem('tasks')).length > 0 ? 
        JSON.parse(localStorage.getItem('tasks'))[JSON.parse(localStorage.getItem('tasks')).length -1].id
        : 0  : 0 ;
  let task = {
    id :  generateID + 1  ,
    name: taskInput.value,
    date: `${day}/${month}/${year} , ${hours}:${minutes}:${seconds} 
               ${hours >= 12 ? "PM" : "AM"}`,
    completed: false,
    isUpdated: false
  };
  arrayOfTasks.push(task);
  taskInput.value = "";
  localStorage.setItem('tasks',JSON.stringify(arrayOfTasks));
}
function addTask() {
  let spaceReg = /\S/i;
  if (spaceReg.test(taskInput.value)) {
    createTask();
  }
  if(categoryTitle.innerText == 'All'){
    renderTasks(arrayOfTasks);
  }else if(categoryTitle.innerText == 'To-Do'){
    renderUncompletedTasks();
  }else{
    renderCompletedTasks();
  }
}
function deleteTask(taskID) {
  arrayOfTasks = arrayOfTasks.filter( (task) =>{
    return task.id != taskID ;
  });
  if (categoryTitle.innerText == "All") {
    renderTasks(arrayOfTasks);
  } else if (categoryTitle.innerText == "To-Do") {
    renderUncompletedTasks();
  } else {
    renderCompletedTasks();
  }
  localStorage.setItem('tasks',JSON.stringify(arrayOfTasks));
}

function toggleTaskStatus(taskID) {
  arrayOfTasks.forEach( (task) =>{
      if(task.id == taskID){
        task.completed = !task.completed ;
      }
  });
  if (categoryTitle.innerText == "All") {
    renderTasks(arrayOfTasks);
  }else if (categoryTitle.innerText == "To-Do") {
    setTimeout(() =>{
      renderUncompletedTasks();
    },1000);
  } else {
    setTimeout(() =>{
      renderCompletedTasks();
    },1000);
  }
  localStorage.setItem('tasks',JSON.stringify(arrayOfTasks));
}
function updateTask(taskID,taskIndex) {
  let updatedContent = document.querySelectorAll("section .tasks .task .content h4");
  arrayOfTasks.forEach( (task) => {
    if(task.id == taskID){
      if(task.isUpdated == true) {
          task.name = updatedContent[taskIndex].innerText.trim();
          task.isUpdated = false ;
      }else{
        task.isUpdated = true ;
      }
    }
  });
  if (categoryTitle.innerText == "All") {
    renderTasks(arrayOfTasks);
  }else if(categoryTitle.innerText == "To-Do"){
    renderUncompletedTasks();
  }else{
    renderCompletedTasks();
  }
  localStorage.setItem('tasks',JSON.stringify(arrayOfTasks));
}
