gsap.registerPlugin(ScrollTrigger);

// Particle Canvas Setup
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mood = 'rain'; 

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        // Warm firefly behavior added to sunrise, falling petals to blossom phase
        this.y = mood === 'rain' ? -10 : Math.random() * canvas.height + (mood === 'sunrise' ? 0 : canvas.height);
        this.size = mood === 'rain' ? Math.random() * 2 + 1 : mood === 'sunrise' ? Math.random() * 3 + 1.5 : Math.random() * 4 + 2;
        this.speedY = mood === 'rain' ? Math.random() * 6 + 4 : mood === 'sunrise' ? (Math.random() * 0.6 - 0.3) : -(Math.random() * 1.2 + 0.4);
        this.speedX = mood === 'rain' ? -0.5 : Math.random() * 1 - 0.5;
        this.color = mood === 'rain' ? 'rgba(148, 163, 184, 0.3)' : mood === 'sunrise' ? 'rgba(253, 224, 71, 0.5)' : 'rgba(244, 63, 94, 0.45)';
        this.opacityWobble = Math.random() * 0.05;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Gentle shimmer for firefly mood
        if(mood === 'sunrise') {
            this.size += Math.sin(Date.now() * this.opacityWobble) * 0.1;
        }

        if (mood === 'rain' && this.y > canvas.height) this.reset();
        if (mood === 'blossom' && this.y < -10) this.reset();
        if (mood === 'sunrise' && (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height)) this.reset();
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        if (mood === 'blossom') {
            ctx.ellipse(this.x, this.y, this.size, this.size * 1.4, Math.PI / 4, 0, Math.PI * 2);
        } else {
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        }
        ctx.fill();
    }
}

for(let i = 0; i < 75; i++) { particles.push(new Particle()); }

function runParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(runParticles);
}
runParticles();

// Soft Element Fade-In Text Setup
gsap.utils.toArray('.fade-text').forEach(text => {
    gsap.fromTo(text, { opacity: 0, y: 15 }, {
        scrollTrigger: {
            trigger: text,
            start: "top 80%"
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power1.out"
    });
});

// Scene 1 -> Scene 2 Environment Scroll Trigger Fix
ScrollTrigger.create({
    trigger: "#scene-2",
    start: "top 60%",
    end: "bottom center",
    onEnter: () => {
        mood = 'sunrise';
        document.body.className = "font-sans text-slate-100 overflow-x-hidden selection:bg-rose-500/30 bg-phase-sunrise";
        document.getElementById('heart-crack-line').style.transform = 'scaleY(1)';
    },
    onLeaveBack: () => {
        mood = 'rain';
        document.body.className = "font-sans text-slate-100 overflow-x-hidden selection:bg-rose-500/30 dynamic-bg";
        document.getElementById('heart-crack-line').style.transform = 'scaleY(0)';
    }
});

// Scene 3 Card Animation Chain
gsap.to(".glass-card", {
    scrollTrigger: {
        trigger: "#scene-3",
        start: "top 70%"
    },
    opacity: 1,
    y: 0,
    stagger: 0.2,
    duration: 0.8,
    ease: "power2.out"
});

// Scene 4 Floating Polaroids Entrance
gsap.from(".polaroid-card", {
    scrollTrigger: {
        trigger: "#scene-4",
        start: "top 60%"
    },
    opacity: 0,
    scale: 0.8,
    rotation: 0,
    stagger: 0.3,
    duration: 1.2,
    ease: "back.out(1.7)"
});

// Scene 5 Blossom Phase Shift Trigger
ScrollTrigger.create({
    trigger: "#scene-5",
    start: "top 60%",
    onEnter: () => {
        mood = 'blossom';
        document.body.className = "font-sans text-slate-800 overflow-x-hidden selection:bg-rose-500/30 bg-phase-blossom";
        
        // Handle Typing Flow safely once triggered
        const box = document.getElementById('typing-container');
        if(box.innerHTML === "") {
            const strings = [
                "I'm not here because I'm afraid of losing you.",
                "I'm here because I still choose you.",
                "Every single day."
            ];
            strings.forEach((str, index) => {
                setTimeout(() => {
                    let el = document.createElement('p');
                    el.className = "transition-opacity duration-1000 opacity-0 font-light text-slate-800 text-xl md:text-2xl";
                    if(index === 2) el.className = "transition-all duration-1000 opacity-0 font-medium text-rose-600 text-2xl md:text-3xl drop-shadow-sm";
                    el.innerText = str;
                    box.appendChild(el);
                    setTimeout(() => el.classList.remove('opacity-0'), 50);
                }, index * 2000);
            });
        }
    },
    onLeaveBack: () => {
        mood = 'sunrise';
        document.body.className = "font-sans text-slate-100 overflow-x-hidden selection:bg-rose-500/30 bg-phase-sunrise";
    }
});

// Scene 6 Bridge Planks Sequential Reveal
gsap.to(".plank", {
    scrollTrigger: {
        trigger: "#bridge-container",
        start: "top 70%"
    },
    opacity: 1,
    x: 0,
    stagger: 0.25,
    duration: 0.6,
    ease: "power2.out"
});

// Scene 7 Envelope Scale Reveal
gsap.to("#envelope-wrapper", {
    scrollTrigger: {
        trigger: "#scene-7",
        start: "top 50%"
    },
    scale: 1,
    opacity: 1,
    duration: 1.2,
    ease: "power2.out"
});

// Scene Final White Screen Fade Transition
ScrollTrigger.create({
    trigger: "#scene-final",
    start: "top 50%",
    onEnter: () => {
        mood = 'none';
        document.body.className = "font-sans text-slate-900 overflow-x-hidden bg-phase-final";
        document.getElementById('final-heart').classList.remove('opacity-0');
        
        const fText = document.getElementById('final-text');
        if(fText.innerHTML === "") {
            setTimeout(() => {
                fText.innerHTML = `<p class="transition-opacity duration-1000 font-light text-stone-600">"Every beautiful story deserves another chapter..."</p>`;
                setTimeout(() => {
                    fText.innerHTML += `<p class="transition-opacity duration-1000 font-medium text-stone-900 mt-2">Only if both hearts choose to write it together.</p>`;
                    setTimeout(() => {
                        document.getElementById('cta-btn').classList.remove('hidden');
                    }, 1000);
                }, 2000);
            }, 1000);
        }
    }
});

// Final CTA Button Mechanics
document.getElementById('cta-btn').addEventListener('click', function() {
    this.style.display = 'none';
    const interactBox = document.getElementById('hearts-interact');
    interactBox.classList.remove('hidden');
    interactBox.classList.add('flex');
    
    // Magnetic paths pulling closer smoothly
    gsap.to(interactBox.children[0], { x: 80, duration: 3, ease: "power2.inOut" });
    gsap.to(interactBox.children[1], { x: -80, duration: 3, ease: "power2.inOut" });
});

// Audio Playback Elements
const sound = document.getElementById('bg-music');
const soundBtn = document.getElementById('audio-toggle');
soundBtn.addEventListener('click', () => {
    if (sound.paused) {
        sound.play().catch(() => console.log("Interaction required before media plays."));
        soundBtn.innerText = "⏸️ Pause Music";
    } else {
        sound.pause();
        soundBtn.innerText = "🎵 Play Music";
    }
});
