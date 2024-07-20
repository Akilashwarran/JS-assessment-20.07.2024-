
let create = (type, className, textContent = '') => {
    let elem = document.createElement(type);
    elem.className = className;
    elem.textContent = textContent;
    return elem;
};

let Header = create('Header', 'header', 'DCKAP Palli Inventory');
let main = create('div', 'main');
let topProducts = create('section', 'Top-Products');
let cards = create('div', 'cards');
let chart = create('section', 'ChartDiv');
let stat = create('h1', 'stat', 'Inventory Status');
// let tableDiv = create('section', 'TableDiv');
// let tabletitle = create('h1','tabletitel','Product Recipients')
// let scrollable = create('div','scrollable')
// let table = create('table','recipients-table')

// scrollable.append(table)
// tableDiv.append(tabletitle,scrollable)
let btn = create('div', 'btn');
let add = create('button', 'add', 'Add');
let update = create('button', 'update', 'Update');

btn.append(add, update);

let createStaticCard = (id) => {
    let card = create('div', 'card');
    card.id = `card-${id}`;  
    let ProductName = create('h1', 'name');
    let quantity = create('p', 'quantity');
    card.append(ProductName, quantity);
    return card;
};

for (let i = 1; i <= 3; i++) {
    cards.append(createStaticCard(i));
}

topProducts.append(cards, btn);
main.append(topProducts, chart);
document.body.append(Header, main);

let ctx = create('canvas', 'chart-canvas').getContext('2d');
chart.append(stat, ctx.canvas);
ctx.id = 'bar-chart';

const API_URL = 'https://api.jsonbin.io/v3/b/669b40b9e41b4d34e4146b16';
const API_KEY = '$2a$10$Sq2/s3mmIbMiz7RDJ4Ls/uquZa0h0DSVMa5t5gL3PmhnoTg7U.OZy';

// Function to fetch and display data
let fetchData = async () => {
    try {
        let response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'X-Master-Key': API_KEY
            }
        });

        if (!response.ok) throw new Error('Error fetching data');

        let data = await response.json();
        let products = data.record.Product;
        let topProducts = products
            .slice()
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 3);

        topProducts.forEach((product, index) => {
            let card = document.getElementById(`card-${index + 1}`);
            if (card) {
                card.querySelector('.name').textContent = product.name;
                card.querySelector('.quantity').textContent = `Quantity: ${product.quantity}`;
            }
        });

        const fixedColors = [
            'rgba(75, 192, 192, 1)', 
            'rgba(255, 99, 132, 1)', 
            'rgba(255, 159, 64, 1)', 
            'rgba(153, 102, 255, 1)', 
            'rgba(255, 205, 86, 1)'
        ];

        const colors = products.map((_, index) => fixedColors[index % fixedColors.length]);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: products.map(product => product.name),
                datasets: [{
                    label: 'Quantity',
                    data: products.map(product => product.quantity),
                    backgroundColor: colors,
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false  
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            display: true  
                        },
                        title: {
                            display: true,
                            text: 'Quantity'  
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching data: ', error.message);
    }
};

fetchData();



