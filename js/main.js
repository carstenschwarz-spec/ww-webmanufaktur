/* ============================================
   COIFFEUR LAVIE - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initPreloader();
    initNavigation();
    initScrollEffects();
    initAnimations();
    initTestimonials();
    initBackToTop();
    initCounters();
    initParallax();
    initProductShowcase();
    initHeroVideoSlideshow();
});

/* Hero Video Slideshow */
function initHeroVideoSlideshow() {
    const videos = document.querySelectorAll('.hero-video');
    if (videos.length === 0) return;

    let currentIndex = 0;
    const transitionDuration = 6000; // 6 seconds per video

    // Start all videos (muted for autoplay)
    videos.forEach(video => {
        video.play().catch(e => console.log('Video autoplay blocked:', e));
    });

    // Function to switch to next video
    function switchVideo() {
        // Remove active class from current video
        videos[currentIndex].classList.remove('active');

        // Move to next video
        currentIndex = (currentIndex + 1) % videos.length;

        // Add active class to new video
        videos[currentIndex].classList.add('active');

        // Reset and play the new video
        videos[currentIndex].currentTime = 0;
        videos[currentIndex].play().catch(e => console.log('Video play error:', e));
    }

    // Switch videos at interval
    setInterval(switchVideo, transitionDuration);

    // Pause videos when not visible (performance)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                videos.forEach(video => video.play().catch(() => {}));
            } else {
                videos.forEach(video => video.pause());
            }
        });
    }, { threshold: 0.3 });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        observer.observe(heroSection);
    }
}

/* Preloader */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                preloader.classList.add('hidden');
            }, 500);
        });
    }
}

/* Navigation */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect for navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    });
}

/* Scroll Effects */
function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/* Animations (AOS-like) */
function initAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/* Testimonials Slider */
function initTestimonials() {
    const track = document.querySelector('.testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    const dotsContainer = document.querySelector('.testimonial-dots');

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    const totalSlides = cards.length;

    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.testimonial-dots .dot');

    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Auto-play
    let autoPlay = setInterval(nextSlide, 5000);

    track.addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.addEventListener('mouseleave', () => {
        autoPlay = setInterval(nextSlide, 5000);
    });

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) nextSlide();
        if (touchEndX - touchStartX > 50) prevSlide();
    });
}

/* Counter Animation */
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

/* Parallax Effect */
function initParallax() {
    const parallaxBgs = document.querySelectorAll('.about-parallax-bg');

    if (parallaxBgs.length === 0) return;

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;

        parallaxBgs.forEach(bg => {
            const section = bg.parentElement;
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrolled > sectionTop - window.innerHeight && scrolled < sectionTop + sectionHeight) {
                const yPos = (scrolled - sectionTop) * 0.3;
                bg.style.transform = `translateY(${yPos}px)`;
            }
        });
    });
}

/* Product Showcase - Interactive Selection */
function initProductShowcase() {
    const productThumbs = document.querySelectorAll('.product-thumb');
    const featuredImg = document.getElementById('featuredImg');
    const featuredTitle = document.getElementById('featuredTitle');
    const featuredCategory = document.getElementById('featuredCategory');
    const featuredDesc = document.getElementById('featuredDesc');
    const featuredPrice = document.getElementById('featuredPrice');
    const featuredBadge = document.getElementById('featuredBadge');

    if (!featuredImg || productThumbs.length === 0) return;

    productThumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Remove active class from all thumbs
            productThumbs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked thumb
            this.classList.add('active');

            // Get data attributes
            const imgSrc = this.getAttribute('data-img');
            const title = this.getAttribute('data-title');
            const category = this.getAttribute('data-category');
            const desc = this.getAttribute('data-desc');
            const price = this.getAttribute('data-price');
            const badge = this.getAttribute('data-badge');

            // Animate out
            featuredImg.style.opacity = '0';
            featuredImg.style.transform = 'scale(1.05)';

            // Update content after short delay
            setTimeout(() => {
                featuredImg.src = imgSrc;
                featuredImg.alt = title;
                featuredTitle.textContent = title;
                featuredCategory.textContent = category;
                featuredDesc.textContent = desc;
                featuredPrice.textContent = price;
                featuredBadge.textContent = badge || '';

                // Animate in
                featuredImg.style.opacity = '1';
                featuredImg.style.transform = 'scale(1)';
            }, 200);
        });
    });
}

/* Back to Top */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/* Newsletter Form */
const newsletterForms = document.querySelectorAll('.newsletter-form');
newsletterForms.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;

        // Simulate API call
        console.log('Newsletter subscription:', email);

        // Show success
        this.querySelector('input').value = '';
        alert('Vielen Dank für Ihre Anmeldung!');
    });
});

/* Utility Functions */
function formatCurrency(amount) {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

function formatTime(hours, minutes) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Export utilities for other scripts
window.LaVieUtils = {
    formatCurrency,
    formatDate,
    formatTime
};
