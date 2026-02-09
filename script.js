document.addEventListener('DOMContentLoaded', () => {
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const questionArea = document.getElementById('question-area');
    const celebrationArea = document.getElementById('celebration-area');
    const flirtyLines = document.querySelectorAll('.flirty-line');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = document.getElementById('music-icon');
    const heartsContainer = document.getElementById('hearts-container');
    const petalCanvas = document.getElementById('petal-canvas');
    const ctx = petalCanvas.getContext('2d');

    let isMusicPlaying = false;
    const funnyMessages = [
        "No is not an option 😜",
        "Try YES da 😉",
        "Only YES allowed 💖"
    ];

    // --- Subtle Floating Hearts Backround ---
    function createSubtleHeart() {
        const heart = document.createElement('div');
        heart.classList.add('subtle-heart');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = Math.random() * 100 + 'vh';
        heart.style.fontSize = Math.random() * 15 + 10 + 'px';
        heart.style.opacity = Math.random() * 0.3;
        heart.style.animationDuration = Math.random() * 5 + 5 + 's';
        heartsContainer.appendChild(heart);

        setTimeout(() => heart.remove(), 10000);
    }
    // Very few hearts
    setInterval(createSubtleHeart, 1500);

    // --- NO Button Interaction ---
    function dodgeNo() {
        if (noBtn.style.position !== 'fixed') {
            noBtn.style.position = 'fixed';
        }

        const margin = 50;
        const maxX = window.innerWidth - noBtn.offsetWidth - margin;
        const maxY = window.innerHeight - noBtn.offsetHeight - margin;

        const targetX = Math.max(margin, Math.random() * maxX);
        const targetY = Math.max(margin, Math.random() * maxY);

        noBtn.style.left = targetX + 'px';
        noBtn.style.top = targetY + 'px';

        showMiniMessage(targetX, targetY);
    }

    function showMiniMessage(x, y) {
        const msg = document.createElement('div');
        msg.classList.add('no-msg');
        msg.innerText = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
        msg.style.left = (x > window.innerWidth / 2) ? (x - 130) + 'px' : (x + 30) + 'px';
        msg.style.top = (y - 30) + 'px';
        document.body.appendChild(msg);

        setTimeout(() => {
            msg.style.opacity = '0';
            setTimeout(() => msg.remove(), 400);
        }, 1200);
    }

    noBtn.addEventListener('mouseenter', dodgeNo);
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        dodgeNo();
    });

    // --- YES Button Flow ---
    yesBtn.addEventListener('click', () => {
        questionArea.classList.add('hidden');
        celebrationArea.classList.remove('hidden');
        document.body.classList.add('celebrating');
        startSubtleCelebration();
        sequenceMessages();

        if (!isMusicPlaying) toggleMusic();
    });

    function sequenceMessages() {
        flirtyLines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('active-line');
                if (window.innerWidth < 600) line.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, (index + 1) * 2800);
        });
    }

    // --- Music Toggle ---
    function toggleMusic() {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicIcon.innerText = '🔇';
        } else {
            bgMusic.play().catch(e => console.log("Play failed", e));
            musicIcon.innerText = '🔊';
        }
        isMusicPlaying = !isMusicPlaying;
    }
    musicToggle.addEventListener('click', toggleMusic);

    // --- Soft Upward Hearts Animation ---
    let heartArray = [];
    const maxHearts = 40; // Minimal

    function resize() {
        petalCanvas.width = window.innerWidth;
        petalCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class CelebHeart {
        constructor() {
            this.init();
        }
        init() {
            this.x = Math.random() * petalCanvas.width;
            this.y = petalCanvas.height + 50;
            this.size = Math.random() * 15 + 15;
            this.speed = Math.random() * 1.2 + 0.8;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.icon = '💗';
        }
        update() {
            this.y -= this.speed;
            if (this.y < -50) this.init();
        }
        draw() {
            ctx.globalAlpha = this.opacity;
            ctx.font = `${this.size}px serif`;
            ctx.fillText(this.icon, this.x, this.y);
        }
    }

    function startSubtleCelebration() {
        for (let i = 0; i < maxHearts; i++) heartArray.push(new CelebHeart());
        render();
    }

    function render() {
        ctx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);
        heartArray.forEach(h => {
            h.update();
            h.draw();
        });
        requestAnimationFrame(render);
    }
});
