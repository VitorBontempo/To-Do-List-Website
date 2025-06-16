// For to-do list | Para lista de tarefas.
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// For cronometer | Para o cronômetro.
let activeTimerInterval = null; 
let activeTaskItem = null;

// Event listeners | Verificadores de evento.
document.addEventListener('DOMContentLoaded', loadTasks);
taskForm.addEventListener('submit', handleFormSubmit);
taskList.addEventListener('click', handleTaskListClick);


// Main Functions | Funções Principais

// Add Task | Adicionar Tarefa.
function handleFormSubmit(event) { 
    event.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert("Please enter a task.");
        return;
    }
    addTask(taskText, false, 0);
    taskInput.value = '';
    taskInput.focus();
    saveTasks();
}

// Manage tasks | Gerenciar tarefas
function handleTaskListClick(event) {
    const clickedElement = event.target;
    const taskItem = clickedElement.closest('.task-item');

    // Delete Task | Deletar tarefa
    if (clickedElement.closest('.delete-btn')) {
        if (taskItem === activeTaskItem) {
            stopActiveTimer();
        }
        taskItem.classList.add('fall');
        taskItem.addEventListener('transitionend', () => {
            taskItem.remove();
            saveTasks();
        });
    }

    // Complete task | Concluir tarefa
    if (clickedElement.closest('.complete-btn')) {
        // If it's done, stop time | Se concluiu o cronometro deve parar.
        if (taskItem === activeTaskItem) {
            stopActiveTimer();
        }
        taskItem.classList.toggle('completed');
        saveTasks();
    }
    
    // Play and pause button | Botão de play e pause
    if (clickedElement.closest('.play-pause-btn')) {
        toggleStopwatch(taskItem);
    }
}

// Task visualization (Completion and Time) | Visualização das tarefas (Conclusão e tempo)
function addTask(text, isCompleted, timeElapsedInSeconds) {
    const listItem = document.createElement('li');
    listItem.className = `task-item ${isCompleted ? 'completed' : ''}`;
    listItem.dataset.timeElapsed = timeElapsedInSeconds;

    const taskDetails = document.createElement('div');
    taskDetails.className = 'task-details';

    const taskTextSpan = document.createElement('span');
    taskTextSpan.textContent = text;
    
    const stopwatch = document.createElement('div');
    stopwatch.className = 'task-stopwatch';

    const stopwatchDisplay = document.createElement('span');
    stopwatchDisplay.className = 'stopwatch-display';
    stopwatchDisplay.textContent = formatTime(timeElapsedInSeconds);

    const playPauseBtn = document.createElement('button');
    playPauseBtn.className = 'stopwatch-btn play-pause-btn';
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i><i class="fa-solid fa-pause"></i>';

    stopwatch.appendChild(playPauseBtn);
    stopwatch.appendChild(stopwatchDisplay);

    taskDetails.appendChild(taskTextSpan);
    taskDetails.appendChild(stopwatch);
    
    const actionButtons = document.createElement('div');
    actionButtons.className = 'task-actions';

    const completeButton = document.createElement('button');
    completeButton.className = 'complete-btn';
    completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    
    actionButtons.appendChild(completeButton);
    actionButtons.appendChild(deleteButton);
    
    listItem.appendChild(taskDetails);
    listItem.appendChild(actionButtons);
    
    taskList.appendChild(listItem);
}

// Cronometer | Cronômetro
function toggleStopwatch(taskItem) {
    // MUDANÇA PRINCIPAL: Verifica se a tarefa está completa. Se estiver, não faz nada.
    if (taskItem.classList.contains('completed')) {
        console.log("Cannot start timer for a completed task.");
        return; 
    }

    if (taskItem === activeTaskItem) {
        stopActiveTimer();
    } else {
        stopActiveTimer();
        startNewTimer(taskItem);
    }
}

function startNewTimer(taskItem) {
    activeTaskItem = taskItem;
    activeTaskItem.classList.add('timing');
    
    activeTimerInterval = setInterval(() => {
        let currentTime = parseInt(activeTaskItem.dataset.timeElapsed, 10);
        currentTime++;
        activeTaskItem.dataset.timeElapsed = currentTime;
        activeTaskItem.querySelector('.stopwatch-display').textContent = formatTime(currentTime);
        saveTasks();
    }, 1000);
}

function stopActiveTimer() {
    if (!activeTaskItem) return;
    clearInterval(activeTimerInterval);
    activeTaskItem.classList.remove('timing');
    activeTaskItem = null;
    activeTimerInterval = null;
}

// Auxiliary functions and localstorage | Funções auxiliares e armazenamento local
function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(taskItem => {
        tasks.push({
            text: taskItem.querySelector('.task-details span').textContent,
            completed: taskItem.classList.contains('completed'),
            timeElapsed: parseInt(taskItem.dataset.timeElapsed, 10)
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
        savedTasks.forEach(task => addTask(task.text, task.completed, task.timeElapsed));
    }
}