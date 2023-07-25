"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const apiUrl = "http://localhost:5000/todos";
function fetchTodos() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return (yield response.json());
    });
}
function addTodo(todo) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(todo),
        });
        if (!response.ok) {
            throw new Error("Failed to add todo");
        }
        return (yield response.json());
    });
}
function updateTodo(todo) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${apiUrl}/${todo.id}`;
        const response = yield fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(todo),
        });
        if (!response.ok) {
            throw new Error("Failed to update todo");
        }
        return (yield response.json());
    });
}
function deleteTodo(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${apiUrl}/${id}`;
        const response = yield fetch(url, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Failed to delete todo");
        }
    });
}
function renderTodoList(todos) {
    const todoListElement = document.getElementById("todoList");
    if (todoListElement) {
        todoListElement.innerHTML = "";
        todos.forEach((todo) => {
            const li = document.createElement("li");
            li.textContent = todo.title;
            li.className = todo.completed ? "completed" : "";
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                yield deleteTodo(todo.id);
                todos = todos.filter((t) => t.id !== todo.id);
                renderTodoList(todos);
            }));
            const updateButton = document.createElement("button");
            updateButton.textContent = "Update";
            updateButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                const newTitle = prompt("Enter new todo title:", todo.title);
                if (newTitle !== null && newTitle.trim() !== "") {
                    todo.title = newTitle.trim();
                    yield updateTodo(todo);
                    renderTodoList(todos);
                }
            }));
            const doneButton = document.createElement("button");
            doneButton.textContent = todo.completed ? "Undo" : "Done";
            doneButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                todo.completed = !todo.completed;
                yield updateTodo(todo);
                renderTodoList(todos);
            }));
            li.appendChild(deleteButton);
            li.appendChild(updateButton);
            li.appendChild(doneButton);
            todoListElement.appendChild(li);
        });
    }
}
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
if (todoForm && todoInput) {
    todoForm.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        const title = todoInput.value.trim();
        if (!title) {
            return;
        }
        const newTodo = {
            id: Date.now(),
            title: title,
            completed: false,
        };
        yield addTodo(newTodo);
        const todos = yield fetchTodos();
        renderTodoList(todos);
        todoInput.value = "";
    }));
    // Initial rendering of todo list
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const todos = yield fetchTodos();
        renderTodoList(todos);
    }))();
}
