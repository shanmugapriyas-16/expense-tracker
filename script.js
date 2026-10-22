class Expense {
  constructor(id, name, amount, category, date) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.category = category;
    this.date = date;
  }
}
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let budget = Number(localStorage.getItem("budget") || 0);

const budgetInput = document.getElementById("budgetInput");
const setBudgetBtn = document.getElementById("setBudgetBtn");
const addBtn = document.getElementById("addBtn");
const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");
const clearBtn = document.getElementById("clearBtn");
setBudgetBtn.addEventListener("click", () => {
  budget = budgetInput.value;
  localStorage.setItem("budget", budget);
  updateDashboard();
});

addBtn.addEventListener("click", () => {
  const name = document.getElementById("name").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;
  if (!name || !amount || !date) {
    alert("Fill all fields!");
    return;
  }
  const expense = new Expense(Date.now(), name, amount, category, date);
  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderTable();
  updateDashboard();
});

function renderTable() {
  const tbody = document.getElementById("expenseTable");
  tbody.innerHTML = "";
  expenses.forEach(exp => {
    const row = document.createElement("tr");
    row.innerHTML = 
     `<td>${exp.name}</td>
      <td>₹${exp.amount}</td>
      <td>${exp.category}</td>
      <td>${exp.date}</td>
      <td><button onclick="deleteExpense(${exp.id})">Delete</button></td>`;
    tbody.appendChild(row);
  });
}

window.deleteExpense = function(id) {
  expenses = expenses.filter(e => e.id !== id);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderTable();
  updateDashboard();
};

function updateDashboard() {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const total = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  document.getElementById("spending").innerText = "Total Spending: ₹" + total;
  document.getElementById("count").innerText = "Number of Expenses: " + monthlyExpenses.length;
  document.getElementById("remaining").innerText = "Remaining Budget: ₹" + (budget - total);
}

exportBtn.addEventListener("click", () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(expenses));
  const a = document.createElement("a");
  a.href = dataStr;
  a.download = "expenses.json";
  a.click();
});

importFile.addEventListener("change", (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data)) {
        expenses = data;
        localStorage.setItem("expenses", JSON.stringify(expenses));
        renderTable();
        updateDashboard();
      } else {
        alert("Invalid JSON!");
      }
    } catch {
      alert("Error reading file!");
    }
  };
  reader.readAsText(file);
});

clearBtn.addEventListener("click", () => {
  if (confirm("Clear all expenses? Budget will stay.")) {
    expenses = [];
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderTable();
    updateDashboard();
  }
});

renderTable();
updateDashboard();
