"use strict";
const form = document.getElementById('add item');
const nameInput = document.getElementById('name');
const quantityInput = document.getElementById('quantity');
const priceInput = document.getElementById('price');
const commentInput = document.getElementById('comment');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const newItem = {
        name: nameInput.value,
        quantity: parseInt(quantityInput.value),
        price: priceInput.value,
        comment: commentInput.value,
    };
    console.log("Neue Ware hinzugefügt:");
    console.log("Name:", newItem.name);
    console.log("Menge:", newItem.quantity);
    console.log("Datum:", newItem.price);
    console.log("Kommentar:", newItem.comment);
});
class ShoppingList {
    items;
    constructor() {
        this.items = [];
    }
    addItem(item) {
        this.items.push(item);
    }
}
const shoppingList = new ShoppingList();
function displayShoppingList() {
}
function addItemToList(item) {
    shoppingList.addItem(item);
    displayShoppingList();
}
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const newItem = {
        name: nameInput.value,
        quantity: parseInt(quantityInput.value),
        price: priceInput.value,
        comment: commentInput.value,
    };
    addItemToList(newItem);
});
displayShoppingList();
//# sourceMappingURL=pricelist.js.map