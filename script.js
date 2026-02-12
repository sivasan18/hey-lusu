document.addEventListener('DOMContentLoaded', () => {
    // ===== DOM Elements =====
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const screenLanding = document.getElementById('screen-landing');
    const heartExplosion = document.getElementById('heart-explosion');
    const screenLetter = document.getElementById('screen-letter');
    const bigHeart = document.querySelector('.big-heart');
    const envelope = document.getElementById('envelope');
    const letter = document.getElementById('letter');
    const letterContent = document.getElementById('letter-content');
    const explosionCanvas = document.getElementById('explosion-canvas');
    const postCanvas = document.getElementById('post-hearts-canvas');
    const heartsBg = document.getElementById('hearts-bg');
    const escapeMessages = document.getElementById('escape-messages');
    const audioControl = document.getElementById('audio-control');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = document.getElementById('music-icon');

    let noClickCount = 0;
    let isMusicPlaying = false;

    // ===== FLOATING HEARTS BACKGROUND =====
    function createBgHeart() {
        const heart = document.createElement('div');
        heart.classList.add('bg-heart');
        const hearts = ['♥', '♡', '❤', '💕', '💗'];
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 18 + 10) + 'px';
        const duration = Math.random() * 8 + 8;
        heart.style.animationDuration = duration + 's';
        heart.style.animationDelay = Math.random() * 5 + 's';
        heartsBg.appendChild(heart);
        setTimeout(() => heart.remove(), (duration + 6) * 1000);
    }

    // Create initial hearts
    for (let i = 0; i < 15; i++) {
        setTimeout(createBgHeart, i * 400);
    }
    setInterval(createBgHeart, 1200);

    // ===== NO BUTTON ESCAPE LOGIC =====
    const escapeTexts = [
        "Nice try 😜",
        "Not allowed 🙈",
        "Only YES works 💕",
        "Haha nope! 😂",
        "Try again 💘",
        "You can't say NO! 🥰",
        "Wrong button da 😜",
        "Click YES only 💖"
    ];

    function getRandomPosition() {
        const margin = 20;
        const btnWidth = noBtn.offsetWidth || 120;
        const btnHeight = noBtn.offsetHeight || 50;
        const maxX = window.innerWidth - btnWidth - margin;
        const maxY = window.innerHeight - btnHeight - margin;
        return {
            x: Math.max(margin, Math.random() * maxX),
            y: Math.max(margin, Math.random() * maxY)
        };
    }

    function escapeNoButton(e) {
        if (e) e.preventDefault();

        noClickCount++;
        noBtn.classList.add('escaped');

        const pos = getRandomPosition();
        noBtn.style.left = pos.x + 'px';
        noBtn.style.top = pos.y + 'px';

        // Grow YES button
        const scale = 1 + noClickCount * 0.08;
        const maxScale = 2.2;
        yesBtn.style.transform = `scale(${Math.min(scale, maxScale)})`;

        // Show escape message
        showEscapeMessage(pos.x, pos.y);
    }

    function showEscapeMessage(x, y) {
        const msg = document.createElement('div');
        msg.classList.add('escape-msg');
        msg.textContent = escapeTexts[Math.floor(Math.random() * escapeTexts.length)];

        // Position near where the button was
        const msgX = x > window.innerWidth / 2 ? x - 140 : x + 20;
        const msgY = y - 40;
        msg.style.left = Math.max(5, msgX) + 'px';
        msg.style.top = Math.max(5, msgY) + 'px';

        escapeMessages.appendChild(msg);
        setTimeout(() => msg.remove(), 1500);
    }

    // Desktop: escape on hover
    noBtn.addEventListener('mouseenter', escapeNoButton);
    // Mobile: escape on touch
    noBtn.addEventListener('touchstart', escapeNoButton, { passive: false });
    // Prevent actual click
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        escapeNoButton(e);
    });

    // ===== YES BUTTON - MAIN FLOW =====
    yesBtn.addEventListener('click', () => {
        // Disable buttons
        yesBtn.disabled = true;
        noBtn.style.display = 'none';

        // Start the magic sequence
        startHeartExplosion();
    });

    // ===== PHASE 1: HEART EXPLOSION =====
    function startHeartExplosion() {
        // Flash pink
        const flash = document.createElement('div');
        flash.classList.add('pink-flash');
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 800);

        // Hide landing, show explosion
        screenLanding.classList.remove('active');
        heartExplosion.classList.add('active');

        // Animate big heart
        bigHeart.classList.add('animate');

        // Start explosion particles after big heart grows
        setTimeout(() => {
            launchExplosionParticles();
        }, 800);

        // After explosion, transition to letter
        setTimeout(() => {
            heartExplosion.classList.remove('active');
            startLetterSequence();
        }, 3000);
    }

    // ===== EXPLOSION PARTICLES (CANVAS) =====
    function launchExplosionParticles() {
        const ctx = explosionCanvas.getContext('2d');
        explosionCanvas.width = window.innerWidth;
        explosionCanvas.height = window.innerHeight;

        const particles = [];
        const heartEmojis = ['💖', '💗', '💕', '❤️', '💘', '💝', '♥️', '🩷'];
        const cx = explosionCanvas.width / 2;
        const cy = explosionCanvas.height / 2;

        for (let i = 0; i < 60; i++) {
            const angle = (Math.PI * 2 * i) / 60;
            const speed = Math.random() * 6 + 3;
            particles.push({
                x: cx,
                y: cy,
                vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
                vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 2,
                size: Math.random() * 20 + 14,
                emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
                opacity: 1,
                gravity: 0.05 + Math.random() * 0.05,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 8
            });
        }

        let frame = 0;
        function animateParticles() {
            ctx.clearRect(0, 0, explosionCanvas.width, explosionCanvas.height);
            let alive = false;

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                p.opacity -= 0.008;
                p.rotation += p.rotSpeed;
                p.vx *= 0.99;

                if (p.opacity > 0) {
                    alive = true;
                    ctx.save();
                    ctx.globalAlpha = Math.max(0, p.opacity);
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.font = `${p.size}px serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(p.emoji, 0, 0);
                    ctx.restore();
                }
            });

            frame++;
            if (alive && frame < 180) {
                requestAnimationFrame(animateParticles);
            }
        }

        animateParticles();
    }

    // ===== PHASE 2: LOVE LETTER SEQUENCE =====
    function startLetterSequence() {
        screenLetter.classList.add('active');

        // Start music
        startMusic();

        // Show envelope
        setTimeout(() => {
            envelope.classList.add('visible');
        }, 300);

        // Open envelope
        setTimeout(() => {
            envelope.classList.add('opened');
        }, 1500);

        // Hide envelope, show letter
        setTimeout(() => {
            envelope.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            envelope.style.opacity = '0';
            envelope.style.transform = 'scale(0.8) translateY(-20px)';
        }, 2500);

        setTimeout(() => {
            envelope.style.display = 'none';
            letter.classList.add('visible');
            startTypingEffect();
        }, 3200);
    }

    // ===== PHASE 3: TYPING EFFECT =====
    const letterLines = [
        { text: "Oii Lusu 💖", delay: 500, pause: 1200 },
        { text: "", delay: 0, pause: 200 },
        { text: "I've been waiting for this moment…", delay: 500, pause: 1500 },
        { text: "", delay: 0, pause: 200 },
        { text: "Are you a nurse? Because my heart races whenever you're near 🩺💓", delay: 500, pause: 2000 },
        { text: "", delay: 0, pause: 200 },
        { text: "I must be a developer… because I just committed my life to you 💻❤️", delay: 500, pause: 2000 },
        { text: "", delay: 0, pause: 200 },
        { text: "Happy Valentine's Day ❤️", delay: 500, pause: 0 }
    ];

    function startTypingEffect() {
        letterContent.innerHTML = '';
        let totalDelay = 0;

        letterLines.forEach((lineObj, lineIndex) => {
            totalDelay += lineObj.delay;

            if (lineObj.text === "") {
                // Empty line (spacer)
                setTimeout(() => {
                    const br = document.createElement('br');
                    letterContent.appendChild(br);
                }, totalDelay);
                totalDelay += lineObj.pause;
                return;
            }

            const lineDelay = totalDelay;
            const text = lineObj.text;
            const lineEl = document.createElement('div');
            lineEl.classList.add('line');
            lineEl.style.animationDelay = '0s';

            // Calculate typing time for this line
            const charDelay = 40; // ms per character
            const lineTypingTime = text.length * charDelay;

            setTimeout(() => {
                letterContent.appendChild(lineEl);

                // Create cursor
                const cursor = document.createElement('span');
                cursor.classList.add('cursor-blink');
                lineEl.appendChild(cursor);

                // Type characters one by one
                let charIndex = 0;
                const typeInterval = setInterval(() => {
                    if (charIndex < text.length) {
                        // Insert character before cursor
                        const charSpan = document.createTextNode(text[charIndex]);
                        lineEl.insertBefore(charSpan, cursor);
                        charIndex++;
                    } else {
                        clearInterval(typeInterval);
                        // Remove cursor after typing done (except last line)
                        if (lineIndex < letterLines.length - 1) {
                            setTimeout(() => cursor.remove(), 500);
                        }
                    }
                }, charDelay);

                // Auto-scroll letter if needed
                if (letter.scrollHeight > letter.clientHeight) {
                    letter.scrollTop = letter.scrollHeight;
                }
            }, lineDelay);

            totalDelay += lineTypingTime + lineObj.pause;
        });

        // After all typing is done, start floating hearts
        setTimeout(() => {
            startPostLetterHearts();
        }, totalDelay + 2000);
    }

    // ===== POST-LETTER FLOATING HEARTS =====
    function startPostLetterHearts() {
        const ctx = postCanvas.getContext('2d');
        postCanvas.width = window.innerWidth;
        postCanvas.height = window.innerHeight;

        const hearts = [];
        const heartEmojis = ['💖', '💗', '💕', '❤️', '💘', '🩷'];
        const maxHearts = 30;

        class FloatingHeart {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * postCanvas.width;
                this.y = postCanvas.height + 30;
                this.size = Math.random() * 16 + 12;
                this.speed = Math.random() * 0.8 + 0.3;
                this.emoji = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
                this.opacity = Math.random() * 0.4 + 0.1;
                this.drift = (Math.random() - 0.5) * 0.5;
                this.wobble = Math.random() * Math.PI * 2;
                this.wobbleSpeed = Math.random() * 0.02 + 0.01;
            }
            update() {
                this.y -= this.speed;
                this.x += this.drift + Math.sin(this.wobble) * 0.3;
                this.wobble += this.wobbleSpeed;
                if (this.y < -30) this.reset();
            }
            draw() {
                ctx.globalAlpha = this.opacity;
                ctx.font = `${this.size}px serif`;
                ctx.fillText(this.emoji, this.x, this.y);
            }
        }

        for (let i = 0; i < maxHearts; i++) {
            const h = new FloatingHeart();
            h.y = Math.random() * postCanvas.height; // Start spread out
            hearts.push(h);
        }

        function render() {
            ctx.clearRect(0, 0, postCanvas.width, postCanvas.height);
            hearts.forEach(h => { h.update(); h.draw(); });
            requestAnimationFrame(render);
        }
        render();

        window.addEventListener('resize', () => {
            postCanvas.width = window.innerWidth;
            postCanvas.height = window.innerHeight;
        });
    }

    // ===== MUSIC =====
    function startMusic() {
        bgMusic.volume = 0.4;
        bgMusic.play().catch(e => console.log('Autoplay blocked:', e));
        isMusicPlaying = true;
        musicIcon.textContent = '🔊';
        audioControl.classList.remove('hidden');
    }

    function toggleMusic() {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicIcon.textContent = '🔇';
        } else {
            bgMusic.play().catch(e => console.log('Play failed:', e));
            musicIcon.textContent = '🔊';
        }
        isMusicPlaying = !isMusicPlaying;
    }

    musicToggle.addEventListener('click', toggleMusic);

    // ===== HANDLE RESIZE =====
    window.addEventListener('resize', () => {
        // Reset NO button if it's out of bounds
        if (noBtn.classList.contains('escaped')) {
            const pos = getRandomPosition();
            noBtn.style.left = pos.x + 'px';
            noBtn.style.top = pos.y + 'px';
        }
    });
});
