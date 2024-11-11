import { backend } from "declarations/backend";

// Function to show loading spinner
const showLoading = () => {
    document.getElementById('loading').classList.remove('d-none');
};

// Function to hide loading spinner
const hideLoading = () => {
    document.getElementById('loading').classList.add('d-none');
};

// Function to load all taxpayers
async function loadTaxPayers() {
    try {
        showLoading();
        const taxpayers = await backend.getAllTaxPayers();
        const tbody = document.getElementById('taxpayersList');
        tbody.innerHTML = '';
        
        taxpayers.forEach(tp => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${tp.tid}</td>
                <td>${tp.firstName}</td>
                <td>${tp.lastName}</td>
                <td>${tp.address}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading taxpayers:', error);
        alert('Failed to load taxpayers');
    } finally {
        hideLoading();
    }
}

// Add new taxpayer form submission
document.getElementById('addTaxPayerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const taxpayer = {
        tid: document.getElementById('tid').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        address: document.getElementById('address').value
    };

    try {
        showLoading();
        const result = await backend.addTaxPayer(taxpayer);
        if (result) {
            alert('TaxPayer added successfully');
            e.target.reset();
            loadTaxPayers();
        } else {
            alert('TID already exists');
        }
    } catch (error) {
        console.error('Error adding taxpayer:', error);
        alert('Failed to add taxpayer');
    } finally {
        hideLoading();
    }
});

// Search functionality
document.getElementById('searchButton').addEventListener('click', async () => {
    const tid = document.getElementById('searchTID').value;
    if (!tid) {
        alert('Please enter a TID to search');
        return;
    }

    try {
        showLoading();
        const result = await backend.searchByTID(tid);
        const searchResult = document.getElementById('searchResult');
        
        if (result) {
            searchResult.innerHTML = `
                <div class="alert alert-success">
                    <h5>TaxPayer Found:</h5>
                    <p>TID: ${result.tid}</p>
                    <p>Name: ${result.firstName} ${result.lastName}</p>
                    <p>Address: ${result.address}</p>
                </div>
            `;
        } else {
            searchResult.innerHTML = `
                <div class="alert alert-warning">
                    No taxpayer found with TID: ${tid}
                </div>
            `;
        }
    } catch (error) {
        console.error('Error searching taxpayer:', error);
        alert('Failed to search taxpayer');
    } finally {
        hideLoading();
    }
});

// Load taxpayers when page loads
window.addEventListener('load', loadTaxPayers);
