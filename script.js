document.addEventListener('DOMContentLoaded', () => {

    // ─────────────────────────────────────────────
    // 1. MEDIA GALLERY FILTERING
    // ─────────────────────────────────────────────
    const filterBtns   = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const show = filterValue === 'all' || item.classList.contains(filterValue);
                if (show) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.45s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // ─────────────────────────────────────────────
    // 2. TESTIMONIALS SLIDER (arrow navigation)
    // ─────────────────────────────────────────────
    const bubbles   = document.querySelectorAll('.bubble');
    const dots      = document.querySelectorAll('.dot');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow= document.querySelector('.right-arrow');

    // Extra testimonials data (shown when navigating)
    const extraTestimonials = [
        {
            text: '"A wonderland for kids! Our children never want to leave. The variety of activities keeps them busy all day."',
            name: '- Fatima Z.',
            color: 'bg-nav-green',
            colorClass: '#9bf3d0'
        },
        {
            text: '"Great staff, clean facilities, and tons of fun. My kids made so many friends here at Kids Village!"',
            name: '- Youssef A.',
            color: 'bg-nav-yellow',
            colorClass: '#ffe97d'
        }
    ];

    let currentSlide = 0;
    const totalSlides = dots.length;

    function goToSlide(index) {
        currentSlide = (index + totalSlides) % totalSlides;

        dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));

        // Animate bubbles out then in
        bubbles.forEach(b => {
            b.style.opacity = '0';
            b.style.transform = 'translateY(10px)';
        });

        setTimeout(() => {
            if (currentSlide === 0) {
                // Restore default
                const pinkBubble = bubbles[0];
                const blueBubble = bubbles[1];
                if (pinkBubble && blueBubble) {
                    pinkBubble.style.backgroundColor = '#ffb7d5';
                    blueBubble.style.backgroundColor = '#9ee0fc';
                }
            } else if (currentSlide < extraTestimonials.length + 1) {
                const ex1 = extraTestimonials[(currentSlide - 1) * 2] || extraTestimonials[0];
                const ex2 = extraTestimonials[(currentSlide - 1) * 2 + 1] || extraTestimonials[1];
                if (bubbles[0] && ex1) bubbles[0].style.backgroundColor = ex1.colorClass;
                if (bubbles[1] && ex2) bubbles[1].style.backgroundColor = ex2.colorClass;
            }

            bubbles.forEach(b => {
                b.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                b.style.opacity = '1';
                b.style.transform = 'translateY(0)';
            });
        }, 200);
    }

    if (leftArrow)  leftArrow.addEventListener('click',  () => goToSlide(currentSlide - 1));
    if (rightArrow) rightArrow.addEventListener('click', () => goToSlide(currentSlide + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

    // Auto-slide every 5 seconds
    setInterval(() => goToSlide(currentSlide + 1), 5000);

    // ─────────────────────────────────────────────
    // 3. MOBILE MENU TOGGLE
    // ─────────────────────────────────────────────
    const mobileMenuIcon = document.querySelector('.mobile-toggle');
    const mobileNav     = document.querySelector('.mobile-nav-menu');

    if (mobileMenuIcon && mobileNav) {
        mobileMenuIcon.addEventListener('click', () => {
            const isHidden = mobileNav.style.display === 'none' || mobileNav.style.display === '';

            if (isHidden) {
                mobileNav.style.display = 'flex';
                // Trigger animation in next frame
                setTimeout(() => {
                    mobileNav.classList.add('open');
                }, 10);
            } else {
                mobileNav.classList.remove('open');
                setTimeout(() => {
                    mobileNav.style.display = 'none';
                }, 300); // Matches transition duration
            }
        });

        // Close menu on link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                setTimeout(() => {
                    mobileNav.style.display = 'none';
                }, 300);
            });
        });
    }

    // ─────────────────────────────────────────────
    // 4. SCROLL REVEAL — fade-in sections on scroll
    // ─────────────────────────────────────────────
    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('reveal-on-scroll');
        revealObserver.observe(section);
    });

});
