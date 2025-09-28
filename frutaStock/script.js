// FrutaStock Pro - Main JavaScript File

// Security and Data Storage
let inventory = [];
let sales = [];
let currentSection = 'inventory';
let isLoggedIn = false;
let isDemoMode = false;
let currentPassword = '';

// Demo Data
const demoInventory = [
    {
        id: 1001,
        name: "Manzanas Rojas",
        category: "Frutas",
        quantityKg: 22.5,
        costKg: 2000,
        priceUnit: 500,
        priceKg: 3200,
        expiry: getDateString(7),
        minStockKg: 5,
        dateAdded: new Date().toISOString()
    },
    {
        id: 1002,
        name: "Plátanos",
        category: "Frutas",
        quantityKg: 15.5,
        costKg: 1800,
        priceUnit: 400,
        priceKg: 2800,
        expiry: getDateString(5),
        minStockKg: 5,
        dateAdded: new Date().toISOString()
    },
    {
        id: 1003,
        name: "Naranjas",
        category: "Frutas",
        quantityKg: 12,
        costKg: 2000,
        priceUnit: 400,
        priceKg: 3200,
        expiry: getDateString(10),
        minStockKg: 3,
        dateAdded: new Date().toISOString()
    },
    {
        id: 1004,
        name: "Lechuga",
        category: "Verduras",
        quantityKg: 4,
        costKg: 4000,
        priceUnit: 800,
        priceKg: 6400,
        expiry: getDateString(2),
        minStockKg: 5,
        dateAdded: new Date().toISOString()
    },
    {
        id: 1005,
        name: "Tomates",
        category: "Verduras",
        quantityKg: 8.2,
        costKg: 2800,
        priceUnit: 600,
        priceKg: 4500,
        expiry: getDateString(6),
        minStockKg: 10,
        dateAdded: new Date().toISOString()
    },
    {
        id: 1006,
        name: "Peras",
        category: "Frutas",
        quantityKg: 8,
        costKg: 2500,
        priceUnit: 600,
        priceKg: 3800,
        expiry: getDateString(1),
        minStockKg: 5,
        dateAdded: new Date().toISOString()
    }
];

const demoSales = [
    {
        id: 2001,
        productId: 1001,
        productName: "Manzanas Rojas",
        quantity: 5,
        unit: "unidades",
        unitPrice: 500,
        total: 2500,
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 2002,
        productId: 1002,
        productName: "Plátanos",
        quantity: 2.5,
        unit: "kg",
        unitPrice: 2800,
        total: 7000,
        date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 2003,
        productId: 1003,
        productName: "Naranjas",
        quantity: 10,
        unit: "unidades",
        unitPrice: 400,
        total: 4000,
        date: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    }
];

function getDateString(daysFromNow) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
}

// Predefined product list
const predefinedProducts = {
    'Frutas': [
        'Manzanas Rojas', 'Manzanas Verdes', 'Manzanas Amarillas',
        'Plátanos', 'Plátanos de Freír', 'Plátanos Maduros',
        'Naranjas', 'Naranjas de Jugo', 'Naranjas Navel',
        'Peras', 'Peras Packham', 'Peras Williams',
        'Uvas Rojas', 'Uvas Verdes', 'Uvas Negras',
        'Frutillas', 'Frambuesas', 'Arándanos',
        'Kiwis', 'Paltas', 'Limones',
        'Mandarinas', 'Pomelos', 'Duraznos',
        'Ciruelas', 'Damascos', 'Sandías',
        'Melones', 'Piñas', 'Mangos',
        'Papayas', 'Chirimoyas', 'Lúcumas',
        'Granadas', 'Higos', 'Caquis'
    ],
    'Verduras': [
        'Lechuga', 'Lechuga Escarola', 'Lechuga Iceberg',
        'Tomates', 'Tomates Cherry', 'Tomates Pera',
        'Cebollas', 'Cebollas Moradas', 'Cebollín',
        'Papas', 'Papas Nuevas', 'Papas Chilotas',
        'Zanahorias', 'Zanahorias Baby', 'Betarragas',
        'Apio', 'Brócoli', 'Coliflor',
        'Repollo', 'Repollo Morado', 'Acelgas',
        'Espinacas', 'Rúcula', 'Berros',
        'Pimientos Rojos', 'Pimientos Verdes', 'Pimientos Amarillos',
        'Pepinos', 'Zapallitos Italianos', 'Berenjenas',
        'Choclo', 'Porotos Verdes', 'Arvejas',
        'Perejil', 'Cilantro', 'Albahaca',
        'Ajo', 'Jengibre', 'Puerros',
        'Rabanitos', 'Nabos', 'Alcachofas'
    ]
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    setMinDate();
    setupUnitChangeListeners();
    setupProductAutocomplete();
});

// Función para cargar datos guardados por contraseña
function loadSavedData(password) {
    try {
        const savedInventory = localStorage.getItem(`frutastock_inventory_${password}`);
        const savedSales = localStorage.getItem(`frutastock_sales_${password}`);
        
        if (savedInventory) {
            inventory = JSON.parse(savedInventory);
        } else {
            inventory = [];
        }
        
        if (savedSales) {
            sales = JSON.parse(savedSales);
        } else {
            sales = [];
        }
    } catch (error) {
        console.warn('Error loading saved data:', error);
        // Si hay error, mantener arrays vacíos
        inventory = [];
        sales = [];
    }
}

// Demo Functions
function startDemo() {
    isDemoMode = true;
    inventory = [...demoInventory];
    sales = [...demoSales];
    
    isLoggedIn = true;
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    document.getElementById('demoBadge').classList.remove('hidden');
    
    showSection('inventory');
    updateStats();
    showNotification('🎭 ¡Bienvenido al Modo Demo! Explora todas las funciones');
}

function exitDemo() {
    if (confirm('¿Salir del modo demo? Se perderán todos los datos de ejemplo.')) {
        isDemoMode = false;
        
        // Restaurar datos reales guardados
        if (currentPassword) {
            loadSavedData(currentPassword);
        }
        
        document.getElementById('demoBadge').classList.add('hidden');
        
        // Actualizar la vista con los datos reales
        if (isLoggedIn) {
            updateStats();
            if (currentSection === 'inventory') {
                loadInventory();
            } else if (currentSection === 'sales') {
                loadSalesProducts();
                loadTodaySales();
            } else if (currentSection === 'reports') {
                loadReports();
            } else if (currentSection === 'alerts') {
                loadAlerts();
            }
            showNotification('✅ Volviste a tus datos reales');
        } else {
            logout();
        }
    }
}

// Security Functions
function checkLogin() {
    const savedPassword = localStorage.getItem('frutastock_password');
    if (!savedPassword) {
        showCreatePassword();
    } else {
        showLogin();
    }
}

function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('createPasswordForm').classList.add('hidden');
}

function showCreatePassword() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('createPasswordForm').classList.remove('hidden');
}

// Login Form
document.getElementById('loginFormElement').addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('loginPassword').value;
    const savedPassword = localStorage.getItem('frutastock_password');
    
    if (password === savedPassword) {
        currentPassword = password;
        loadSavedData(password);
        isLoggedIn = true;
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        showSection('inventory');
        updateStats();
        showNotification('¡Bienvenido a FrutaStock Pro!');
    } else {
        alert('❌ Contraseña incorrecta');
        document.getElementById('loginPassword').value = '';
    }
});

// Create Password Form
document.getElementById('createPasswordFormElement').addEventListener('submit', function(e) {
    e.preventDefault();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        alert('❌ Las contraseñas no coinciden');
        return;
    }
    
    if (newPassword.length < 4) {
        alert('❌ La contraseña debe tener al menos 4 caracteres');
        return;
    }
    
    // Verificar si ya existe una contraseña
    const existingPassword = localStorage.getItem('frutastock_password');
    
    if (existingPassword && existingPassword !== newPassword) {
        // Si es una contraseña nueva diferente, crear datos vacíos
        currentPassword = newPassword;
        inventory = [];
        sales = [];
        localStorage.setItem('frutastock_password', newPassword);
        showNotification('✅ Nueva contraseña creada - Empezando con datos vacíos');
    } else {
        // Si es la primera vez o la misma contraseña
        localStorage.setItem('frutastock_password', newPassword);
        currentPassword = newPassword;
        loadSavedData(newPassword);
        showNotification('✅ Contraseña configurada exitosamente');
    }
    
    showLogin();
});

function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        // Guardar datos antes de cerrar sesión (solo si no es modo demo)
        if (!isDemoMode && currentPassword) {
            saveData();
        }
        
        isLoggedIn = false;
        const wasDemoMode = isDemoMode;
        isDemoMode = false;
        currentPassword = '';
        
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
        document.getElementById('demoBadge').classList.add('hidden');
        document.getElementById('loginPassword').value = '';
        
        // Limpiar datos si salimos del modo demo
        if (wasDemoMode) {
            inventory = [];
            sales = [];
        }
        
        showNotification('👋 Sesión cerrada exitosamente');
    }
}

// Unit change listeners
function setupUnitChangeListeners() {
    const productUnit = document.getElementById('productUnit');
    if (productUnit) {
        productUnit.addEventListener('change', function() {
            const unit = this.value;
            const label = document.getElementById('priceUnitLabel');
            if (label) {
                label.textContent = unit === 'kg' ? 'kilogramo' : 'unidad';
            }
        });
    }
}

// Set minimum date to today
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    const productExpiryEl = document.getElementById('productExpiry');
    const editExpiryEl = document.getElementById('editExpiry');
    
    if (productExpiryEl) productExpiryEl.min = today;
    if (editExpiryEl) editExpiryEl.min = today;
}

// Navigation
function showSection(section) {
    if (!isLoggedIn) return;
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    
    // Show selected section
    const sectionEl = document.getElementById(section + '-section');
    if (sectionEl) {
        sectionEl.classList.remove('hidden');
    }
    
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-green-600', 'bg-green-50', 'border-green-500');
        btn.classList.add('text-gray-700', 'border-transparent');
    });
    
    if (event && event.target) {
        event.target.classList.remove('text-gray-700', 'border-transparent');
        event.target.classList.add('text-green-600', 'bg-green-50', 'border-green-500');
    }
    
    currentSection = section;
    
    // Load section data
    switch(section) {
        case 'inventory':
            loadInventory();
            break;
        case 'sales':
            loadSalesProducts();
            loadTodaySales();
            break;
        case 'reports':
            loadReports();
            break;
        case 'alerts':
            loadAlerts();
            break;
    }
}

// Product Management
document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const quantityKg = parseFloat(document.getElementById('productQuantityKg').value) || 0;
    const costKg = parseInt(document.getElementById('productCostKg').value) || 0;
    const priceUnit = parseInt(document.getElementById('productPriceUnit').value) || 0;
    const priceKg = parseInt(document.getElementById('productPriceKg').value) || 0;
    const minStockKg = 10; // Stock mínimo fijo de 10 kg
    
    // Validar que haya cantidad en kilogramos
    if (quantityKg === 0) {
        alert('❌ Debes ingresar la cantidad en kilogramos');
        return;
    }
    
    // Validar que haya al menos un precio de venta
    if (priceUnit === 0 && priceKg === 0) {
        alert('❌ Debes ingresar al menos un precio de venta (por unidad o por kilogramo)');
        return;
    }
    
    // Validar que haya costo por kilogramo
    if (costKg === 0) {
        alert('❌ Debes ingresar el costo por kilogramo');
        return;
    }
    
    const product = {
        id: Date.now(),
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        quantityKg: quantityKg,
        costKg: costKg,
        priceUnit: priceUnit,
        priceKg: priceKg,
        expiry: document.getElementById('productExpiry').value,
        minStockKg: minStockKg,
        dateAdded: new Date().toISOString()
    };
    
    inventory.push(product);
    saveData();
    showNotification('✨ Producto agregado exitosamente');
    this.reset();
    updateStats();
});

// Load Inventory
function loadInventory() {
    const tbody = document.getElementById('inventoryTable');
    const emptyDiv = document.getElementById('emptyInventory');
    
    if (inventory.length === 0) {
        if (tbody) tbody.innerHTML = '';
        if (emptyDiv) emptyDiv.classList.remove('hidden');
        return;
    }
    
    if (emptyDiv) emptyDiv.classList.add('hidden');
    
    let filteredInventory = inventory;
    const searchInput = document.getElementById('searchInput');
    const filterCategory = document.getElementById('filterCategory');
    
    if (searchInput && searchInput.value) {
        const searchTerm = searchInput.value.toLowerCase();
        filteredInventory = filteredInventory.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filterCategory && filterCategory.value) {
        const categoryFilter = filterCategory.value;
        filteredInventory = filteredInventory.filter(product => 
            product.category === categoryFilter
        );
    }
    
    if (tbody) {
        tbody.innerHTML = filteredInventory.map(product => {
            const daysToExpiry = Math.ceil((new Date(product.expiry) - new Date()) / (1000 * 60 * 60 * 24));
            
            // Verificar stock bajo
            const isLowStock = product.quantityKg <= product.minStockKg;
            
            const isExpiringSoon = daysToExpiry <= 3;
            
            let statusBadge = '';
            if (isExpiringSoon && daysToExpiry >= 0) {
                statusBadge = '<span class="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full font-medium">⏰ Vence pronto</span>';
            } else if (daysToExpiry < 0) {
                statusBadge = '<span class="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">❌ Vencido</span>';
            } else if (isLowStock) {
                statusBadge = '<span class="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-medium">⚠️ Stock bajo</span>';
            }
            
            const categoryIcon = product.category === 'Frutas' ? '🍎' : '🥬';
            
            // Mostrar stock disponible
            const stockDisplay = `<span class="font-bold text-lg ${isLowStock ? 'text-red-600' : 'text-gray-800'}">${product.quantityKg} kg</span>`;
            
            // Mostrar costos
            const costDisplay = `<span class="text-orange-700 font-semibold">$${formatCLP(product.costKg)}/kg</span>`;
            
            // Mostrar precios
            let priceDisplay = '';
            if (product.priceUnit > 0 && product.priceKg > 0) {
                priceDisplay = `
                    <div class="text-green-700 font-semibold">
                        $${formatCLP(product.priceUnit)}/unidad<br>
                        $${formatCLP(product.priceKg)}/kg
                    </div>
                `;
            } else if (product.priceUnit > 0) {
                priceDisplay = `<span class="text-green-700 font-semibold">$${formatCLP(product.priceUnit)}/unidad</span>`;
            } else if (product.priceKg > 0) {
                priceDisplay = `<span class="text-green-700 font-semibold">$${formatCLP(product.priceKg)}/kg</span>`;
            }
            
            // Calcular margen
            let marginDisplay = '';
            if (product.priceUnit > 0) {
                const marginUnit = ((product.priceUnit - (product.costKg / 1000)) / (product.costKg / 1000) * 100).toFixed(1);
                marginDisplay += `<div class="text-sm font-medium ${marginUnit > 0 ? 'text-green-600' : 'text-red-600'}">${marginUnit}% unidad</div>`;
            }
            if (product.priceKg > 0) {
                const marginKg = ((product.priceKg - product.costKg) / product.costKg * 100).toFixed(1);
                marginDisplay += `<div class="text-sm font-medium ${marginKg > 0 ? 'text-green-600' : 'text-red-600'}">${marginKg}% kg</div>`;
            }
            if (!marginDisplay) {
                marginDisplay = '<span class="text-gray-400 text-sm">-</span>';
            }
            
            return `
                <tr class="border-b hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all">
                    <td class="py-4 px-4">
                        <div class="font-medium text-gray-800 text-lg">${product.name}</div>
                        ${statusBadge}
                    </td>
                    <td class="py-4 px-4 text-gray-600">${categoryIcon} ${product.category}</td>
                    <td class="py-4 px-4">${stockDisplay}</td>
                    <td class="py-4 px-4">${costDisplay}</td>
                    <td class="py-4 px-4">${priceDisplay}</td>
                    <td class="py-4 px-4">${marginDisplay}</td>
                    <td class="py-4 px-4">
                        <span class="${isExpiringSoon ? 'text-red-600 font-medium' : 'text-gray-600'}">${formatDate(product.expiry)}</span>
                    </td>
                    <td class="py-4 px-4">
                        <div class="flex space-x-2">
                            <button onclick="editProduct(${product.id})" class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105">
                                ✏️ Editar
                            </button>
                            <button onclick="deleteProduct(${product.id})" class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105">
                                🗑️ Eliminar
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }
}

// Search and Filter
const searchInput = document.getElementById('searchInput');
const filterCategory = document.getElementById('filterCategory');
if (searchInput) searchInput.addEventListener('input', loadInventory);
if (filterCategory) filterCategory.addEventListener('change', loadInventory);

// Edit Product
function editProduct(id) {
    const product = inventory.find(p => p.id === id);
    if (!product) return;
    
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editName').value = product.name;
    document.getElementById('editQuantity').value = product.quantityUnits || product.quantityKg || 0;
    document.getElementById('editUnit').value = product.quantityUnits > 0 ? 'unidades' : 'kg';
    document.getElementById('editCost').value = product.costUnit || product.costKg || 0;
    document.getElementById('editPrice').value = product.priceUnit || product.priceKg || 0;
    document.getElementById('editExpiry').value = product.expiry;
    
    document.getElementById('editModal').classList.remove('hidden');
    document.getElementById('editModal').classList.add('flex');
}

function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
    document.getElementById('editModal').classList.remove('flex');
}

document.getElementById('editForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editProductId').value);
    const productIndex = inventory.findIndex(p => p.id === id);
    
    if (productIndex !== -1) {
        const quantity = parseFloat(document.getElementById('editQuantity').value);
        const unit = document.getElementById('editUnit').value;
        const cost = parseInt(document.getElementById('editCost').value);
        const price = parseInt(document.getElementById('editPrice').value);
        
        inventory[productIndex].name = document.getElementById('editName').value;
        inventory[productIndex].expiry = document.getElementById('editExpiry').value;
        
        // Actualizar según la unidad seleccionada
        if (unit === 'unidades') {
            inventory[productIndex].quantityUnits = quantity;
            inventory[productIndex].costUnit = cost;
            inventory[productIndex].priceUnit = price;
        } else {
            inventory[productIndex].quantityKg = quantity;
            inventory[productIndex].costKg = cost;
            inventory[productIndex].priceKg = price;
        }
        
        saveData();
        loadInventory();
        closeEditModal();
        showNotification('💾 Producto actualizado exitosamente');
        updateStats();
    }
});

// Delete Product
function deleteProduct(id) {
    if (confirm('🗑️ ¿Estás seguro de que quieres eliminar este producto?')) {
        const productIndex = inventory.findIndex(p => p.id === id);
        if (productIndex !== -1) {
            inventory.splice(productIndex, 1);
            saveData();
            loadInventory();
            showNotification('🗑️ Producto eliminado exitosamente');
            updateStats();
            
            // Recargar productos en ventas si estamos en esa sección
            if (currentSection === 'sales') {
                loadSalesProducts();
            }
        } else {
            showNotification('❌ Error: No se pudo encontrar el producto');
        }
    }
}

// Sales Management
function loadSalesProducts() {
    const select = document.getElementById('saleProduct');
    if (select) {
        select.innerHTML = '<option value="">Seleccionar producto</option>';
        
        inventory.filter(p => p.quantityKg > 0).forEach(product => {
            const categoryIcon = product.category === 'Frutas' ? '🍎' : '🥬';
            const stockInfo = `(${product.quantityKg} kg)`;
            select.innerHTML += `<option value="${product.id}">${categoryIcon} ${product.name} ${stockInfo}</option>`;
        });
    }
}

document.getElementById('saleProduct').addEventListener('change', function() {
    const productId = parseInt(this.value);
    const product = inventory.find(p => p.id === productId);
    
    if (product) {
        // Mostrar información del stock
        const stockInfo = `${product.quantityKg} kg`;
        const stockInfoEl = document.getElementById('stockInfo');
        if (stockInfoEl) stockInfoEl.innerHTML = stockInfo;
        
        // Mostrar información de precios
        let priceInfo = '';
        if (product.priceUnit > 0 && product.priceKg > 0) {
            priceInfo = `$${formatCLP(product.priceUnit)}/unidad<br>$${formatCLP(product.priceKg)}/kg`;
        } else if (product.priceUnit > 0) {
            priceInfo = `$${formatCLP(product.priceUnit)}/unidad`;
        } else if (product.priceKg > 0) {
            priceInfo = `$${formatCLP(product.priceKg)}/kg`;
        }
        const priceInfoEl = document.getElementById('priceInfo');
        if (priceInfoEl) priceInfoEl.innerHTML = priceInfo;
        
        const categoryInfoEl = document.getElementById('productCategoryInfo');
        if (categoryInfoEl) categoryInfoEl.textContent = product.category;
        
        const productInfoEl = document.getElementById('productInfo');
        if (productInfoEl) productInfoEl.classList.remove('hidden');
        
        // Actualizar opciones de tipo de venta
        const saleTypeSelect = document.getElementById('saleType');
        if (saleTypeSelect) {
            saleTypeSelect.innerHTML = '<option value="">Seleccionar tipo</option>';
            
            if (product.priceUnit > 0) {
                saleTypeSelect.innerHTML += '<option value="units">Por Unidades</option>';
            }
            if (product.priceKg > 0) {
                saleTypeSelect.innerHTML += '<option value="kg">Por Kilogramos</option>';
            }
        }
        
        // Limpiar campos
        const saleTypeEl = document.getElementById('saleType');
        const saleQuantityEl = document.getElementById('saleQuantity');
        const saleUnitPriceEl = document.getElementById('saleUnitPrice');
        const saleTotalEl = document.getElementById('saleTotal');
        
        if (saleTypeEl) saleTypeEl.value = '';
        if (saleQuantityEl) saleQuantityEl.value = '';
        if (saleUnitPriceEl) saleUnitPriceEl.value = '';
        if (saleTotalEl) saleTotalEl.value = '0';
    } else {
        const productInfoEl = document.getElementById('productInfo');
        const saleTypeEl = document.getElementById('saleType');
        
        if (productInfoEl) productInfoEl.classList.add('hidden');
        if (saleTypeEl) saleTypeEl.innerHTML = '<option value="">Seleccionar tipo</option>';
    }
});

document.getElementById('saleType').addEventListener('change', function() {
    const productId = parseInt(document.getElementById('saleProduct').value);
    const product = inventory.find(p => p.id === productId);
    const saleType = this.value;
    
    if (product && saleType) {
        const saleUnitPriceEl = document.getElementById('saleUnitPrice');
        const saleQuantityEl = document.getElementById('saleQuantity');
        
        if (saleType === 'units') {
            if (saleUnitPriceEl) saleUnitPriceEl.value = product.priceUnit;
            // Calcular máximo de unidades basado en el peso disponible (asumiendo 1 unidad = 1kg)
            if (saleQuantityEl) {
                saleQuantityEl.max = Math.floor(product.quantityKg);
                saleQuantityEl.step = '1';
                saleQuantityEl.min = '1';
            }
        } else if (saleType === 'kg') {
            if (saleUnitPriceEl) saleUnitPriceEl.value = product.priceKg;
            if (saleQuantityEl) {
                saleQuantityEl.max = product.quantityKg;
                saleQuantityEl.step = '0.1';
                saleQuantityEl.min = '0.1';
            }
        }
        calculateSaleTotal();
    }
});

document.getElementById('saleQuantity').addEventListener('input', calculateSaleTotal);
document.getElementById('saleUnitPrice').addEventListener('input', calculateSaleTotal);

function calculateSaleTotal() {
    const saleQuantityEl = document.getElementById('saleQuantity');
    const saleUnitPriceEl = document.getElementById('saleUnitPrice');
    const saleTotalEl = document.getElementById('saleTotal');
    
    if (saleQuantityEl && saleUnitPriceEl && saleTotalEl) {
        const quantity = parseFloat(saleQuantityEl.value) || 0;
        const unitPrice = parseInt(saleUnitPriceEl.value) || 0;
        
        if (quantity > 0 && unitPrice > 0) {
            const total = quantity * unitPrice;
            saleTotalEl.value = formatCLP(total);
        } else {
            saleTotalEl.value = '0';
        }
    }
}

document.getElementById('saleForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const productId = parseInt(document.getElementById('saleProduct').value);
    const saleType = document.getElementById('saleType').value;
    const quantity = parseFloat(document.getElementById('saleQuantity').value);
    const unitPrice = parseInt(document.getElementById('saleUnitPrice').value);
    const product = inventory.find(p => p.id === productId);
    
    if (!product) {
        alert('❌ Por favor selecciona un producto');
        return;
    }
    
    if (!saleType) {
        alert('❌ Por favor selecciona el tipo de venta');
        return;
    }
    
    if (unitPrice <= 0) {
        alert('❌ El precio debe ser mayor a 0');
        return;
    }
    
    // Verificar stock disponible según el tipo de venta
    if (saleType === 'units') {
        if (quantity > Math.floor(product.quantityKg)) {
            alert('❌ No hay suficientes unidades disponibles');
            return;
        }
    } else if (saleType === 'kg') {
        if (quantity > product.quantityKg) {
            alert('❌ No hay suficientes kilogramos disponibles');
            return;
        }
    }
    
    // Create sale record
    const sale = {
        id: Date.now(),
        productId: productId,
        productName: product.name,
        quantity: quantity,
        unit: saleType === 'units' ? 'unidades' : 'kg',
        unitPrice: unitPrice,
        total: quantity * unitPrice,
        date: new Date().toISOString()
    };
    
    // Update inventory - siempre restar del peso en kg
    if (saleType === 'units') {
        // Asumir que 1 unidad = 1 kg para el descuento del inventario
        product.quantityKg -= quantity;
    } else if (saleType === 'kg') {
        product.quantityKg -= quantity;
    }
    
    // Add sale
    sales.push(sale);
    
    saveData();
    showNotification('🎯 Venta registrada exitosamente');
    this.reset();
    const productInfoEl = document.getElementById('productInfo');
    const saleTypeEl = document.getElementById('saleType');
    if (productInfoEl) productInfoEl.classList.add('hidden');
    if (saleTypeEl) saleTypeEl.innerHTML = '<option value="">Seleccionar tipo</option>';
    loadSalesProducts();
    loadTodaySales();
    updateStats();
});

function loadTodaySales() {
    const today = new Date().toDateString();
    const todaySales = sales.filter(sale => new Date(sale.date).toDateString() === today);
    
    const tbody = document.getElementById('salesTable');
    if (tbody) {
        tbody.innerHTML = todaySales.map(sale => `
            <tr class="border-b hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all">
                <td class="py-3 px-4 text-sm text-gray-600 font-medium">${formatTime(sale.date)}</td>
                <td class="py-3 px-4 text-sm font-medium">${sale.productName}</td>
                <td class="py-3 px-4 text-sm">${sale.quantity} ${sale.unit}</td>
                <td class="py-3 px-4 text-sm font-medium">$${formatCLP(sale.unitPrice)}</td>
                <td class="py-3 px-4 text-sm font-bold text-green-600">$${formatCLP(sale.total)}</td>
            </tr>
        `).join('');
    }
}

// Reports
function loadReports() {
    const today = new Date().toDateString();
    const todaySales = sales.filter(sale => new Date(sale.date).toDateString() === today);
    const dailyTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    
    // Calcular ganancia diaria
    let dailyProfit = 0;
    todaySales.forEach(sale => {
        const product = inventory.find(p => p.id === sale.productId);
        if (product) {
            let cost;
            if (sale.unit === 'unidades') {
                // Costo por unidad basado en el costo por kg (asumiendo 1 unidad = 1 kg)
                cost = product.costKg;
            } else {
                cost = product.costKg;
            }
            const profit = (sale.unitPrice - cost) * sale.quantity;
            dailyProfit += profit;
        }
    });
    
    const reportTotalProductsEl = document.getElementById('reportTotalProducts');
    const reportDailySalesEl = document.getElementById('reportDailySales');
    const reportDailyProfitEl = document.getElementById('reportDailyProfit');
    
    if (reportTotalProductsEl) reportTotalProductsEl.textContent = inventory.length;
    if (reportDailySalesEl) reportDailySalesEl.textContent = `$${formatCLP(dailyTotal)}`;
    if (reportDailyProfitEl) reportDailyProfitEl.textContent = `$${formatCLP(dailyProfit)}`;
    
    // Calcular datos mensuales
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlySales = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    });
    
    // Calcular inversiones mensuales (productos agregados este mes)
    const monthlyProducts = inventory.filter(product => {
        const addedDate = new Date(product.dateAdded);
        return addedDate.getMonth() === currentMonth && addedDate.getFullYear() === currentYear;
    });
    
    const monthlyInvestments = monthlyProducts.reduce((sum, product) => {
        return sum + (product.quantityKg * product.costKg);
    }, 0);
    
    // Calcular ingresos por ventas
    const monthlyTotal = monthlySales.reduce((sum, sale) => sum + sale.total, 0);
    
    // Calcular costos de productos vendidos
    let monthlyCostTotal = 0;
    monthlySales.forEach(sale => {
        const product = inventory.find(p => p.id === sale.productId);
        if (product) {
            const cost = product.costKg; // Siempre usar costo por kg
            const totalCost = cost * sale.quantity;
            monthlyCostTotal += totalCost;
        }
    });
    
    // Calcular ganancia/pérdida real
    const monthlyProfitTotal = monthlyTotal - monthlyCostTotal;
    
    // Calcular ROI (Retorno de Inversión)
    const monthlyROI = monthlyInvestments > 0 ? ((monthlyProfitTotal / monthlyInvestments) * 100).toFixed(1) : 0;
    
    // Calcular margen de ganancia
    const monthlyMargin = monthlyTotal > 0 ? ((monthlyProfitTotal / monthlyTotal) * 100).toFixed(1) : 0;
    
    // Actualizar elementos del DOM
    const monthlySalesEl = document.getElementById('monthlySales');
    const monthlyInvestmentsEl = document.getElementById('monthlyInvestments');
    const monthlyCostsEl = document.getElementById('monthlyCosts');
    const monthlyProfitEl = document.getElementById('monthlyProfit');
    const monthlyROIEl = document.getElementById('monthlyROI');
    const monthlyMarginEl = document.getElementById('monthlyMargin');
    
    if (monthlySalesEl) monthlySalesEl.textContent = `$${formatCLP(monthlyTotal)}`;
    if (monthlyInvestmentsEl) monthlyInvestmentsEl.textContent = `$${formatCLP(monthlyInvestments)}`;
    if (monthlyCostsEl) monthlyCostsEl.textContent = `$${formatCLP(monthlyCostTotal)}`;
    if (monthlyProfitEl) monthlyProfitEl.textContent = `$${formatCLP(monthlyProfitTotal)}`;
    if (monthlyROIEl) monthlyROIEl.textContent = `${monthlyROI}%`;
    if (monthlyMarginEl) monthlyMarginEl.textContent = `${monthlyMargin}%`;
    
    // Colorear ganancia/pérdida
    if (monthlyProfitEl) {
        if (monthlyProfitTotal > 0) {
            monthlyProfitEl.className = 'text-2xl font-bold text-green-600';
        } else if (monthlyProfitTotal < 0) {
            monthlyProfitEl.className = 'text-2xl font-bold text-red-600';
        } else {
            monthlyProfitEl.className = 'text-2xl font-bold text-gray-600';
        }
    }
    
    // Colorear ROI
    if (monthlyROIEl) {
        if (parseFloat(monthlyROI) > 0) {
            monthlyROIEl.className = 'text-xl font-bold text-green-700';
        } else if (parseFloat(monthlyROI) < 0) {
            monthlyROIEl.className = 'text-xl font-bold text-red-700';
        } else {
            monthlyROIEl.className = 'text-xl font-bold text-gray-700';
        }
    }
    
    // Colorear margen
    if (monthlyMarginEl) {
        if (parseFloat(monthlyMargin) > 0) {
            monthlyMarginEl.className = 'text-xl font-bold text-teal-700';
        } else if (parseFloat(monthlyMargin) < 0) {
            monthlyMarginEl.className = 'text-xl font-bold text-red-700';
        } else {
            monthlyMarginEl.className = 'text-xl font-bold text-gray-700';
        }
    }
    
    // Count alerts
    let alertCount = 0;
    inventory.forEach(product => {
        const daysToExpiry = Math.ceil((new Date(product.expiry) - new Date()) / (1000 * 60 * 60 * 24));
        const isLowStockUnits = product.quantityUnits > 0 && product.quantityUnits <= product.minStockUnits;
        const isLowStockKg = product.quantityKg > 0 && product.quantityKg <= product.minStockKg;
        if (isLowStockUnits || isLowStockKg || daysToExpiry <= 3) {
            alertCount++;
        }
    });
    
    const reportAlertsEl = document.getElementById('reportAlerts');
    if (reportAlertsEl) reportAlertsEl.textContent = alertCount;
    
    // Top products
    const productSales = {};
    sales.forEach(sale => {
        if (!productSales[sale.productName]) {
            productSales[sale.productName] = { quantity: 0, total: 0 };
        }
        productSales[sale.productName].quantity += sale.quantity;
        productSales[sale.productName].total += sale.total;
    });
    
    const topProducts = Object.entries(productSales)
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, 5);
    
    const topProductsEl = document.getElementById('topProducts');
    if (topProductsEl) {
        topProductsEl.innerHTML = topProducts.length > 0 
            ? topProducts.map(([name, data], index) => `
                <div class="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border border-yellow-200">
                    <div class="flex items-center space-x-3">
                        <span class="text-2xl">${index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}</span>
                        <span class="font-medium">${name}</span>
                    </div>
                    <span class="text-green-600 font-bold text-lg">$${formatCLP(data.total)}</span>
                </div>
            `).join('')
            : '<p class="text-gray-500 text-center py-8">📊 No hay datos de ventas</p>';
    }
    
    // Low stock products
    const lowStockProducts = [];
    inventory.forEach(product => {
        if (product.quantityUnits > 0 && product.quantityUnits <= product.minStockUnits) {
            lowStockProducts.push({
                name: product.name,
                stock: `${product.quantityUnits} unidades restantes`,
                type: 'units'
            });
        }
        if (product.quantityKg > 0 && product.quantityKg <= product.minStockKg) {
            lowStockProducts.push({
                name: product.name,
                stock: `${product.quantityKg} kg restantes`,
                type: 'kg'
            });
        }
    });
    
    const lowStockProductsEl = document.getElementById('lowStockProducts');
    if (lowStockProductsEl) {
        lowStockProductsEl.innerHTML = lowStockProducts.length > 0
            ? lowStockProducts.map(item => `
                <div class="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border border-red-200">
                    <div class="flex items-center space-x-3">
                        <span class="text-2xl">⚠️</span>
                        <span class="font-medium">${item.name}</span>
                    </div>
                    <span class="text-red-600 font-bold">${item.stock}</span>
                </div>
            `).join('')
            : '<p class="text-gray-500 text-center py-8">✅ Todos los productos tienen stock suficiente</p>';
    }
}

// Alerts
function loadAlerts() {
    const alerts = [];
    const today = new Date();
    
    inventory.forEach(product => {
        const daysToExpiry = Math.ceil((new Date(product.expiry) - today) / (1000 * 60 * 60 * 24));
        
        if (daysToExpiry < 0) {
            alerts.push({
                type: 'expired',
                product: product.name,
                message: `❌ ${product.name} ha vencido`,
                priority: 'high'
            });
        } else if (daysToExpiry <= 3) {
            alerts.push({
                type: 'expiring',
                product: product.name,
                message: `⏰ ${product.name} vence en ${daysToExpiry} día(s)`,
                priority: 'medium'
            });
        }
        
        // Verificar stock bajo para unidades
        if (product.quantityUnits > 0 && product.quantityUnits <= product.minStockUnits) {
            alerts.push({
                type: 'low-stock',
                product: product.name,
                message: `⚠️ Stock bajo en unidades: ${product.name} (${product.quantityUnits} unidades restantes)`,
                priority: product.quantityUnits === 0 ? 'high' : 'medium'
            });
        }
        
        // Verificar stock bajo para kilogramos
        if (product.quantityKg > 0 && product.quantityKg <= product.minStockKg) {
            alerts.push({
                type: 'low-stock',
                product: product.name,
                message: `⚠️ Stock bajo en kilogramos: ${product.name} (${product.quantityKg} kg restantes)`,
                priority: product.quantityKg === 0 ? 'high' : 'medium'
            });
        }
    });
    
    const container = document.getElementById('alertsContainer');
    const noAlerts = document.getElementById('noAlerts');
    
    if (alerts.length === 0) {
        if (container) container.innerHTML = '';
        if (noAlerts) noAlerts.classList.remove('hidden');
        return;
    }
    
    if (noAlerts) noAlerts.classList.add('hidden');
    
    if (container) {
        container.innerHTML = alerts.map(alert => {
            const colorClass = alert.priority === 'high' ? 'border-red-500 bg-gradient-to-r from-red-50 to-pink-50' : 'border-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50';
            const iconClass = alert.priority === 'high' ? 'text-red-500' : 'text-yellow-500';
            
            return `
                <div class="border-l-4 ${colorClass} p-6 rounded-r-2xl shadow-sm">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <svg class="w-6 h-6 ${iconClass}" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                            </svg>
                        </div>
                        <div class="ml-4">
                            <p class="text-lg font-medium text-gray-800">${alert.message}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Utility Functions
function updateStats() {
    const today = new Date().toDateString();
    const todaySales = sales.filter(sale => new Date(sale.date).toDateString() === today);
    const dailyTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    
    const totalProductsEl = document.getElementById('totalProducts');
    const dailySalesEl = document.getElementById('dailySales');
    
    if (totalProductsEl) totalProductsEl.textContent = inventory.length;
    if (dailySalesEl) dailySalesEl.textContent = `$${formatCLP(dailyTotal)}`;
}

function formatCLP(amount) {
    return new Intl.NumberFormat('es-CL').format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-CL');
}

function formatTime(dateString) {
    return new Date(dateString).toLocaleTimeString('es-CL', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function saveData() {
    if (!isDemoMode && currentPassword) {
        try {
            localStorage.setItem(`frutastock_inventory_${currentPassword}`, JSON.stringify(inventory));
            localStorage.setItem(`frutastock_sales_${currentPassword}`, JSON.stringify(sales));
        } catch (error) {
            console.error('Error saving data:', error);
            showNotification('⚠️ Error al guardar datos. Verifica el espacio disponible.');
        }
    }
}

// Guardar datos automáticamente cada 30 segundos (solo si no es modo demo)
setInterval(() => {
    if (isLoggedIn && !isDemoMode) {
        saveData();
    }
}, 30000);

function showNotification(message) {
    const notification = document.getElementById('notification');
    const text = document.getElementById('notificationText');
    
    if (notification && text) {
        text.textContent = message;
        notification.classList.remove('translate-x-full');
        
        setTimeout(() => {
            notification.classList.add('translate-x-full');
        }, 4000);
    }
}

// Download Report Function - COMPLETAMENTE NUEVO Y ROBUSTO
function downloadReport() {
    try {
        const selectedMonth = document.getElementById('reportMonth').value;
        const selectedYear = document.getElementById('reportYear').value;
        
        if (!selectedMonth || !selectedYear) {
            alert('❌ Por favor selecciona el mes y año para generar el reporte');
            return;
        }
        
        showNotification('📄 Generando reporte...');
        
        // Filter sales by selected month and year
        const monthInt = parseInt(selectedMonth);
        const yearInt = parseInt(selectedYear);
        const filteredSales = sales.filter(sale => {
            try {
                const saleDate = new Date(sale.date);
                return saleDate.getMonth() === monthInt && saleDate.getFullYear() === yearInt;
            } catch (e) {
                return false;
            }
        });
        
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        // Calculate totals safely
        const totalSales = filteredSales.reduce((sum, sale) => sum + (sale.total || 0), 0);
        let totalCosts = 0;
        let totalProfit = 0;
        
        filteredSales.forEach(sale => {
            try {
                const product = inventory.find(p => p.id === sale.productId);
                if (product && sale.quantity && sale.unitPrice) {
                    const cost = product.costKg || 0;
                    const totalCost = cost * sale.quantity;
                    const profit = (sale.unitPrice - cost) * sale.quantity;
                    totalCosts += totalCost;
                    totalProfit += profit;
                }
            } catch (e) {
                console.warn('Error calculating costs for sale:', sale);
            }
        });
        
        // Try PDF first, then fallback to Excel-style CSV
        setTimeout(() => {
            try {
                // Check if jsPDF is available and working
                if (typeof window.jspdf !== 'undefined' && window.jspdf.jsPDF) {
                    generatePDFReport(monthNames[monthInt], yearInt, filteredSales, totalSales, totalCosts, totalProfit);
                } else {
                    throw new Error('PDF library not available');
                }
            } catch (pdfError) {
                console.warn('PDF generation failed, using CSV fallback:', pdfError);
                generateCSVReport(monthNames[monthInt], yearInt, filteredSales, totalSales, totalCosts, totalProfit);
            }
        }, 100);
        
    } catch (error) {
        console.error('Error in downloadReport:', error);
        generateTextReport(monthNames[monthInt] || 'Mes', yearInt || new Date().getFullYear(), filteredSales || [], totalSales || 0, totalCosts || 0, totalProfit || 0);
    }
}

// Funciones mejoradas para generar reportes más bonitos y profesionales

// PDF Generation Function - VERSIÓN MEJORADA
function generatePDFReport(monthName, year, sales, totalSales, totalCosts, totalProfit) {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Colores del tema
        const primaryColor = [16, 185, 129]; // Verde
        const secondaryColor = [107, 114, 128]; // Gris
        const accentColor = [59, 130, 246]; // Azul
        const dangerColor = [239, 68, 68]; // Rojo
        
        // HEADER CON LOGO Y DISEÑO
        // Fondo del header
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 210, 45, 'F');
        
        // Logo simulado (círculo con texto)
        doc.setFillColor(255, 255, 255);
        doc.circle(25, 22, 12, 'F');
        doc.setTextColor(...primaryColor);
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('FS', 20, 26);
        
        // Título principal
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont(undefined, 'bold');
        doc.text('FrutaStock Pro', 45, 22);
        
        doc.setFontSize(14);
        doc.setFont(undefined, 'normal');
        doc.text('Reporte de Inventario y Ventas', 45, 32);
        
        // Fecha de generación en header
        doc.setFontSize(10);
        doc.text(`Generado: ${new Date().toLocaleDateString('es-CL')} - ${new Date().toLocaleTimeString('es-CL')}`, 45, 38);
        
        // INFORMACIÓN DEL PERÍODO
        let yPos = 60;
        doc.setTextColor(...secondaryColor);
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text(`Período: ${monthName} ${year}`, 20, yPos);
        
        // Línea decorativa
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(2);
        doc.line(20, yPos + 5, 190, yPos + 5);
        
        // SECCIÓN DE RESUMEN FINANCIERO
        yPos += 25;
        doc.setFillColor(248, 250, 252); // Fondo gris claro
        doc.rect(15, yPos - 8, 180, 50, 'F');
        
        doc.setTextColor(...primaryColor);
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text(' RESUMEN FINANCIERO', 20, yPos);
        
        yPos += 15;
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        
        // Tabla de resumen con formato mejorado
        const margin = totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : 0;
        const roi = totalCosts > 0 ? ((totalProfit / totalCosts) * 100).toFixed(1) : 0;
        
        const summaryData = [
            ['Concepto', 'Monto', 'Indicador'],
            ['Ingresos por Ventas', `$${formatCLP(totalSales)}`, ''],
            ['Costos de Productos', `$${formatCLP(totalCosts)}`, ''],
            ['Ganancia/Pérdida', `$${formatCLP(totalProfit)}`, totalProfit >= 0 ? '' : ''],
            ['Margen de Ganancia', `${margin}%`, margin > 20 ? '' : margin > 10 ? '' : ''],
            ['ROI (Retorno Inversión)', `${roi}%`, roi > 15 ? '' : roi > 5 ? '' : '']
        ];
        
        // Dibujar tabla de resumen
        let tableY = yPos;
        const colWidths = [70, 50, 20];
        const rowHeight = 8;
        
        summaryData.forEach((row, index) => {
            if (index === 0) {
                // Header de tabla
                doc.setFillColor(...primaryColor);
                doc.rect(20, tableY - 2, 140, rowHeight, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFont(undefined, 'bold');
            } else {
                // Filas alternas
                if (index % 2 === 0) {
                    doc.setFillColor(245, 245, 245);
                    doc.rect(20, tableY - 2, 140, rowHeight, 'F');
                }
                doc.setTextColor(0, 0, 0);
                doc.setFont(undefined, 'normal');
            }
            
            doc.text(row[0], 25, tableY + 3);
            doc.text(row[1], 95, tableY + 3);
            doc.text(row[2], 140, tableY + 3);
            
            tableY += rowHeight;
        });
        
        // SECCIÓN DE PRODUCTOS MÁS VENDIDOS
        if (sales.length > 0) {
            yPos = tableY + 20;
            
            // Nueva página si es necesario
            if (yPos > 250) {
                doc.addPage();
                yPos = 30;
            }
            
            doc.setFillColor(254, 249, 195); // Fondo amarillo claro
            doc.rect(15, yPos - 8, 180, 8, 'F');
            
            doc.setTextColor(...accentColor);
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.text(' ANÁLISIS DE VENTAS', 20, yPos);
            
            yPos += 15;
            
            // Calcular productos más vendidos
            const productSales = {};
            sales.forEach(sale => {
                if (!productSales[sale.productName]) {
                    productSales[sale.productName] = { quantity: 0, total: 0, count: 0 };
                }
                productSales[sale.productName].quantity += sale.quantity;
                productSales[sale.productName].total += sale.total;
                productSales[sale.productName].count += 1;
            });
            
            const topProducts = Object.entries(productSales)
                .sort((a, b) => b[1].total - a[1].total)
                .slice(0, 5);
            
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            
            topProducts.forEach((product, index) => {
                const [name, data] = product;
                const medal = index === 0 ? '' : index === 1 ? '' : index === 2 ? '' : '';
                
                doc.setFont(undefined, 'bold');
                doc.text(`${medal} ${name}`, 25, yPos);
                doc.setFont(undefined, 'normal');
                doc.text(`Ventas: $${formatCLP(data.total)} | Cantidad: ${data.quantity} | Transacciones: ${data.count}`, 30, yPos + 5);
                yPos += 12;
            });
        }
        
        // DETALLE DE VENTAS
        if (sales.length > 0) {
            yPos += 15;
            
            // Nueva página si es necesario
            if (yPos > 230) {
                doc.addPage();
                yPos = 30;
            }
            
            doc.setFillColor(240, 253, 250); // Fondo verde claro
            doc.rect(15, yPos - 8, 180, 8, 'F');
            
            doc.setTextColor(...primaryColor);
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.text(' DETALLE DE TRANSACCIONES', 20, yPos);
            
            yPos += 15;
            
            // Header de tabla de ventas
            const headers = ['Fecha', 'Producto', 'Cant.', 'Precio', 'Total'];
            const headerWidths = [30, 60, 25, 25, 30];
            
            doc.setFillColor(...accentColor);
            doc.rect(20, yPos - 5, 170, 8, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.setFont(undefined, 'bold');
            
            let xPos = 25;
            headers.forEach((header, i) => {
                doc.text(header, xPos, yPos);
                xPos += headerWidths[i];
            });
            
            yPos += 10;
            
            // Ventas con formato
            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, 'normal');
            
            sales.slice(0, 20).forEach((sale, index) => { // Máximo 20 ventas
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 30;
                }
                
                // Fila alterna
                if (index % 2 === 0) {
                    doc.setFillColor(248, 250, 252);
                    doc.rect(20, yPos - 3, 170, 7, 'F');
                }
                
                const date = new Date(sale.date).toLocaleDateString('es-CL');
                const productName = sale.productName.length > 15 ? 
                    sale.productName.substring(0, 15) + '...' : sale.productName;
                
                let xPos = 25;
                const rowData = [
                    date,
                    productName,
                    `${sale.quantity} ${sale.unit}`,
                    `$${formatCLP(sale.unitPrice)}`,
                    `$${formatCLP(sale.total)}`
                ];
                
                rowData.forEach((data, i) => {
                    doc.text(data, xPos, yPos);
                    xPos += headerWidths[i];
                });
                
                yPos += 7;
            });
            
            // Nota si hay más ventas
            if (sales.length > 20) {
                yPos += 5;
                doc.setFontSize(9);
                doc.setTextColor(...secondaryColor);
                doc.text(`* Mostrando las primeras 20 transacciones de ${sales.length} totales.`, 25, yPos);
            }
        }
        
        // FOOTER
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            
            // Línea del footer
            doc.setDrawColor(...secondaryColor);
            doc.setLineWidth(0.5);
            doc.line(20, 285, 190, 285);
            
            // Texto del footer
            doc.setTextColor(...secondaryColor);
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            doc.text(`FrutaStock Pro - Sistema de Gestión de Inventario`, 20, 292);
            doc.text(`Página ${i} de ${pageCount}`, 170, 292);
        }
        
        // GUARDAR PDF
        const fileName = `FrutaStock_Reporte_${monthName}_${year}.pdf`;
        doc.save(fileName);
        showNotification(`✅ Reporte PDF profesional descargado: ${fileName}`);
        
    } catch (error) {
        console.error('PDF generation error:', error);
        throw error;
    }
}

// CSV Report Generation - VERSIÓN MEJORADA
function generateCSVReport(monthName, year, sales, totalSales, totalCosts, totalProfit) {
    try {
        let csvContent = '\uFEFF'; // BOM for UTF-8
        
        // HEADER DECORATIVO
        csvContent += `=== FRUTASTOCK PRO - REPORTE PROFESIONAL ===\n`;
        csvContent += `Período:,${monthName} ${year}\n`;
        csvContent += `Fecha de generación:,${new Date().toLocaleDateString('es-CL')} ${new Date().toLocaleTimeString('es-CL')}\n`;
        csvContent += `\n`;
        
        // RESUMEN EJECUTIVO
        csvContent += `=== RESUMEN FINANCIERO ===\n`;
        csvContent += `Concepto,Valor\n`;
        csvContent += `Ingresos por Ventas,$${formatCLP(totalSales)},💰\n`;
        csvContent += `Costos de Productos,$${formatCLP(totalCosts)},💸\n`;
        
        const profit = totalProfit;
        const profitIndicator = profit >= 0 ? '✅ Ganancia' : '❌ Pérdida';
        csvContent += `Resultado Final,$${formatCLP(Math.abs(profit))},${profitIndicator}\n`;
        
        const margin = totalSales > 0 ? ((profit / totalSales) * 100).toFixed(1) : 0;
        const marginIndicator = margin > 20 ? '🟢 Excelente' : margin > 10 ? '🟡 Bueno' : '🔴 Mejorar';
        csvContent += `Margen de Ganancia,${margin}%,${marginIndicator}\n`;
        
        const roi = totalCosts > 0 ? ((profit / totalCosts) * 100).toFixed(1) : 0;
        const roiIndicator = roi > 15 ? '🟢 Alto' : roi > 5 ? '🟡 Medio' : '🔴 Bajo';
        csvContent += `ROI (Retorno de Inversión),${roi}%,${roiIndicator}\n`;
        csvContent += `\n`;
        
        // ANÁLISIS DE PRODUCTOS
        if (sales.length > 0) {
            csvContent += `=== ANÁLISIS DE PRODUCTOS MÁS VENDIDOS ===\n`;
            csvContent += `Ranking,Producto,Total Vendido,Cantidad,Transacciones,Promedio por Venta\n`;
            
            // Calcular productos más vendidos
            const productSales = {};
            sales.forEach(sale => {
                if (!productSales[sale.productName]) {
                    productSales[sale.productName] = { quantity: 0, total: 0, count: 0 };
                }
                productSales[sale.productName].quantity += sale.quantity;
                productSales[sale.productName].total += sale.total;
                productSales[sale.productName].count += 1;
            });
            
            const topProducts = Object.entries(productSales)
                .sort((a, b) => b[1].total - a[1].total)
                .slice(0, 10);
            
            topProducts.forEach(([name, data], index) => {
                const ranking = index + 1;
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${ranking}°`;
                const avgSale = (data.total / data.count).toFixed(0);
                
                csvContent += `${medal},${name},$${formatCLP(data.total)},${data.quantity},${data.count},$${formatCLP(avgSale)}\n`;
            });
            csvContent += `\n`;
        }
        
        // DETALLE DE TRANSACCIONES
        if (sales.length > 0) {
            csvContent += `=== DETALLE COMPLETO DE VENTAS ===\n`;
            csvContent += `Fecha,Hora,Producto,Cantidad,Unidad,Precio Unitario,Total,Día de la Semana\n`;
            
            sales.forEach(sale => {
                const saleDate = new Date(sale.date);
                const date = saleDate.toLocaleDateString('es-CL');
                const time = saleDate.toLocaleTimeString('es-CL');
                const dayOfWeek = saleDate.toLocaleDateString('es-CL', { weekday: 'long' });
                
                csvContent += `${date},${time},"${sale.productName}",${sale.quantity},${sale.unit},$${formatCLP(sale.unitPrice)},$${formatCLP(sale.total)},${dayOfWeek}\n`;
            });
            csvContent += `\n`;
        }
        
        // ESTADÍSTICAS ADICIONALES
        if (sales.length > 0) {
            csvContent += `=== ESTADÍSTICAS ADICIONALES ===\n`;
            
            const totalTransactions = sales.length;
            const avgSaleAmount = totalTransactions > 0 ? (totalSales / totalTransactions).toFixed(0) : 0;
            
            // Análisis por día de la semana
            const salesByDay = {};
            const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            
            sales.forEach(sale => {
                const day = new Date(sale.date).getDay();
                const dayName = days[day];
                if (!salesByDay[dayName]) salesByDay[dayName] = { count: 0, total: 0 };
                salesByDay[dayName].count++;
                salesByDay[dayName].total += sale.total;
            });
            
            csvContent += `Métrica,Valor\n`;
            csvContent += `Total de Transacciones,${totalTransactions}\n`;
            csvContent += `Promedio por Venta,$${formatCLP(avgSaleAmount)}\n`;
            csvContent += `\n`;
            
            csvContent += `=== VENTAS POR DÍA DE LA SEMANA ===\n`;
            csvContent += `Día,Cantidad Ventas,Total Vendido,Promedio\n`;
            
            days.forEach(day => {
                if (salesByDay[day]) {
                    const data = salesByDay[day];
                    const avg = (data.total / data.count).toFixed(0);
                    csvContent += `${day},${data.count},$${formatCLP(data.total)},$${formatCLP(avg)}\n`;
                }
            });
        }
        
        // INVENTARIO ACTUAL
        if (inventory.length > 0) {
            csvContent += `\n=== ESTADO ACTUAL DEL INVENTARIO ===\n`;
            csvContent += `Producto,Categoría,Stock (kg),Costo por kg,Precio Unidad,Precio kg,Vencimiento,Estado\n`;
            
            inventory.forEach(product => {
                const daysToExpiry = Math.ceil((new Date(product.expiry) - new Date()) / (1000 * 60 * 60 * 24));
                const isLowStock = product.quantityKg <= product.minStockKg;
                
                let status = '✅ Normal';
                if (daysToExpiry < 0) status = '❌ Vencido';
                else if (daysToExpiry <= 3) status = '⚠️ Por vencer';
                else if (isLowStock) status = '📉 Stock bajo';
                
                csvContent += `"${product.name}","${product.category}",${product.quantityKg},$${formatCLP(product.costKg)},$${formatCLP(product.priceUnit || 0)},$${formatCLP(product.priceKg || 0)},${formatDate(product.expiry)},${status}\n`;
            });
        }
        
        // FOOTER
        csvContent += `\n=== INFORMACIÓN DEL REPORTE ===\n`;
        csvContent += `Sistema,FrutaStock Pro\n`;
        csvContent += `Versión,1.0\n`;
        csvContent += `Generado por,Sistema Automático\n`;
        csvContent += `Fecha de creación,${new Date().toLocaleString('es-CL')}\n`;
        
        // Create and download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `FrutaStock_Reporte_Completo_${monthName}_${year}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showNotification(`✅ Reporte CSV completo descargado: FrutaStock_Reporte_Completo_${monthName}_${year}.csv`);
        
    } catch (error) {
        console.error('CSV generation error:', error);
        generateTextReport(monthName, year, sales, totalSales, totalCosts, totalProfit);
    }
}

// Fallback text report function - VERSIÓN MEJORADA
function generateTextReport(monthName, year, sales, totalSales, totalCosts, totalProfit) {
    let reportText = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                        🍎 FRUTASTOCK PRO 🥬                                  ║
║                     REPORTE MENSUAL PROFESIONAL                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ Período: ${monthName} ${year}                                                      ║
║ Generado: ${new Date().toLocaleDateString('es-CL')} - ${new Date().toLocaleTimeString('es-CL')}              ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────────┐
│                           💰 RESUMEN FINANCIERO                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ Ingresos por Ventas:     $${formatCLP(totalSales).padStart(12)}                     │
│ Costos de Productos:     $${formatCLP(totalCosts).padStart(12)}                     │
│ ────────────────────────────────────────────────                           │
│ Resultado Final:         $${formatCLP(totalProfit).padStart(12)} ${totalProfit >= 0 ? '✅' : '❌'}             │
│                                                                             │
│ Margen de Ganancia:      ${((totalSales > 0 ? (totalProfit / totalSales) * 100 : 0).toFixed(1) + '%').padStart(8)}                           │
│ ROI (Retorno Inversión): ${((totalCosts > 0 ? (totalProfit / totalCosts) * 100 : 0).toFixed(1) + '%').padStart(8)}                           │
└─────────────────────────────────────────────────────────────────────────────┘

`;

    if (sales.length > 0) {
        reportText += `
┌─────────────────────────────────────────────────────────────────────────────┐
│                        🏆 PRODUCTOS MÁS VENDIDOS                           │
├─────────────────────────────────────────────────────────────────────────────┤
`;

        // Calcular productos más vendidos
        const productSales = {};
        sales.forEach(sale => {
            if (!productSales[sale.productName]) {
                productSales[sale.productName] = { quantity: 0, total: 0, count: 0 };
            }
            productSales[sale.productName].quantity += sale.quantity;
            productSales[sale.productName].total += sale.total;
            productSales[sale.productName].count += 1;
        });
        
        const topProducts = Object.entries(productSales)
            .sort((a, b) => b[1].total - a[1].total)
            .slice(0, 5);
        
        topProducts.forEach(([name, data], index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅';
            const productLine = `│ ${medal} ${name.padEnd(25)} $${formatCLP(data.total).padStart(10)} │`;
            reportText += productLine + '\n';
        });
        
        reportText += `└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         📋 RESUMEN DE TRANSACCIONES                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ Total de Ventas: ${sales.length.toString().padStart(3)} transacciones                                    │
│ Venta Promedio:  $${formatCLP(Math.round(totalSales / sales.length)).padStart(12)}                              │
│ Producto con más ventas: ${topProducts[0] ? topProducts[0][0] : 'N/A'}                     │
└─────────────────────────────────────────────────────────────────────────────┘

`;
    }
    
    reportText += `
═══════════════════════════════════════════════════════════════════════════════
                           FrutaStock Pro v1.0
                    Sistema de Gestión de Inventario
             Reporte generado automáticamente el ${new Date().toLocaleDateString('es-CL')}
═══════════════════════════════════════════════════════════════════════════════
`;
    
    // Create and download as text file
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FrutaStock_Reporte_${monthName}_${year}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('📄 Reporte de texto profesional generado');
}

// Product Autocomplete System
function setupProductAutocomplete() {
    const productNameInput = document.getElementById('productName');
    const suggestionsDiv = document.getElementById('productSuggestions');
    const categorySelect = document.getElementById('productCategory');
    
    if (!productNameInput || !suggestionsDiv || !categorySelect) return;
    
    let currentSuggestions = [];
    let selectedIndex = -1;
    
    // Show suggestions when typing or focusing
    function updateSuggestions() {
        const query = productNameInput.value.toLowerCase().trim();
        const selectedCategory = categorySelect.value;
        
        // Get suggestions based on category or all products
        let allProducts = [];
        if (selectedCategory && predefinedProducts[selectedCategory]) {
            allProducts = predefinedProducts[selectedCategory];
        } else {
            allProducts = [...predefinedProducts.Frutas, ...predefinedProducts.Verduras];
        }
        
        // Filter products that match the query (or show all if no query)
        if (query.length === 0) {
            currentSuggestions = allProducts.slice(0, 8);
        } else {
            currentSuggestions = allProducts.filter(product => 
                product.toLowerCase().includes(query)
            ).slice(0, 8);
        }
        
        if (currentSuggestions.length > 0) {
            showSuggestions(currentSuggestions);
        } else {
            hideSuggestions();
        }
    }
    
    productNameInput.addEventListener('input', updateSuggestions);
    productNameInput.addEventListener('focus', updateSuggestions);
    
    // Handle keyboard navigation
    productNameInput.addEventListener('keydown', function(e) {
        if (!suggestionsDiv.classList.contains('hidden')) {
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    selectedIndex = Math.min(selectedIndex + 1, currentSuggestions.length - 1);
                    updateSelectedSuggestion();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    selectedIndex = Math.max(selectedIndex - 1, -1);
                    updateSelectedSuggestion();
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (selectedIndex >= 0 && currentSuggestions[selectedIndex]) {
                        selectSuggestion(currentSuggestions[selectedIndex]);
                    }
                    break;
                case 'Escape':
                    hideSuggestions();
                    break;
            }
        }
    });
    
    // Update category suggestions when category changes
    categorySelect.addEventListener('change', function() {
        if (productNameInput.value.trim()) {
            productNameInput.dispatchEvent(new Event('input'));
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!productNameInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
            hideSuggestions();
        }
    });
    
    function showSuggestions(suggestions) {
        if (suggestions.length === 0) {
            hideSuggestions();
            return;
        }
        
        suggestionsDiv.innerHTML = suggestions.map((product, index) => {
            const category = getProductCategory(product);
            const categoryIcon = category === 'Frutas' ? '🍎' : '🥬';
            
            return `
                <div class="suggestion-item px-4 py-3 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-center justify-between transition-colors" 
                     data-product="${product}" data-index="${index}">
                    <span class="font-medium text-gray-800">${product}</span>
                    <span class="text-sm text-gray-500">${categoryIcon} ${category}</span>
                </div>
            `;
        }).join('');
        
        // Add click listeners to suggestions
        suggestionsDiv.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', function() {
                const product = this.getAttribute('data-product');
                selectSuggestion(product);
            });
        });
        
        suggestionsDiv.classList.remove('hidden');
        selectedIndex = -1;
    }
    
    function hideSuggestions() {
        suggestionsDiv.classList.add('hidden');
        selectedIndex = -1;
    }
    
    function updateSelectedSuggestion() {
        const items = suggestionsDiv.querySelectorAll('.suggestion-item');
        items.forEach((item, index) => {
            if (index === selectedIndex) {
                item.classList.add('bg-green-100');
                item.classList.remove('hover:bg-green-50');
            } else {
                item.classList.remove('bg-green-100');
                item.classList.add('hover:bg-green-50');
            }
        });
    }
    
    function selectSuggestion(product) {
        productNameInput.value = product;
        
        // Auto-select category if not already selected
        const category = getProductCategory(product);
        if (!categorySelect.value && category) {
            categorySelect.value = category;
        }
        
        hideSuggestions();
        
        // Focus next input
        const nextInput = document.getElementById('productQuantityKg');
        if (nextInput) nextInput.focus();
    }
    
    function getProductCategory(product) {
        for (const [category, products] of Object.entries(predefinedProducts)) {
            if (products.includes(product)) {
                return category;
            }
        }
        return null;
    }
}

// Close modal when clicking outside
const editModal = document.getElementById('editModal');
if (editModal) {
    editModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeEditModal();
        }
    });
}