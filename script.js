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

async function loadComponent(id, file) {
    try {
        const response = await fetch(file);
        const data = await response.text();
        document.getElementById(id).innerHTML = data;

        if (id === 'header-load') {
            // 1. Re-initialize Dropdowns
            const dropdowns = document.querySelectorAll('.dropdown-toggle');
            dropdowns.forEach(el => new bootstrap.Dropdown(el));

            // 2. RE-INITIALIZE SCROLLSPY
            // We find the body and tell it to look at the newly loaded navbar
            const scrollSpyInstance = bootstrap.ScrollSpy.getInstance(document.body);
            if (scrollSpyInstance) {
                scrollSpyInstance.refresh();
            } else {
                new bootstrap.ScrollSpy(document.body, {
                    target: '.scrollspy', // Matches the class on your 2nd <nav>
                    offset: 90           // Adjust based on your header height
                });
            }
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }

    if (id === 'header-load') {
        // 1. Re-init Dropdowns
        const dropdowns = document.querySelectorAll('.dropdown-toggle');
        dropdowns.forEach(el => new bootstrap.Dropdown(el));

        // 2. Init/Refresh ScrollSpy
        let scrollSpyInstance = bootstrap.ScrollSpy.getInstance(document.body);
        if (!scrollSpyInstance) {
            scrollSpyInstance = new bootstrap.ScrollSpy(document.body, {
                target: '.scrollspy',
                offset: 160
            });
        }

        // 3. AUTO-SCROLL HORIZONTAL NAV
        // Listen for when a new section becomes "active"
        document.body.addEventListener('activate.bs.scrollspy', function () {
            const activeLink = document.querySelector('.scrollspy .nav-link.active');
            if (activeLink) {
                const navContainer = document.querySelector('.scrollspy .navbar-nav');

                // Calculate how far to scroll to center the active link
                const linkOffset = activeLink.offsetLeft;
                const linkWidth = activeLink.offsetWidth;
                const containerWidth = navContainer.offsetWidth;

                navContainer.scrollTo({
                    left: linkOffset - (containerWidth / 2) + (linkWidth / 2),
                    behavior: 'smooth'
                });
            }
        });
    }
}