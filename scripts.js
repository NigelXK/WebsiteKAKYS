const users = [];
let currentUser = null;

const canteens = [
    { id: 1, name: 'Kantin 1', menu: [
        { id: 1, name: 'Nasi Goreng', price: 15000 },
        { id: 2, name: 'Mie Goreng', price: 15000 },
        { id: 3, name: 'Kwetiaw Goreng', price: 15000 },
    ]},
    { id: 2, name: 'Kantin 2', menu: [
        { id: 4, name: 'Geprek', price: 15000 },
        { id: 5, name: 'Salted Egg', price: 15000 },
        { id: 6, name: 'Nanban', price: 18000 },
    ]}
];

let cart = [];
let currentCanteen = null;

document.addEventListener('DOMContentLoaded', () => {
    loginContainer.style.display = 'block';
    appContainer.style.display = 'none';
    populateCanteenSelect();
    // Load jsbarcode library
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.0/JsBarcode.all.min.js';
    document.head.appendChild(script);
});

function populateCanteenSelect() {
    const canteenSelect = document.getElementById('canteenSelect');
    canteenSelect.innerHTML = '<option value="">Pilih Kantin</option>';
    canteens.forEach(canteen => {
        const option = document.createElement('option');
        option.value = canteen.id;
        option.textContent = canteen.name;
        canteenSelect.appendChild(option);
    });
}

function populateMenu(canteenId) {
    const menuSection = document.getElementById('menuSection');
    const menuList = document.getElementById('menuList');
    menuList.innerHTML = '';

    const canteen = canteens.find(c => c.id === parseInt(canteenId));
    if (canteen) {
        canteen.menu.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - ${item.price} IDR`;
            const addButton = document.createElement('button');
            addButton.textContent = 'Add to Cart';
            addButton.onclick = () => addToCart(item);
            li.appendChild(addButton);
            menuList.appendChild(li);
        });
        menuSection.style.display = 'block';
        document.documentElement.scrollTop = 0;
    }
}

function handleCanteenChange(event) {
    const canteenId = event.target.value;
    if (canteenId) {
        currentCanteen = canteenId;
        populateMenu(canteenId);
    } else {
        document.getElementById('menuSection').style.display = 'none';
    }
}

function addToCart(item) {
    cart.push(item);
    renderCart();
}

function renderCart() {
    const cartList = document.getElementById('cartList');
    const totalPriceElem = document.getElementById('totalPrice');
    cartList.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.price} IDR`;
        cartList.appendChild(li);
        total += item.price;
    });

    totalPriceElem.textContent = total;
}

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        currentUser = user;
        loginContainer.style.display = 'none';
        appContainer.style.display = 'flex';
        document.getElementById('canteenSelect').addEventListener('change', handleCanteenChange);
        document.documentElement.scrollTop = 0;
    } else {
        document.getElementById('loginError').textContent = 'Username atau password salah.';
    }
}

function handleSignup(event) {
    event.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;

    if (users.some(user => user.username === username)) {
        document.getElementById('signupError').textContent = 'Username sudah digunakan.';
    } else {
        users.push({ username, password });
        loginContainer.style.display = 'block';
        signupContainer.style.display = 'none';
    }
}

function handleLogout() {
    loginContainer.style.display = 'block';
    appContainer.style.display = 'none';
    currentUser = null;
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('signupUsername').value = '';
    document.getElementById('signupPassword').value = '';
    document.getElementById('loginError').textContent = '';
    document.getElementById('signupError').textContent = '';
    document.getElementById('canteenSelect').removeEventListener('change', handleCanteenChange);
    document.getElementById('menuSection').style.display = 'none';
    document.getElementById('cartSection').style.display = 'none';
}

function handleCheckout() {
    document.getElementById('paymentSection').style.display = 'block';
}

function handlePayment(event) {
    event.preventDefault();
    const paymentMethod = document.getElementById('paymentMethod').value;
    if (paymentMethod) {
        const queueNumber = Math.floor(Math.random() * 100);
        const postNumber = Math.floor(Math.random() * 10);

        document.getElementById('paymentSection').style.display = 'none';
        document.getElementById('receiptSection').style.display = 'block';
        document.getElementById('receiptMessage').textContent = `Pembayaran berhasil dengan metode ${paymentMethod}.`;
        document.getElementById('queueNumber').textContent = queueNumber;
        document.getElementById('postNumber').textContent = postNumber;

        if (paymentMethod === 'onlinePayment') {
            generateBarcode(queueNumber);
        }

        cart.length = 0; // Clear the cart
        renderCart();
    } else {
        document.getElementById('paymentMessage').textContent = 'Silakan pilih metode pembayaran.';
    }
}

function generateBarcode(queueNumber) {
    const barcodeContainer = document.getElementById('barcodeContainer');
    const barcodeImage = document.getElementById('barcodeImage');
    
    JsBarcode(barcodeImage, queueNumber.toString(), {
        format: 'CODE128',
        displayValue: true,
        fontSize: 16,
    });
    barcodeContainer.style.display = 'block';
}

function handleShowCart() {
    document.getElementById('cartSection').style.display = 'block';
    document.getElementById('menuSection').style.display = 'none';
}

document.getElementById('loginForm').addEventListener('submit', handleLogin);
document.getElementById('signupForm').addEventListener('submit', handleSignup);
document.getElementById('logoutButton').addEventListener('click', handleLogout);
document.getElementById('checkoutButton').addEventListener('click', handleCheckout);
document.getElementById('paymentForm').addEventListener('submit', handlePayment);
document.getElementById('showSignup').addEventListener('click', () => {
    loginContainer.style.display = 'none';
    signupContainer.style.display = 'block';
});
document.getElementById('showLogin').addEventListener('click', () => {
    signupContainer.style.display = 'none';
    loginContainer.style.display = 'block';
});
document.getElementById('showCartButton').addEventListener('click', handleShowCart);
