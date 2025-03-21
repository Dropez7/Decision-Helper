// Interface para os itens
interface Item {
  id: number;
  name: string;
  group?: string;
  isEditing?: boolean;  // Adiciona um campo para controlar o estado de edição
}

// Listas de itens e grupos exclusivos
let items: Item[] = [];
let exclusiveGroups: string[] = [];
let isEditingItem = false; // Controla se algum item está em edição
let isEditingGroup = false; // Controla se algum grupo está em edição

// Selecionando elementos do DOM
const generalList = document.getElementById("generalList") as HTMLUListElement;
const exclusiveContainer = document.getElementById(
  "exclusiveContainer"
) as HTMLDivElement;
const addGeneralBtn = document.getElementById(
  "addGeneralBtn"
) as HTMLButtonElement;
const addExclusiveGroupBtn = document.getElementById(
  "addExclusiveGroupBtn"
) as HTMLButtonElement;
const exclusiveList = document.getElementById("exclusiveList") as HTMLUListElement;
const numToDraw = document.getElementById("numToDraw") as HTMLInputElement;
const drawBtn = document.getElementById("drawBtn") as HTMLButtonElement;
const resultDiv = document.getElementById("result") as HTMLDivElement;

// Salva os itens no localStorage
function saveItems(): void {
  localStorage.setItem("items", JSON.stringify(items));
  localStorage.setItem("exclusiveGroups", JSON.stringify(exclusiveGroups));
}

// Carrega os itens do localStorage
function loadItems(): void {
  const savedItems = localStorage.getItem("items");
  const savedGroups = localStorage.getItem("exclusiveGroups");

  if (savedItems) items = JSON.parse(savedItems);
  if (savedGroups) exclusiveGroups = JSON.parse(savedGroups);

  renderLists(); // Chama renderLists após carregar os itens
}

// Renderiza os itens na tela
function renderLists(): void {
  generalList.innerHTML = "";
  exclusiveList.innerHTML = "";  // Clear the exclusive group list

  const maxItems = 100; // Limitar a 100 itens
  
  const generalItems = items.filter((item) => !item.group).slice(0, maxItems);
  generalItems.forEach((item) => addGeneralList(item, generalList));

  exclusiveGroups.forEach((group) => addExclusiveGroup(group, exclusiveList));  // Renderiza os grupos exclusivos
}


function addGeneralList(item: Item, list: HTMLUListElement): void {
  const li = document.createElement("li");
  li.className =
    "list-group-item d-flex justify-content-between align-items-center bg-dark text-white border-0";

  const input = document.createElement("input");

  input.type = "text";
  input.value = item.name;
  input.disabled = !item.isEditing;  // Se o item não está em edição, desabilita o input
  input.className = "form-control me-2 bg-dark text-white border-0";

  input.onblur = () => {
    item.name = input.value;
    item.isEditing = false; // Marca como não editando após perder o foco
    isEditingItem = false; // Atualiza o controle de edição
    saveItems();
    renderLists(); // Re-renderiza a lista para refletir as mudanças
  };

  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-primary me-2";
  editBtn.textContent = "✏️";
  editBtn.onclick = () => {
    item.isEditing = true; // Marca o item como em edição
    isEditingItem = true; // Marca que estamos editando um item
    renderLists(); // Re-renderiza a lista para aplicar as mudanças
  };

  const removeBtn = document.createElement("button");
  removeBtn.className = "btn btn-danger";
  removeBtn.textContent = "🗑️";
  removeBtn.onclick = () => removeItem(item.id);

  // Adiciona os elementos ao li
  li.appendChild(input);
  li.appendChild(editBtn);
  li.appendChild(removeBtn);
  list.appendChild(li);

  // Foca no input assim que ele for inserido no DOM
  if (item.isEditing) {
    input.focus();
  }
}

function addExclusiveGroup(group: string, list: HTMLUListElement): void {
  const li = document.createElement("li");
  li.className =
    "list-group-item d-flex justify-content-between align-items-center bg-dark text-white border-0";

  const input = document.createElement("input");

  input.type = "text";
  input.value = group;
  input.disabled = false;  // O grupo sempre estará disponível para edição ao ser criado
  input.className = "form-control me-2 bg-dark text-white border-0";

  input.onblur = () => {
    const index = exclusiveGroups.indexOf(group);
    if (index !== -1) {
      exclusiveGroups[index] = input.value;
      isEditingGroup = false; // Atualiza o controle de edição do grupo
      saveItems();
      renderLists(); // Re-renderiza a lista para refletir as mudanças
    }
  };

  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-primary me-2";
  editBtn.textContent = "✏️";
  editBtn.onclick = () => {
    input.disabled = false; // Ativa o input para edição
    input.focus();  // Foca no input
    isEditingGroup = true; // Marca que estamos editando um grupo
  };

  const removeBtn = document.createElement("button");
  removeBtn.className = "btn btn-danger";
  removeBtn.textContent = "🗑️";
  removeBtn.onclick = () => removeExclusiveGroup(group);

  // Adiciona os elementos ao li
  li.appendChild(input);
  li.appendChild(editBtn);
  li.appendChild(removeBtn);
  list.appendChild(li);

  // Foca no input apenas quando o grupo está sendo editado
  if (isEditingGroup) {
    input.focus();
  }
}


function removeItem(id: number): void {
  items = items.filter((item) => item.id !== id);
  saveItems();
  renderLists();
}

function removeExclusiveGroup(group: string): void {
  exclusiveGroups = exclusiveGroups.filter((g) => g !== group);
  saveItems();
  renderLists();
}

// Função para adicionar novo item na lista
addGeneralBtn.addEventListener("click", () => {
  if (isEditingItem) return; // Impede a adição de novos itens se algum item está sendo editado
  const newItem: Item = { id: Date.now(), name: "Novo item", isEditing: true };  // Define como item em edição ao ser criado
  items.push(newItem);
  isEditingItem = true; // Marca que estamos criando um item
  saveItems();
  renderLists();
});

// Função para adicionar um novo grupo exclusivo
addExclusiveGroupBtn.addEventListener("click", () => {
  if (isEditingGroup) return; // Impede a adição de novos grupos se algum grupo está sendo editado
  const newGroup = "Novo grupo exclusivo";
  exclusiveGroups.push(newGroup);
  isEditingGroup = true; // Marca que estamos criando um grupo
  saveItems();
  renderLists();
});

// Chama loadItems para carregar os itens quando a página for recarregada
loadItems();
