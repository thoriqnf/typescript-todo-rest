// Define Todo type
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const apiUrl = "http://localhost:5000/todos";

async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return (await response.json()) as Todo[];
}

async function addTodo(todo: Todo): Promise<Todo> {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });
  if (!response.ok) {
    throw new Error("Failed to add todo");
  }
  return (await response.json()) as Todo;
}

async function updateTodo(todo: Todo): Promise<Todo> {
  const url = `${apiUrl}/${todo.id}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });
  if (!response.ok) {
    throw new Error("Failed to update todo");
  }
  return (await response.json()) as Todo;
}

async function deleteTodo(id: number): Promise<void> {
  const url = `${apiUrl}/${id}`;
  const response = await fetch(url, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete todo");
  }
}

function renderTodoList(todos: Todo[]): void {
  const todoListElement = document.getElementById("todoList");
  if (todoListElement) {
    todoListElement.innerHTML = "";

    todos.forEach((todo) => {
      const li = document.createElement("li");
      li.textContent = todo.title;
      li.className = todo.completed ? "completed" : "";

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", async () => {
        await deleteTodo(todo.id);
        todos = todos.filter((t) => t.id !== todo.id);
        renderTodoList(todos);
      });

      const updateButton = document.createElement("button");
      updateButton.textContent = "Update";
      updateButton.addEventListener("click", async () => {
        const newTitle = prompt("Enter new todo title:", todo.title);
        if (newTitle !== null && newTitle.trim() !== "") {
          todo.title = newTitle.trim();
          await updateTodo(todo);
          renderTodoList(todos);
        }
      });

      const doneButton = document.createElement("button");
      doneButton.textContent = todo.completed ? "Undo" : "Done";
      doneButton.addEventListener("click", async () => {
        todo.completed = !todo.completed;
        await updateTodo(todo);
        renderTodoList(todos);
      });

      li.appendChild(deleteButton);
      li.appendChild(updateButton);
      li.appendChild(doneButton);
      todoListElement.appendChild(li);
    });
  }
}

const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput") as HTMLInputElement;

if (todoForm && todoInput) {
  todoForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const title = todoInput.value.trim();
    if (!title) {
      return;
    }

    const newTodo: Todo = {
      id: Date.now(), // For simplicity, using timestamp as ID. In a real application, use a unique ID generator.
      title: title,
      completed: false,
    };

    await addTodo(newTodo);
    const todos = await fetchTodos();
    renderTodoList(todos);
    todoInput.value = "";
  });

  // Initial rendering of todo list
  (async () => {
    const todos = await fetchTodos();
    renderTodoList(todos);
  })();
}
