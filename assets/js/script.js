// CUSTOM CURSOR SYSTEM
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

// Create custom cursor elements
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);

    const follower = document.createElement('div');
    follower.className = 'cursor-follower';
    document.body.appendChild(follower);

    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate cursors
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.3;
        cursorY += (mouseY - cursorY) * 0.3;
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .portfolio-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            follower.style.transform = 'scale(2)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            follower.style.transform = 'scale(1)';
        });
    });
});

// PARTICLES SYSTEM
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    document.body.appendChild(particlesContainer);

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random starting position
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        
        // Random colors
        const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#f093fb'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        particlesContainer.appendChild(particle);

        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 25000);
    }

    // Create particles periodically
    setInterval(createParticle, 300);
    
    // Create initial batch
    for (let i = 0; i < 10; i++) {
        setTimeout(createParticle, i * 200);
    }
}

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const sections = document.querySelectorAll('section');

// Mobile Navigation with enhanced animations
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    navLinks.forEach((link, index) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        
        // Staggered animation for mobile menu
        link.style.animationDelay = `${index * 0.1}s`;
    });
}

// Enhanced smooth scrolling with easing
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 100;
            
            // Custom smooth scroll with easing
            const startPosition = window.pageYOffset;
            const distance = offsetTop - startPosition;
            const duration = 1200;
            let start = null;
            
            function easeInOutQuart(t) {
                return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
            }
            
            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const progress = Math.min(timeElapsed / duration, 1);
                const ease = easeInOutQuart(progress);
                
                window.scrollTo(0, startPosition + distance * ease);
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }
            
            requestAnimationFrame(animation);
        }
    });
});

// Advanced parallax system
let lastScrollY = 0;
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    // Floating shapes parallax
    const shapes = document.querySelectorAll('.floating-shape');
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.15;
        const yPos = -(scrolled * speed);
        const rotate = scrolled * 0.05;
        shape.style.transform = `translate3d(0, ${yPos}px, 0) rotate(${rotate}deg)`;
    });
    
    // Background parallax
    const backgroundAnimation = document.querySelector('.background-animation');
    if (backgroundAnimation) {
        backgroundAnimation.style.transform = `translate3d(0, ${rate}px, 0)`;
    }
    
    // Navbar blur effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const opacity = Math.min(scrolled / 100, 1);
        navbar.style.background = `rgba(10, 10, 10, ${0.3 + opacity * 0.5})`;
        navbar.style.backdropFilter = `blur(${20 + scrolled * 0.1}px)`;
    }
    
    lastScrollY = scrolled;
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Staggered animations for grids
            if (entry.target.closest('.services-grid') || entry.target.closest('.portfolio-grid')) {
                const siblings = entry.target.parentElement.children;
                Array.from(siblings).forEach((sibling, index) => {
                    setTimeout(() => {
                        sibling.classList.add('visible');
                    }, index * 200);
                });
            }
        }
    });
}, observerOptions);

// Enhanced typing animation
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            
            // Add cursor effect
            element.innerHTML += '<span class="typing-cursor">|</span>';
            
            setTimeout(() => {
                element.innerHTML = element.innerHTML.slice(0, -1);
                i++;
                type();
            }, speed);
        } else {
            // Remove cursor after typing is done
            setTimeout(() => {
                element.innerHTML = element.innerHTML.replace('<span class="typing-cursor">|</span>', '');
            }, 1000);
        }
    }
    
    type();
}

// 3D tilt effect for cards
function addTiltEffect(element) {
    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 8;
        const rotateY = (centerX - x) / 8;
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
}

// Magnetic button effect
function addMagneticEffect(button) {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0px, 0px)';
    });
}

// Initialize all effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create particles
    createParticles();
    
    // Add fade-in observer to elements
    const animatedElements = document.querySelectorAll(
        '.service-card, .portfolio-item, .contact-info, .glass-form, .hero-visual, .section-title'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Add tilt effect to cards
    const tiltElements = document.querySelectorAll('.service-card, .portfolio-item, .glass-form');
    tiltElements.forEach(addTiltEffect);
    
    // Add magnetic effect to buttons
    const magneticButtons = document.querySelectorAll('.btn, .portfolio-btn, .social-link');
    magneticButtons.forEach(addMagneticEffect);
    
    // Initialize typing animation
    setTimeout(() => {
        const subtitle = document.querySelector('.hero-subtitle');
        if (subtitle) {
            const originalText = subtitle.textContent;
            typeWriter(subtitle, originalText, 40);
        }
    }, 2000);
    
    // Add CSS for typing cursor
    const style = document.createElement('style');
    style.textContent = `
        .typing-cursor {
            animation: blink 1s infinite;
            color: #6366f1;
        }
        
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});

// Enhanced form handling
const contactForm = document.querySelector('.glass-form');
if (contactForm) {
    const formInputs = contactForm.querySelectorAll('input, textarea');
    
    // Enhanced input animations
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
            
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: ripple 0.6s linear;
                pointer-events: none;
                z-index: 0;
            `;
            
            input.parentElement.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
        
        input.addEventListener('blur', () => {
            if (input.value === '') {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // Real-time validation visual feedback
        input.addEventListener('input', () => {
            if (input.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(input.value)) {
                    input.style.borderColor = '#10b981';
                    input.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.3)';
                } else if (input.value !== '') {
                    input.style.borderColor = '#ef4444';
                    input.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.3)';
                }
            }
        });
    });
    
    // Add ripple animation CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                width: 200px;
                height: 200px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // Enhanced form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.btn-primary');
        const originalText = submitBtn.innerHTML;
        
        // Success animation
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Invio in corso...';
        submitBtn.disabled = true;
        submitBtn.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
        
        // Simulate form submission with enhanced feedback
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Messaggio Inviato!';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            // Add success particle effect
            createSuccessParticles(submitBtn);
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                contactForm.reset();
                
                // Reset form field styles
                formInputs.forEach(input => {
                    input.parentElement.classList.remove('focused');
                    input.style.borderColor = '';
                    input.style.boxShadow = '';
                });
            }, 3000);
        }, 2500);
    });
}

// Success particles for form submission
function createSuccessParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: #10b981;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${centerX}px;
            top: ${centerY}px;
        `;
        
        document.body.appendChild(particle);
        
        // Animate particle
        const angle = (Math.PI * 2 * i) / 15;
        const velocity = 100 + Math.random() * 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let x = 0;
        let y = 0;
        let opacity = 1;
        
        function animateParticle() {
            x += vx * 0.02;
            y += vy * 0.02 + 2; // gravity
            opacity -= 0.02;
            
            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animateParticle);
            } else {
                document.body.removeChild(particle);
            }
        }
        
        requestAnimationFrame(animateParticle);
    }
}

// Audio feedback system (optional)
function playInteractionSound(frequency = 800, duration = 100) {
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    }
}

// Add sound to interactions
document.addEventListener('DOMContentLoaded', () => {
    const interactiveElements = document.querySelectorAll('.btn, .nav-menu a, .social-link');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            playInteractionSound(1000, 50);
        });
    });
});

// Matrix rain effect for background (Easter egg)
function createMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -2;
        opacity: 0.1;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#6366f1';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = characters[Math.floor(Math.random() * characters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 50);
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Konami Code Easter Egg - Enhanced
let konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.keyCode === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateUltimateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateUltimateEasterEgg() {
    // Play achievement sound
    playInteractionSound(523, 200);
    setTimeout(() => playInteractionSound(659, 200), 100);
    setTimeout(() => playInteractionSound(784, 300), 200);
    
    // Create notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        padding: 2rem 3rem;
        border-radius: 20px;
        font-size: 1.5rem;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 20px 60px rgba(99, 102, 241, 0.6);
        animation: easterEggPop 3s ease-in-out;
        text-align: center;
    `;
    notification.innerHTML = `
        🎉 KONAMI CODE ACTIVATED! 🎉<br>
        <span style="font-size: 1rem; opacity: 0.9;">Ultimate Developer Mode Unlocked</span>
    `;
    
    document.body.appendChild(notification);
    
    // Add animation CSS
    const easterEggStyle = document.createElement('style');
    easterEggStyle.textContent = `
        @keyframes easterEggPop {
            0% { transform: translate(-50%, -50%) scale(0) rotate(180deg); opacity: 0; }
            20% { transform: translate(-50%, -50%) scale(1.2) rotate(0deg); opacity: 1; }
            80% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(0) rotate(-180deg); opacity: 0; }
        }
        
        @keyframes rainbow-pulse {
            0% { filter: hue-rotate(0deg) brightness(1); }
            25% { filter: hue-rotate(90deg) brightness(1.2); }
            50% { filter: hue-rotate(180deg) brightness(1.4); }
            75% { filter: hue-rotate(270deg) brightness(1.2); }
            100% { filter: hue-rotate(360deg) brightness(1); }
        }
        
        @keyframes disco-bg {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;
    document.head.appendChild(easterEggStyle);
    
    // Rainbow effects
    const shapes = document.querySelectorAll('.floating-shape');
    shapes.forEach(shape => {
        shape.style.animation = 'float-extreme 3s infinite ease-in-out, rainbow-pulse 2s infinite';
        shape.style.filter = 'blur(40px) brightness(1.5)';
    });
    
    // Background disco effect
    const backgroundAnimation = document.querySelector('.background-animation');
    if (backgroundAnimation) {
        backgroundAnimation.style.background = `
            linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f093fb, #f5576c, #4facfe),
            radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)
        `;
        backgroundAnimation.style.backgroundSize = '400% 400%, 20px 20px';
        backgroundAnimation.style.animation = 'disco-bg 2s ease-in-out infinite';
    }
    
    // Matrix rain effect
    createMatrixRain();
    
    // Particle explosion
    createMegaParticleExplosion();
    
    // Reset after 10 seconds
    setTimeout(() => {
        document.body.removeChild(notification);
        document.head.removeChild(easterEggStyle);
        
        shapes.forEach(shape => {
            shape.style.animation = 'float-extreme 25s infinite ease-in-out';
            shape.style.filter = 'blur(60px)';
        });
        
        if (backgroundAnimation) {
            backgroundAnimation.style.background = '';
            backgroundAnimation.style.backgroundSize = '';
            backgroundAnimation.style.animation = 'background-shift 20s ease-in-out infinite';
        }
        
        // Remove matrix canvas
        const matrixCanvas = document.querySelector('canvas');
        if (matrixCanvas) {
            document.body.removeChild(matrixCanvas);
        }
    }, 10000);
}

function createMegaParticleExplosion() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f093fb', '#f5576c', '#4facfe', '#43e97b', '#38f9d7'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: ${Math.random() * 8 + 4}px;
                height: ${Math.random() * 8 + 4}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: 50%;
                top: 50%;
                box-shadow: 0 0 20px currentColor;
            `;
            
            document.body.appendChild(particle);
            
            const angle = (Math.PI * 2 * Math.random());
            const velocity = Math.random() * 300 + 100;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let x = 0;
            let y = 0;
            let opacity = 1;
            let scale = 1;
            
            function animateExplosionParticle() {
                x += vx * 0.02;
                y += vy * 0.02 + 1;
                opacity -= 0.01;
                scale += 0.02;
                
                particle.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
                particle.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animateExplosionParticle);
                } else {
                    if (particle.parentNode) {
                        document.body.removeChild(particle);
                    }
                }
            }
            
            requestAnimationFrame(animateExplosionParticle);
        }, i * 20);
    }
}

// Performance monitoring
let frameCount = 0;
let lastTime = performance.now();

function monitorPerformance() {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // Adjust effects based on performance
        if (fps < 30) {
            // Reduce particle count and effects for better performance
            const particles = document.querySelectorAll('.particle');
            particles.forEach((particle, index) => {
                if (index % 2 === 0) {
                    particle.style.display = 'none';
                }
            });
        }
        
        frameCount = 0;
        lastTime = currentTime;
    }
    
    requestAnimationFrame(monitorPerformance);
}

// Start performance monitoring
monitorPerformance();

// Advanced loading screen
window.addEventListener('load', () => {
    const loader = document.createElement('div');
    loader.className = 'ultimate-loader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0a0a0a, #1a1a2e, #16213e);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: all 0.8s ease;
    `;
    
    const loaderContent = document.createElement('div');
    loaderContent.innerHTML = `
        <div style="text-align: center; position: relative;">
            <div style="font-size: 3rem; margin-bottom: 2rem; background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 800;">
                <span style="display: inline-block; animation: bounce 1s infinite;">S</span>
                <span style="display: inline-block; animation: bounce 1s infinite 0.1s;">i</span>
                <span style="display: inline-block; animation: bounce 1s infinite 0.2s;">l</span>
                <span style="display: inline-block; animation: bounce 1s infinite 0.3s;">v</span>
                <span style="display: inline-block; animation: bounce 1s infinite 0.4s;">e</span>
                <span style="display: inline-block; animation: bounce 1s infinite 0.5s;">r</span>
                <span style="display: inline-block; animation: bounce 1s infinite 0.6s; color: #8b5cf6;">S</span>
                <span style="display: inline-block; animation: bounce 1s infinite 0.7s; color: #8b5cf6;">t</span>
                <span style="display: inline-block; animation: bounce 1s infinite 0.8s; color: #8b5cf6;">u</span>
                <span style="display: inline-block; animation: bounce 1s infinite 0.9s; color: #8b5cf6;">d</span>
                <span style="display: inline-block; animation: bounce 1s infinite 1s; color: #8b5cf6;">i</span>
                <span style="display: inline-block; animation: bounce 1s infinite 1.1s; color: #8b5cf6;">o</span>
            </div>
            <div style="width: 200px; height: 4px; background: rgba(99, 102, 241, 0.2); border-radius: 2px; margin: 0 auto; overflow: hidden;">
                <div style="width: 0; height: 100%; background: linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4); border-radius: 2px; animation: loading-bar 2s ease-in-out; box-shadow: 0 0 20px rgba(99, 102, 241, 0.6);"></div>
            </div>
            <div style="margin-top: 2rem; color: rgba(255, 255, 255, 0.7); font-size: 1.1rem; animation: pulse 2s infinite;">
                Caricamento esperienza immersiva...
            </div>
        </div>
    `;
    
    loader.appendChild(loaderContent);
    
    const loadingStyle = document.createElement('style');
    loadingStyle.textContent = `
        @keyframes loading-bar {
            0% { width: 0%; }
            100% { width: 100%; }
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
        }
    `;
    document.head.appendChild(loadingStyle);
    
    document.body.appendChild(loader);
    
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            if (loader.parentNode) {
                document.body.removeChild(loader);
            }
            if (loadingStyle.parentNode) {
                document.head.removeChild(loadingStyle);
            }
        }, 800);
    }, 2500);
});

});

// Export functions for external use
window.SilverStudio = {
    createParticles,
    playInteractionSound,
    addTiltEffect,
    addMagneticEffect,
    createSuccessParticles
};
