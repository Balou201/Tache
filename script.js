// On sélectionne les éléments HTML dont on a besoin
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// On récupère les tâches sauvegardées ou on crée une liste vide
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Variable pour stocker l'élément en cours de glissement
let draggedItem = null;

// Fonction pour sauvegarder les tâches dans le stockage local du navigateur
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Fonction pour afficher les tâches
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.classList.toggle('completed', task.completed);
        li.draggable = true;

        li.addEventListener('dragstart', () => {
            draggedItem = li;
            setTimeout(() => li.classList.add('dragging'), 0);
        });

        li.addEventListener('dragend', () => {
            li.classList.remove('dragging');
            draggedItem = null;
        });

        li.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        li.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedItem && draggedItem !== li) {
                const draggedIndex = [...taskList.children].indexOf(draggedItem);
                const droppedIndex = [...taskList.children].indexOf(li);

                const [movedTask] = tasks.splice(draggedIndex, 1);
                tasks.splice(droppedIndex, 0, movedTask);

                saveTasks();
                renderTasks();
            }
        });

        const taskText = document.createElement('span');
        taskText.classList.add('task-text');

        // Vérifie si le texte est un lien
        if (task.text.startsWith('http://') || task.text.startsWith('https://')) {
            const linkButton = document.createElement('a');
            linkButton.href = task.text;
            linkButton.textContent = 'Ouvrir le lien';
            linkButton.target = "_blank"; // Ouvre le lien dans un nouvel onglet
            linkButton.classList.add('task-link-button');

            const simpleText = document.createTextNode('Lien ajouté : ');
            taskText.appendChild(simpleText);
            taskText.appendChild(linkButton);
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

// Gère la soumission du formulaire pour ajouter une nouvelle tâche
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (taskInput.value.trim() === '') {
        return;
    }
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
    if (newText !== null && newText.trim() !== '') {
        tasks[index].text = newText;
        saveTasks();
        renderTasks();
    }
}

// Supprime une tâche
function deleteTask(index) {
    if (confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
}

// Affiche les tâches au chargement de la page
document.addEventListener('DOMContentLoaded', renderTasks);
