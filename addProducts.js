// API configuration
const apiUrl = 'https://api.jsonbin.io/v3/b/669b40b9e41b4d34e4146b16';
const apiKey = '$2a$10$Sq2/s3mmIbMiz7RDJ4Ls/uquZa0h0DSVMa5t5gL3PmhnoTg7U.OZy';


let openPopup = (popupId) => {
    document.getElementById(popupId).style.display = 'block';
};


let closePopup = (popupId) => {
    document.getElementById(popupId).style.display = 'none';
};


document.querySelector('.add').addEventListener('click', () => {
    openPopup('add-product-popup');
});


document.querySelector('.update').addEventListener('click', () => {
    openPopup('update-inventory-popup');
});


document.querySelectorAll('.popup button[type="button"]').forEach(button => {
    button.addEventListener('click', (e) => {
        let popupId = e.target.closest('.popup-content').parentElement.id;
        closePopup(popupId);
    });
});


const handleAddProduct = async (event) => {
    event.preventDefault();
    
    const productName = document.getElementById('product-name').value.trim();
    const productQuantity = parseInt(document.getElementById('product-quantity').value, 10);

    try {
       
        let response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-Master-Key': apiKey
            }
        });
        
        if (!response.ok) throw new Error('Error fetching data');

        let data = await response.json();
        let products = data.record.Product || [];
        
      
        let existingProduct = products.find(product => product.name === productName);
        
        if (existingProduct) {
           
            existingProduct.quantity += productQuantity;
        } else {
         
            products.push({ name: productName, quantity: productQuantity });
        }

      
        let updateResponse = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': apiKey
            },
            body: JSON.stringify({ Product: products })
        });

        if (!updateResponse.ok) throw new Error('Error updating data');

       
        closePopup('add-product-popup');
        document.getElementById('add-product-form').reset();

      

    } catch (error) {
        console.error(error.message);
    }
   
};

document.getElementById('add-product-form').addEventListener('submit', handleAddProduct);
