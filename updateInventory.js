
let handleUpdateInventory = async (event) => {
    event.preventDefault();

    let recipientName = document.getElementById('recipient-name').value.trim();
    let productName = document.getElementById('update-product-name').value.trim();
    let productQuantity = parseInt(document.getElementById('update-product-quantity').value, 10);

    try {
    
        let response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'X-Master-Key': API_KEY
            }
        });

        if (!response.ok) throw new Error('Error fetching data');

        let data = await response.json();
        let products = data.record.Product || [];
        
        let product = products.find(product => product.name === productName);

        if (!product) {
            console.error('Product not found');
            return;
        }

 
        product.quantity -= productQuantity;

  
        let updateResponse = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
            },
            body: JSON.stringify({ Product: products })
        });

        if (!updateResponse.ok) throw new Error('Error updating data');


        closePopup('update-inventory-popup');
        document.getElementById('update-inventory-form').reset();

   
        saveRecipientToLocalStorage(recipientName, productName, productQuantity);

    } catch (error) {
        console.error(error.message);
    }
};

let saveRecipientToLocalStorage = (recipientName, productName, quantity) => {
    let recipients = JSON.parse(localStorage.getItem('recipients')) || [];
    recipients.push({ recipientName, productName, quantity });
    localStorage.setItem('recipients', JSON.stringify(recipients));
    updateTableFromLocalStorage(); 
};


let updateTableFromLocalStorage = () => {
    let tbody = document.getElementById('recipients-table').querySelector('tbody');
    tbody.innerHTML = ''; 

    let recipients = JSON.parse(localStorage.getItem('recipients')) || [];
    recipients.forEach(recipient => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${recipient.recipientName}</td>
            <td>${recipient.productName}</td>
            <td>${recipient.quantity}</td>
        `;
        tbody.appendChild(row);
    });
};


document.getElementById('update-inventory-form').addEventListener('submit', handleUpdateInventory);


window.onload = updateTableFromLocalStorage;
