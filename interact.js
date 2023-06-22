// Enable draggable behavior for the task cards
document.querySelectorAll('.task-card').forEach((card) => {
  card.addEventListener('dragstart', dragStart);
  card.addEventListener('dragend', dragEnd);
});

// Enable drop behavior for the task sections
document.querySelectorAll('.task-section').forEach((section) => {
  section.addEventListener('dragover', dragOver);
  section.addEventListener('dragenter', dragEnter);
  section.addEventListener('dragleave', dragLeave);
  section.addEventListener('drop', drop);
});

let draggedCard = null;

function dragStart(event) {
  draggedCard = this;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/html', this.innerHTML);
  this.classList.add('dragging');
}

function dragEnd() {
  draggedCard = null;
  this.classList.remove('dragging');
}

function dragOver(event) {
  event.preventDefault();
}

function dragEnter(event) {
  event.preventDefault();
  this.classList.add('drag-target');
}

function dragLeave() {
  this.classList.remove('drag-target');
}

function drop(event) {
  event.preventDefault();
  this.classList.remove('drag-target');

  // Check if the card is being dropped into a different section
  const currentSection = draggedCard.closest('.task-section');
  if (currentSection !== this) {
    // Update the task's status
    const taskId = draggedCard.dataset.taskId;
    const status = this.querySelector('h3').textContent.trim();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find((t) => t.id === parseInt(taskId));
    if (task) {
      task.status = status;
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }


  // Move the card smoothly to the dropped container
  const container = this.querySelector('.task-cards-container');
  container.appendChild(draggedCard);

  // Reset the transform and transition after the animation completes
  setTimeout(() => {
    draggedCard.style.transition = '';
    draggedCard.style.transform = '';
  }, 300);
  updateMemberCards()

}


function updateMemberCards() {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const memberTasks = getMemberTasks(loggedInUser.email);
  displayMemberTasks(memberTasks);
}









