"use strict";
let items = [];
const itemInput = document.getElementById('itemInput');
const addBtn = document.getElementById('addBtn');
const itemList = document.getElementById('itemList');
const numToDraw = document.getElementById('numToDraw');
const drawBtn = document.getElementById('drawBtn');
const resultDiv = document.getElementById('result');
function saveItems() {
    localStorage.setItem('items', JSON.stringify(items));
}
function loadItems() {
    const saved = localStorage.getItem('items');
    if (saved) {
        items = JSON.parse(saved);
        renderList();
    }
}
function renderList() {
    itemList.innerHTML = '';
    items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center bg-dark text-white mb-2';
        li.innerHTML = `
        ${item.name}
        <div>
          <button class="btn btn-warning btn-sm me-2 edit-btn">✏️</button>
          <button class="btn btn-danger btn-sm delete-btn">🗑️</button>
        </div>
      `;
        li.querySelector('.delete-btn').addEventListener('click', () => deleteItem(item.id));
        li.querySelector('.edit-btn').addEventListener('click', () => editItem(item.id));
        itemList.appendChild(li);
    });
}
function addItem(name) {
    if (!name.trim())
        return;
    items.push({ id: Date.now(), name });
    saveItems();
    renderList();
    itemInput.value = '';
}
function deleteItem(id) {
    items = items.filter(item => item.id !== id);
    saveItems();
    renderList();
}
function editItem(id) {
    const item = items.find(i => i.id === id);
    if (!item)
        return;
    const newName = prompt('Editar item:', item.name);
    if (newName !== null) {
        item.name = newName.trim();
        saveItems();
        renderList();
    }
}
function drawItems(count) {
    if (items.length === 0 || count <= 0)
        return;
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count).map(item => item.name);
    resultDiv.textContent = `🎲 Resultado: ${selected.join(', ')}`;
}
// Event Listeners
addBtn.addEventListener('click', () => addItem(itemInput.value));
drawBtn.addEventListener('click', () => {
    const count = parseInt(numToDraw.value);
    drawItems(count);
});
// Load saved items
loadItems();
