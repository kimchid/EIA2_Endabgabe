interface ListItem {
    name: string;
    quantity: number;
    price: string;
    comment: string;
  }
  
  const form = document.getElementById('add item') as HTMLFormElement;
  const nameInput = document.getElementById('name') as HTMLInputElement;
  const quantityInput = document.getElementById('quantity') as HTMLInputElement;
  const priceInput = document.getElementById('price') as HTMLInputElement;
  const commentInput = document.getElementById('comment') as HTMLInputElement;
  
  form.addEventListener('submit', (event: Event) => {
    event.preventDefault();
  
    const newItem: ListItem = {
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
    items: ListItem[];
  
    constructor() {
      this.items = [];
    }
  
    addItem(item: ListItem) {
      this.items.push(item);
    }
  }
  
  
  const shoppingList = new ShoppingList();
  
  function displayShoppingList() {
  }
  
  function addItemToList(item: ListItem) {
    shoppingList.addItem(item);
    displayShoppingList();
  }
  
  form.addEventListener('submit', (event: Event) => {
    event.preventDefault();
  
    const newItem: ListItem = {
      name: nameInput.value,
      quantity: parseInt(quantityInput.value),
      price: priceInput.value,
      comment: commentInput.value,
    };
  
    addItemToList(newItem);
  });
  
  displayShoppingList();
  
  