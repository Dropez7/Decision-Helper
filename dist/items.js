export let items = [];
export let isEditingItem = false;
const generalList = document.getElementById("generalList");
// Função para renderizar itens na lista geral
export function renderLists() {
    generalList.innerHTML = "";
    items.filter((item) => !item.group).forEach((item) => addGeneralGroupItem(item, generalList));
}
// Função para adicionar ou editar item na lista geral
export function addGeneralGroupItem(item, list) {
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
            removeItem(item.id);
        }
        else {
            // Caso contrário, salva o item
            item.name = input.value;
            item.isEditing = false;
            isEditingItem = false;
            renderLists();
        }
    };
    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-primary me-2";
    editBtn.textContent = "✏️";
    editBtn.onclick = () => {
        item.isEditing = true;
        isEditingItem = true;
        renderLists();
    };
    const removeBtn = document.createElement("button");
    removeBtn.className = "btn btn-danger";
    removeBtn.textContent = "🗑️";
    removeBtn.onclick = () => removeItem(item.id);
    li.appendChild(input);
    li.appendChild(editBtn);
    li.appendChild(removeBtn);
    list.appendChild(li);
    if (item.isEditing) {
        input.focus(); // Dá o foco ao input quando o item estiver em edição
    }
}
export function removeItem(id) {
    items = items.filter((item) => item.id !== id);
}
