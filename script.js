// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeMusic();
    initializeVideo();
    createFloatingHearts();
    addPhotoClickHandlers();
    initializeMobileInteractions(); // 新增移动端互动
    initializeBirthdayAnimations(); // 新增生日动画
    initializePhotoSwipe(); // 新增照片滑动
    initializeConfetti(); // 新增彩带效果
});

// 音樂控制
let isMusicPlaying = false;
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

// 设置初始状态
if (musicToggle) {
    musicToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
    musicToggle.classList.add('paused');
}

function initializeMusic() {
    // 由於瀏覽器政策，需要用戶互動才能播放音樂
    musicToggle.addEventListener('click', function() {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
            musicToggle.classList.remove('playing');
            musicToggle.classList.add('paused');
            isMusicPlaying = false;
        } else {
            bgMusic.play().then(() => {
                musicToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>';
                musicToggle.classList.remove('paused');
                musicToggle.classList.add('playing');
                isMusicPlaying = true;
            }).catch(error => {
                console.log('音樂播放失敗:', error);
                musicToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
                musicToggle.classList.remove('music');
                musicToggle.classList.add('paused');
                showMusicError();
            });
        }
    });

    // 監聽音樂播放狀態
    bgMusic.addEventListener('ended', function() {
        isMusicPlaying = false;
        musicToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
        musicToggle.classList.remove('playing');
        musicToggle.classList.add('paused');
    });

    bgMusic.addEventListener('pause', function() {
        isMusicPlaying = false;
        musicToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
        musicToggle.classList.remove('playing');
        musicToggle.classList.add('paused');
    });

    bgMusic.addEventListener('play', function() {
        isMusicPlaying = true;
        musicToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>';
        musicToggle.classList.remove('paused');
        musicToggle.classList.add('playing');
    });

    // 檢查音樂文件是否存在
    bgMusic.addEventListener('error', function() {
        showMusicError();
    });
}

// 影片控制
function initializeVideo() {
    const video = document.getElementById('birthdayVideo');
    if (video) {
        // 檢查影片文件是否存在
        video.addEventListener('error', function() {
            showVideoPlaceholder();
        });

        // 影片載入完成後隱藏佔位符
        video.addEventListener('loadeddata', function() {
            hideVideoPlaceholder();
        });
    }
}

// 顯示音樂錯誤提示
function showMusicError() {
    const prompt = document.createElement('div');
    prompt.className = 'music-error';
    prompt.innerHTML = `
        <div class="error-content">
            <p>🎵 音樂文件未找到</p>
            <p>請將你的音樂文件命名為 "your-music.mp3" 並放在網站目錄中</p>
            <button onclick="this.parentElement.parentElement.remove()">知道了</button>
        </div>
    `;
    prompt.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(139, 0, 0, 0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 1001;
        text-align: center;
        max-width: 300px;
    `;
    document.body.appendChild(prompt);
    
    setTimeout(() => {
        if (prompt.parentElement) {
            prompt.remove();
        }
    }, 5000);
}

// 顯示影片佔位符
function showVideoPlaceholder() {
    const video = document.getElementById('birthdayVideo');
    const placeholder = document.querySelector('.video-placeholder');
    
    if (video && placeholder) {
        video.style.display = 'none';
        placeholder.style.display = 'block';
    }
}

// 隱藏影片佔位符
function hideVideoPlaceholder() {
    const video = document.getElementById('birthdayVideo');
    const placeholder = document.querySelector('.video-placeholder');
    
    if (video && placeholder) {
        video.style.display = 'block';
        placeholder.style.display = 'none';
    }
}

// 頁面導航
function showSection(sectionId) {
    // 隱藏所有區段
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // 顯示目標區段
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // 添加進入動畫
        targetSection.style.animation = 'fadeInUp 0.5s ease-out';
        setTimeout(() => {
            targetSection.style.animation = '';
        }, 500);
    }

    // 如果是開場畫面，嘗試播放音樂
    if (sectionId === 'opening' && !isMusicPlaying) {
        showMusicPrompt();
    }

    // 如果是影片頁面，檢查影片
    if (sectionId === 'video') {
        const video = document.getElementById('birthdayVideo');
        if (video && video.readyState === 0) {
            showVideoPlaceholder();
        }
    }
}

// 顯示音樂播放提示
function showMusicPrompt() {
    const prompt = document.createElement('div');
    prompt.className = 'music-prompt';
    prompt.innerHTML = `
        <div class="prompt-content">
            <p>🎵 點擊右上角的音樂按鈕來播放背景音樂</p>
            <button onclick="this.parentElement.parentElement.remove()">知道了</button>
        </div>
    `;
    prompt.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(139, 0, 0, 0.8);
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 1001;
        text-align: center;
    `;
    document.body.appendChild(prompt);
    
    // 3秒後自動消失
    setTimeout(() => {
        if (prompt.parentElement) {
            prompt.remove();
        }
    }, 3000);
}

// 創建更多浮動愛心
function createFloatingHearts() {
    const heartsContainer = document.querySelector('.floating-hearts');
    const hearts = ['💖', '💕', '💗', '💙', '💚', '💛', '💜', '💙', '💚', '💛', '💜'];
    
    // 創建更多愛心元素
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('span');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 6 + 's';
        heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
        heartsContainer.appendChild(heart);
    }
}

// 照片點擊處理
function addPhotoClickHandlers() {
    const photoItems = document.querySelectorAll('.photo-placeholder img');
    photoItems.forEach((photo, index) => {
        photo.addEventListener('click', function() {
            showPhotoModal(this.src);
        });
    });
}

// 顯示照片模態框
function showPhotoModal(photoSrc) {
    const modal = document.createElement('div');
    modal.className = 'photo-modal';
    
    modal.innerHTML = `
        <img src="${photoSrc}" alt="Emma Chow" style="max-width: 90%; max-height: 90%; object-fit: contain; border-radius: 10px;">
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease-out;
        cursor: pointer;
    `;
    
    document.body.appendChild(modal);
    
    // 点击任意位置关闭模态框
    modal.addEventListener('click', () => modal.remove());
}

// 添加淡入動畫
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .music-prompt .prompt-content button,
    .music-error .error-content button {
        background: #8b0000;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        cursor: pointer;
        margin-top: 10px;
        font-weight: 500;
    }
    
    .music-prompt .prompt-content button:hover,
    .music-error .error-content button:hover {
        background: #a0522d;
    }
    
    .error-content p {
        margin-bottom: 10px;
        line-height: 1.4;
    }
`;
document.head.appendChild(style);

// 鍵盤快捷鍵
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case 'Escape':
            // 關閉模態框
            const modal = document.querySelector('.photo-modal');
            if (modal) {
                modal.remove();
            }
            break;
        case ' ':
            // 空格鍵切換音樂
            e.preventDefault();
            musicToggle.click();
            break;
        case 'v':
        case 'V':
            // V鍵切換到影片頁面
            if (document.getElementById('opening').classList.contains('active')) {
                showSection('video');
            }
            break;
        case 'h':
        case 'H':
            // H鍵回到首頁
            if (document.getElementById('video').classList.contains('active')) {
                showSection('opening');
            }
            break;
    }
});

// 觸摸設備優化
if ('ontouchstart' in window) {
    // 為觸摸設備添加額外的樣式
    const touchStyle = document.createElement('style');
    touchStyle.textContent = `
        .explore-btn, .nav-btn, .music-btn {
            min-height: 44px;
            min-width: 44px;
        }
        
        .photo-placeholder {
            min-height: 120px;
        }
        
        .days span {
            min-height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* 触摸反馈效果 */
        .touch-feedback {
            transition: transform 0.1s ease;
        }
        
        .touch-feedback:active {
            transform: scale(0.95);
        }
        
        /* 长按提示 */
        .long-press-hint {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .long-press-hint.show {
            opacity: 1;
        }
        
        /* 音乐可视化 */
        .music-visualizer {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(45deg, #ff6b6b, #ffd93d);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            z-index: 1000;
            animation: musicPulse 1s ease-in-out infinite alternate;
        }
        
        @keyframes musicPulse {
            from { transform: scale(1); }
            to { transform: scale(1.1); }
        }
        
        /* 生日倒计时 */
        .birthday-countdown {
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(45deg, #ff6b6b, #ffd93d);
            color: white;
            padding: 10px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: bold;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
    `;
    document.head.appendChild(touchStyle);
    
    // 添加触摸反馈
    const touchElements = document.querySelectorAll('.explore-btn, .nav-btn, .music-btn, .photo-placeholder, .days span');
    touchElements.forEach(element => {
        element.classList.add('touch-feedback');
    });
    
    // 添加长按提示
    const hint = document.createElement('div');
    hint.className = 'long-press-hint';
    hint.textContent = '💡 长按生日日期有惊喜！';
    document.body.appendChild(hint);
    
    // 显示提示
    setTimeout(() => {
        hint.classList.add('show');
        setTimeout(() => {
            hint.classList.remove('show');
        }, 3000);
    }, 2000);
    
    // 添加音乐可视化
    const visualizer = document.createElement('div');
    visualizer.className = 'music-visualizer';
    visualizer.innerHTML = '🎵';
    document.body.appendChild(visualizer);
    
    // 音乐播放时显示可视化
    const musicToggle = document.getElementById('musicToggle');
    if (musicToggle) {
        const originalClick = musicToggle.onclick;
        musicToggle.onclick = function() {
            if (originalClick) originalClick.call(this);
            if (isMusicPlaying) {
                visualizer.style.display = 'flex';
            } else {
                visualizer.style.display = 'none';
            }
        };
    }
    
    // 添加生日倒计时
    const countdown = document.createElement('div');
    countdown.className = 'birthday-countdown';
    document.body.appendChild(countdown);
    
    // 计算倒计时
    function updateCountdown() {
        const now = new Date();
        const birthday = new Date('2025-08-27');
        const diff = birthday - now;
        
        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            countdown.innerHTML = `🎂 ${days}天${hours}小时`;
        } else {
            countdown.innerHTML = '🎉 生日快乐！';
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 60000); // 每分钟更新一次
}

// 頁面可見性變化時暫停音樂
document.addEventListener('visibilitychange', function() {
    if (document.hidden && isMusicPlaying) {
        bgMusic.pause();
        musicToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
        musicToggle.classList.remove('playing');
        musicToggle.classList.add('paused');
        isMusicPlaying = false;
    }
});

// 添加一些隨機的互動效果
setInterval(() => {
    if (Math.random() < 0.05) { // 5% 機率
        const hearts = document.querySelectorAll('.floating-hearts span');
        hearts.forEach((heart, index) => {
            setTimeout(() => {
                heart.style.transform = 'scale(1.3) rotate(180deg)';
                setTimeout(() => {
                    heart.style.transform = '';
                }, 300);
            }, index * 100);
        });
    }
}, 8000);

// 日曆互動效果
document.addEventListener('DOMContentLoaded', function() {
    const calendarDays = document.querySelectorAll('.days span');
    calendarDays.forEach(day => {
        day.addEventListener('click', function() {
            if (this.classList.contains('birthday')) {
                this.style.animation = 'pulse 0.5s ease-in-out';
                setTimeout(() => {
                    this.style.animation = '';
                }, 500);
            }
        });
    });
});

// 添加脈衝動畫
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
    }
    
    @keyframes confetti {
        0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    
    .shake-animation {
        animation: shake 0.5s ease-in-out;
    }
    
    .bounce-animation {
        animation: bounce 1s ease-in-out;
    }
    
    .confetti {
        position: fixed;
        width: 10px;
        height: 10px;
        pointer-events: none;
        z-index: 9999;
        animation: confetti 3s linear forwards;
    }
    
    .birthday-highlight {
        background: linear-gradient(45deg, #ff6b6b, #ffd93d, #6bcf7f, #4d96ff);
        background-size: 400% 400%;
        animation: gradientShift 2s ease infinite;
        border-radius: 10px;
        padding: 5px;
        color: white;
        font-weight: bold;
    }
    
    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
`;
document.head.appendChild(pulseStyle);

// 移动端互动功能
function initializeMobileInteractions() {
    // 长按生日日期显示特殊效果
    const birthdayElement = document.querySelector('.birthday');
    if (birthdayElement) {
        let pressTimer;
        
        birthdayElement.addEventListener('touchstart', function(e) {
            pressTimer = setTimeout(() => {
                this.classList.add('birthday-highlight');
                createConfetti();
                showBirthdayMessage();
            }, 500);
        });
        
        birthdayElement.addEventListener('touchend', function() {
            clearTimeout(pressTimer);
        });
        
        birthdayElement.addEventListener('touchmove', function() {
            clearTimeout(pressTimer);
        });
    }
    
    // 双击照片区域显示惊喜
    const photoSection = document.querySelector('.photo-section');
    if (photoSection) {
        let lastTap = 0;
        photoSection.addEventListener('touchend', function(e) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                // 双击检测
                showSurpriseMessage();
                createConfetti();
            }
            lastTap = currentTime;
        });
    }
    
    // 摇晃手机触发特效
    if ('DeviceMotionEvent' in window) {
        let lastUpdate = 0;
        let lastX = 0, lastY = 0, lastZ = 0;
        
        window.addEventListener('devicemotion', function(e) {
            const currentTime = new Date().getTime();
            if (currentTime - lastUpdate > 100) {
                const diffTime = currentTime - lastUpdate;
                lastUpdate = currentTime;
                
                const acceleration = e.accelerationIncludingGravity;
                if (!acceleration) return;
                
                const speed = Math.abs(acceleration.x + acceleration.y + acceleration.z - lastX - lastY - lastZ) / diffTime * 10000;
                
                if (speed > 800) {
                    // 检测到摇晃
                    shakeEffect();
                }
                
                lastX = acceleration.x;
                lastY = acceleration.y;
                lastZ = acceleration.z;
            }
        });
    }
}

// 生日动画
function initializeBirthdayAnimations() {
    // 点击Emma名字时的特效
    const nameTitle = document.querySelector('.name-title');
    if (nameTitle) {
        nameTitle.addEventListener('click', function() {
            this.classList.add('bounce-animation');
            createConfetti();
            setTimeout(() => {
                this.classList.remove('bounce-animation');
            }, 1000);
        });
    }
    
    // 点击祝福文字时的特效
    const birthdayMessage = document.querySelector('.birthday-message');
    if (birthdayMessage) {
        birthdayMessage.addEventListener('click', function() {
            this.classList.add('shake-animation');
            setTimeout(() => {
                this.classList.remove('shake-animation');
            }, 500);
        });
    }
}

// 照片滑动功能
function initializePhotoSwipe() {
    // 移除滑动功能，保持简单的照片查看
    const photos = document.querySelectorAll('.photo-placeholder img');
    
    photos.forEach((photo) => {
        photo.addEventListener('click', function() {
            // 直接显示照片，不添加滑动功能
            showPhotoModal(this.src);
        });
    });
}

// 彩带效果
function initializeConfetti() {
    // 彩带创建函数
    window.createConfetti = function() {
        const colors = ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4d96ff', '#ff8e8e', '#ffb366'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 2 + 's';
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 3000);
            }, i * 50);
        }
    };
}

// 摇晃特效
function shakeEffect() {
    const card = document.querySelector('.birthday-card');
    if (card) {
        card.classList.add('shake-animation');
        createConfetti();
        setTimeout(() => {
            card.classList.remove('shake-animation');
        }, 500);
    }
}

// 生日消息
function showBirthdayMessage() {
    const message = document.createElement('div');
    message.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #ff6b6b, #ffd93d);
            color: white;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            z-index: 1001;
            font-weight: bold;
            font-size: 1.2rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        ">
            🎂 Happy Birthday Emma! 🎂<br>
            🎉 生日快乐 Emma! 🎉
        </div>
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// 惊喜消息
function showSurpriseMessage() {
    const message = document.createElement('div');
    message.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #4d96ff, #6bcf7f);
            color: white;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            z-index: 1001;
            font-weight: bold;
            font-size: 1.1rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        ">
             惊喜！ <br>
            你发现了隐藏功能！
        </div>
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 2000);
} 