function openProfileModal() {
    const modal = document.getElementById("profileModal");
    modal.style.display = "block";
  
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
      const user = users.find((u) => u.email === loggedInUser.email);
    const isAdmin= loggedInUser.email.endsWith('@admin.ca')
    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");
  
    profileName.textContent = user.name;
    profileEmail.textContent = user.email;
    const assignedTask= getAssignedTask();
    const assignedTasksList = document.getElementById("assignedTasksList");
    if (isAdmin){
        assignedTasksList.innerHTML= "You are a Admin";
    }
    else{assignedTasksList.innerHTML = assignedTask.map(item => `<li>${item.title}</li>`).join("");}
  }
  
  function getAssignedTask() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const filterTasks = tasks.filter((task) => task.assignee === loggedInUser.email)
    return filterTasks;
  }
  
  function closeProfileModal() {
    const modal = document.getElementById("profileModal");
    modal.style.display = "none";
  }
  