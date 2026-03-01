// ============================================
// KRÉOLYSE — SITE DE PRÉSENTATION
// Three.js 3D + Mots flottants + Interactions
// ============================================

// -----------------------------------------
// 1. THÈME CLAIR / SOMBRE
// -----------------------------------------
const themeToggleBtn = document.getElementById('theme-toggle');
const root = document.documentElement;
let isDark = true;

themeToggleBtn.addEventListener('click', () => {
    isDark = !isDark;
    if (isDark) {
        root.setAttribute('data-theme', 'dark');
        themeToggleBtn.querySelector('.theme-icon').textContent = '☀️';
        switchToDarkMode3D();
    } else {
        root.setAttribute('data-theme', 'light');
        themeToggleBtn.querySelector('.theme-icon').textContent = '🌙';
        switchToLightMode3D();
    }
});

// -----------------------------------------
// 2. THREE.JS — PARTICULES & ANNEAUX
//    Protégé par try/catch : si WebGL échoue,
//    le reste du site fonctionne normalement.
// -----------------------------------------
let webglOK = false;
let scene, camera, renderer, particles, particlesMaterial;
let ring, ringMaterial, ring2, ring2Material;
let ambientLight, pointLight1, pointLight2;
let clock;

const container = document.getElementById('canvas-container');

try {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 18;
    if (window.innerWidth > 768) camera.position.x = 5;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lumières
    ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    pointLight1 = new THREE.PointLight(0xa16bfe, 2.5);
    pointLight1.position.set(15, 10, 15);
    scene.add(pointLight1);

    pointLight2 = new THREE.PointLight(0x7b5cff, 1.5);
    pointLight2.position.set(-15, -8, 10);
    scene.add(pointLight2);

    // Particules flottantes
    const particlesCount = 600;
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
        posArray[i * 3] = (Math.random() - 0.5) * 60;
        posArray[i * 3 + 1] = (Math.random() - 0.5) * 60;
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    particlesMaterial = new THREE.PointsMaterial({
        size: 0.06,
        color: 0xa16bfe,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
    });

    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Anneau orbital 1
    const ringGeometry = new THREE.TorusGeometry(7, 0.04, 16, 200);
    ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xa16bfe,
        transparent: true,
        opacity: 0.15,
    });
    ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI * 0.4;
    ring.rotation.y = Math.PI * 0.15;
    scene.add(ring);

    // Anneau orbital 2
    const ring2Geometry = new THREE.TorusGeometry(9, 0.03, 16, 200);
    ring2Material = new THREE.MeshBasicMaterial({
        color: 0x7b5cff,
        transparent: true,
        opacity: 0.08,
    });
    ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
    ring2.rotation.x = Math.PI * 0.6;
    ring2.rotation.y = -Math.PI * 0.2;
    scene.add(ring2);

    clock = new THREE.Clock();
    webglOK = true;

} catch (e) {
    console.warn('WebGL non disponible — le site fonctionne sans fond 3D.', e);
}

// Transitions 3D thème
function switchToLightMode3D() {
    if (!webglOK) return;
    particlesMaterial.color.setHex(0x6c3cdf);
    particlesMaterial.opacity = 0.25;
    ringMaterial.color.setHex(0x6c3cdf);
    ringMaterial.opacity = 0.1;
    ring2Material.color.setHex(0x5a2ed6);
    pointLight1.color.setHex(0x6c3cdf);
    pointLight1.intensity = 2;
    pointLight2.color.setHex(0xfbc531);
    pointLight2.intensity = 1;
    ambientLight.intensity = 0.6;
}

function switchToDarkMode3D() {
    if (!webglOK) return;
    particlesMaterial.color.setHex(0xa16bfe);
    particlesMaterial.opacity = 0.5;
    ringMaterial.color.setHex(0xa16bfe);
    ringMaterial.opacity = 0.15;
    ring2Material.color.setHex(0x7b5cff);
    pointLight1.color.setHex(0xa16bfe);
    pointLight1.intensity = 2.5;
    pointLight2.color.setHex(0x7b5cff);
    pointLight2.intensity = 1.5;
    ambientLight.intensity = 0.3;
}

// -----------------------------------------
// 3. MOTS FLOTTANTS FR / CRÉOLE (GAUCHE + DROITE)
// -----------------------------------------
const lexiqueExtraits = [
    { fr: 'Bonjour', cr: 'Bonjou' },
    { fr: 'Soleil', cr: 'Solé' },
    { fr: 'Eau', cr: 'Dilo' },
    { fr: 'Maison', cr: 'Kaz' },
    { fr: 'Manger', cr: 'Manjé' },
    { fr: 'Amour', cr: 'Lanmou' },
    { fr: 'Enfant', cr: 'Timoun' },
    { fr: 'Rivière', cr: 'Larivyè' },
    { fr: 'Poisson', cr: 'Poson' },
    { fr: 'Arbre', cr: 'Pyébwa' },
    { fr: 'Dormir', cr: 'Dronmi' },
    { fr: 'Étoile', cr: 'Zétwèl' },
    { fr: 'Pluie', cr: 'Lapli' },
    { fr: 'Famille', cr: 'Fanmi' },
    { fr: 'Chanter', cr: 'Chanté' },
    { fr: 'Lune', cr: 'Lalin' },
    { fr: 'Oiseau', cr: 'Zozo' },
    { fr: 'Fleur', cr: 'Flèr' },
    { fr: 'Ciel', cr: 'Syèl' },
    { fr: 'Boire', cr: 'Bwè' },
    { fr: 'Danser', cr: 'Dansé' },
    { fr: 'Courir', cr: 'Kouri' },
    { fr: 'Femme', cr: 'Fanm' },
    { fr: 'Homme', cr: 'Wonm' },
    { fr: 'Terre', cr: 'Latè' },
    { fr: 'Frère', cr: 'Frè' },
    { fr: 'Mère', cr: 'Manman' },
    { fr: 'Père', cr: 'Papa' },
    { fr: 'Chien', cr: 'Chyen' },
    { fr: 'Rire', cr: 'Ari' },
    { fr: 'Bébé', cr: 'Tibébé' },
    { fr: 'Jour', cr: 'Jou' },
    { fr: 'Pleurer', cr: 'Pléré' },
];

const containerRight = document.getElementById('floating-words-right');
const containerLeft = document.getElementById('floating-words-left');
const WORDS_PER_SIDE = 6;
let activeWordsRight = [];
let activeWordsLeft = [];

// Positions pré-calculées pour éviter les chevauchements
function generatePositions(count) {
    const positions = [];
    const usedZones = [];
    for (let i = 0; i < count; i++) {
        let x, y, attempts = 0;
        do {
            x = 8 + Math.random() * 75;
            y = 10 + Math.random() * 75;
            attempts++;
        } while (
            attempts < 50 &&
            usedZones.some(z => Math.abs(z.x - x) < 18 && Math.abs(z.y - y) < 14)
        );
        usedZones.push({ x, y });
        positions.push({ x, y });
    }
    return positions;
}

function createFloatingWord(wordPair, position, delay, parentContainer) {
    const el = document.createElement('div');
    el.className = 'floating-word';
    el.innerHTML = `<span class="word-fr">${wordPair.fr}</span><span class="word-arrow">→</span><span class="word-cr">${wordPair.cr}</span>`;

    const rotateX = (Math.random() - 0.5) * 12;
    const rotateY = (Math.random() - 0.5) * 12;
    const translateZ = (Math.random() - 0.5) * 30;
    const scale = 0.55 + Math.random() * 0.4; // Plus petit : 0.55 à 0.95

    el.style.left = position.x + '%';
    el.style.top = position.y + '%';
    el.style.fontSize = `${scale}rem`;

    // Stocker les valeurs initiales pour le scroll
    el.dataset.initX = position.x;
    el.dataset.rotateX = rotateX;
    el.dataset.rotateY = rotateY;
    el.dataset.translateZ = translateZ;
    el.dataset.scale = scale;

    // Transform initiale (sans déplacement scroll)
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale}) translateX(0px)`;

    parentContainer.appendChild(el);
    setTimeout(() => el.classList.add('active'), delay);
    return el;
}

function refreshSide(parentContainer, activeArray, delayOffset) {
    // Fade out
    activeArray.forEach(el => el.classList.remove('active'));

    setTimeout(() => {
        activeArray.forEach(el => el.remove());
        activeArray.length = 0;

        const shuffled = [...lexiqueExtraits].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, WORDS_PER_SIDE);
        const positions = generatePositions(WORDS_PER_SIDE);

        selected.forEach((pair, i) => {
            const el = createFloatingWord(pair, positions[i], delayOffset + i * 150, parentContainer);
            activeArray.push(el);
        });
    }, 800);
}

// Premier affichage
refreshSide(containerRight, activeWordsRight, 0);
setTimeout(() => refreshSide(containerLeft, activeWordsLeft, 0), 2000); // Décalé

// Rotation : droite toutes les 4.5s, gauche toutes les 5.5s (désynchronisé)
setInterval(() => refreshSide(containerRight, activeWordsRight, 0), 4500);
setInterval(() => refreshSide(containerLeft, activeWordsLeft, 0), 5500);

// -----------------------------------------
// 3b. SCROLL → DÉRIVE DES MOTS VERS L'EXTÉRIEUR
// -----------------------------------------
let lastScrollForWords = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const drift = scrollY * 0.15; // Intensité de la dérive
    const fadeStart = 100;  // Début du fade
    const fadeEnd = 600;    // Disparition complète

    // Opacité qui diminue avec le scroll
    const scrollOpacity = Math.max(0, 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart));

    // Droite → dérive vers la droite
    activeWordsRight.forEach(el => {
        const rX = parseFloat(el.dataset.rotateX);
        const rY = parseFloat(el.dataset.rotateY);
        const tZ = parseFloat(el.dataset.translateZ);
        const sc = parseFloat(el.dataset.scale);
        el.style.transform = `perspective(800px) rotateX(${rX}deg) rotateY(${rY}deg) translateZ(${tZ}px) scale(${sc}) translateX(${drift}px)`;
        el.style.opacity = el.classList.contains('active') ? Math.max(0, scrollOpacity) : 0;
    });

    // Gauche → dérive vers la gauche
    activeWordsLeft.forEach(el => {
        const rX = parseFloat(el.dataset.rotateX);
        const rY = parseFloat(el.dataset.rotateY);
        const tZ = parseFloat(el.dataset.translateZ);
        const sc = parseFloat(el.dataset.scale);
        el.style.transform = `perspective(800px) rotateX(${rX}deg) rotateY(${rY}deg) translateZ(${tZ}px) scale(${sc}) translateX(${-drift}px)`;
        el.style.opacity = el.classList.contains('active') ? Math.max(0, scrollOpacity) : 0;
    });

    lastScrollForWords = scrollY;
}, { passive: true });

// -----------------------------------------
// 4. INTERACTION SOURIS (Three.js)
// -----------------------------------------
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2);
    mouseY = (event.clientY - window.innerHeight / 2);
});

// Logo flottant mouse-tracking
const floatingLogo = document.getElementById('floating-logo');
document.addEventListener('mousemove', (event) => {
    if (!floatingLogo) return;
    const x = (event.clientX / window.innerWidth - 0.5) * 10;
    const y = (event.clientY / window.innerHeight - 0.5) * 10;
    floatingLogo.style.transform = `translate(${x}px, ${y}px) scale(1)`;
});

// -----------------------------------------
// 6. PARALLAX SOURIS SUR LES SECTIONS
// -----------------------------------------
const parallaxSections = document.querySelectorAll('.step-card, .quote-card, .cultural-content, .final-cta-content, .hero-badge, .hero-subtitle');

document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5);
    const y = (e.clientY / window.innerHeight - 0.5);

    parallaxSections.forEach(el => {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (!inView) return;

        const depth = 8; // intensité du mouvement
        el.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
    });
});

// -----------------------------------------
// 7. EFFET MAGNÉTIQUE SUR LES BOUTONS
// -----------------------------------------
const magneticElements = document.querySelectorAll('.cta-btn, .nav-cta, #theme-toggle');

magneticElements.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// -----------------------------------------
// 8. 3D CARD TILT EFFECT
// -----------------------------------------
const tiltCards = document.querySelectorAll('[data-tilt]');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / centerY * -8;
        const rotateY = (x - centerX) / centerX * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// -----------------------------------------
// 9. BOUCLE D'ANIMATION THREE.JS
// -----------------------------------------
function animate() {
    if (!webglOK) return;
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Anneaux orbitaux
    ring.rotation.z += 0.002;
    ring2.rotation.z -= 0.0015;

    // Particules : mouvement doux + suivi souris
    particles.rotation.y += 0.0003;
    particles.rotation.x += 0.0001;
    particles.rotation.y += (mouseX * 0.00002 - particles.rotation.y * 0.001);
    particles.rotation.x += (mouseY * 0.00002 - particles.rotation.x * 0.001);

    // Lumières dynamiques
    pointLight1.position.x = Math.sin(elapsed * 0.3) * 15;
    pointLight1.position.y = Math.cos(elapsed * 0.4) * 10;
    pointLight2.position.x = Math.cos(elapsed * 0.2) * 12;
    pointLight2.position.y = Math.sin(elapsed * 0.3) * 8;

    // Scroll parallax sur les particules
    const scrollY = window.scrollY || window.pageYOffset;
    particles.position.y = -scrollY * 0.002;

    renderer.render(scene, camera);
}

if (webglOK) animate();

// -----------------------------------------
// 10. SCROLL REVEAL (Intersection Observer)
// -----------------------------------------
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// -----------------------------------------
// 11. COMPTEUR ANIMÉ (Stats)
// -----------------------------------------
const statNumbers = document.querySelectorAll('.stat-number');
let countersStarted = false;

function animateCounters() {
    if (countersStarted) return;
    countersStarted = true;

    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            stat.textContent = current.toLocaleString('fr-FR');

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target.toLocaleString('fr-FR');
            }
        }
        requestAnimationFrame(updateCounter);
    });
}

const statsSection = document.getElementById('stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
}

// -----------------------------------------
// 12. SPLIT TEXT ANIMATION (Hero)
// -----------------------------------------
const splitTextElement = document.querySelector('.split-text');
if (splitTextElement) {
    setTimeout(() => splitTextElement.classList.add('visible'), 300);
}

// -----------------------------------------
// 13. NAV SCROLL EFFECT
// -----------------------------------------
const navElement = document.querySelector('nav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navElement.style.boxShadow = '0 4px 30px rgba(0,0,0,0.15)';
    } else {
        navElement.style.boxShadow = 'none';
    }
}, { passive: true });

// -----------------------------------------
// 14. RESPONSIVE
// -----------------------------------------
window.addEventListener('resize', () => {
    if (webglOK) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    if (window.innerWidth > 768) {
        if (webglOK) camera.position.x = 5;
    } else {
        if (webglOK) {
            camera.position.x = 0;
            camera.position.z = 22;
        }
    }
});

if (webglOK && window.innerWidth <= 768) {
    camera.position.x = 0;
    camera.position.z = 22;
}

// -----------------------------------------
// 15. SMOOTH SCROLL
// -----------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href) return;

        if (href === '#') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
