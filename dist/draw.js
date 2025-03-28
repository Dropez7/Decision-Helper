export function draw(qtd) {
    if (qtd <= 0) {
        resultDiv.textContent = 'Por favor, insira um número válido.';
        return;
    }
    let availableItems = items.concat(...Object.values(exclusiveGroups));
    if (availableItems.length === 0) {
        resultDiv.textContent = 'Nenhum item disponível para sorteio.';
        return;
    }
    const selectedItems = [];
    while (selectedItems.length < qtd && availableItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableItems.length);
        const winner = availableItems[randomIndex];
        selectedItems.push(winner);
        availableItems.splice(randomIndex, 1);
        if (winner.group) {
            availableItems = availableItems.filter((item) => item.group !== winner.group);
        }
    }
    resultDiv.textContent = `Os vencedores são: ${selectedItems.map((item) => item.name).join(', ')}`;
}
