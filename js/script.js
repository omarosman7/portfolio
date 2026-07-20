document.addEventListener('DOMContentLoaded', () => {
    /* =========================================
       1. LOADING SCREEN
       ========================================= */
    const loader = document.querySelector('.loader');
    
    function hideLoader() {
        if (loader.style.opacity === '0') return; // Already hidden
        
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        
        // Trigger initial animations
        setTimeout(() => {
            const fadeUps = document.querySelectorAll('.hero-content.fade-up');
            fadeUps.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
            
            const fadeIns = document.querySelectorAll('.hero-image.fade-in');
            fadeIns.forEach(el => {
                el.style.opacity = '1';
            });
        }, 300);
    }
    
    // Hide loader after a short delay to simulate loading or when page is fully loaded
    window.addEventListener('load', hideLoader);
    
    // Fallback: If page takes too long to load (e.g. image stuck), force hide loader after 3 seconds
    setTimeout(hideLoader, 3000);

    /* =========================================
       2. CUSTOM CURSOR
       ========================================= */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Check if it's a touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice) {
        document.body.classList.add('custom-cursor-active');
        
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            // Dot follows instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            // Outline follows with a slight delay using animate for smoothness
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });
        
        // Hover effects for clickable elements
        const hoverElements = document.querySelectorAll('a, button, .magnetic, .hover-lift');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('hovering');
            });
        });
    }

    /* =========================================
       3. MAGNETIC BUTTONS
       ========================================= */
    if (!isTouchDevice) {
        const magneticElements = document.querySelectorAll('.magnetic');
        
        magneticElements.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                // Reduce the movement intensity
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    /* =========================================
       4. SCROLL PROGRESS & NAVBAR
       ========================================= */
    const scrollProgress = document.querySelector('.scroll-progress');
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        // Scroll Progress
        const scrollTop = window.scrollY;
        const docHeight = document.body.offsetHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = scrollTop / (docHeight - winHeight);
        const scrollPercentRounded = Math.round(scrollPercent * 100);
        
        scrollProgress.style.width = `${scrollPercentRounded}%`;
        
        // Navbar Scrolled State
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* =========================================
       5. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
       ========================================= */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Optional: only animate once
            }
        });
    }, observerOptions);
    
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => {
        observer.observe(el);
    });

    /* =========================================
       6. PARALLAX EFFECT
       ========================================= */
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        parallaxElements.forEach(el => {
            const speed = el.getAttribute('data-speed') || 0.05;
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });

    /* =========================================
       7. PROJECTS FILTERING
       ========================================= */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.classList.contains(filterValue)) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 400); // Matches transition time
                }
            });
        });
    });

    /* =========================================
       8. PROJECT MODAL (CASE STUDY)
       ========================================= */
    const modal = document.getElementById('projectModal');
    const modalBody = modal.querySelector('.modal-body');
    const closeModalBtn = modal.querySelector('.close-modal');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const openProjectBtns = document.querySelectorAll('.open-project-btn');
    
    function openModal(content) {
        modalBody.innerHTML = content;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Enable scrolling
    }
    
    openProjectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.project-card');
            const title = card.querySelector('h3').innerText;
            const meta = card.querySelector('.project-meta').innerHTML;
            const imgSrc = card.querySelector('img').src;
            const caseStudyHTML = card.querySelector('.case-study-details').innerHTML;
            
            const content = `
                ${meta}
                <h3>${title}</h3>
                <img src="${imgSrc}" alt="${title}" style="border-radius:10px; margin-bottom: 1.5rem; max-height: 300px; width: 100%; object-fit: cover;">
                <div class="case-study-content" style="line-height: 1.8;">
                    ${caseStudyHTML}
                </div>
            `;
            
            openModal(content);
        });
    });
    
    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    /* =========================================
       9. FOOTER YEAR & BACK TO TOP
       ========================================= */
    document.getElementById('year').textContent = new Date().getFullYear();
    
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    // Initial hiding of back to top
    backToTop.style.opacity = '0';
    backToTop.style.visibility = 'hidden';
    backToTop.style.transition = 'all 0.3s ease';
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* =========================================
       10. INTERACTIVE HERO SHAPES
       ========================================= */
    const shapes = document.querySelectorAll('.geo-shape-container');
    const heroImageContainer = document.querySelector('.hero-image');
    
    if (heroImageContainer && shapes.length > 0 && !isTouchDevice) {
        heroImageContainer.addEventListener('mousemove', (e) => {
            const rect = heroImageContainer.getBoundingClientRect();
            // Calculate mouse position relative to the center of the container
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            shapes.forEach((shape, index) => {
                // Different shapes move at different speeds for a parallax effect
                const speed = (index + 1) * 0.08;
                shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
        
        heroImageContainer.addEventListener('mouseleave', () => {
            // Reset shapes to original position smoothly when mouse leaves
            shapes.forEach(shape => {
                shape.style.transform = `translate(0, 0)`;
            });
        });
    }
});
