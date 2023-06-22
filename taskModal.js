// JavaScript code to handle task card click event and display the popup

function openPopup(taskId) {
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
