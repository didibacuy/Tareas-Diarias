// Selección de elementos del DOM
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');

// Array para almacenar las tareas
let tasks = [];

// Cargar tareas desde localStorage al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromLocalStorage();
    renderTasks();
});

// Evento para añadir una nueva tarea
addTaskBtn.addEventListener('click', addTask);

// Evento para añadir tarea al presionar Enter
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Función para añadir una nueva tarea
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Por favor, ingresa una tarea');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        date: new Date().toLocaleDateString()
    };
    
    tasks.push(newTask);
    saveTasksToLocalStorage();
    renderTasks();
    
    taskInput.value = '';
    taskInput.focus();
}

// Función para renderizar las tareas en el DOM
function renderTasks(filterType = 'all') {
    taskList.innerHTML = '';
    
    let filteredTasks = tasks;
    
    if (filterType === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (filterType === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<div class="no-tasks">No hay tareas para mostrar</div>';
        return;
    }
    
    filteredTasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        if (task.completed) {
            taskItem.classList.add('completed');
        }
        
        taskItem.innerHTML = `
            <div class="task-check" onclick="toggleTaskStatus(${task.id})">
                <i class="fas ${task.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
            </div>
            <div class="task-text">${task.text}</div>
            <div class="task-date">${task.date}</div>
            <div class="task-actions">
                <button class="edit-btn" onclick="editTask(${task.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        taskList.appendChild(taskItem);
    });
}

// Función para cambiar el estado de una tarea (completada/pendiente)
function toggleTaskStatus(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    
    saveTasksToLocalStorage();
    renderTasks();
}

// Función para editar una tarea
function editTask(id) {
    const taskToEdit = tasks.find(task => task.id === id);
    
    if (!taskToEdit) return;
    
    const newText = prompt('Editar tarea:', taskToEdit.text);
    
    if (newText === null) return; // Si el usuario cancela
    
    if (newText.trim() === '') {
        alert('La tarea no puede estar vacía');
        return;
    }
    
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, text: newText.trim() };
        }
        return task;
    });
    
    saveTasksToLocalStorage();
    renderTasks();
}

// Función para eliminar una tarea
function deleteTask(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasksToLocalStorage();
        renderTasks();
    }
}

// Eventos para los botones de filtro
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Quitar la clase active de todos los botones
        filterBtns.forEach(b => b.classList.remove('active'));
        // Añadir la clase active al botón clickeado
        btn.classList.add('active');
        // Renderizar las tareas según el filtro
        renderTasks(btn.getAttribute('data-filter'));
    });
});

// Guardar tareas en localStorage
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Cargar tareas desde localStorage
function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}