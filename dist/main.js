"use strict";
// Listas de itens e grupos exclusivos
let items = [];
let exclusiveGroups = {};
let isEditingItem = false;
let isEditingGroup = false;
// Selecionando elementos do DOM
const generalList = document.getElementById("generalList");
const exclusiveContainer = document.getElementById("exclusiveContainer");
const addGeneralBtn = document.getElementById("addGeneralBtn");
const addNewExclusiveGroupBtn = document.getElementById("addNewExclusiveGroupBtn");
const drawBtn = document.getElementById("drawBtn");
const numToDrawElement = document.getElementById("numToDraw");
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
    items.filter((item) => !item.group).forEach((item) => addGeneralGroupItem(item, generalList));
    Object.keys(exclusiveGroups).forEach((group) => addExclusiveGroup(group, exclusiveGroups[group]));
}
// Grupo Geral 
// Função para adicionar ou editar item na lista geral
// Função para adicionar ou editar item na lista geral
function addGeneralGroupItem(item, list) {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center bg-dark text-white border-0";
    const input = document.createElement("input");
    input.type = "text";
    input.value = item.name;
    input.disabled = !item.isEditing;
    input.className = "form-control me-2 bg-dark text-white border-0";
    // Se o input perder o foco
    input.onblur = () => {
        if (input.value.trim() === "") {
            // Se o input estiver vazio, remove o item
            removeGeneralItem(item.id);
        }
        else {
            // Caso contrário, salva o item
            item.name = input.value;
            item.isEditing = false;
            isEditingItem = false;
            saveItems();
            renderLists();
        }
    };
    const editBtn = createEditButton(item);
    const removeBtn = createRemoveButton(item);
    const toggleBtn = createToggleButton(item); // Cria o botão de fixar/desfixar
    li.appendChild(input);
    li.appendChild(editBtn);
    li.appendChild(removeBtn);
    li.appendChild(toggleBtn); // Adiciona o botão de toggle
    list.appendChild(li);
    if (item.isEditing) {
        input.focus(); // Dá o foco ao input quando o item estiver em edição
    }
}
// Função para adicionar um item a um grupo exclusivo
function addExclusiveGroupItem(item, exclusiveGroup) {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center bg-dark text-white border-0";
    const input = document.createElement("input");
    input.type = "text";
    input.value = item.name;
    input.disabled = !item.isEditing;
    input.className = "form-control me-2 bg-dark text-white border-0";
    input.onblur = () => {
        if (input.value.trim() === "") {
            removeGeneralItem(item.id);
        }
        else {
            item.name = input.value;
            item.isEditing = false;
            isEditingItem = false;
            saveItems();
            renderLists();
        }
    };
    const editBtn = createEditButton(item);
    const removeBtn = createRemoveButton(item);
    const toggleBtn = createToggleButton(item);
    li.appendChild(input);
    li.appendChild(editBtn);
    li.appendChild(removeBtn);
    li.appendChild(toggleBtn); // Adiciona o botão de toggle
    exclusiveGroup.appendChild(li);
    if (item.isEditing) {
        setTimeout(() => {
            input.focus(); // Focar no input de edição
        }, 0);
    }
}
function addNewExclusiveGroup() {
    const groupName = prompt("Nome do novo grupo exclusivo:");
    if (!groupName || exclusiveGroups[groupName])
        return;
    exclusiveGroups[groupName] = [];
    saveItems();
    renderLists();
}
function addExclusiveGroup(groupName, itemsInGroup) {
    const card = document.createElement("div");
    card.className = "card bg-dark text-white mb-3";
    const cardHeader = document.createElement("div");
    cardHeader.className = "card-header d-flex justify-content-between align-items-center";
    const span = document.createElement("span");
    span.className = "text-warning";
    span.textContent = groupName;
    const addItemBtn = document.createElement("button");
    addItemBtn.className = "btn btn-success btn-sm";
    addItemBtn.textContent = "+";
    addItemBtn.onclick = () => addItemToExclusiveGroup(groupName);
    const removeGroupBtn = document.createElement("button");
    removeGroupBtn.className = "btn btn-danger btn-sm";
    removeGroupBtn.textContent = "🗑️";
    removeGroupBtn.onclick = () => removeExclusiveGroup(groupName);
    const divbtn = document.createElement("div");
    divbtn.className = "d-flex gap-2";
    divbtn.appendChild(addItemBtn);
    divbtn.appendChild(removeGroupBtn);
    const ul = document.createElement("ul");
    ul.className = "list-group list-group-flush bg-dark";
    itemsInGroup.forEach((item) => addExclusiveGroupItem(item, ul));
    cardHeader.appendChild(span);
    cardHeader.appendChild(divbtn);
    card.appendChild(cardHeader);
    card.appendChild(ul);
    exclusiveContainer.appendChild(card);
}
function addItemToExclusiveGroup(groupName) {
    const newItem = { id: Date.now(), name: "", isEditing: true, group: groupName };
    exclusiveGroups[groupName].push(newItem);
    saveItems();
    renderLists();
    // Aguarde o DOM ser atualizado e foque no último item
    setTimeout(() => {
        // Encontre o grupo pelo nome
        const exclusiveGroupCard = Array.from(exclusiveContainer.getElementsByClassName('card'))
            .find(card => card.querySelector('.card-header span')?.textContent === groupName);
        if (exclusiveGroupCard) {
            const ul = exclusiveGroupCard.querySelector('ul');
            // Pega o último item do ul
            const lastItemInput = ul?.querySelector('li:last-child input');
            if (lastItemInput) {
                lastItemInput.focus(); // Focar no input do último item
            }
        }
    }, 0); // Garantir que o foco seja definido depois da renderização
}
function createToggleButton(item) {
    const button = document.createElement("button");
    button.className = item.isFixed ? "btn btn-sm btn-warning" : "btn btn-sm btn-outline-warning";
    button.textContent = "📌";
    button.onclick = () => {
        item.isFixed = !item.isFixed; // Alterna o estado do fixado
        saveItems();
        renderLists();
    };
    return button;
}
function createEditButton(item) {
    const button = document.createElement("button");
    button.className = "btn btn-sm btn-outline-primary me-2";
    button.textContent = "✏️";
    button.onclick = () => {
        item.isEditing = true;
        isEditingItem = true;
        renderLists();
    };
    return button;
}
function createRemoveButton(item) {
    const button = document.createElement("button");
    button.className = "btn btn-sm btn-outline-danger me-2";
    button.textContent = "🗑️";
    if (item.group) {
        button.onclick = () => removeExclusiveItem(item);
    }
    else {
        button.onclick = () => removeGeneralItem(item.id);
    }
    return button;
}
function removeGeneralItem(id) {
    items = items.filter((item) => item.id !== id);
    saveItems();
    renderLists();
}
function removeExclusiveItem(item) {
    if (item.group) {
        exclusiveGroups[item.group] = exclusiveGroups[item.group].filter((i) => i.id !== item.id);
        saveItems();
        renderLists();
    }
}
function removeExclusiveGroup(groupName) {
    delete exclusiveGroups[groupName];
    saveItems();
    renderLists();
}
function draw(qtd) {
    if (qtd <= 0) {
        resultDiv.textContent = "Por favor, insira um número válido.";
        return;
    }
    let availableItems = items.concat(...Object.values(exclusiveGroups));
    // Filtrando apenas os itens não fixos para que os fixos sejam sempre sorteados
    const fixedItems = availableItems.filter(item => item.isFixed);
    const nonFixedItems = availableItems.filter(item => !item.isFixed);
    // Armazenando os grupos dos itens fixos para garantir que não sorteiem outros itens do mesmo grupo
    const excludedGroups = new Set();
    fixedItems.forEach(item => {
        if (item.group) {
            excludedGroups.add(item.group);
        }
    });
    if (nonFixedItems.length === 0) {
        resultDiv.textContent = "Nenhum item disponível para sorteio.";
        return;
    }
    const selectedItems = [];
    // Garantir que os itens fixos sejam sempre sorteados
    while (selectedItems.length < qtd && nonFixedItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * nonFixedItems.length);
        const winner = nonFixedItems[randomIndex];
        // Se o item pertencer a um grupo de item fixado, não sorteie ele
        if (winner.group && excludedGroups.has(winner.group)) {
            nonFixedItems.splice(randomIndex, 1); // Remove o item do sorteio
            continue;
        }
        selectedItems.push(winner);
        nonFixedItems.splice(randomIndex, 1);
        if (winner.group) {
            excludedGroups.add(winner.group); // Exclui o grupo para os próximos sorteios
        }
    }
    // Adiciona os itens fixos ao resultado
    selectedItems.unshift(...fixedItems);
    resultDiv.textContent = `Os vencedores são: ${selectedItems.map((item) => item.name).join(", ")}`;
}
addGeneralBtn.addEventListener("click", () => {
    if (isEditingItem)
        return;
    const newItem = { id: Date.now(), name: "", isEditing: true };
    items.push(newItem);
    isEditingItem = true;
    saveItems();
    renderLists();
});
addNewExclusiveGroupBtn.addEventListener("click", addNewExclusiveGroup);
drawBtn.addEventListener("click", () => {
    const qtd = numToDrawElement ? parseInt(numToDrawElement.value, 10) : 0;
    draw(qtd);
});
loadItems();
