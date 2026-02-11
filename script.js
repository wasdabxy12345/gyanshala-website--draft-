async function loadComponent(id, file) {
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Could not fetch ${file}`);
        const data = await response.text();
        document.getElementById(id).innerHTML = data;

        if (id === 'header-load') {
            // 1. Re-init Dropdowns
            const dropdowns = document.querySelectorAll('.dropdown-toggle');
            dropdowns.forEach(el => new bootstrap.Dropdown(el));

            // 2. Calculate heights and Sync ScrollSpy
            const mainNav = document.querySelector('.custom-navbar');
            const secondNav = document.querySelector('.scrollspy');
            
            // We wait a tiny bit for the browser to render the heights
            setTimeout(() => {
                const totalHeight = mainNav.offsetHeight + secondNav.offsetHeight;
                
                // Update CSS variable so the scroll stops perfectly
                document.documentElement.style.setProperty('--nav-height', totalHeight + 'px');

                // Initialize or Refresh ScrollSpy
                let scrollSpyInstance = bootstrap.ScrollSpy.getInstance(document.body);
                if (scrollSpyInstance) scrollSpyInstance.dispose();

                new bootstrap.ScrollSpy(document.body, {
                    target: '.scrollspy',
                    offset: totalHeight + 50, // Offset slightly larger than margin for reliable triggering
                    smoothScroll: true
                });
            }, 100);

            // 3. Horizontal Scroll for active link
            document.body.addEventListener('activate.bs.scrollspy', function () {
                const activeLink = document.querySelector('.scrollspy .nav-link.active');
                const navContainer = document.querySelector('.scrollspy .navbar-nav');
                if (activeLink && navContainer) {
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
    } catch (error) {
        console.error('Error:', error);
    }
}

// Initial Call
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header-load', 'header.html');
    loadComponent('footer-load', 'footer.html');
});