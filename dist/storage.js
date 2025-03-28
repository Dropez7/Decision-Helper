// Salva os itens no localStorage
import "./types";
import "./generalGroup";
import "./exclusiveGroup";
let items = [];
let exclusiveGroups = {};
const generalList = document.getElementById("generalList");
const exclusiveContainer = document.getElementById("exclusiveContainer");
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
