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
    const myCarousel = document.querySelector('#img-carousel');
    if (myCarousel) {
        new bootstrap.Carousel(myCarousel, {
            interval: 5000,
            ride: 'carousel',
            pause: 'hover'
        });
    }

    const impactCarousel = document.querySelector('#impact');
    if (impactCarousel) {
        new bootstrap.Carousel(impactCarousel, {
            interval: 5000,
            ride: 'carousel',
            pause: 'hover'
        });
    }

    loadComponent('header-load', 'header.html').then(() => {
        // Dynamic Header Height Calculation
        const updateHeaderHeight = () => {
            const header = document.getElementById('header-load');
            if (header) {
                const height = header.offsetHeight;
                document.documentElement.style.setProperty('--header-height', `${height}px`);
            }
        };

        // Initial calculation
        setTimeout(updateHeaderHeight, 100);

        // Update on resize
        window.addEventListener('resize', updateHeaderHeight);

        // Generate links for the 2nd navbar dynamically
        const secondaryNavList = document.getElementById('secondary-nav-list');
        const pageSections = document.querySelectorAll('main section[id], main div[id]');
        const isTeamPage = window.location.pathname.includes('team.html');

        if (secondaryNavList && pageSections.length > 0) {
            if (isTeamPage) {
                const nav = secondaryNavList.closest('nav');
                if (nav) nav.style.display = 'none';
            } else {
                pageSections.forEach(section => {
                    const id = section.id;
                    // Skip non-content IDs and tab-related containers
                    if (['img-carousel', 'header-load', 'footer-load', 'welcome', 'about-hero', 'impact-bar', 'roots', 'impact'].includes(id) && id !== 'welcome') return;
                    if (section.classList.contains('tab-pane') || section.classList.contains('tab-content')) return;

                    // Format ID to Title (e.g., 'about-history' -> 'History')
                    let title = id.replace('about-', '')
                        .replace(/-/g, ' ')
                        .replace(/\b\w/g, l => l.toUpperCase())
                        .replace(/\bUp\b/g, 'UP');

                    const li = document.createElement('li');
                    li.className = 'nav-item';
                    const a = document.createElement('a');
                    a.className = 'nav-link px-2';
                    a.href = `#${id}`;
                    a.textContent = title;
                    li.appendChild(a);
                    secondaryNavList.appendChild(li);
                });
            }
        }

        // Secondary Nav Element
        const secondaryNav = document.querySelector('header > .navbar:nth-of-type(2)');

        // Hide secondary nav initially if we are at the top
        if (secondaryNav) {
            secondaryNav.classList.add('secondary-nav-hidden');
        }

        // Initialize ScrollSpy after links are generated
        const navLinks = document.querySelectorAll('header > .navbar:nth-of-type(2) .nav-link');

        // Add smooth scrolling and active class update
        navLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');

                    const headerHeight = parseInt(document.documentElement.style.getPropertyValue('--header-height')) || 125;
                    const offsetPosition = targetSection.offsetTop - headerHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            });
        });

        // ScrollSpy logic
        const scrollSpy = () => {
            const headerHeight = parseInt(document.documentElement.style.getPropertyValue('--header-height')) || 125;
            const scrollPosition = window.scrollY + headerHeight + 50;

            // Toggle secondary nav visibility based on scroll position
            if (secondaryNav && navLinks.length > 0) {
                const firstTargetId = navLinks[0].getAttribute('href').substring(1);
                const firstSection = document.getElementById(firstTargetId);

                // Show the navbar when we've scrolled down to the first linked section
                if (firstSection && (window.scrollY + headerHeight + 10 >= firstSection.offsetTop)) {
                    if (secondaryNav.classList.contains('secondary-nav-hidden')) {
                        secondaryNav.classList.remove('secondary-nav-hidden');
                        setTimeout(updateHeaderHeight, 300); // Update after transition
                    }
                } else {
                    if (!secondaryNav.classList.contains('secondary-nav-hidden')) {
                        secondaryNav.classList.add('secondary-nav-hidden');
                        setTimeout(updateHeaderHeight, 300); // Update after transition
                    }
                }
            }

            pageSections.forEach(section => {
                const id = section.id;
                const link = Array.from(navLinks).find(l => l.getAttribute('href') === `#${id}`);

                if (link && scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
                    if (!link.classList.contains('active')) {
                        navLinks.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');

                        // Automatically scroll the navbar link into view if it's hidden
                        link.scrollIntoView({
                            behavior: 'smooth',
                            inline: 'center',
                            block: 'nearest'
                        });
                    }
                }
            });
        };

        window.addEventListener('scroll', scrollSpy);
        // Call immediately to set correct state on page load
        scrollSpy();
    });

    loadComponent('footer-load', 'footer.html');
});