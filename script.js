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
        const main = document.querySelector('main');
        const secondaryNav = document.querySelector('header .navbar:nth-of-type(2)');

        if (secondaryNavList && main) {
            // Keep useful content sections, skip utility/internal ones
            const skips = ['header-load', 'footer-load', 'img-carousel', 'impact-bar', 'roots', 'impact', 'about-hero', 'testimonialSlider'];
            const pageSections = Array.from(main.querySelectorAll('section[id], div[id]')).filter(el => {
                return !skips.includes(el.id) && !el.classList.contains('tab-pane') && !el.classList.contains('tab-content');
            });

            if (window.location.pathname.includes('team.html')) {
                const nav = secondaryNavList.closest('nav');
                if (nav) nav.style.display = 'none';
            } else {
                secondaryNavList.innerHTML = ''; // Clear existing
                pageSections.forEach(section => {
                    const id = section.id;
                    let title = id.replace('about-', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    const li = document.createElement('li');
                    li.className = 'nav-item';
                    li.innerHTML = `<a class="nav-link px-2" href="#${id}">${title}</a>`;
                    secondaryNavList.appendChild(li);
                });
            }
        }

        if (secondaryNav) secondaryNav.classList.add('secondary-nav-hidden');

        // Combined Nav Logic
        let isManualScrolling = false;

        const getHeaderHeight = () => {
            const header = document.getElementById('header-load');
            if (!header) return 125;
            // If the secondary nav will be visible at target, we use the full height
            const secNav = header.querySelector('.navbar:nth-of-type(2)');
            if (secNav && secNav.classList.contains('secondary-nav-hidden')) {
                // Approximate expanded height if currently hidden
                return header.offsetHeight + 40;
            }
            return header.offsetHeight;
        };

        const SCROLL_OFFSET = 25;

        if (secondaryNavList) {
            secondaryNavList.addEventListener('click', (e) => {
                const link = e.target.closest('.nav-link');
                if (!link) return;

                const targetId = link.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);

                if (target) {
                    e.preventDefault();
                    isManualScrolling = true;

                    // Update active class immediately for visual feedback
                    secondaryNavList.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    link.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

                    const absoluteTop = target.getBoundingClientRect().top + window.scrollY;
                    const finalScrollPos = absoluteTop - getHeaderHeight() - SCROLL_OFFSET;

                    window.scrollTo({
                        top: finalScrollPos,
                        behavior: 'smooth'
                    });

                    // Re-enable scrollspy after scroll finishes
                    let scrollTimeout;
                    const onScroll = () => {
                        clearTimeout(scrollTimeout);
                        scrollTimeout = setTimeout(() => {
                            window.removeEventListener('scroll', onScroll);
                            isManualScrolling = false;
                            // Update hash without jumping
                            history.replaceState(null, null, `#${targetId}`);
                        }, 100);
                    };
                    window.addEventListener('scroll', onScroll);
                }
            });
        }

        const scrollSpy = () => {
            if (isManualScrolling) return;

            const headerHeight = getHeaderHeight();
            const scrollPos = window.scrollY + headerHeight + SCROLL_OFFSET + 20;
            const navLinks = secondaryNavList ? secondaryNavList.querySelectorAll('.nav-link') : [];

            // Navbar Visibility
            if (secondaryNav && navLinks.length > 0) {
                const firstId = navLinks[0].getAttribute('href').substring(1);
                const firstSec = document.getElementById(firstId);
                if (firstSec) {
                    const firstTop = firstSec.getBoundingClientRect().top + window.scrollY;
                    if (window.scrollY + 100 >= firstTop) {
                        if (secondaryNav.classList.contains('secondary-nav-hidden')) {
                            secondaryNav.classList.remove('secondary-nav-hidden');
                            updateHeaderHeight();
                        }
                    } else if (window.scrollY < 50) {
                        secondaryNav.classList.add('secondary-nav-hidden');
                        updateHeaderHeight();
                    }
                }
            }

            // Highlighting Logic
            let currentId = "";
            navLinks.forEach(link => {
                const id = link.getAttribute('href').substring(1);
                const section = document.getElementById(id);
                if (section) {
                    const top = section.getBoundingClientRect().top + window.scrollY;
                    if (scrollPos >= top) currentId = id;
                }
            });

            if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 60) {
                if (navLinks.length > 0) currentId = navLinks[navLinks.length - 1].getAttribute('href').substring(1);
            }

            navLinks.forEach(link => {
                const id = link.getAttribute('href').substring(1);
                if (id === currentId) {
                    if (!link.classList.contains('active')) {
                        link.classList.add('active');
                        link.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                    }
                } else {
                    link.classList.remove('active');
                }
            });
        };

        window.addEventListener('scroll', scrollSpy);
        setTimeout(scrollSpy, 300); // Initial check after components settle
    });

    loadComponent('footer-load', 'footer.html');
});