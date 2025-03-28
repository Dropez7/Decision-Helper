// Interface para os itens
interface Item {
  id: number;
  name: string;
  group?: string;
  isEditing?: boolean;
  isFixed?: boolean; // Adicionando o campo isFixed para marcar itens fixos
}

interface ExclusiveGroups {
  [key: string]: Item[];
}

// Listas de itens e grupos exclusivos
let items: Item[] = [];
let exclusiveGroups: ExclusiveGroups = {};
let isEditingItem = false;
let isEditingGroup = false;

// Selecionando elementos do DOM
const generalList = document.getElementById("generalList") as HTMLUListElement;
const exclusiveContainer = document.getElementById("exclusiveContainer") as HTMLDivElement;
const addGeneralBtn = document.getElementById("addGeneralBtn") as HTMLButtonElement;
const addNewExclusiveGroupBtn = document.getElementById("addNewExclusiveGroupBtn") as HTMLButtonElement;
const drawBtn = document.getElementById("drawBtn") as HTMLButtonElement;
const numToDrawElement = document.getElementById("numToDraw") as HTMLInputElement | null;
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

  renderLists();
}

// Renderiza os itens na tela
function renderLists(): void {
  generalList.innerHTML = "";
  exclusiveContainer.innerHTML = "";

  items.filter((item) => !item.group).forEach((item) => addGeneralGroupItem(item, generalList));
  Object.keys(exclusiveGroups).forEach((group) => addExclusiveGroup(group, exclusiveGroups[group]));
}



// Grupo Geral 



// Função para adicionar ou editar item na lista geral
// Função para adicionar ou editar item na lista geral
function addGeneralGroupItem(item: Item, list: HTMLUListElement): void {
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
    } else {
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
    input.focus();  // Dá o foco ao input quando o item estiver em edição
  }
}

// Função para adicionar um item a um grupo exclusivo
function addExclusiveGroupItem(item: Item, exclusiveGroup: HTMLUListElement): void {
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
    } else {
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


function addNewExclusiveGroup(): void {
  const groupName = prompt("Nome do novo grupo exclusivo:");
  if (!groupName || exclusiveGroups[groupName]) return;
  
  exclusiveGroups[groupName] = [];
  saveItems();
  renderLists();
}

function addExclusiveGroup(groupName: string, itemsInGroup: Item[]): void {
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
  removeGroupBtn.textContent = "🗑️"
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

function addItemToExclusiveGroup(groupName: string): void {
  const newItem: Item = { id: Date.now(), name: "", isEditing: true, group: groupName };
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
        (lastItemInput as HTMLInputElement).focus(); // Focar no input do último item
      }
    }
  }, 0); // Garantir que o foco seja definido depois da renderização
}

function createToggleButton(item: Item): HTMLButtonElement {
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

function createEditButton(item: Item): HTMLButtonElement {
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

function createRemoveButton(item: Item): HTMLButtonElement {
  const button = document.createElement("button");
  button.className = "btn btn-sm btn-outline-danger me-2";
  button.textContent = "🗑️";
  if(item.group) {
    button.onclick = () => removeExclusiveItem(item);
  }
  else {
    button.onclick = () => removeGeneralItem(item.id);
  }

  return button;
}


function removeGeneralItem(id: number): void {
  items = items.filter((item) => item.id !== id);
  saveItems();
  renderLists();
}

function removeExclusiveItem(item: Item): void {
  if (item.group) {
    exclusiveGroups[item.group] = exclusiveGroups[item.group].filter((i) => i.id !== item.id);
    saveItems();
    renderLists();
  }
}

function removeExclusiveGroup(groupName: string): void {
  delete exclusiveGroups[groupName];
  saveItems();
  renderLists();
}

// Função de sorteio modificada para tratar os grupos exclusivos corretamente
function draw(qtd: number): void {
  if (qtd <= 0) {
    resultDiv.textContent = "Por favor, insira um número válido.";
    return;
  }

  let availableItems: Item[] = [];

  // Adicionando os itens gerais
  availableItems = availableItems.concat(items.filter(item => !item.group));

  // Adicionando os grupos exclusivos como itens únicos (não se expande para os itens do grupo)
  Object.keys(exclusiveGroups).forEach(groupName => {
    availableItems.push({
      id: Date.now() + Math.random(),
      name: groupName, // Usamos o nome do grupo para representar o grupo inteiro
      group: groupName
    });
  });

  // Filtrando apenas os itens não fixos para que os fixos sejam sempre sorteados
  const fixedItems = availableItems.filter(item => item.isFixed);
  const nonFixedItems = availableItems.filter(item => !item.isFixed);

  // Armazenando os grupos dos itens fixos para garantir que não sorteiem outros itens do mesmo grupo
  const excludedGroups: Set<string> = new Set();
  
  fixedItems.forEach(item => {
    if (item.group) {
      excludedGroups.add(item.group);
    }
  });

  if (nonFixedItems.length === 0) {
    resultDiv.textContent = "Nenhum item disponível para sorteio.";
    return;
  }

  const selectedItems: Item[] = [];

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

  // Agora, precisamos sortear um item de cada grupo exclusivo, se o grupo for sorteado
  const resultItems = selectedItems.map(item => {
    if (item.group) {
      // Se o item for de um grupo exclusivo, sorteie um item desse grupo
      const groupItems = exclusiveGroups[item.group];
      const randomIndex = Math.floor(Math.random() * groupItems.length);
      return groupItems[randomIndex];
    } else {
      return item;
    }
  });

  resultDiv.textContent = `Os vencedores são: ${resultItems.map((item) => item.name).join(", ")}`;
}



addGeneralBtn.addEventListener("click", () => {
  if (isEditingItem) return;
  const newItem: Item = { id: Date.now(), name: "", isEditing: true };
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