// main variables
let categoriesArr = ["All", "To-Do", "Completed"];
let arrayOfTasks = [];
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
      <li class="p-md-3 fs-md-4 fw-medium rounded-2" onclick="event.stopPropagation();selectTasksCategory(${i})">
      ${category}</li>`;
  });
}
renderCategories();
selectTasksCategory(0);
function selectTasksCategory(indexElement) {
  categoryTitle.innerText = categoriesArr[indexElement];
  document.querySelectorAll("aside ul li").forEach((li) => {
    li.classList.remove("active");
  });
  document
    .querySelector(`aside ul li:nth-of-type(${indexElement + 1})`)
    .classList.add("active");
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
            <div class="content flex-grow-1">
               <h4 contenteditable=${task.isUpdated ? "true" : "false"}>${task.name}</h4> 
               <span>${task.date}</span>
            </div>
            <div class="update ms-2" onclick="event.stopPropagation();updateTask(${i})">
            <i class="fa-solid ${
              task.isUpdated ? "fa-floppy-disk" : "fa-pencil"
            }"></i>
            </div>
            <div class="delete" onclick="event.stopPropagation(); deleteTask(${i},'${task.name}')">
            <i class="fa-regular fa-trash-can"></i></div>
            <div class="status">
              <input type="checkbox" id="task-${i}-status" class="rounded-circle" 
              onchange="toggleTaskStatus(${i})"
                ${task.completed == true ? "checked" : null}/>
              <label for="task-${i}-status" class="toggle-check pe-4"></label>
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
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let seconds = currentDate.getSeconds();
  let task = {
    name: taskInput.value,
    date: `${day}/${month}/${year} , ${hours >= 12 ? hours - 12 : hours}:${minutes}:${seconds} 
               ${hours >= 12 ? "PM" : "AM"}` ,
    completed: false,
    isUpdated: false
  };
  arrayOfTasks.push(task);
  taskInput.value = "";
}
function addTask() {
  let spaceReg = /\S/i;
  if (spaceReg.test(taskInput.value)) {
    createTask();
  }
  renderTasks(arrayOfTasks);
}
function deleteTask(taskIndex,taskName) {
  if (categoryTitle.innerText == "All") {
      arrayOfTasks.splice(taskIndex,1);
      renderTasks(arrayOfTasks);
  } else if (categoryTitle.innerText == "To-Do") {
      unCompletedTasks.splice(taskIndex,1);
      renderTasks(unCompletedTasks);
      arrayOfTasks = arrayOfTasks.filter((task) =>{
         return task.name != taskName ;
      });
  } else {
      completedTasks.splice(taskIndex,1); 
      renderTasks(completedTasks);
      arrayOfTasks = arrayOfTasks.filter((task) =>{
         return task.name != taskName ;
      });
  }
}
function toggleTaskStatus(taskIndex) {
  if(categoryTitle.innerText == "All") {
    arrayOfTasks[taskIndex].completed = !arrayOfTasks[taskIndex].completed;
  } else if (categoryTitle.innerText == "To-Do") {
    unCompletedTasks[taskIndex].completed = !unCompletedTasks[taskIndex].completed;
    /*arrayOfTasks.forEach( (task) =>{
         if(task.name == taskName){
             task.completed = !task.completed ;
         }
      });*/
    setTimeout(() => {
      unCompletedTasks.splice(taskIndex, 1);
      renderTasks(unCompletedTasks);
    }, 500);
  } else {
    completedTasks[taskIndex].completed = !completedTasks[taskIndex].completed;
    /*arrayOfTasks.forEach( (task) =>{
         if(task.name == taskName){
             task.completed = !task.completed ;
         }
      });*/
    setTimeout(() => {
      completedTasks.splice(taskIndex, 1);
      renderTasks(completedTasks);
    }, 500);
  }
}
function updateTask(taskIndex) {
  let updatedContent = document.querySelectorAll("section .tasks .task .content h4");
  if (categoryTitle.innerText == "All") {
    if (arrayOfTasks[taskIndex].isUpdated == true) {
      arrayOfTasks[taskIndex].name = updatedContent[taskIndex].innerText.trim();
      arrayOfTasks[taskIndex].isUpdated = false;
    } else {
      arrayOfTasks[taskIndex].isUpdated = true;
    }
    renderTasks(arrayOfTasks);
  } else if (categoryTitle.innerText == "To-Do") {
    if (unCompletedTasks[taskIndex].isUpdated == true) {
      unCompletedTasks[taskIndex].name = updatedContent[taskIndex].innerText.trim();
      unCompletedTasks[taskIndex].isUpdated = false;
    } else {
      unCompletedTasks[taskIndex].isUpdated = true;
    }
    renderTasks(unCompletedTasks);
  } else {
    if (completedTasks[taskIndex].isUpdated == true) {
      completedTasks[taskIndex].name = updatedContent[taskIndex].innerText.trim();
      completedTasks[taskIndex].isUpdated = false;
    } else {
      completedTasks[taskIndex].isUpdated = true;
    }
    renderTasks(completedTasks);
  }
}
