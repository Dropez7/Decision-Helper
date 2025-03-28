export let exclusiveGroups = {};
const exclusiveContainer = document.getElementById("exclusiveContainer");
export function addExclusiveGroup(groupName, itemsInGroup) {
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
function addExclusiveGroupItem(item, exclusiveGroup) {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center bg-dark text-white border-0";
    const input = document.createElement("input");
    input.type = "text";
    input.value = item.name;
    input.disabled = !item.isEditing;
    input.className = "form-control me-2 bg-dark text-white border-0";
    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-primary me-2";
    editBtn.textContent = "✏️";
    editBtn.onclick = () => {
        item.isEditing = true;
        renderLists();
    };
    const removeBtn = document.createElement("button");
    removeBtn.className = "btn btn-danger";
    removeBtn.textContent = "🗑️";
    removeBtn.onclick = () => {
        exclusiveGroups[item.group].splice(exclusiveGroups[item.group].findIndex((i) => i.id === item.id), 1);
        renderLists();
    };
    li.appendChild(input);
    li.appendChild(editBtn);
    li.appendChild(removeBtn);
    exclusiveGroup.appendChild(li);
}
function addItemToExclusiveGroup(groupName) {
    const newItem = { id: Date.now(), name: "", isEditing: true, group: groupName };
    exclusiveGroups[groupName].push(newItem);
    renderLists();
}
export function removeExclusiveGroup(groupName) {
    delete exclusiveGroups[groupName];
    renderLists();
}
