"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderLists = renderLists;
const storage_1 = require("./storage");
// Adicione a importação de addExclusiveGroup, caso esteja em outro arquivo
const exclusiveGroups_1 = require("./exclusiveGroups");
function renderLists(items, exclusiveGroups, generalList, exclusiveContainer, updateCallback) {
    generalList.innerHTML = "";
    exclusiveContainer.innerHTML = "";
    items.filter((item) => !item.group).forEach((item) => addGeneralGroupItem(item, generalList, items, exclusiveGroups, updateCallback));
    Object.keys(exclusiveGroups).forEach((group) => (0, exclusiveGroups_1.addExclusiveGroup)(group, exclusiveGroups[group], exclusiveContainer, updateCallback));
}
function addGeneralGroupItem(item, list, items, exclusiveGroups, updateCallback) {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center bg-dark text-white border-0";
    const input = document.createElement("input");
    input.type = "text";
    input.value = item.name;
    input.disabled = !item.isEditing;
    input.className = "form-control me-2 bg-dark text-white border-0";
    input.onblur = () => {
        if (input.value.trim() === "") {
            updateCallback();
        }
        else {
            item.name = input.value;
            item.isEditing = false;
            (0, storage_1.saveItems)(items, exclusiveGroups);
            updateCallback();
        }
    };
    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-primary me-2";
    editBtn.textContent = "✏️";
    editBtn.onclick = () => {
        item.isEditing = true;
        updateCallback();
    };
    const pinBtn = document.createElement("button");
    pinBtn.className = "btn btn-warning me-2";
    pinBtn.textContent = item.isPinned ? "🔓" : "🔒";
    pinBtn.onclick = () => {
        item.isPinned = !item.isPinned;
        (0, storage_1.saveItems)(items, exclusiveGroups);
        updateCallback();
    };
    const removeBtn = document.createElement("button");
    removeBtn.className = "btn btn-danger";
    removeBtn.textContent = "🗑️";
    removeBtn.onclick = updateCallback;
    li.appendChild(input);
    li.appendChild(editBtn);
    li.appendChild(pinBtn);
    li.appendChild(removeBtn);
    list.appendChild(li);
    if (item.isEditing) {
        input.focus();
    }
}
