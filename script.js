


const pageLinks = document.querySelectorAll("[data-page]");
const pages = document.querySelectorAll(".content-page");

pages.forEach(function (page) {
    page.classList.remove("active");
});

pageLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
        event.preventDefault();

        const pageName = link.dataset.page;

        // HOME: return to the dashboard buttons
        if (pageName === "home") {
            pages.forEach(function (page) {
                page.classList.remove("active");
            });

            document.getElementById("home-dashboard").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            return;
        }

        // OTHER PAGES
        const selectedPage = document.getElementById(pageName);

        if (!selectedPage) return;

        pages.forEach(function (page) {
            page.classList.remove("active");
        });

        selectedPage.classList.add("active");

        selectedPage.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});






const noteTitle = document.getElementById("note-title");
const noteContent = document.getElementById("note-content");
const saveNoteBtn = document.getElementById("save-note-btn");
const notesList = document.getElementById("notes-list");

let notes = [];

try {
    notes = JSON.parse(localStorage.getItem("galexiaNotes")) || [];
    if (!Array.isArray(notes)) notes = [];
} catch (error) {
    notes = [];
}

let editingId = null;

function saveNotesToStorage() {
    try {
        localStorage.setItem("galexiaNotes", JSON.stringify(notes));
        return true;
    } catch (error) {
        alert("Unable to save notes in this browser.");
        return false;
    }
}



const monthYear = document.getElementById("month-year");
const calendarDays = document.getElementById("calendar-days");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");

if (monthYear && calendarDays && prevMonthBtn && nextMonthBtn) {
    const today = new Date();

    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    function renderCalendar() {
        monthYear.textContent = new Date(
            currentYear,
            currentMonth
        ).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
        });

        calendarDays.replaceChildren();

        const firstDay = new Date(
            currentYear,
            currentMonth,
            1
        ).getDay();

        const daysInMonth = new Date(
            currentYear,
            currentMonth + 1,
            0
        ).getDate();

        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement("div");
            emptyDay.className = "empty-day";
            calendarDays.appendChild(emptyDay);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement("div");
            dayCell.textContent = day;

            if (
                day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear()
            ) {
                dayCell.classList.add("today");
            }

            calendarDays.appendChild(dayCell);
        }
    }

    prevMonthBtn.addEventListener("click", function () {
        currentMonth--;

        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }

        renderCalendar();
    });

    nextMonthBtn.addEventListener("click", function () {
        currentMonth++;

        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }

        renderCalendar();
    });

    renderCalendar();
}




function renderNotes() {
    notesList.replaceChildren();

    if (notes.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-notes";
        emptyMessage.textContent = "No notes yet. Write your first note above!";
        notesList.appendChild(emptyMessage);
        return;
    }

    notes.forEach(function (note) {
        const card = document.createElement("div");
        card.className = "note-card";

        const title = document.createElement("h3");
        title.textContent = note.title;

        const content = document.createElement("p");
        content.textContent = note.content;

        const actions = document.createElement("div");
        actions.className = "note-actions";

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.textContent = "✏️ Edit";

        editBtn.addEventListener("click", function () {
            noteTitle.value = note.title;
            noteContent.value = note.content;
            editingId = note.id;
            saveNoteBtn.textContent = "💾 Update Note";
            noteTitle.focus();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.textContent = "🗑️ Delete";

        deleteBtn.addEventListener("click", function () {
            if (!confirm("Delete this note?")) return;

            const previousNotes = notes;
            notes = notes.filter(function (item) {
                return item.id !== note.id;
            });

            if (!saveNotesToStorage()) {
                notes = previousNotes;
                return;
            }

            if (editingId === note.id) {
                resetNoteForm();
            }

            renderNotes();
        });

        actions.append(editBtn, deleteBtn);
        card.append(title, content, actions);
        notesList.appendChild(card);
    });
}

function resetNoteForm() {
    noteTitle.value = "";
    noteContent.value = "";
    editingId = null;
    saveNoteBtn.textContent = "💾 Save Note";
}

saveNoteBtn.addEventListener("click", function () {
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();

    if (!title || !content) {
        alert("Please enter both a title and your note.");
        return;
    }

    const previousNotes = notes.map(function (note) {
        return { ...note };
    });

    if (editingId !== null) {
        notes = notes.map(function (note) {
            return note.id === editingId
                ? { ...note, title: title, content: content }
                : note;
        });
    } else {
        notes.unshift({
            id: Date.now().toString() + Math.random().toString(16).slice(2),
            title: title,
            content: content
        });
    }

    if (!saveNotesToStorage()) {
        notes = previousNotes;
        return;
    }

    resetNoteForm();
    renderNotes();
});

renderNotes();



const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");

if (taskInput && addTaskBtn && taskList && taskCount) {
    let tasks = [];

    try {
        const savedTasks = JSON.parse(
            localStorage.getItem("galexiaTasks")
        );

        if (Array.isArray(savedTasks)) {
            tasks = savedTasks.filter(function (task) {
                return task &&
                    typeof task.id === "string" &&
                    typeof task.text === "string" &&
                    typeof task.completed === "boolean";
            });
        }
    } catch (error) {
        tasks = [];
    }

    function saveTasks() {
        try {
            localStorage.setItem(
                "galexiaTasks",
                JSON.stringify(tasks)
            );
            return true;
        } catch (error) {
            alert("Unable to save tasks in this browser.");
            return false;
        }
    }

    function renderTasks() {
        taskList.replaceChildren();

        const remaining = tasks.filter(function (task) {
            return !task.completed;
        }).length;

        taskCount.textContent =
            remaining + (remaining === 1 ? " task remaining" : " tasks remaining");

        if (tasks.length === 0) {
            const message = document.createElement("p");
            message.className = "empty-tasks";
            message.textContent = "No tasks yet. Add your first task!";
            taskList.appendChild(message);
            return;
        }

        tasks.forEach(function (task) {
            const item = document.createElement("div");
            item.className = "task-item";

            if (task.completed) {
                item.classList.add("completed");
            }

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.setAttribute(
                "aria-label",
                "Mark task as complete"
            );

            checkbox.addEventListener("change", function () {
                const previousCompleted = task.completed;
                task.completed = checkbox.checked;

                if (!saveTasks()) {
                    task.completed = previousCompleted;
                    renderTasks();
                    return;
                }

                renderTasks();
            });

            const text = document.createElement("span");
            text.className = "task-text";
            text.textContent = task.text;

            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "delete-task-btn";
            deleteBtn.textContent = "🗑️ Delete";

            deleteBtn.addEventListener("click", function () {
                if (!confirm("Delete this task?")) return;

                const previousTasks = tasks;
                tasks = tasks.filter(function (entry) {
                    return entry.id !== task.id;
                });

                if (!saveTasks()) {
                    tasks = previousTasks;
                }

                renderTasks();
            });

            item.append(checkbox, text, deleteBtn);
            taskList.appendChild(item);
        });
    }

    function addTask() {
        const text = taskInput.value.trim();

        if (!text) {
            alert("Please enter a task first.");
            taskInput.focus();
            return;
        }

        tasks.unshift({
            id: Date.now().toString() +
                Math.random().toString(16).slice(2),
            text: text,
            completed: false
        });

        if (!saveTasks()) {
            tasks.shift();
            return;
        }

        taskInput.value = "";
        renderTasks();
        taskInput.focus();
    }

    addTaskBtn.addEventListener("click", addTask);

    taskInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            addTask();
        }
    });

    renderTasks();
}


const scheduleTitle = document.getElementById("schedule-title");
const scheduleDate = document.getElementById("schedule-date");
const scheduleTime = document.getElementById("schedule-time");
const scheduleDescription = document.getElementById("schedule-description");
const addScheduleBtn = document.getElementById("add-schedule-btn");
const schedulesList = document.getElementById("schedules-list");

if (
    scheduleTitle &&
    scheduleDate &&
    scheduleTime &&
    scheduleDescription &&
    addScheduleBtn &&
    schedulesList
) {
    let schedules = [];

    try {
        const savedSchedules = JSON.parse(
            localStorage.getItem("galexiaSchedules")
        );

        if (Array.isArray(savedSchedules)) {
            schedules = savedSchedules.filter(function (item) {
                return item &&
                    typeof item.id === "string" &&
                    typeof item.title === "string" &&
                    typeof item.date === "string" &&
                    typeof item.time === "string" &&
                    typeof item.description === "string";
            });
        }
    } catch (error) {
        schedules = [];
    }

    function saveSchedules() {
        try {
            localStorage.setItem(
                "galexiaSchedules",
                JSON.stringify(schedules)
            );
            return true;
        } catch (error) {
            alert("Unable to save schedules in this browser.");
            return false;
        }
    }

    function renderSchedules() {
        schedulesList.replaceChildren();

        const sortedSchedules = [...schedules].sort(function (a, b) {
            const dateA = a.date + "T" + (a.time || "00:00");
            const dateB = b.date + "T" + (b.time || "00:00");
            return dateA.localeCompare(dateB);
        });

        if (sortedSchedules.length === 0) {
            const message = document.createElement("p");
            message.className = "empty-schedules";
            message.textContent =
                "No schedules yet. Add something to your calendar!";
            schedulesList.appendChild(message);
            return;
        }

        sortedSchedules.forEach(function (schedule) {
            const card = document.createElement("div");
            card.className = "schedule-card";

            const title = document.createElement("h3");
            title.textContent = schedule.title;

            const date = document.createElement("p");
            date.className = "schedule-meta";

            const parsedDate = new Date(
                schedule.date + "T00:00:00"
            );

            date.textContent = "📅 " +
                parsedDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                });

            const time = document.createElement("p");
            time.className = "schedule-meta";
            time.textContent = schedule.time
                ? "🕒 " + new Date(
                    "2000-01-01T" + schedule.time
                ).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit"
                })
                : "🕒 No time set";

            card.append(title, date, time);

            if (schedule.description) {
                const description = document.createElement("p");
                description.className = "schedule-description";
                description.textContent = schedule.description;
                card.appendChild(description);
            }

            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "delete-schedule-btn";
            deleteBtn.textContent = "🗑️ Delete";

            deleteBtn.addEventListener("click", function () {
                if (!confirm("Delete this schedule?")) return;

                const previousSchedules = schedules;
                schedules = schedules.filter(function (item) {
                    return item.id !== schedule.id;
                });

                if (!saveSchedules()) {
                    schedules = previousSchedules;
                }

                renderSchedules();
            });

            card.appendChild(deleteBtn);
            schedulesList.appendChild(card);
        });
    }

    addScheduleBtn.addEventListener("click", function () {
        const title = scheduleTitle.value.trim();
        const date = scheduleDate.value;
        const time = scheduleTime.value;
        const description = scheduleDescription.value.trim();

        if (!title || !date) {
            alert("Please enter a schedule title and date.");
            return;
        }

        const newSchedule = {
            id: Date.now().toString() +
                Math.random().toString(16).slice(2),
            title: title,
            date: date,
            time: time,
            description: description
        };

        schedules.push(newSchedule);

        if (!saveSchedules()) {
            schedules = schedules.filter(function (item) {
                return item.id !== newSchedule.id;
            });
            return;
        }

        scheduleTitle.value = "";
        scheduleDate.value = "";
        scheduleTime.value = "";
        scheduleDescription.value = "";

        renderSchedules();
    });

    renderSchedules();
}


/* PLANNER */

const plannerTitle = document.getElementById("planner-title");
const plannerDate = document.getElementById("planner-date");
const plannerDetails = document.getElementById("planner-details");
const addPlanBtn = document.getElementById("add-plan-btn");
const plannerList = document.getElementById("planner-list");

if (plannerTitle && plannerDate && plannerDetails && addPlanBtn && plannerList) {

    let plans = [];

    try {
        const savedPlans = JSON.parse(localStorage.getItem("galexiaPlans"));
        if (Array.isArray(savedPlans)) {
            plans = savedPlans.filter(function (plan) {
                return plan &&
                    typeof plan.id === "string" &&
                    typeof plan.title === "string" &&
                    typeof plan.date === "string" &&
                    typeof plan.details === "string";
            });
        }
    } catch (error) {
        plans = [];
    }

    function savePlans() {
        try {
            localStorage.setItem("galexiaPlans", JSON.stringify(plans));
            return true;
        } catch (error) {
            alert("Unable to save plans in this browser.");
            return false;
        }
    }

    function renderPlans() {
        plannerList.replaceChildren();

        if (plans.length === 0) {
            const message = document.createElement("p");
            message.className = "empty-plans";
            message.textContent = "No plans yet. Start planning your goals! ✨";
            plannerList.appendChild(message);
            return;
        }

        const sortedPlans = [...plans].sort(function (a, b) {
            return (a.date || "9999-12-31").localeCompare(
                b.date || "9999-12-31"
            );
        });

        sortedPlans.forEach(function (plan) {
            const card = document.createElement("div");
            card.className = "plan-card";

            const title = document.createElement("h3");
            title.textContent = "🌌 " + plan.title;

            const date = document.createElement("p");
            date.className = "plan-date";

            if (plan.date) {
                const parts = plan.date.split("-");
                const formattedDate = new Date(
                    Number(parts[0]),
                    Number(parts[1]) - 1,
                    Number(parts[2])
                );

                date.textContent = "🎯 Target Date: " +
                    formattedDate.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                    });
            } else {
                date.textContent = "🎯 No target date set";
            }

            const details = document.createElement("p");
            details.className = "plan-details";
            details.textContent = plan.details || "No details added.";

            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "delete-plan-btn";
            deleteBtn.textContent = "🗑️ Delete Plan";

            deleteBtn.addEventListener("click", function () {
                if (!confirm("Are you sure you want to delete this plan?")) {
                    return;
                }

                const previousPlans = plans;
                plans = plans.filter(function (item) {
                    return item.id !== plan.id;
                });

                if (!savePlans()) {
                    plans = previousPlans;
                    return;
                }

                renderPlans();
            });

            card.append(title, date, details, deleteBtn);
            plannerList.appendChild(card);
        });
    }

    addPlanBtn.addEventListener("click", function () {
        const title = plannerTitle.value.trim();
        const date = plannerDate.value;
        const details = plannerDetails.value.trim();

        if (!title) {
            alert("Please enter a plan title.");
            plannerTitle.focus();
            return;
        }

        const newPlan = {
            id: Date.now().toString() +
                Math.random().toString(16).slice(2),
            title: title,
            date: date,
            details: details
        };

        plans.unshift(newPlan);

        if (!savePlans()) {
            plans.shift();
            return;
        }

        plannerTitle.value = "";
        plannerDate.value = "";
        plannerDetails.value = "";

        renderPlans();
    });

    renderPlans();
}



const documentUpload = document.getElementById("document-upload");
const documentsList = document.getElementById("documents-list");

if (documentUpload && documentsList) {
    let documents = [];

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(1) + " KB";
        }
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }

    function getFileIcon(name) {
        const extension = name.split(".").pop().toLowerCase();

        if (extension === "pdf") return "📕";
        if (["doc", "docx"].includes(extension)) return "📘";
        if (["ppt", "pptx"].includes(extension)) return "📙";
        if (["xls", "xlsx"].includes(extension)) return "📗";
        if (["jpg", "jpeg", "png"].includes(extension)) return "🖼️";

        return "📄";
    }

    function renderDocuments() {
        documentsList.replaceChildren();

        if (documents.length === 0) {
            const empty = document.createElement("p");
            empty.className = "empty-documents";
            empty.textContent =
                "No files added yet. Upload your first document!";
            documentsList.appendChild(empty);
            return;
        }

        documents.forEach(function (file, index) {
            const card = document.createElement("div");
            card.className = "document-card";

            const icon = document.createElement("span");
            icon.className = "document-icon";
            icon.textContent = getFileIcon(file.name);

            const info = document.createElement("div");
            info.className = "document-info";

            const name = document.createElement("h3");
            name.textContent = file.name;

            const size = document.createElement("p");
            size.textContent = formatFileSize(file.size);

            info.append(name, size);

            const actions = document.createElement("div");
            actions.className = "document-actions";

            const openBtn = document.createElement("button");
            openBtn.type = "button";
            openBtn.textContent = "Open";

            openBtn.addEventListener("click", function () {
                const url = URL.createObjectURL(file);
                const newTab = window.open(url, "_blank");

                if (newTab) {
                    newTab.addEventListener("beforeunload", function () {
                        URL.revokeObjectURL(url);
                    });
                } else {
                    URL.revokeObjectURL(url);
                    alert("Please allow pop-ups to open this file.");
                }
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "delete-document-btn";
            deleteBtn.textContent = "Delete";

            deleteBtn.addEventListener("click", function () {
                if (!confirm("Remove this file from the list?")) return;

                documents.splice(index, 1);
                renderDocuments();
            });

            actions.append(openBtn, deleteBtn);
            card.append(icon, info, actions);
            documentsList.appendChild(card);
        });
    }

    documentUpload.addEventListener("change", function () {
        const selectedFiles = Array.from(documentUpload.files);

        selectedFiles.forEach(function (file) {
            documents.push(file);
        });

        renderDocuments();
        documentUpload.value = "";
    });

    renderDocuments();
}


const transactionTitle = document.getElementById("transaction-title");
const transactionAmount = document.getElementById("transaction-amount");
const transactionType = document.getElementById("transaction-type");
const transactionCategory = document.getElementById("transaction-category");
const transactionDate = document.getElementById("transaction-date");
const addTransactionBtn = document.getElementById("add-transaction-btn");
const transactionsList = document.getElementById("transactions-list");

const totalIncomeDisplay = document.getElementById("total-income");
const totalExpensesDisplay = document.getElementById("total-expenses");
const remainingBalanceDisplay = document.getElementById("remaining-balance");

if (
    transactionTitle && transactionAmount && transactionType &&
    transactionCategory && transactionDate && addTransactionBtn &&
    transactionsList && totalIncomeDisplay &&
    totalExpensesDisplay && remainingBalanceDisplay
) {
    let transactions = [];

    try {
        const savedTransactions = JSON.parse(
            localStorage.getItem("galexiaTransactions")
        );

        if (Array.isArray(savedTransactions)) {
            transactions = savedTransactions.filter(function (item) {
                return item &&
                    typeof item.title === "string" &&
                    Number.isFinite(item.amount) &&
                    item.amount > 0 &&
                    (item.type === "income" || item.type === "expense");
            });
        }
    } catch (error) {
        transactions = [];
    }

    // Set today's date automatically
    const today = new Date();
    const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    transactionDate.value = localToday;

    function formatMoney(amount) {
        return amount.toLocaleString("en-PH", {
            style: "currency",
            currency: "PHP"
        });
    }

    function saveTransactions() {
        try {
            localStorage.setItem(
                "galexiaTransactions",
                JSON.stringify(transactions)
            );
            return true;
        } catch (error) {
            alert("Unable to save transactions in this browser.");
            return false;
        }
    }

    function renderTransactions() {
        let income = 0;
        let expenses = 0;

        transactions.forEach(function (item) {
            if (item.type === "income") {
                income += item.amount;
            } else {
                expenses += item.amount;
            }
        });

        totalIncomeDisplay.textContent = formatMoney(income);
        totalExpensesDisplay.textContent = formatMoney(expenses);
        remainingBalanceDisplay.textContent = formatMoney(income - expenses);

        transactionsList.replaceChildren();

        if (transactions.length === 0) {
            const empty = document.createElement("p");
            empty.className = "empty-transactions";
            empty.textContent = "No transactions yet. Add your first one!";
            transactionsList.appendChild(empty);
            return;
        }

        const sortedTransactions = [...transactions].sort(function (a, b) {
            return b.date.localeCompare(a.date) || b.id.localeCompare(a.id);
        });

        sortedTransactions.forEach(function (item) {
            const row = document.createElement("div");
            row.className = "transaction-item";

            const info = document.createElement("div");
            info.className = "transaction-info";

            const title = document.createElement("h3");
            title.textContent = item.title;

            const details = document.createElement("p");
            details.textContent =
                item.category + " • " + item.date;

            info.append(title, details);

            const amount = document.createElement("span");
            amount.className = "transaction-amount " +
                (item.type === "income" ? "income-amount" : "expense-amount");

            amount.textContent =
                (item.type === "income" ? "+" : "−") +
                formatMoney(item.amount);

            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.className = "delete-transaction-btn";
            deleteBtn.textContent = "Delete";

            deleteBtn.addEventListener("click", function () {
                if (!confirm("Delete this transaction?")) return;

                const previousTransactions = transactions;
                transactions = transactions.filter(function (transaction) {
                    return transaction.id !== item.id;
                });

                if (!saveTransactions()) {
                    transactions = previousTransactions;
                    return;
                }

                renderTransactions();
            });

            row.append(info, amount, deleteBtn);
            transactionsList.appendChild(row);
        });
    }

    addTransactionBtn.addEventListener("click", function () {
        const title = transactionTitle.value.trim();
        const amount = Number(transactionAmount.value);
        const type = transactionType.value;
        const category = transactionCategory.value;
        const date = transactionDate.value;

        if (!title || !transactionAmount.value.trim() || !date) {
            alert("Please complete the description, amount, and date.");
            return;
        }

        if (!Number.isFinite(amount) || amount <= 0) {
            alert("Please enter an amount greater than zero.");
            return;
        }

        const transaction = {
            id: Date.now().toString() + Math.random().toString(16).slice(2),
            title: title,
            amount: amount,
            type: type,
            category: category,
            date: date
        };

        transactions.unshift(transaction);

        if (!saveTransactions()) {
            transactions.shift();
            return;
        }

        transactionTitle.value = "";
        transactionAmount.value = "";
        renderTransactions();
    });

    renderTransactions();
}




/* =================================
   GALEXIA STUDY HUB
================================= */

// Shared helper functions

function studyCreateId() {
    return Date.now().toString() +
        Math.random().toString(16).slice(2);
}

function studyLoadData(key) {
    try {
        const data = JSON.parse(localStorage.getItem(key));
        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}

function studySaveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        alert("Unable to save data. Your browser storage may be full.");
        return false;
    }
}

function studyCreateButton(text, className, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;

    if (className) {
        button.className = className;
    }

    button.addEventListener("click", onClick);
    return button;
}

function studyCreateEmptyMessage(text) {
    const message = document.createElement("p");
    message.className = "study-empty";
    message.textContent = text;
    return message;
}


/* =================================
   1. MY SUBJECTS
================================= */

const subjectForm = document.getElementById("subject-form");
const subjectName = document.getElementById("subject-name");
const subjectDescription = document.getElementById("subject-description");
const subjectsList = document.getElementById("subjects-list");

if (subjectForm && subjectName && subjectDescription && subjectsList) {
    const storageKey = "galexiaStudySubjects";
    let subjects = studyLoadData(storageKey);

    function renderSubjects() {
        subjectsList.replaceChildren();

        if (subjects.length === 0) {
            subjectsList.appendChild(
                studyCreateEmptyMessage(
                    "No subjects yet. Add your first subject!"
                )
            );
            return;
        }

        subjects.forEach(function (subject) {
            const card = document.createElement("div");
            card.className = "study-item";

            const title = document.createElement("h3");
            title.textContent = "📚 " + subject.name;

            const description = document.createElement("p");
            description.textContent =
                subject.description || "No description added.";

            const actions = document.createElement("div");
            actions.className = "study-actions";

            const editButton = studyCreateButton(
                "✏️ Edit",
                "",
                function () {
                    const newName = prompt(
                        "Enter the subject name:",
                        subject.name
                    );

                    if (newName === null) return;

                    if (!newName.trim()) {
                        alert("Subject name cannot be empty.");
                        return;
                    }

                    const newDescription = prompt(
                        "Enter a description (optional):",
                        subject.description || ""
                    );

                    if (newDescription === null) return;

                    const previousSubjects = subjects;

                    subjects = subjects.map(function (item) {
                        return item.id === subject.id
                            ? {
                                ...item,
                                name: newName.trim(),
                                description: newDescription.trim()
                            }
                            : item;
                    });

                    if (!studySaveData(storageKey, subjects)) {
                        subjects = previousSubjects;
                        return;
                    }

                    renderSubjects();
                }
            );

            const deleteButton = studyCreateButton(
                "🗑️ Delete",
                "delete-study-btn",
                function () {
                    if (!confirm("Delete this subject?")) return;

                    const previousSubjects = subjects;

                    subjects = subjects.filter(function (item) {
                        return item.id !== subject.id;
                    });

                    if (!studySaveData(storageKey, subjects)) {
                        subjects = previousSubjects;
                        return;
                    }

                    renderSubjects();
                }
            );

            actions.append(editButton, deleteButton);
            card.append(title, description, actions);
            subjectsList.appendChild(card);
        });
    }

    subjectForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = subjectName.value.trim();
        const description = subjectDescription.value.trim();

        if (!name) {
            alert("Please enter a subject name.");
            return;
        }

        const newSubject = {
            id: studyCreateId(),
            name: name,
            description: description
        };

        subjects.unshift(newSubject);

        if (!studySaveData(storageKey, subjects)) {
            subjects.shift();
            return;
        }

        subjectForm.reset();
        renderSubjects();
    });

    renderSubjects();
}


/* =================================
   2. REVIEWERS & SUMMARIES
================================= */

const reviewerForm = document.getElementById("reviewer-form");
const reviewerTitle = document.getElementById("reviewer-title");
const reviewerSubject = document.getElementById("reviewer-subject");
const reviewerContent = document.getElementById("reviewer-content");
const reviewersList = document.getElementById("reviewers-list");

if (
    reviewerForm &&
    reviewerTitle &&
    reviewerSubject &&
    reviewerContent &&
    reviewersList
) {
    const storageKey = "galexiaStudyReviewers";
    let reviewers = studyLoadData(storageKey);

    function renderReviewers() {
        reviewersList.replaceChildren();

        if (reviewers.length === 0) {
            reviewersList.appendChild(
                studyCreateEmptyMessage(
                    "No reviewers yet. Save your first lesson summary!"
                )
            );
            return;
        }

        reviewers.forEach(function (reviewer) {
            const card = document.createElement("div");
            card.className = "study-item";

            const title = document.createElement("h3");
            title.textContent = "📝 " + reviewer.title;

            const subject = document.createElement("p");
            subject.className = "study-meta";
            subject.textContent = reviewer.subject
                ? "Subject: " + reviewer.subject
                : "No subject assigned";

            const content = document.createElement("p");
            content.textContent = reviewer.content;

            const actions = document.createElement("div");
            actions.className = "study-actions";

            const editButton = studyCreateButton(
                "✏️ Edit",
                "",
                function () {
                    const newTitle = prompt(
                        "Reviewer title:",
                        reviewer.title
                    );

                    if (newTitle === null) return;

                    if (!newTitle.trim()) {
                        alert("Reviewer title cannot be empty.");
                        return;
                    }

                    const newSubject = prompt(
                        "Subject (optional):",
                        reviewer.subject || ""
                    );

                    if (newSubject === null) return;

                    const newContent = prompt(
                        "Reviewer notes:",
                        reviewer.content
                    );

                    if (newContent === null) return;

                    if (!newContent.trim()) {
                        alert("Reviewer notes cannot be empty.");
                        return;
                    }

                    const previousReviewers = reviewers;

                    reviewers = reviewers.map(function (item) {
                        return item.id === reviewer.id
                            ? {
                                ...item,
                                title: newTitle.trim(),
                                subject: newSubject.trim(),
                                content: newContent.trim()
                            }
                            : item;
                    });

                    if (!studySaveData(storageKey, reviewers)) {
                        reviewers = previousReviewers;
                        return;
                    }

                    renderReviewers();
                }
            );

            const deleteButton = studyCreateButton(
                "🗑️ Delete",
                "delete-study-btn",
                function () {
                    if (!confirm("Delete this reviewer?")) return;

                    const previousReviewers = reviewers;

                    reviewers = reviewers.filter(function (item) {
                        return item.id !== reviewer.id;
                    });

                    if (!studySaveData(storageKey, reviewers)) {
                        reviewers = previousReviewers;
                        return;
                    }

                    renderReviewers();
                }
            );

            actions.append(editButton, deleteButton);
            card.append(title, subject, content, actions);
            reviewersList.appendChild(card);
        });
    }

    reviewerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = reviewerTitle.value.trim();
        const subject = reviewerSubject.value.trim();
        const content = reviewerContent.value.trim();

        if (!title || !content) {
            alert("Please enter a title and your notes.");
            return;
        }

        const newReviewer = {
            id: studyCreateId(),
            title: title,
            subject: subject,
            content: content
        };

        reviewers.unshift(newReviewer);

        if (!studySaveData(storageKey, reviewers)) {
            reviewers.shift();
            return;
        }

        reviewerForm.reset();
        renderReviewers();
    });

    renderReviewers();
}


/* =================================
   3. LEARNING MATERIALS
================================= */

const materialForm = document.getElementById("material-form");
const materialTitle = document.getElementById("material-title");
const materialType = document.getElementById("material-type");
const materialUrl = document.getElementById("material-url");
const materialsList = document.getElementById("materials-list");

if (
    materialForm &&
    materialTitle &&
    materialType &&
    materialUrl &&
    materialsList
) {
    const storageKey = "galexiaStudyMaterials";
    let materials = studyLoadData(storageKey);

    function isValidResourceUrl(value) {
        try {
            const url = new URL(value);
            return url.protocol === "https:" ||
                url.protocol === "http:";
        } catch (error) {
            return false;
        }
    }

    function renderMaterials() {
        materialsList.replaceChildren();

        if (materials.length === 0) {
            materialsList.appendChild(
                studyCreateEmptyMessage(
                    "No learning materials yet. Save a useful resource!"
                )
            );
            return;
        }

        materials.forEach(function (material) {
            const card = document.createElement("div");
            card.className = "study-item";

            const title = document.createElement("h3");
            title.textContent = "💻 " + material.title;

            const type = document.createElement("p");
            type.className = "study-meta";
            type.textContent = material.type;

            const link = document.createElement("a");
            link.href = material.url;
            link.textContent = "Open Learning Resource ↗";
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            const actions = document.createElement("div");
            actions.className = "study-actions";

            const editButton = studyCreateButton(
                "✏️ Edit",
                "",
                function () {
                    const newTitle = prompt(
                        "Resource title:",
                        material.title
                    );

                    if (newTitle === null) return;

                    if (!newTitle.trim()) {
                        alert("Resource title cannot be empty.");
                        return;
                    }

                    const newType = prompt(
                        "Resource type:",
                        material.type
                    );

                    if (newType === null) return;

                    if (!newType.trim()) {
                        alert("Resource type cannot be empty.");
                        return;
                    }

                    const newUrl = prompt(
                        "Resource URL:",
                        material.url
                    );

                    if (newUrl === null) return;

                    if (!isValidResourceUrl(newUrl.trim())) {
                        alert("Please enter a valid HTTP or HTTPS link.");
                        return;
                    }

                    const previousMaterials = materials;

                    materials = materials.map(function (item) {
                        return item.id === material.id
                            ? {
                                ...item,
                                title: newTitle.trim(),
                                type: newType.trim(),
                                url: newUrl.trim()
                            }
                            : item;
                    });

                    if (!studySaveData(storageKey, materials)) {
                        materials = previousMaterials;
                        return;
                    }

                    renderMaterials();
                }
            );

            const deleteButton = studyCreateButton(
                "🗑️ Delete",
                "delete-study-btn",
                function () {
                    if (!confirm("Delete this learning material?")) return;

                    const previousMaterials = materials;

                    materials = materials.filter(function (item) {
                        return item.id !== material.id;
                    });

                    if (!studySaveData(storageKey, materials)) {
                        materials = previousMaterials;
                        return;
                    }

                    renderMaterials();
                }
            );

            actions.append(editButton, deleteButton);
            card.append(title, type, link, actions);
            materialsList.appendChild(card);
        });
    }

    materialForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = materialTitle.value.trim();
        const type = materialType.value;
        const url = materialUrl.value.trim();

        if (!title || !type || !url) {
            alert("Please complete all learning material fields.");
            return;
        }

        if (!isValidResourceUrl(url)) {
            alert("Please enter a valid HTTP or HTTPS resource link.");
            return;
        }

        const newMaterial = {
            id: studyCreateId(),
            title: title,
            type: type,
            url: url
        };

        materials.unshift(newMaterial);

        if (!studySaveData(storageKey, materials)) {
            materials.shift();
            return;
        }

        materialForm.reset();
        renderMaterials();
    });

    renderMaterials();
}

