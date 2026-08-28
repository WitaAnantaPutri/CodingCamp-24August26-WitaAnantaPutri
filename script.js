const $ = (selector) => document.querySelector(selector);

const clockEl = $("#clock");
const dateEl = $("#date");
const greetingEl = $("#greeting");

function updateDateTime() {
  const now = new Date();

  clockEl.textContent = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  dateEl.textContent = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const hour = now.getHours();
  greetingEl.textContent =
    hour < 12 ? "Good Morning" :
    hour < 18 ? "Good Afternoon" :
    "Good Evening";
}

updateDateTime();
setInterval(updateDateTime, 1000);

// ==================== FOCUS TIMER ====================
let totalSeconds = 25 * 60;
let timerId = null;

function renderTimer() {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  $("#timer").textContent = `${minutes}:${seconds}`;
}

$("#startBtn").addEventListener("click", () => {
  if (timerId !== null) return;

  timerId = setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      renderTimer();
    } else {
      clearInterval(timerId);
      timerId = null;
      alert("Focus session selesai! 🎉");
    }
  }, 1000);
});

$("#stopBtn").addEventListener("click", () => {
  clearInterval(timerId);
  timerId = null;
});

$("#resetBtn").addEventListener("click", () => {
  clearInterval(timerId);
  timerId = null;
  totalSeconds = 25 * 60;
  renderTimer();
});

renderTimer();

// ==================== TASKS ====================
const defaultTasks = [
  { text: "belanja", done: false },
  { text: "belajar", done: false }
];

let tasks = JSON.parse(localStorage.getItem("focusTasks") || "null") || defaultTasks;

function saveTasks() {
  localStorage.setItem("focusTasks", JSON.stringify(tasks));
}

function renderTasks() {
  const list = $("#taskList");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.done ? "done" : ""}`;

    li.innerHTML = `
      <input type="checkbox" id="task-${index}" ${task.done ? "checked" : ""}>
      <label for="task-${index}"></label>
      <button class="delete-btn" type="button">Delete</button>
    `;

    li.querySelector("label").textContent = task.text;

    li.querySelector("input").addEventListener("change", () => {
      tasks[index].done = !tasks[index].done;
      saveTasks();
      renderTasks();
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    list.appendChild(li);
  });
}

$("#taskForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const text = $("#taskInput").value.trim();

  if (!text) return;

  tasks.push({ text, done: false });
  saveTasks();
  renderTasks();
  $("#taskInput").value = "";
  $("#taskInput").focus();
});

renderTasks();

// ==================== QUICK LINKS ====================
const defaultLinks = [
  { name: "Google", url: "https://www.google.com" },
  { name: "Gmail", url: "https://mail.google.com" },
  { name: "Calendar", url: "https://calendar.google.com" }
];

let links = JSON.parse(localStorage.getItem("focusLinks") || "null") || defaultLinks;

function normalizeUrl(url) {
  if (!/^https?:\/\//i.test(url)) return "https://" + url;
  return url;
}

function saveLinks() {
  localStorage.setItem("focusLinks", JSON.stringify(links));
}

function renderLinks() {
  const container = $("#linksList");
  container.innerHTML = "";

  links.forEach((link, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "quick-link";

    const anchor = document.createElement("a");
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.textContent = link.name;
    anchor.style.color = "inherit";
    anchor.style.textDecoration = "none";
    anchor.style.flex = "1";

    const remove = document.createElement("button");
    remove.className = "remove-link";
    remove.type = "button";
    remove.textContent = "×";
    remove.title = "Remove link";

    remove.addEventListener("click", () => {
      links.splice(index, 1);
      saveLinks();
      renderLinks();
    });

    wrapper.append(anchor, remove);
    container.appendChild(wrapper);
  });
}

$("#linkForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const name = $("#linkName").value.trim();
  const rawUrl = $("#linkUrl").value.trim();

  if (!name || !rawUrl) return;

  links.push({
    name,
    url: normalizeUrl(rawUrl)
  });

  saveLinks();
  renderLinks();

  $("#linkName").value = "";
  $("#linkUrl").value = "";
  $("#linkName").focus();
});

renderLinks();
