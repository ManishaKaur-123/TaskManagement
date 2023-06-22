// Retrieve registered members from local storage
const registeredMembers = JSON.parse(localStorage.getItem("registeredUsers"));
// Filter out only the members
const members = registeredMembers.filter((member) =>
  member.email.endsWith("@lambton.ca")
);

function addTask() {
  const assignee = document.getElementById("task-assignee").value;
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-description").value;
  const estimatedTime = document.getElementById("task-estimated-time").value;

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const taskId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

  const newTask = {
    id: taskId,
    assignee: assignee,
    title: title,
    description: description,
    estimatedTime: estimatedTime,
    status: "To Do",
  };

  tasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Retrieve users from local storage
  const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];

  // Find the admin user
  const adminUser = users.find((user) => user.role === "admin");

  // Store tasks for the admin user
  let adminTasks = JSON.parse(localStorage.getItem(adminUser.email)) || [];
  adminTasks.push(taskId);
  localStorage.setItem(adminUser.email, JSON.stringify(adminTasks));

  // Find the assigned member user
  const assignedMember = users.find((user) => user.email === assignee);

  // Store tasks for the assigned member
  let memberTasks =
    JSON.parse(localStorage.getItem(assignedMember.email)) || [];
  memberTasks.push(taskId);
  localStorage.setItem(assignedMember.email, JSON.stringify(memberTasks));

  // Update the task cards
  updateTaskCards();

  document.getElementById("task-assignee").value = "";
  document.getElementById("task-title").value = "";
  document.getElementById("task-description").value = "";
  document.getElementById("task-estimated-time").value = "";
}

function updateTaskCards() {
  const taskCardsContainer = document.querySelector(".task-cards-container");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  taskCardsContainer.innerHTML = "";
  tasks.forEach((task) => {
    if (
      loggedInUser.role === "admin" ||
      (loggedInUser.role === "member" && task.assignee === loggedInUser.email)
    ) {
      const taskCard = document.createElement("div");
      taskCard.classList.add("task-card");

      const taskTitle = document.createElement("h4");
      taskTitle.textContent = task.title;

      const assigneeName = getAssigneeName(task.assignee);
      const assigneeParagraph = document.createElement("p");
      assigneeParagraph.textContent = "Assigned To: " + assigneeName;

      const descriptionParagraph = document.createElement("p");
      descriptionParagraph.textContent = "Description: " + task.description;

      const estimatedTimeParagraph = document.createElement("p");
      estimatedTimeParagraph.textContent =
        "Estimated Time: " + task.estimatedTime + " hours";

      const loggedHours = document.createElement("p");
      loggedHours.textContent = task.loggedHours
        ? "Logged Hours: " + task.loggedHours + " hours"
        : "";

      const payCalculationContainer = document.createElement("div");
      payCalculationContainer.classList.add("pay-container");

      const payCalculated = document.createElement("p");
      payCalculationContainer.classList.add("pay-container");
      payCalculated.textContent =
        "Calculated Pay: " + task.loggedHours * 16.5 + "$";
      payCalculated.classList.add("pay-calculation");

      payCalculationContainer.appendChild(payCalculated);

      const status = document.createElement("h4");
      status.textContent = task.status;
      status.style.marginTop = "10px";
      // Assign color based on task status
      if (task.status === "To Do") {
        status.style.color = "red";
      } else if (task.status === "In Progress") {
        status.style.color = "yellow";
      } else if (task.status === "Done") {
        status.style.color = "green";
      }
      taskCard.appendChild(taskTitle);
      taskCard.appendChild(assigneeParagraph);
      taskCard.appendChild(descriptionParagraph);
      taskCard.appendChild(estimatedTimeParagraph);
      taskCard.appendChild(loggedHours);
      taskCard.appendChild(status);
      if (task.loggedHours) {
        taskCard.appendChild(payCalculationContainer);
      }
      taskCardsContainer.appendChild(taskCard);
    }
  });
}

function getAssigneeName(email) {
  const member = registeredMembers.find((member) => member.email === email);
  return member ? member.name : "Unknown Assignee";
}

function formatCreationDate(dateString) {
  const date = dateString ? new Date(dateString) : new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
}

var selectedTaskId = null;

window.addEventListener("DOMContentLoaded", () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const taskFormContainer = document.getElementById(
    "task-management-container"
  );

  if (loggedInUser.role === "admin") {
    updateTaskForm();
    updateTaskCards();
    taskFormContainer.style.display = "none";
  } else {
    updateTaskForm();
    // updateSectionCounts();
    // observeTaskCardsContainer();
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    console.log(JSON.stringify(tasks) + "tasks");

    const memberTasks = getMemberTasks(loggedInUser.email);
    if (memberTasks.length > 0) {
      displayMemberTasks(memberTasks);
    }
    // Add an event listener to each task card to open the popup on click
    var taskCards = document.querySelectorAll(".task-card");
    taskCards.forEach(function (card) {
      card.addEventListener("click", function () {
        // Get the task ID associated with the card (retrieve this from your data source based on the member)
        var taskId = card.getAttribute("data-task-id");
        selectedTaskId = taskId;

        // Open the popup with the task data
        openPopup(taskId);
      });
    });
  }
});

// JavaScript code to handle task card click event and display the popup
function openPopup(taskId) {
  console.log(taskId);
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  var task = tasks.find(function (task) {
    return task.id === parseInt(taskId);
  });

  //   Set the values of the input fields in the popup
  document.getElementById("popup-title").value = task.title;
  document.getElementById("popup-description").value = task.description;
  document.getElementById("popup-estimated").value = task.estimatedTime;
  document.getElementById("popup-log").value = task.loggedHours || "";

  // Open the popup
  var popup = document.getElementById("taskPopup");
  popup.style.display = "block";
}

function closePopup() {
  var popup = document.getElementById("taskPopup");
  popup.style.display = "none";
}

function saveTask() {
  const loggedHours = document.getElementById("popup-log").value;
  console.log(selectedTaskId + "selectedTaskId");
  if (selectedTaskId) {
    updateLoggedHours(selectedTaskId, loggedHours);
  }

  // Close the popup
  closePopup();
}

function updateLoggedHours(taskId, hours) {
  // Get tasks from local storage
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const task = tasks.find((t) => t.id === parseInt(taskId));
  if (task) {
    task.loggedHours = hours;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

// Add an event listener to each task card to open the popup on click
var taskCards = document.querySelectorAll(".task-card");
taskCards.forEach(function (card) {
  card.addEventListener("click", function () {
    // Get the task data associated with the card (you can retrieve this from your data source)
    var task = {
      title: "Task Title",
      description: "Task Description",
      estimatedHours: 2,
    };

    // Open the popup with the task data
    openPopup(task);
  });
});

function updateTaskForm() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const taskFormContainer = document.getElementById("task-form-container");

  if (loggedInUser.role === "admin") {
    taskFormContainer.style.display = "block";
  } else {
    taskFormContainer.style.display = "none";
  }
  const assigneeSelect = document.getElementById("task-assignee");
  assigneeSelect.innerHTML = "";

  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = "Select Assignee";
  placeholderOption.disabled = true;
  placeholderOption.selected = true;
  assigneeSelect.appendChild(placeholderOption);

  members.forEach((member) => {
    const option = document.createElement("option");
    option.value = member.email;
    option.textContent = member.name;
    assigneeSelect.appendChild(option);
  });
}

function getMemberTasks(memberEmail) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  return tasks.filter((task) => task.assignee === memberEmail);
}

// function updateSectionCounts() {
//   const sections = document.querySelectorAll(".task-section");
//   sections.forEach((section) => {
//     const countElement = section.querySelector(".section-count");
//     const taskCardsContainer = section.querySelector(".task-cards-container");
//     const count = taskCardsContainer.children.length;
//     countElement.textContent = ` (${count})`;
//   });
// }

// function observeTaskCardsContainer() {
//   const taskCardsContainers = document.querySelectorAll(
//     ".task-cards-container"
//   );
//   taskCardsContainers.forEach((taskCardsContainer) => {
//     // Create a new MutationObserver
//     const observer = new MutationObserver(() => {
//       // Call the updateSectionCounts function whenever there is a change
//       updateSectionCounts();
//     });

//     // Observe changes in the task cards container
//     observer.observe(taskCardsContainer, {
//       childList: true, // Detect changes in the child elements
//     });
//   });
// }

function displayMemberTasks(tasks) {
  const todoContainer = document.getElementById("todo-container");
  const inprogressContainer = document.getElementById("inprogress-container");
  const qaContainer = document.getElementById("qa-container");
  const doneContainer = document.getElementById("done-container");

  todoContainer.innerHTML = "";
  inprogressContainer.innerHTML = "";
  qaContainer.innerHTML = "";
  doneContainer.innerHTML = "";

  tasks.forEach((task) => {
    const taskCard = document.createElement("div");

    taskCard.classList.add("task-card");
    taskCard.dataset.taskId = task.id;

    const taskTitle = document.createElement("h4");
    taskTitle.textContent = task.title;

    const assigneeParagraph = document.createElement("p");
    assigneeParagraph.textContent = "Assigned To: You";

    const descriptionParagraph = document.createElement("p");
    descriptionParagraph.textContent = "Description: " + task.description;

    const estimatedTimeParagraph = document.createElement("p");
    estimatedTimeParagraph.textContent =
      "Estimated Time: " + task.estimatedTime + " hours";

    const status = document.createElement("h4");
    status.textContent = task.status;
    // Assign color based on task status
    if (task.status === "To Do") {
      status.style.color = "red";
    } else if (task.status === "In Progress") {
      status.style.color = "lightblue";
    } else if (task.status === "Done") {
      status.style.color = "green";
    }

    const creationDateContainer = document.createElement("div");
    creationDateContainer.classList.add("creation-date-container");

    const creationDateParagraph = document.createElement("p");
    creationDateParagraph.textContent = formatCreationDate(task.createdAt);
    creationDateParagraph.classList.add("creation-date");

    creationDateContainer.appendChild(creationDateParagraph);
    taskCard.draggable = true;
    taskCard.addEventListener("dragstart", dragStart);

    taskCard.appendChild(taskTitle);
    taskCard.appendChild(assigneeParagraph);
    taskCard.appendChild(descriptionParagraph);
    taskCard.appendChild(estimatedTimeParagraph);
    taskCard.appendChild(status);
    taskCard.appendChild(creationDateContainer);

    if (task.status === "To Do") {
      todoContainer.appendChild(taskCard);
    } else if (task.status === "In Progress") {
      inprogressContainer.appendChild(taskCard);
    } else if (task.status === "In QA") {
      qaContainer.appendChild(taskCard);
    } else if (task.status === "Done") {
      doneContainer.appendChild(taskCard);
    } else {
      todoContainer.appendChild(taskCard);
    }
  });
}

function dragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
}

function allowDrop(event) {
  event.preventDefault();
}

// Function to retrieve task data by ID
function getTaskById(taskId) {
  var assignedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  var task = assignedTasks.find(function (task) {
    return task.id == taskId;
  });
  return task;
}

document.getElementById("logout-icon").addEventListener("click", logout);

function logout() {
  document.getElementById("loader-overlay").style.display = "flex";
  setTimeout(function () {
    // localStorage.removeItem('logg');
    window.location.href = "login.html";
  }, 2000);
}
