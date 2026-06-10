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

// ══════════════════════════════════════════════════════════════════
// 5. BOOKING / INSCRIPTION FORM — Google Sheets Integration
// ══════════════════════════════════════════════════════════════════
// Ce code envoie les données du formulaire #book à Google Sheets
// via Google Apps Script (même URL que github-pages/index.html)
// Flow: Ce formulaire → Google Apps Script → Google Sheets → Laravel Import
// ══════════════════════════════════════════════════════════════════

// Google Apps Script Web App URL (même URL que le formulaire GitHub Pages)
const BOOKING_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxCtaYu0Uk81Z9nqEp37h3gZO_Vqpz5A6KQmq-HNSQbg5LbOyBFnpXOfnZFc6BDZOdJ/exec';

let childCount = 1;

// Ajouter un enfant supplémentaire (max 3)
function addChild() {
    if (childCount >= 3) return;
    childCount++;

    const container = document.getElementById('childrenContainer');
    const block = document.createElement('div');
    block.className = 'child-block';
    block.setAttribute('data-child', childCount);
    block.innerHTML = `
        <div class="child-label font-fredoka">
            <i class="fa-solid fa-child text-green-500"></i> Enfant #${childCount}
            <button type="button" onclick="removeChild(this)" 
                style="margin-left:auto;color:#ef4444;font-size:14px;background:none;border:none;cursor:pointer;">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
        <div class="book-grid">
            <div class="book-field">
                <label class="book-label">Prénom <span class="text-red-400">*</span></label>
                <input type="text" data-field="first_name" required placeholder="Prénom" class="book-input">
            </div>
            <div class="book-field">
                <label class="book-label">Nom <span class="text-red-400">*</span></label>
                <input type="text" data-field="last_name" required placeholder="Nom de famille" class="book-input">
            </div>
            <div class="book-field">
                <label class="book-label">Date de naissance</label>
                <input type="date" data-field="date_of_birth" class="book-input">
            </div>
            <div class="book-field">
                <label class="book-label">École</label>
                <input type="text" data-field="school_name" placeholder="Nom de l'école" class="book-input">
            </div>
            <div class="book-field col-span-full">
                <label class="book-label">Allergies / Notes médicales</label>
                <input type="text" data-field="allergies" placeholder="Aucune allergie connue" class="book-input">
            </div>
        </div>
    `;
    container.appendChild(block);

    if (childCount >= 3) {
        document.getElementById('addChildBtn').style.display = 'none';
    }
}

// Supprimer un enfant
function removeChild(btn) {
    btn.closest('.child-block').remove();
    childCount--;
    document.getElementById('addChildBtn').style.display = 'flex';
    // Renumber children
    document.querySelectorAll('#childrenContainer .child-block').forEach((block, i) => {
        block.setAttribute('data-child', i + 1);
        block.querySelector('.child-label').innerHTML = `
            <i class="fa-solid fa-child text-green-500"></i> Enfant #${i + 1}
            ${i > 0 ? `<button type="button" onclick="removeChild(this)" 
                style="margin-left:auto;color:#ef4444;font-size:14px;background:none;border:none;cursor:pointer;">
                <i class="fa-solid fa-trash"></i></button>` : ''}
        `;
    });
}

// Collecter les données des enfants
function collectBookingChildren() {
    const children = [];
    document.querySelectorAll('#childrenContainer .child-block').forEach(block => {
        const child = {};
        block.querySelectorAll('[data-field]').forEach(input => {
            child[input.getAttribute('data-field')] = input.value.trim();
        });
        if (child.first_name || child.last_name) {
            children.push(child);
        }
    });
    return children;
}

// Soumettre le formulaire → Google Sheets
async function handleBookingSubmit(e) {
    e.preventDefault();

    const btn = document.getElementById('bookSubmitBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours...';

    // Collecter toutes les données
    const data = {
        timestamp: new Date().toLocaleString('fr-FR'),
        father_name: document.getElementById('b_father_name').value.trim(),
        mother_name: document.getElementById('b_mother_name').value.trim(),
        phone: document.getElementById('b_phone').value.trim(),
        emergency_phone: document.getElementById('b_emergency_phone').value.trim(),
        email: document.getElementById('b_email').value.trim(),
        cin: document.getElementById('b_cin').value.trim(),
        address: document.getElementById('b_address').value.trim(),
        father_job: document.getElementById('b_father_job').value.trim(),
        father_work_place: document.getElementById('b_father_work_place').value.trim(),
        mother_job: document.getElementById('b_mother_job').value.trim(),
        mother_work_place: document.getElementById('b_mother_work_place').value.trim(),
        source: 'Inscription en ligne',
        children: collectBookingChildren()
    };

    try {
        // Envoyer à Google Apps Script (même URL que GitHub Pages)
        await fetch(BOOKING_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        // Afficher le message de succès
        document.getElementById('bookingForm').style.display = 'none';
        document.getElementById('bookingSuccess').classList.remove('hidden');

        // Scroll to success message
        document.getElementById('bookingSuccess').scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
        alert('Erreur lors de l\'envoi. Veuillez réessayer.');
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Soumettre l\'inscription';
    }
}

// Réinitialiser le formulaire
function resetBookingForm() {
    document.getElementById('bookingForm').reset();
    document.getElementById('bookingForm').style.display = 'block';
    document.getElementById('bookingSuccess').classList.add('hidden');

    const btn = document.getElementById('bookSubmitBtn');
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Soumettre l\'inscription';

    // Reset children to just one
    const container = document.getElementById('childrenContainer');
    const blocks = container.querySelectorAll('.child-block');
    blocks.forEach((block, i) => { if (i > 0) block.remove(); });
    childCount = 1;
    document.getElementById('addChildBtn').style.display = 'flex';

    // Scroll back to form
    document.getElementById('book').scrollIntoView({ behavior: 'smooth' });
}
