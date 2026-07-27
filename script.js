try {
    const audio1 = document.getElementById('bgMusic1');
    const audio2 = document.getElementById('bgMusic2');
    const audio3 = document.getElementById('bgMusic3');
    const voiceAudio = document.getElementById('voiceMsg'); 
    const player = document.getElementById('music-player');
    
    let currentAudio = audio1; 
    let heartInterval; 
    let flowerInterval; 

    let isStarted = false;
    let isGiftOpened = false;

    const orbitImageSources = [
        'ảnh/anh1.jpg.JPEG', 
        'ảnh/anh2.jpg.JPEG', 
        'ảnh/anh3.jpg.JPEG', 
        'ảnh/anh4.jpg.JPEG', 
        'ảnh/anh5.jpg.JPEG', 
        'ảnh/anh6.jpg.JPEG', 
        'ảnh/anh7.jpg.JPEG'
    ]; 
    let orbitElements = []; 

    function toggleMusic() {
        try {
            if (currentAudio.paused) {
                currentAudio.play().then(() => { player.style.animationPlayState = 'running'; }).catch(e => {});
            } else {
                currentAudio.pause();
                player.style.animationPlayState = 'paused';
            }
        } catch(e) {}
    }

    function switchScreen(oldId, newId, displayStyle = 'flex') {
        const oldScreen = document.getElementById(oldId);
        const newScreen = document.getElementById(newId);
        if(!oldScreen || !newScreen) return;
        
        // Làm mờ từ từ màn hình cũ
        oldScreen.style.opacity = '0';
        setTimeout(() => {
            oldScreen.classList.remove('active');
            oldScreen.style.display = 'none';
            
            newScreen.style.display = displayStyle;
            setTimeout(() => {
                newScreen.classList.add('active');
                // Hiện từ từ màn hình mới
                newScreen.style.opacity = '1';
            }, 50);
        }, 1000); 
    }

    function flySpaceship() {
        const ship = document.createElement('div');
        ship.id = "flying-ship";
        const rocket = document.createElement('div');
        rocket.innerHTML = "🚀"; rocket.style.transform = "rotate(45deg)"; rocket.style.fontSize = "8rem"; rocket.style.position = "relative"; rocket.style.zIndex = "2";
        const exhaust = document.createElement('div');
        exhaust.style.position = "absolute"; exhaust.style.left = "-40px"; exhaust.style.top = "50%"; exhaust.style.transform = "translateY(-50%)"; exhaust.style.zIndex = "1";
        ship.appendChild(exhaust); ship.appendChild(rocket); document.body.appendChild(ship);

        let pos = -30; 
        let exhaustInterval = setInterval(() => {
            for(let i=0; i<4; i++){
                let heart = document.createElement('div');
                heart.className = 'exhaust-heart';
                heart.innerText = ['❤️', '💖', '💗', '💕', '🔥', '✨'][Math.floor(Math.random()*6)];
                heart.style.top = (Math.random() * 80 - 40) + 'px'; 
                exhaust.appendChild(heart);
                setTimeout(() => { if(heart.parentNode) heart.remove(); }, 1000);
            }
        }, 20); 

        let moveInterval = setInterval(() => {
            pos += 0.8; ship.style.left = pos + 'vw'; ship.style.top = 35 + Math.sin(pos * 0.1) * 3 + '%'; 
            if(pos > 130) { clearInterval(moveInterval); clearInterval(exhaustInterval); if(ship.parentNode) ship.remove(); }
        }, 20);
    }

    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerText = ['❤️', '💖', '💗', '💓', '💕', '💘'][Math.floor(Math.random() * 6)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 3 + 0.6) + 'rem';
        const duration = Math.random() * 4 + 4;
        heart.style.setProperty('--duration', duration + 's');
        heart.style.setProperty('--drift', (Math.random() * 300 - 150) + 'px');
        heart.style.setProperty('--rot', (Math.random() * 360) + 'deg');
        document.body.appendChild(heart);
        setTimeout(() => { if (heart.parentNode) heart.remove(); }, duration * 1000);
    }

    function startExperience() {
        if (isStarted) return; 
        isStarted = true;
        heartInterval = setInterval(createHeart, 100);
        document.getElementById('start-btn').style.display = 'none';
        document.getElementById('loading-container').style.display = 'block';
        flySpaceship();
        try { currentAudio.play().then(() => player.style.animationPlayState = 'running').catch(e=>{}); } catch(e){}

        let progress = 0;
        const progressEl = document.getElementById('progress');
        const textEl = document.getElementById('loading-text');
        
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 8) + 5; 
            if (progress >= 100) {
                progress = 100; clearInterval(interval);
                textEl.innerText = "Đã tìm thấy tiểu vũ trụ của anh! ❤️"; progressEl.style.width = "100%";
                setTimeout(() => switchScreen('loading-screen', 'gift-screen'), 1000);
            } else {
                textEl.innerText = "Đang dò tìm tọa độ của em... " + progress + "%"; progressEl.style.width = progress + "%";
            }
        }, 100);
    }

    function openGift(event) {
        if (isGiftOpened) return; 
        isGiftOpened = true;

        const giftWrapper = document.querySelector('.gift-wrapper');
        const giftBox = document.querySelector('.gift-box-css');
        giftWrapper.style.animation = 'none'; 
        giftBox.classList.add('open');

        setTimeout(() => {
            const rect = giftWrapper.getBoundingClientRect();
            const originX = (rect.left + rect.width / 2) || (window.innerWidth / 2);
            const originY = (rect.top + rect.height / 2) || (window.innerHeight / 2);
            const fContainer = document.getElementById('flower-container') || document.body;

            function spawnFlowers(count) {
                const flowers = ['💖', '✨', '💗', '🌸', '🌸', '🌸', '💝', '🌹', '🦋'];
                for (let i = 0; i < count; i++) { 
                    const flower = document.createElement('div');
                    flower.className = 'flower'; 
                    flower.innerText = flowers[Math.floor(Math.random() * flowers.length)];
                    flower.style.left = originX + 'px'; 
                    flower.style.top = originY + 'px';
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * (Math.max(window.innerWidth, window.innerHeight)) + 200; 
                    flower.style.setProperty('--tx', Math.cos(angle) * distance + 'px'); 
                    flower.style.setProperty('--ty', Math.sin(angle) * distance + 'px'); 
                    flower.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg'); 
                    flower.style.setProperty('--scale-end', Math.random() * 1.5 + 0.8);
                    fContainer.appendChild(flower);
                }
            }

            spawnFlowers(50);
            flowerInterval = setInterval(() => { spawnFlowers(12); }, 80); 
            player.style.display = 'block';

            // KHI HẾT THỜI GIAN HOA NỔ, CHO CHÚNG MỜ DẦN TỪ TỪ THAY VÌ BIẾN MẤT CÁI VÈO
            setTimeout(() => {
                if (flowerInterval) clearInterval(flowerInterval); 
                if (heartInterval) clearInterval(heartInterval); 

                // Hiệu ứng mờ dần (Fade out) cho tất cả hoa và tim đang bay
                const fadingElements = document.querySelectorAll('.floating-heart, .flower');
                fadingElements.forEach(el => {
                    el.style.transition = "opacity 1s ease-out";
                    el.style.opacity = "0";
                });

                try { currentAudio.pause(); } catch(e) {}

                // Chuyển màn hình sang phần ghi âm một cách êm dịu
                switchScreen('gift-screen', 'voice-screen', 'flex');

                // Sau 1 giây mờ dần thì xóa hẳn khỏi bộ nhớ
                setTimeout(() => {
                    fadingElements.forEach(el => el.remove());
                }, 1000);
                
                setTimeout(() => {
                    try {
                        let playPromise = voiceAudio.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(e => { unlockUniverseScreen(); });
                        }
                    } catch(e) { unlockUniverseScreen(); }
                }, 1000);

            }, 3500); 
        }, 400); 
    }

    function unlockUniverseScreen() {
        document.querySelectorAll('.wave').forEach(el => el.style.animationPlayState = 'paused');
        const voiceText = document.getElementById('voice-text');
        if (voiceText) voiceText.innerText = "Đã nghe xong lời nhắn của anh ❤️";
        const hint = document.getElementById('voice-hint');
        if (hint) hint.style.display = "block";
    }

    voiceAudio.onended = unlockUniverseScreen;
    voiceAudio.onerror = unlockUniverseScreen;

    let isGoingToUniverse = false;
    function goToUniverse() {
        if (isGoingToUniverse) return;
        isGoingToUniverse = true;

        try { voiceAudio.pause(); } catch(e) {}
        
        switchScreen('voice-screen', 'universe-screen', 'block');
        
        try {
            currentAudio = audio2; 
            currentAudio.currentTime = 0;
            currentAudio.play().then(() => { player.style.animationPlayState = 'running'; }).catch(e=>{}); 
        } catch(e) {}

        setTimeout(startUniverse, 1000); 
    }

    /* ================= MÀN 3: VŨ TRỤ TRÁI TIM ================= */
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    let width, height; let particles = []; let isUniverseActive = false; let galaxyCenterY, heartCenterY;

    function resize() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; galaxyCenterY = height / 2 + 100; heartCenterY = height / 2 - 150; }
    window.addEventListener("resize", resize); resize();
    function getHeartPoint(t, scale) { const x = 16 * Math.pow(Math.sin(t), 3); const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)); return { x: x * scale, y: y * scale }; }

    class Particle {
        constructor() {
            const rand = Math.random();
            if (rand < 0.12) this.type = 'heart';
            else if (rand < 0.90) this.type = 'galaxy';
            else this.type = 'dust';
            const colors = ['#ff1493', '#ff00ff', '#ff69b4', '#ffb3c6', '#ffffff', '#ff007f', '#da70d6'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.size = Math.random() * 1.8 + 0.4;
            const startAngle = Math.random() * Math.PI * 2; const startRadius = Math.random() * width + 500;
            this.x = width / 2 + Math.cos(startAngle) * startRadius; this.y = height / 2 + Math.sin(startAngle) * startRadius;
            if (this.type === 'heart') { this.t = Math.random() * Math.PI * 2; this.baseScale = Math.min(width, height) / 60; this.speed = Math.random() * 0.03 + 0.02; this.noiseX = (Math.random() - 0.5) * 20; this.noiseY = (Math.random() - 0.5) * 20; } 
            else if (this.type === 'galaxy') { const arms = 5; const armIndex = Math.floor(Math.random() * arms); const armAngle = (armIndex * Math.PI * 2) / arms; this.galaxyRadius = 30 + Math.random() * (width * 0.85); this.galaxyAngle = armAngle + this.galaxyRadius * 0.004 + (Math.random() - 0.5) * 0.6; this.orbitSpeed = Math.random() * 0.0025 + 0.0008; this.zOffset = (Math.random() - 0.5) * 25; } 
            else { this.dustAngle = Math.random() * Math.PI * 2; this.dustRadius = Math.random() * (width * 0.7); this.dustSpeed = Math.random() * 0.001 + 0.0005; }
        }
        update() {
            if (this.type === 'heart') { const time = Date.now() * 0.005; const beat = 1 + Math.sin(time) * 0.05; const target = getHeartPoint(this.t, this.baseScale * beat); const targetX = width / 2 + target.x + this.noiseX; const targetY = heartCenterY + target.y + this.noiseY; this.x += (targetX - this.x) * this.speed; this.y += (targetY - this.y) * this.speed; } 
            else if (this.type === 'galaxy') { this.galaxyAngle -= this.orbitSpeed; const targetX = width / 2 + Math.cos(this.galaxyAngle) * this.galaxyRadius; const targetY = galaxyCenterY + Math.sin(this.galaxyAngle) * this.galaxyRadius * 0.35 + this.zOffset; this.x += (targetX - this.x) * 0.06; this.y += (targetY - this.y) * 0.06; } 
            else { this.dustAngle += this.dustSpeed; const targetX = width / 2 + Math.cos(this.dustAngle) * this.dustRadius; const targetY = galaxyCenterY + Math.sin(this.dustAngle) * (this.dustRadius * 0.35); this.x += (targetX - this.x) * 0.04; this.y += (targetY - this.y) * 0.04; }
        }
        draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fillStyle = this.color; ctx.shadowBlur = this.type === 'heart' ? 10 : 4; ctx.shadowColor = this.color; ctx.fill(); }
    }

    function startUniverse() {
        isUniverseActive = true;
        document.querySelectorAll('.bg-floating-img').forEach(el => el.remove());
        document.querySelectorAll('.flower').forEach(el => el.remove());
        document.querySelectorAll('.floating-heart').forEach(el => el.remove());

        particles = []; for (let i = 0; i < 12000; i++) particles.push(new Particle()); 

        const orbitContainer = document.getElementById('orbit-container'); orbitContainer.innerHTML = ''; orbitElements = [];
        const totalOrbits = 12; 
        for(let i = 0; i < totalOrbits; i++) {
            let img = document.createElement('img'); img.src = orbitImageSources[i % orbitImageSources.length]; img.className = 'orbit-img'; img.onerror = function() { this.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='; };
            let isInnerRing = i % 2 === 0; let size = isInnerRing ? 85 : 125; img.style.width = size + 'px'; img.style.height = (size * 1.1) + 'px'; orbitContainer.appendChild(img);
            let exactAngle = (Math.floor(i / 2) / 6) * Math.PI * 2 + (isInnerRing ? 0 : Math.PI / 6);
            orbitElements.push({ el: img, angle: exactAngle, radius: width > 600 ? (isInnerRing ? 380 : 550) : (isInnerRing ? 180 : 260), speed: isInnerRing ? 0.0025 : 0.0015, yDrift: i, yDriftSpeed: 0.015 });
        }
        
        function animate() {
            if (!isUniverseActive) return;
            ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; ctx.fillRect(0, 0, width, height);
            ctx.save(); ctx.beginPath(); ctx.ellipse(width / 2, galaxyCenterY, 110, 110 * 0.35, 0, 0, Math.PI * 2); ctx.fillStyle = "rgba(255, 20, 147, 0.2)"; ctx.shadowBlur = 50; ctx.shadowColor = "#ff1493"; ctx.fill(); ctx.beginPath(); ctx.ellipse(width / 2, galaxyCenterY, 50, 50 * 0.35, 0, 0, Math.PI * 2); ctx.fillStyle = "#000000"; ctx.fill(); ctx.restore();
            particles.forEach(p => { p.update(); p.draw(); });
            orbitElements.forEach(obj => {
                obj.angle -= obj.speed; obj.yDrift += obj.yDriftSpeed;
                let x = width / 2 + Math.cos(obj.angle) * obj.radius; let baseOrbitY = heartCenterY + Math.sin(obj.angle) * obj.radius * 0.7; let y = baseOrbitY + Math.sin(obj.yDrift) * 20;
                let isFront = Math.sin(obj.angle) > 0; let scale = 0.85 + (Math.sin(obj.angle) * 0.25); let opacity = isFront ? 1 : 0.3; 
                obj.el.style.left = x + 'px'; obj.el.style.top = y + 'px'; obj.el.style.transform = `translate(-50%, -50%) scale(${scale})`; obj.el.style.opacity = opacity; obj.el.style.zIndex = isFront ? 10 : 1;
            });
            requestAnimationFrame(animate);
        }
        animate();

        setTimeout(() => { document.getElementById("floatingTexts").style.display = "block"; document.querySelectorAll(".float-text").forEach((el, index) => { setTimeout(() => { el.style.opacity = 1; }, index * 500); }); }, 2000);
        setTimeout(() => { const hint = document.querySelector(".hint-text"); if(hint) hint.style.display = "block"; }, 4000);
    }

    function goToGallery() {
        if (!isUniverseActive) return;
        isUniverseActive = false; 
        const hint = document.querySelector(".hint-text"); 
        if(hint) hint.style.display = "none";
        
        switchScreen('universe-screen', 'gallery-screen', 'flex');

        for (let i = 0; i < 8; i++) { setTimeout(createFloatingImage, i * 400); }
        setTimeout(() => {
            window.scrollTo(0, 0); 
            if ('IntersectionObserver' in window) { 
                const observer = new IntersectionObserver((entries) => { 
                    entries.forEach(entry => { 
                        if (entry.isIntersecting) entry.target.classList.add('show'); 
                    }); 
                }, { threshold: 0.1 }); 
                document.querySelectorAll('.photo-card').forEach(card => observer.observe(card)); 
            } else { 
                document.querySelectorAll('.photo-card').forEach(card => card.classList.add('show')); 
            }
        }, 1000);
    }

    const floatingImagesSrc = [ 'ảnh/anh1.jpg.JPEG', 'ảnh/anh2.jpg.JPEG', 'ảnh/anh3.jpg.JPEG', 'ảnh/anh4.jpg.JPEG', 'ảnh/anh5.jpg.JPEG', 'ảnh/anh6.jpg.JPEG', 'ảnh/anh7.jpg.JPEG' ]; 
    function createFloatingImage() {
        if (isUniverseActive) return;
        try {
            const img = document.createElement('img'); img.src = floatingImagesSrc[Math.floor(Math.random() * floatingImagesSrc.length)]; img.className = 'bg-floating-img'; img.onerror = function() { this.remove(); };
            const startX = Math.random() * 90; const scale = Math.random() * 0.4 + 0.4; const duration = Math.random() * 6 + 6; const rotStart = Math.random() * 60 - 30; const rotEnd = Math.random() * 180 - 90; 
            img.style.left = startX + 'vw'; img.style.setProperty('--scale', scale); img.style.setProperty('--duration', duration + 's'); img.style.setProperty('--rot-start', rotStart + 'deg'); img.style.setProperty('--rot-end', rotEnd + 'deg');
            document.body.appendChild(img); setTimeout(() => { if(img && img.parentNode) img.remove(); }, duration * 1000);
        } catch(e) {}
    }

    for (let i = 0; i < 8; i++) { setTimeout(createFloatingImage, i * 400); }
    setInterval(createFloatingImage, 1200);
    window.startExperience = startExperience; window.openGift = openGift; window.goToGallery = goToGallery; window.goToUniverse = goToUniverse; 

} catch (error) { console.error("Đã xảy ra lỗi khởi tạo:", error); }