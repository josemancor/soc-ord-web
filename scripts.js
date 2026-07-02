// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70, // offset for fixed navbar
                behavior: 'smooth'
            });
        }
    });
});

// Parallax effect for the hero particles background
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const particlesBg = document.getElementById('particles-bg');
    
    if (particlesBg && scrollY < window.innerHeight) {
        particlesBg.style.transform = `translateY(${scrollY * 0.4}px)`;
        particlesBg.style.opacity = 1 - (scrollY / window.innerHeight);
    }
});

// Simple intersection observer to animate elements fading in
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .showcase-item, .manual-content').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Video placeholder interaction (for future videos)
document.getElementById('video-overlay-1')?.addEventListener('click', function() {
    // If user adds a real video later, this will hide the overlay and play the video
    const video = this.previousElementSibling;
    if (video && video.tagName === 'VIDEO') {
        this.style.display = 'none';
        video.style.display = 'block';
        video.play().catch(e => {
            console.log("Video source not found or playback prevented.", e);
            this.style.display = 'flex'; // show overlay again if it fails
            video.style.display = 'none';
        });
    }
});

// Lightbox logic
document.addEventListener('DOMContentLoaded', () => {
    // Create lightbox HTML and inject it
    const lightboxHtml = `
        <div id="lightbox" class="lightbox">
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-content" id="lightbox-img" src="" alt="Ampliada">
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHtml);

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');

    // Make gallery images and showcase videos clickable
    document.querySelectorAll('.gallery-img, .image-placeholder img, video').forEach(media => {
        media.classList.add('clickable-media');
        media.addEventListener('click', function(e) {
            // only handle images for now (videos have controls)
            if (this.tagName === 'IMG') {
                lightbox.classList.add('active');
                lightboxImg.src = this.src;
            }
        });
    });

    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) {
            lightbox.classList.remove('active');
        }
    });
});

// Toggle profundizacion sections (Accordions)
window.toggleProf = function(id) {
    const targetSection = document.getElementById(id);
    const allSections = document.querySelectorAll('.prof-section');
    
    // Check if the target is already visible
    const isVisible = targetSection.style.display === 'block';
    
    // Hide all sections first to prevent joint deployment
    allSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // If it wasn't visible before, show it and scroll to it
    if (!isVisible) {
        targetSection.style.display = 'block';
        window.scrollTo({
            top: targetSection.offsetTop - 80, // Offset for navbar
            behavior: 'smooth'
        });
    } else {
        // If it was visible, it's now hidden. Scroll back up to the cards.
        const engineeringSection = targetSection.previousElementSibling;
        window.scrollTo({
            top: engineeringSection ? engineeringSection.offsetTop - 50 : 0,
            behavior: 'smooth'
        });
    }
};
