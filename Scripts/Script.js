const apiBaseUrl = "http://localhost:53659/api/product";

window.onload = function () {
    applySavedTheme(); // 🌓 First apply dark mode if saved
    loadProducts();    // 🛒 Load products after theme
};

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

   if (user === "admin" && pass === "1234") {
    alert("✅ Login Successful!");
    localStorage.setItem(" ", user); // 👈 Store username

    document.getElementById("loginContainer").style.display = "none";
    const inventory = document.getElementById("inventorySection");
    inventory.style.display = "block";
    inventory.classList.add("show-animated");

    document.getElementById("productTableContainer").style.display = "block"; // 👈 ADD THIS LINE

    loadProducts();
}

	else {
        alert("❌ Invalid credentials");
    }
});

document.getElementById("productForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const productId = document.getElementById("ProductID").value;

    const product = {
        ProductName: document.getElementById("ProductName").value,
        Category: document.getElementById("Category").value,
        QuantityInStock: parseInt(document.getElementById("QuantityInStock").value),
        UnitPrice: parseFloat(document.getElementById("UnitPrice").value),
        CostPrice: parseFloat(document.getElementById("CostPrice").value)
    };

    if (productId) {
        fetch(`${apiBaseUrl}/put?id=${productId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        })
            .then(res => res.json())
            .then(() => {
                showToast("📝 Product Updated!");
                loadProducts();
                document.getElementById("productForm").reset();
                document.getElementById("ProductID").value = "";
                document.getElementById("submitBtn").textContent = "Add Product";
            })
            .catch(error => console.error("Update Error:", error));
    } else {
        fetch(`${apiBaseUrl}/post`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        })
            .then(response => response.json())
            .then(() => {
                showToast("✅ Product Added!");
                loadProducts();
                document.getElementById("productForm").reset();
            })
            .catch(error => console.error("Create Error:", error));
    }
});
function logout() {
    document.getElementById("inventorySection").style.display = "none";
    document.getElementById("loginContainer").style.display = "block";
    document.getElementById("loginForm").reset();

    document.getElementById("productTableContainer").style.display = "none"; // 👈 ADD THIS

    alert("👋 You have been logged out.");
}


function deleteProduct(id) {
    if (confirm("❗Are you sure you want to delete this product?")) {
        fetch(`${apiBaseUrl}/${id}`, {
            method: "DELETE"
        })
            .then(res => {
                if (!res.ok) throw new Error("Delete failed");
                return res.json();
            })
            .then(data => {
                alert(data.Message);
                loadProducts();
            })
            .catch(error => {
                console.error("Error:", error);
                alert("❌ Failed to delete product.");
            });
    }
}

function editProduct(id) {
    fetch(`${apiBaseUrl}/get`)
        .then(res => res.json())
        .then(data => {
            const product = data.find(p => p.ProductID === id);
            if (product) {
                document.getElementById("ProductName").value = product.ProductName;
                document.getElementById("Category").value = product.Category;
                document.getElementById("QuantityInStock").value = product.QuantityInStock;
                document.getElementById("UnitPrice").value = product.UnitPrice;
                document.getElementById("CostPrice").value = product.CostPrice;

                document.getElementById("ProductID").value = product.ProductID;
                document.getElementById("submitBtn").textContent = "Update Product";
            }
        });
}

function loadProducts() {
    fetch(`${apiBaseUrl}/get`)
        .then(res => res.json())
        .then(data => {
            displayProducts(data);
        });
}

function displayProducts(data) {
    const table = document.getElementById("productTable");
    table.innerHTML = "";

    if (!data || data.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding: 20px; color: red;">
                    ❗ No products found.
                </td>
            </tr>`;
        return;
    }

    data.forEach(product => {
        const row = `<tr>
            <td>${product.ProductName}</td>
            <td>${product.Category}</td>
            <td>${product.QuantityInStock}</td>
            <td>${product.UnitPrice}</td>
            <td>${product.CostPrice}</td>
            <td>
                <button onclick="editProduct(${product.ProductID})" style="background-color:#1976d2;">Edit</button>
                <button onclick="deleteProduct(${product.ProductID})" style="background-color:#e53935;">Delete</button>
            </td>
        </tr>`;
        table.innerHTML += row;
    });
}



function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function exportToCSV() {
    fetch(`${apiBaseUrl}/get`)
        .then(res => res.json())
        .then(data => {
            if (!data.length) {
                alert("No data to export!");
                return;
            }

            const headers = Object.keys(data[0]);
            const csvRows = [];

            csvRows.push(headers.join(","));

            for (const row of data) {
                const values = headers.map(header => `"${(row[header] ?? "").toString().replace(/"/g, '""')}"`);
                csvRows.push(values.join(","));
            }

            const csvContent = csvRows.join("\n");
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "Products_Export.csv";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        })
        .catch(error => {
            console.error("Export Error:", error);
            alert("❌ Failed to export data.");
        });
}

// ✅ DARK MODE TOGGLE
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDark);
    document.getElementById("darkModeToggleBtn").textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
}

function applySavedTheme() {
    const darkMode = localStorage.getItem("darkMode") === "true";
    if (darkMode) {
        document.body.classList.add("dark-mode");
        document.getElementById("darkModeToggleBtn").textContent = "☀️ Light Mode";
    } else {
        document.getElementById("darkModeToggleBtn").textContent = "🌙 Dark Mode";
    }
}

window.onload = function () {
    applySavedTheme();  // Dark mode apply houn dyaycha
};


function showTab(tabName) {
    const tabs = ['dashboard', 'products', 'history', 'users'];
    tabs.forEach(tab => {
        const section = document.getElementById(`${tab}Section`);
        if (section) {
            section.style.display = (tab === tabName) ? 'block' : 'none';
        }
    });

    if (tabName === 'dashboard') {
        showDashboardChart();  // Load chart dynamically
    }
	 if (tabName === 'users') {
        const user = localStorage.getItem(" ") || "Guest";
        document.getElementById("loggedInUserInfo").textContent = `👤: ${user}`;
    }
}




function toggleCategoryDropdown() {
    const dropdown = document.getElementById("categoryDropdown");
    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
    } else {
        const categories = [
            "1] SmartPhones",
            "2] Technology",
            "3] Automobiles",
            "4] Accessories"
        ];
        dropdown.innerHTML = "";
        categories.forEach(cat => {
            const div = document.createElement("div");
            div.textContent = cat;
            div.className = "animate__animated animate__fadeInDown category-item";
            dropdown.appendChild(div);
        });
        dropdown.style.display = "block";
    }
}


let categoryChartInstance = null;

function showDashboardChart() {
    fetch(`${apiBaseUrl}/get`)
        .then(res => res.json())
        .then(data => {
            const categoryCounts = {};
            data.forEach(item => {
                categoryCounts[item.Category] = (categoryCounts[item.Category] || 0) + 1;
            });

            const labels = Object.keys(categoryCounts);
            const values = Object.values(categoryCounts);

            // 💡 Generate a different color for each category
            const colorPalette = [
                '#2196f3', '#00bcd4', '#ff7f50', '#ff9800', '#9c27b0',
                '#f44336', '#009688', '#ffc107', '#673ab7', '#e91e63'
            ];
            const backgroundColors = labels.map((_, i) => colorPalette[i % colorPalette.length]);

            // Destroy existing chart
            if (categoryChartInstance) {
                categoryChartInstance.destroy();
            }

            const ctx = document.getElementById('categoryChart').getContext('2d');
            categoryChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Products by Category',
                        data: values,
                        backgroundColor: backgroundColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        });
}
