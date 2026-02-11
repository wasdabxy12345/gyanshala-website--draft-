// Function to load HTML components
async function loadComponent(id, file) {
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Could not fetch ${file}`);
        const data = await response.text();
        document.getElementById(id).innerHTML = data;

        // RE-INITIALIZE BOOTSTRAP COMPONENTS
        // Because the header is added AFTER the page loads, 
        // Bootstrap needs a manual nudge to recognize dropdowns.
        if (id === 'header-load') {
            const dropdowns = document.querySelectorAll('.dropdown-toggle');
            dropdowns.forEach(el => new bootstrap.Dropdown(el));
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header-load', 'header.html');
    loadComponent('footer-load', 'footer.html');
});