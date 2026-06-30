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

// Píldoras Sociométricas - Array de 27 frases
const quotes = [
    "Las Variables Complementarias no son meras etiquetas; actúan como campos gravitatorios que cohesionan o fracturan la red.",
    "Si los perfiles de Variables Complementarias coinciden, el sistema confía en que ese puente aguantará el peso de la reconciliación.",
    "El adjetivo inyectado mediante el AAG es un vector de fuerza léxica que amplifica la gravedad de cada elección.",
    "La homofilia semántica nos demuestra que los sujetos de un mismo grumo tienden a compartir valores idénticos en el Autoinforme Agente (AAG).",
    "A través de la metapercepción triádica, desvelamos la arquitectura de lo invisible: no solo a quién eliges, sino a quién crees que los tuyos elegirán.",
    "La metapercepción mide el grado de 'sincronía cuántica' del grupo: saber con certeza que el otro sabe lo que tú sabes.",
    "La superposición relacional revela cómo múltiples estratos de vínculos (laborales, afectivos, cognitivos) coexisten en un mismo nodo, definiendo su densidad.",
    "El ecosistema grupal se sostiene sobre las fuerzas estructurantes del entrelazamiento atractivo y repulsivo, donde incluso la animadversión teje la arquitectura.",
    "El orden de elección es el mensaje. La sociometría ordinal abandona el reduccionismo binario: no basta con ser elegido, importa en qué estrato del deseo habitas.",
    "Aplicamos un decaimiento matemático para que un rechazo primario tenga un impacto estructural drásticamente superior a un descarte secundario.",
    "La ley de decaimiento asintótico inverso asegura que la distancia afectiva atenúe el vínculo hacia la indiferencia, sin llegar jamás al cero absoluto.",
    "La Densidad Relacional es la termodinámica del grupo. Medimos el ruido, la fricción y el calor latente que determinan si el sistema colapsa o avanza.",
    "La Densidad Absoluta (BDR) mide el 'trabajo total' del grupo; la Densidad Neta (SDR) refleja la energía puramente útil para el avance colectivo.",
    "La estrategia de Difracción Relacional separa la energía social en su espectro puro, aislando quirúrgicamente las fuerzas de cohesión de la entropía.",
    "SOC_ORD traza un paralelismo exacto entre el análisis clásico de MORENO y la velocidad del formato BREVE, logrando un escáner total con mínimo desgaste.",
    "El formato BREVE despoja al cuestionario de la violencia de preguntar explícitamente a quién rechazas, logrando capturar la estructura social real sin generar desgaste cognitivo ni social.",
    "Ninguna visión es completa sin la operatividad de los 6 PRISMAS: cada rotación de la matriz revela una nueva dimensión del holograma grupal.",
    "Los 6 Prismas Analíticos nos permiten diseccionar el ecosistema revelando desde el liderazgo funcional hasta el ostracismo oculto.",
    "Las ópticas Macro, Meso y Micro nos permiten hacer zoom: desde la atmósfera global del clima hasta el átomo diádico de cada individuo.",
    "La lente MACRO diagnostica el clima; la MESO desvela los clústeres y coaliciones; la MICRO realiza la microcirugía de la identidad del sujeto.",
    "Un sujeto con cero elecciones no es un simple aislado; es víctima de un ostracismo activo que anula su agencia social.",
    "Aplicamos la Simetría Agencial: si inviertes mucho y recibes poco, es ostracismo; si recibes mucho sin invertir, es liderazgo orgánico.",
    "Reemplazamos los clásicos sociogramas de flechas ilegibles por mapas topográficos de energía espacial.",
    "Si un sujeto es líder para unos y marginado para otros, estamos ante una 'Identidad Disputada' que fractura la realidad compartida.",
    "Garantizamos datos purgados de ruido estadístico (Zero-Noise). Mostramos solo la señal pura, protegiendo siempre la identidad del evaluado.",
    "No dibujamos las jerarquías impuestas por el organigrama oficial, sino las verdaderas jerarquías de influencia real.",
    "Los números son representaciones abstractas de la realidad. La interpretación final requiere siempre del contexto y la empatía del clínico."
];

// Logic to rotate quotes
function initQuotes() {
    const quoteContainer = document.getElementById('dynamic-quote');
    if (!quoteContainer) return;

    let currentQuoteIndex = Math.floor(Math.random() * quotes.length);
    quoteContainer.textContent = `"${quotes[currentQuoteIndex]}"`;

    setInterval(() => {
        // Fade out
        quoteContainer.style.opacity = 0;
        
        setTimeout(() => {
            currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
            quoteContainer.textContent = `"${quotes[currentQuoteIndex]}"`;
            // Fade in
            quoteContainer.style.opacity = 1;
        }, 1000); // Wait for fade out
    }, 8000); // Rotate every 8 seconds
}

document.addEventListener('DOMContentLoaded', initQuotes);
