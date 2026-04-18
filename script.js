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

        // Primary Nav Active Link Highlighting
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        // Map sub-pages to their parent navbar items
        const parentMap = {
            'transparency.html': 'about_us.html',
            'team.html': 'about_us.html',
            'student-assessments.html': 'impact.html'
        };

        const activePath = parentMap[currentPath] || currentPath;
        const allNavLinks = document.querySelectorAll('#main-navbar .nav-link, #main-navbar .dropdown-item');

        allNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === activePath || (activePath === 'index.html' && href === 'index.html')) {
                link.classList.add('active');

                const parentDropdown = link.closest('.dropdown');
                if (parentDropdown) {
                    const toggle = parentDropdown.querySelector('.dropdown-toggle');
                    if (toggle) toggle.classList.add('active');
                }
            }
        });

        if (secondaryNavList && main) {
            const skips = ['header-load', 'footer-load', 'img-carousel', 'impact-bar', 'roots', 'impact', 'about-hero', 'testimonialSlider', 'job-list', 'more-jobs', 'view-more-container', 'job-list-wrapper', 'no-results'];
            const pageSections = Array.from(main.querySelectorAll('section[id], div[id]')).filter(el => {
                return !skips.includes(el.id) && !el.classList.contains('tab-pane') && !el.classList.contains('tab-content');
            });

            if (window.location.pathname.includes('team.html')) {
                const nav = secondaryNavList.closest('nav');
                if (nav) nav.style.display = 'none';
            } else {
                secondaryNavList.innerHTML = '';
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

    // Tab Bar Draggable Scrolling
    const tabContainers = document.querySelectorAll('.tabs-nav-container');
    tabContainers.forEach(container => {
        let isDown = false;
        let startX;
        let scrollLeft;

        container.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });
        container.addEventListener('mouseleave', () => {
            isDown = false;
        });
        container.addEventListener('mouseup', () => {
            isDown = false;
        });
        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed
            container.scrollLeft = scrollLeft - walk;
        });
    });

    loadComponent('footer-load', 'footer.html');
});

// --- PDF Viewer & Thumbnail Rendering ---
// This logic is shared across multiple pages (impact, assessments, transparency)

let pdfDoc = null;
let scale = 1.5;
let currentUrl = '';
let renderQueue = new Set();
const visibilityMap = new Map();
let updateTimeout;

// Set worker if pdfjsLib is available
if (typeof pdfjsLib !== 'undefined') {
    const PDF_JS_VERSION = '3.11.174';
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDF_JS_VERSION}/pdf.worker.min.js`;
}

async function renderThumbnail(url, canvasId) {
    const canvasElement = document.getElementById(canvasId);
    if (!canvasElement) return;

    const container = canvasElement.parentElement;
    try {
        const path = url.startsWith('http') ? url : './' + url;
        const loadingTask = pdfjsLib.getDocument({
            url: path,
            disableAutoFetch: true,
            disableStream: true
        });

        const doc = await loadingTask.promise;
        const page = await doc.getPage(1);

        const context = canvasElement.getContext('2d');
        const viewport = page.getViewport({ scale: 0.4 });

        canvasElement.height = viewport.height;
        canvasElement.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;

        canvasElement.setAttribute('data-rendered', 'true');
        const loader = document.getElementById(`loader-${canvasId}`);
        if (loader) loader.style.display = 'none';
        canvasElement.style.display = 'block';
    } catch (e) {
        console.error(`[Thumbnail] Error [${canvasId}]:`, e);
        container.innerHTML = `
            <div style="text-align:center; padding: 20px; color: #64748b;">
                <i class="bi bi-file-earmark-pdf" style="font-size: 2rem; color:#ef4444;"></i>
                <div style="font-size:0.75rem; margin-top:5px;">Preview unavailable</div>
                <div style="font-size:0.6rem; color:#94a3b8;">${e.message.substring(0, 40)}</div>
            </div>`;
    }
}

async function openModal(url) {
    if (!url || url === '#') return;

    currentUrl = url.startsWith('http') ? url : './' + url;
    const modal = document.getElementById('pdfModal');
    if (!modal) return;

    const container = document.getElementById('scroll-container');
    const wrapper = document.getElementById('canvas-wrapper');

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    container.scrollTop = 0;
    wrapper.innerHTML = '<div style="color:white; padding: 40px; font-family: sans-serif;">Loading Document...</div>';

    try {
        const loadingTask = pdfjsLib.getDocument({
            url: currentUrl,
            cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
            cMapPacked: true,
        });
        pdfDoc = await loadingTask.promise;
        const pageCountEl = document.getElementById('page_count');
        if (pageCountEl) pageCountEl.textContent = pdfDoc.numPages;
        renderAllPages();
    } catch (e) {
        console.error("[Viewer] Load failed:", e);
        window.open(url, '_blank');
        closeModal();
    }
}

async function renderAllPages(maintainScroll = false) {
    const wrapper = document.getElementById('canvas-wrapper');
    const container = document.getElementById('scroll-container');
    if (!wrapper || !container || !pdfDoc) return;

    const currentRatio = container.scrollTop / container.scrollHeight;
    wrapper.innerHTML = '';

    const firstPage = await pdfDoc.getPage(1);
    const targetWidth = 500;
    const unscaledViewport = firstPage.getViewport({ scale: 1 });
    const fitScale = (targetWidth * scale) / unscaledViewport.width;

    for (let i = 1; i <= pdfDoc.numPages; i++) {
        const pageContainer = document.createElement('div');
        pageContainer.className = 'page-container';
        pageContainer.dataset.pageNumber = i;
        pageContainer.dataset.fitScale = fitScale;
        pageContainer.style.height = (unscaledViewport.height * fitScale) + 'px';
        pageContainer.style.width = (unscaledViewport.width * fitScale) + 'px';
        wrapper.appendChild(pageContainer);
        pdfObserver.observe(pageContainer);
    }

    if (maintainScroll && container.scrollHeight > 0) {
        container.scrollTop = currentRatio * container.scrollHeight;
    }
}

const pdfObserver = (typeof IntersectionObserver !== 'undefined') ? new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        visibilityMap.set(entry.target.dataset.pageNumber, entry.intersectionRatio);

        if (entry.isIntersecting) {
            const container = entry.target;
            const pageNum = parseInt(container.dataset.pageNumber);
            if (!container.querySelector('canvas') && !renderQueue.has(pageNum)) {
                renderLazyPage(pageNum, container);
            }
        }
    });

    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
        let maxRatio = -1;
        let activePage = '1';

        visibilityMap.forEach((ratio, page) => {
            if (ratio > maxRatio) {
                maxRatio = ratio;
                activePage = page;
            }
        });

        if (maxRatio > 0) {
            const indicator = document.getElementById('page_num');
            if (indicator) indicator.textContent = activePage;
        }
    }, 100);
}, {
    root: document.getElementById('scroll-container'),
    threshold: [0, 0.25, 0.5, 0.75, 1.0]
}) : null;

async function renderLazyPage(num, container) {
    if (!pdfDoc) return;
    renderQueue.add(num);
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const page = await pdfDoc.getPage(num);
    const fitScale = parseFloat(container.dataset.fitScale);
    const viewport = page.getViewport({ scale: fitScale });

    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({ canvasContext: context, viewport: viewport }).promise;
    renderQueue.delete(num);
}

function changeZoom(delta) {
    scale = Math.max(0.2, Math.min(3.0, scale + delta));
    renderAllPages(true);
}

async function downloadPDF() {
    if (!currentUrl) return;
    try {
        const response = await fetch(currentUrl);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = currentUrl.split('/').pop() || 'document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
        window.open(currentUrl, '_blank');
    }
}

function closeModal() {
    const modal = document.getElementById('pdfModal');
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = '';
    const wrapper = document.getElementById('canvas-wrapper');
    if (wrapper) wrapper.innerHTML = '';
    pdfDoc = null;
    renderQueue.clear();
}

// Global listeners for PDF modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        return;
    }

    // Handle arrow key scrolling if modal is open
    const modal = document.getElementById('pdfModal');
    if (modal && modal.style.display === 'block') {
        const container = document.getElementById('scroll-container');
        if (container) {
            const scrollStep = 100; // Pixels per arrow press
            if (e.key === 'ArrowDown') {
                container.scrollBy({ top: scrollStep, behavior: 'smooth' });
                e.preventDefault();
            } else if (e.key === 'ArrowUp') {
                container.scrollBy({ top: -scrollStep, behavior: 'smooth' });
                e.preventDefault();
            } else if (e.key === 'PageDown') {
                container.scrollBy({ top: container.clientHeight * 0.8, behavior: 'smooth' });
                e.preventDefault();
            } else if (e.key === 'PageUp') {
                container.scrollBy({ top: -container.clientHeight * 0.8, behavior: 'smooth' });
                e.preventDefault();
            } else if (e.key === 'Home') {
                container.scrollTo({ top: 0, behavior: 'smooth' });
                e.preventDefault();
            } else if (e.key === 'End') {
                container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
                e.preventDefault();
            }
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.getElementById('scroll-container');
    if (scrollContainer) {
        scrollContainer.addEventListener('click', (e) => {
            if (e.target.id === 'scroll-container' || e.target.id === 'canvas-wrapper') closeModal();
        });
    }
});
