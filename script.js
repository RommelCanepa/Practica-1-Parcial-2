document.addEventListener("DOMContentLoaded", function() {
    const taskForm = document.getElementById("taskForm");
    const tasksList = document.getElementById("tasksList");
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderTasks() {
        tasksList.innerHTML = "";
        tasks.forEach((task, index) => {
            const taskCard = document.createElement("div");
            taskCard.classList.add("card", "task-card");
            taskCard.classList.add(task.resolved ? "resolved" : (new Date(task.endDate) < new Date() ? "expired" : "pending"));
            taskCard.innerHTML = `
                <div class="card-body">
                    <p class="card-text">${task.name} (Inicio: ${task.startDate}, Fin: ${task.endDate}, Responsable: ${task.responsible})</p>
                    <button class="btn btn-success" onclick="resolveTask(${index})">${task.resolved ? "Desmarcar" : "Resolver"}</button>
                    <button class="btn btn-danger" onclick="deleteTask(${index})">Eliminar</button>
                </div>
            `;
            tasksList.appendChild(taskCard);
        });
    }

    function addTask(name, startDate, endDate, responsible) {
        tasks.push({ name, startDate, endDate, responsible, resolved: false });
        saveTasks();
        renderTasks();
    }

    taskForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const name = document.getElementById("taskName").value;
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;
        const responsible = document.getElementById("responsible").value;

        if (new Date(endDate) < new Date(startDate)) {
            alert("La fecha de fin no puede ser menor que la fecha de inicio.");
            return;
        }

        addTask(name, startDate, endDate, responsible);
        taskForm.reset();
    });

    window.resolveTask = function(index) {
        const task = tasks[index];
        if (new Date(task.endDate) < new Date()) {
            alert("No se puede marcar como resuelta una tarea cuya fecha de fin ya ha pasado.");
            return;
        }
        task.resolved = !task.resolved;
        saveTasks();
        renderTasks();
    };

    window.deleteTask = function(index) {
        if (confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        }
    };

    renderTasks();
});
