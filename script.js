// Function to load HTML components
function loadComponent(elementId, filePath) {
    return fetch(filePath)
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
    loadComponent('header-load', 'header.html').then(() => {
        // Dynamic Header Height Calculation
        const updateHeaderHeight = () => {
            const header = document.getElementById('header-load');
            if (header) {
                const height = header.offsetHeight;
                document.documentElement.style.setProperty('--header-height', `${height}px`); // Adding 20px buffer
            }
        };

        // Initial calculation
        // Slight delay to ensure images/fonts might be loaded or layout settled
        setTimeout(updateHeaderHeight, 100);

        // Update on resize
        window.addEventListener('resize', updateHeaderHeight);

        // Initialize ScrollSpy after header is loaded
        const sections = document.querySelectorAll('div[id]'); // Select all divs with IDs
        const navLinks = document.querySelectorAll('header > .navbar:nth-of-type(2) .nav-link');

        // Map section IDs to nav links for O(1) access
        const navLinkMap = {};
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                navLinkMap[href.substring(1)] = link;
            }
        });

        // Add smooth scrolling
        navLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start' // or 'start' - offset if we want to handle sticky header height
                    });
                }
            });
        });


        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px', // Active when element is in the viewport "sweet spot"
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Remove active class from all
                    navLinks.forEach(link => link.classList.remove('active'));

                    // Add active class to corresponding link
                    const activeLink = navLinkMap[entry.target.id];
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            // Only observe sections that are actually linked in the nav
            if (navLinkMap[section.id]) {
                observer.observe(section);
            }
        });
    });

    loadComponent('footer-load', 'footer.html');
});