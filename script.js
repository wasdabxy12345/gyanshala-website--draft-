// Function to load HTML components
function loadComponent(elementId, filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading component:', error);
        });
}

// Initial Call
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header-load', 'header.html');
    loadComponent('footer-load', 'footer.html');
});