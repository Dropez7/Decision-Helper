"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {};
// Listas de itens e grupos exclusivos
let items = [];
let exclusiveGroups = [];
// Selecionando elementos do DOM
const generalList = document.getElementById("generalList");
const exclusiveContainer = document.getElementById("exclusiveContainer");
const addGeneralBtn = document.getElementById("addGeneralBtn");
const addExclusiveGroupBtn = document.getElementById("addExclusiveGroupBtn");
const numToDraw = document.getElementById("numToDraw");
const drawBtn = document.getElementById("drawBtn");
const resultDiv = document.getElementById("result");
// Salva os itens no localStorage
function saveItems() {
    localStorage.setItem("items", JSON.stringify(items));
    localStorage.setItem("exclusiveGroups", JSON.stringify(exclusiveGroups));
}
// Carrega os itens do localStorage
function loadItems() {
    const savedItems = localStorage.getItem("items");
    const savedGroups = localStorage.getItem("exclusiveGroups");
    if (savedItems)
        items = JSON.parse(savedItems);
    if (savedGroups)
        exclusiveGroups = JSON.parse(savedGroups);
    renderLists();
}
// Renderiza os itens na tela
function renderLists() {
    generalList.innerHTML = "";
    exclusiveContainer.innerHTML = "";
    const generalItems = items.filter((item) => !item.group);
    generalItems.forEach((item) => addItemToDOM(item, generalList));
    exclusiveGroups.forEach((group) => renderExclusiveGroup(group));
}
// Renderiza um grupo exclusivo e seus itens
function renderExclusiveGroup(group) {
    const card = document.createElement("div");
    card.className = "card bg-dark text-white mb-3 p-3";
    // Header do grupo exclusivo
    const header = document.createElement("div");
    header.className = "d-flex justify-content-between align-items-center";
    const label = document.createElement("span");
    label.textContent = `Grupo: ${group}`;
    // Botão de editar grupo
    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-warning btn-sm";
    editBtn.textContent = "✏️";
    editBtn.addEventListener("click", () => editGroup(group));
    // Botão de excluir grupo
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger btn-sm";
    deleteBtn.textContent = "🗑️";
    deleteBtn.addEventListener("click", () => deleteGroup(group));
    // Lista de itens do grupo
    const list = document.createElement("ul");
    list.className = "list-group list-group-flush bg-dark";
    list.id = `list-${group}`;
    items.filter((item) => item.group === group).forEach((item) => addItemToDOM(item, list));
    // Botão para adicionar itens ao grupo
    const addItemBtn = document.createElement("button");
    addItemBtn.className = "btn btn-success btn-sm mt-2";
    addItemBtn.textContent = "+";
    addItemBtn.addEventListener("click", () => createItemInput(list, group));
    // Adicionando elementos ao card
    header.appendChild(label);
    header.appendChild(editBtn);
    header.appendChild(deleteBtn);
    card.appendChild(header);
    card.appendChild(list);
    card.appendChild(addItemBtn);
    exclusiveContainer.appendChild(card);
}
// Cria um input para inserir um item
function createItemInput(list, group) {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center bg-dark text-white";
    const input = document.createElement("input");
    input.type = "text";
    input.className = "form-control";
    input.placeholder = "Digite o nome do item";
    const confirmBtn = document.createElement("button");
    confirmBtn.className = "btn btn-success btn-sm";
    confirmBtn.textContent = "✔️";
    confirmBtn.addEventListener("click", () => {
        if (input.value.trim()) {
            addItem(input.value.trim(), group);
            li.remove();
        }
    });
    li.appendChild(input);
    li.appendChild(confirmBtn);
    list.appendChild(li);
    input.focus();
}
// Adiciona um item ao array e renderiza
function addItem(name, group) {
    const newItem = { id: Date.now(), name, group };
    items.push(newItem);
    saveItems();
    renderLists();
}
// Adiciona um item ao DOM
function addItemToDOM(item, list) {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center bg-dark text-white";
    const label = document.createElement("span");
    label.textContent = item.name;
    // Botão de editar item
    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-warning btn-sm";
    editBtn.textContent = "✏️";
    editBtn.addEventListener("click", () => editItem(item));
    // Botão de excluir item
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger btn-sm";
    deleteBtn.textContent = "🗑️";
    deleteBtn.addEventListener("click", () => deleteItem(item.id));
    li.appendChild(label);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    list.appendChild(li);
}
// Editar um item
function editItem(item) {
    const newName = prompt("Editar item:", item.name);
    if (newName) {
        item.name = newName;
        saveItems();
        renderLists();
    }
}
// Excluir um item
function deleteItem(id) {
    items = items.filter((item) => item.id !== id);
    saveItems();
    renderLists();
}
// Criar um grupo exclusivo
function createGroupInput() {
    const card = document.createElement("div");
    card.className = "card bg-dark text-white mb-3 p-3";
    const input = document.createElement("input");
    input.type = "text";
    input.className = "form-control mb-2";
    input.placeholder = "Nome do Grupo Exclusivo";
    const confirmBtn = document.createElement("button");
    confirmBtn.className = "btn btn-success btn-sm";
    confirmBtn.textContent = "✔️";
    confirmBtn.addEventListener("click", () => {
        if (input.value.trim() && !exclusiveGroups.includes(input.value.trim())) {
            exclusiveGroups.push(input.value.trim());
            saveItems();
            renderLists();
        }
    });
    card.appendChild(input);
    card.appendChild(confirmBtn);
    exclusiveContainer.appendChild(card);
    input.focus();
}
// Editar um grupo exclusivo
function editGroup(group) {
    const newName = prompt("Editar grupo:", group);
    if (newName && !exclusiveGroups.includes(newName)) {
        const index = exclusiveGroups.indexOf(group);
        if (index !== -1) {
            exclusiveGroups[index] = newName;
            saveItems();
            renderLists();
        }
    }
}
// Excluir um grupo exclusivo
function deleteGroup(group) {
    exclusiveGroups = exclusiveGroups.filter((g) => g !== group);
    items = items.filter((item) => item.group !== group);
    saveItems();
    renderLists();
}
// Sorteia os itens
function drawItems(count) {
    if (items.length === 0 || count <= 0)
        return;
    let gruposExclusivos = {};
    let grupoGeral = [];
    // Separar os itens
    items.forEach((item) => {
        if (item.group) {
            if (!gruposExclusivos[item.group])
                gruposExclusivos[item.group] = [];
            gruposExclusivos[item.group].push(item.name);
        }
        else {
            grupoGeral.push(item.name);
        }
    });
    let elementosParaSortear = [
        ...grupoGeral,
    ];
    // Adicionar grupos exclusivos como objetos (para remover itens depois)
    for (const [group, itemList] of Object.entries(gruposExclusivos)) {
        elementosParaSortear.push({ group, items: [...itemList] });
    }
    let resultado = [];
    while (resultado.length < count && elementosParaSortear.length > 0) {
        let index = Math.floor(Math.random() * elementosParaSortear.length);
        let escolhido = elementosParaSortear[index];
        if (typeof escolhido === "string") {
            // Item do grupo geral
            resultado.push(escolhido);
            elementosParaSortear.splice(index, 1); // Remover para evitar repetição
        }
        else {
            // Grupo exclusivo → Sorteia um item dele
            if (escolhido.items.length > 0) {
                let itemIndex = Math.floor(Math.random() * escolhido.items.length);
                let itemSorteado = escolhido.items.splice(itemIndex, 1)[0];
                resultado.push(itemSorteado);
                // Se o grupo ficar vazio, removemos do sorteio
                if (escolhido.items.length === 0) {
                    elementosParaSortear.splice(index, 1);
                }
            }
        }
    }
    resultDiv.textContent = `🎲 Resultado: ${resultado.join(", ")}`;
}
// Event Listeners
addGeneralBtn.addEventListener("click", () => createItemInput(generalList));
addExclusiveGroupBtn.addEventListener("click", createGroupInput);
drawBtn.addEventListener("click", () => drawItems(parseInt(numToDraw.value)));
loadItems();
