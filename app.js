// State Management: Application Data
let cart = [];
const TAX_RATE = 0.18; // 18% Tax Rate

// Preset inventory template items for fast processing
const presetProducts = [
    { id: 101, name: 'Wireless Mouse', price: 25.00 },
    { id: 102, name: 'Mechanical Keyboard', price: 75.00 },
    { id: 103, name: '27" Monitor IPS', price: 210.00 },
    { id: 104, name: 'USB-C Hub Adapter', price: 34.50 },
    { id: 105, name: 'Noise Cancelling Headphones', price: 129.99 },
    { id: 106, name: 'Ergonomic Desk Chair', price: 189.00 }
];

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    initializeMetadata();
    renderCatalog();
    setupEventListeners();
});

// Set transaction date and random invoice tracking token
function initializeMetadata() {
    document.getElementById('current-date').innerText = new Date().toLocaleDateString();
    document.getElementById('invoice-number').innerText = 'INV-' + Math.floor(100000 + Math.random() * 900000);
}

// Render Fast Selection Buttons onto UI View
function renderCatalog() {
    const catalogContainer = document.getElementById('catalog-list');
    catalogContainer.innerHTML = '';
    
    presetProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'catalog-card';
        card.innerHTML = `
            <h4>${product.name}</h4>
            <p>$${product.price.toFixed(2)}</p>
        `;
        card.addEventListener('click', () => addItemToCart(product.name, product.price, 1));
        catalogContainer.appendChild(card);
    });
}

function setupEventListeners() {
    // Custom item submission form interceptor
    document.getElementById('product-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('item-name');
        const priceInput = document.getElementById('item-price');
        const qtyInput = document.getElementById('item-qty');

        addItemToCart(
            nameInput.value, 
            parseFloat(priceInput.value), 
            parseInt(qtyInput.value)
        );

        // Reset state values inside inputs
        nameInput.value = '';
        priceInput.value = '';
        qtyInput.value = '1';
        nameInput.focus();
    });

    // Handle updates when changing values in the discount input field
    document.getElementById('discount-input').addEventListener('input', () => {
        calculateInvoiceTotals();
    });
}

// Add processing module tracking array balances
function addItemToCart(name, price, qty) {
    const existingItem = cart.find(item => item.name.toLowerCase() === name.toLowerCase());

    if (existingItem) {
        existingItem.qty += qty;
    } else {
        cart.push({ id: Date.now(), name, price, qty });
    }
    
    updateCartUI();
}

// Modifies explicit row element quantity directly from line row input parameter
function updateQuantity(id, newQty) {
    const item = cart.find(i => i.id === id);
    if (item && newQty > 0) {
        item.qty = parseInt(newQty);
        calculateInvoiceTotals();
    }
}

// Delete item index from local data tracker
function removeItemFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

// Complete programmatic interface update routines parsing lines
function updateCartUI() {
    const tbody = document.getElementById('cart-table-body');
    tbody.innerHTML = '';

    cart.forEach(item => {
        const lineTotal = item.price * item.qty;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${item.name}</strong></td>
            <td class="text-center">$${item.price.toFixed(2)}</td>
            <td class="text-center">
                <input type="number" value="${item.qty}" min="1" class="no-print" 
                       style="width: 50px; text-align: center; padding: 2px;"
                       onchange="updateQuantity(${item.id}, this.value)">
                <span class="print-only" style="display:none;">${item.qty}</span>
            </td>
            <td class="text-right"><strong>$${lineTotal.toFixed(2)}</strong></td>
            <td class="text-center no-print">
                <button class="btn-remove" onclick="removeItemFromCart(${item.id})">×</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    calculateInvoiceTotals();
}

// Evaluates application matrix items computing subtotals
function calculateInvoiceTotals() {
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.qty;
    });

    const tax = subtotal * TAX_RATE;
    const discountPercent = parseFloat(document.getElementById('discount-input').value) || 0;
    const discountAmount = (subtotal + tax) * (discountPercent / 100);
    const grandTotal = (subtotal + tax) - discountAmount;

    // Update fields across UI context layers
    document.getElementById('summary-subtotal').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('summary-tax').innerText = `$${tax.toFixed(2)}`;
    document.getElementById('summary-grand-total').innerText = `$${grandTotal.toFixed(2)}`;
    
    // Provide reference points used in matching style operations during standard print calls
    document.querySelector('.discount-row').setAttribute('data-value', discountPercent);
}

// Empty systemic data sets
function resetBillingSystem() {
    if (confirm("Are you sure you want to clear the current invoice layout?")) {
        cart = [];
        document.getElementById('discount-input').value = 0;
        updateCartUI();
        initializeMetadata();
    }
}