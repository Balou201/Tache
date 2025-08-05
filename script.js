// On sélectionne les éléments HTML dont on a besoin
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Fonction pour sauvegarder les tâches dans le stockage local
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Fonction pour afficher les tâches
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.classList.toggle('completed', task.completed);

        const taskText = document.createElement('span');
        taskText.classList.add('task-text');

        // Vérifie si le texte est un lien
        if (task.text.startsWith('http://') || task.text.startsWith('https://')) {
            const link = document.createElement('a');
            link.href = task.text;
            link.textContent = task.text;
            link.target = "_blank"; // Ouvre le lien dans un nouvel onglet
            taskText.appendChild(link);
        } else {
            taskText.textContent = task.text;
        }

        const actions = document.createElement('div');
        actions.classList.add('task-actions');

        const completeBtn = document.createElement('button');
        completeBtn.textContent = '✅';
        completeBtn.onclick = () => toggleComplete(index);

        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️';
        editBtn.classList.add('edit-btn');
        editBtn.onclick = () => editTask(index);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '❌';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = () => deleteTask(index);

        actions.appendChild(completeBtn);
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(taskText);
        li.appendChild(actions);

        taskList.appendChild(li);
    });
}

// Gère la soumission du formulaire
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTask = {
        text: taskInput.value,
        completed: false
    };
    tasks.push(newTask);
    taskInput.value = '';
    saveTasks();
    renderTasks();
});

// Marque une tâche comme terminée ou non
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// Permet de modifier une tâche
function editTask(index) {
    const newText = prompt('Modifier la tâche :', tasks[index].text);
    if (newText !== null && newText !== '') {
        tasks[index].text = newText;
        saveTasks();
        renderTasks();
    }
}

// Supprime une tâche
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Affiche les tâches au chargement de la page
document.addEventListener('DOMContentLoaded', renderTasks);
