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

    // Extra testimonials data (fetched from Google Maps)
    const allTestimonials = [
        {
            name: "Sarah Sarah",
            text: '"Excellente rapport qualité/prix. 50 dhs l\'entrée pour une heure. L\'endroit est propre et le personnel est très sympathique."',
            color: "#ffb7d5"
        },
        {
            name: "Coralie Sakili",
            text: '"Super expérience pour les enfants. Très bien encadré, propre et avec un super espace de jeux. Recommande vivement !"',
            color: "#9ee0fc"
        },
        {
            name: "Ahmad Hasnaoui",
            text: '"باش يبقى ولدك او ابنتك في أمن و أمان كيدز ڤيلاج أحسن مكان... البنات كاملين متمكنات من العمل بالتوفيق"',
            color: "#b7e4c7"
        },
        {
            name: "Queen J lifestyle",
            text: '"تجربة رائعة، قضت ابنتي أجمل أيامها هناك. كنت أتركها لساعتين أو ست ساعات، وكانت في غاية السعادة."',
            color: "#ffe97d"
        },
        {
            name: "Jordan",
            text: '"Great place. The nicest soft play I’ve seen in Tangier. The price is affordable and they have very kind staff."',
            color: "#ffb57b"
        },
        {
            name: "Khouloud Founoune",
            text: '"Weladi ki7ma9o 3la village kids o kiret7o tmak. Best place for kids in Tangier!"',
            color: "#ffcbf2"
        }
    ];

    let currentSlide = 0;
    const slidesPerView = window.innerWidth > 768 ? 2 : 1;
    const totalSlides = Math.ceil(allTestimonials.length / slidesPerView);

    function updateBubbles() {
        const startIndex = currentSlide * slidesPerView;
        
        bubbles.forEach((bubble, i) => {
            const data = allTestimonials[startIndex + i];
            if (data) {
                bubble.style.display = 'block';
                bubble.querySelector('p').textContent = data.text;
                bubble.querySelector('span').textContent = `- ${data.name}`;
                bubble.style.backgroundColor = data.color;
            } else {
                bubble.style.display = 'none';
            }
        });
    }

    function goToSlide(index) {
        currentSlide = (index + totalSlides) % totalSlides;

        dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));

        // Animate bubbles out then in
        bubbles.forEach(b => {
            b.style.opacity = '0';
            b.style.transform = 'translateY(10px)';
        });

        setTimeout(() => {
            updateBubbles();

            bubbles.forEach(b => {
                b.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                b.style.opacity = '1';
                b.style.transform = 'translateY(0)';
            });
        }, 200);
    }

    if (leftArrow)  leftArrow.addEventListener('click',  () => goToSlide(currentSlide - 1));
    if (rightArrow) rightArrow.addEventListener('click', () => goToSlide(currentSlide + 1));
    
    // Initial setup
    function setupSlider() {
        const slidesPerView = window.innerWidth > 768 ? 2 : 1;
        const totalSlidesNeeded = Math.ceil(allTestimonials.length / slidesPerView);
        
        dots.forEach((dot, i) => {
            if (i < totalSlidesNeeded) {
                dot.style.display = 'block';
                dot.onclick = () => goToSlide(i);
            } else {
                dot.style.display = 'none';
            }
        });
        
        updateBubbles();
    }

    window.addEventListener('resize', setupSlider);
    setupSlider();

    // Auto-slide every 6 seconds
    setInterval(() => goToSlide(currentSlide + 1), 6000);

    // ─────────────────────────────────────────────
    // 3. MOBILE MENU TOGGLE
    // ─────────────────────────────────────────────
    const mobileMenuIcon = document.querySelector('.mobile-toggle');
    const mobileNav     = document.querySelector('.mobile-nav-menu');

    if (mobileMenuIcon && mobileNav) {
        mobileMenuIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileNav.classList.toggle('open');
        });

        // Close menu on link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileNav.contains(e.target) && !mobileMenuIcon.contains(e.target)) {
                mobileNav.classList.remove('open');
            }
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
