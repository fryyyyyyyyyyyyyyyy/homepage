// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavbar();
    initDataCounters();
    initParticles();
    initEasterEgg();
    initFluidBackground();
    initNeuralLights();
    initMeritClick();
    initSmoothScroll();
    initTravelMap();
    loadRunningData();
    initTerminal();
});

// 主题切换功能
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');

    // 从 localStorage 读取保存的主题
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme, themeIcon);

    // 切换主题
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme, themeIcon);

        // 重新绘制跑步轨迹以更新颜色
        setTimeout(() => {
            const trackMatrix = document.getElementById('trackMatrix');
            if (trackMatrix && trackMatrix.children.length > 0) {
                // 遍历所有已绘制的轨迹，重新绘制
                const trackItems = trackMatrix.querySelectorAll('.track-item');
                trackItems.forEach((item, index) => {
                    const canvas = item.querySelector('canvas');
                    if (canvas && window.RUNNING_DATA) {
                        const filteredRuns = window.RUNNING_DATA.runs.filter(r => r.distance >= 0.5 && r.pace <= 10);
                        if (filteredRuns[index]) {
                            drawTrack(canvas, filteredRuns[index].points, index);
                        }
                    }
                });
            }
        }, 100);
    });
}

// 更新主题图标
function updateThemeIcon(theme, iconElement) {
    if (theme === 'light') {
        // 月亮图标（夜间模式）
        iconElement.innerHTML = `
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        `;
    } else {
        // 太阳图标（日间模式）
        iconElement.innerHTML = `
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        `;
    }
}

// 平滑滚动并防止焦点闪烁
function initSmoothScroll() {
    // 导航链接的平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // 获取导航栏高度
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;

                // 计算目标位置（考虑导航栏高度，再减去一点额外空间）
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

                // 平滑滚动到目标位置
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // 防止焦点设置到目标元素，避免光标闪烁
                setTimeout(() => {
                    if (document.activeElement) {
                        document.activeElement.blur();
                    }
                    // 移除 tabindex 避免焦点
                    targetElement.setAttribute('tabindex', '-1');
                }, 100);
            }
        });
    });

    // 让所有标题可点击并滚动到顶部
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
        // 添加点击样式提示
        heading.style.cursor = 'pointer';
        heading.style.transition = 'color 0.2s ease';
        heading.style.userSelect = 'none'; // 防止文字被选中

        heading.addEventListener('click', function(e) {
            e.preventDefault();
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = this.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // 立即移除焦点，防止光标闪烁
            this.blur();
            if (document.activeElement === this) {
                document.activeElement.blur();
            }
        });

        // 悬停效果
        heading.addEventListener('mouseenter', function() {
            this.style.color = 'var(--accent)';
        });

        heading.addEventListener('mouseleave', function() {
            this.style.color = '';
        });
    });
}

// 神经网络式呼吸光点
function initNeuralLights() {
    const container = document.getElementById('neuralLights');
    if (!container) return;

    // 只在暗黑模式下显示
    const updateLightsVisibility = () => {
        const theme = document.documentElement.getAttribute('data-theme');
        container.style.display = theme === 'dark' ? 'block' : 'none';
    };

    updateLightsVisibility();

    // 监听主题切换
    const observer = new MutationObserver(updateLightsVisibility);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });

    // 生成随机光点
    const lightCount = 15; // 光点数量

    for (let i = 0; i < lightCount; i++) {
        const light = document.createElement('div');
        light.className = 'neural-light';

        // 随机位置
        const x = Math.random() * 100;
        const y = Math.random() * 100;

        // 随机大小 (150px - 400px)
        const size = 150 + Math.random() * 250;

        // 随机动画时长 (6s - 12s)
        const duration = 6 + Math.random() * 6;

        // 随机延迟 (0s - 8s)
        const delay = Math.random() * 8;

        light.style.left = `${x}%`;
        light.style.top = `${y}%`;
        light.style.width = `${size}px`;
        light.style.height = `${size}px`;
        light.style.animationDuration = `${duration}s`;
        light.style.animationDelay = `${delay}s`;

        container.appendChild(light);
    }
}

// 鼠标粒子拖尾效果 - 光圈波纹
function initCursorTrail() {
    let lastTime = 0;
    const throttleDelay = 50; // 每50ms生成一个波纹

    document.addEventListener('mousemove', (e) => {
        const currentTime = Date.now();

        // 节流：避免生成过多粒子
        if (currentTime - lastTime < throttleDelay) return;
        lastTime = currentTime;

        // 创建波纹
        const particle = document.createElement('div');
        particle.className = 'cursor-particle';

        // 随机大小 (20px - 40px)
        const size = 20 + Math.random() * 20;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // 设置位置（居中对齐鼠标）
        particle.style.left = `${e.clientX - size / 2}px`;
        particle.style.top = `${e.clientY - size / 2}px`;

        document.body.appendChild(particle);

        // 动画结束后移除粒子
        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    });
}

// 点击头像功德+1效果
function initMeritClick() {
    const profileImage = document.querySelector('.profile-image-inline');
    if (!profileImage) return;

    profileImage.addEventListener('click', (e) => {
        // 创建功德文字
        const meritText = document.createElement('div');
        meritText.className = 'merit-text';
        meritText.textContent = '功德+1';

        // 设置位置（从头像居中靠上开始）
        const rect = profileImage.getBoundingClientRect();
        meritText.style.left = `${rect.left + rect.width / 2 - 30}px`; // 居中
        meritText.style.top = `${rect.top + rect.height * 0.15}px`; // 更靠上（15%位置）

        // 随机水平偏移，避免重叠
        const offsetX = (Math.random() - 0.5) * 40;
        meritText.style.transform = `translateX(${offsetX}px)`;

        document.body.appendChild(meritText);

        // 动画结束后移除
        meritText.addEventListener('animationend', () => {
            meritText.remove();
        });
    });
}

// 液态背景动画
function initFluidBackground() {
    const body = document.body;
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;

        const theme = document.documentElement.getAttribute('data-theme');

        if (theme === 'light') {
            body.style.background = `
                linear-gradient(135deg,
                    hsl(${230 + mouseX * 10}, 45%, ${82 + mouseY * 5}%) 0%,
                    hsl(${240 + mouseX * 10}, 40%, ${75 + mouseY * 5}%) 50%,
                    hsl(${250 + mouseX * 10}, 35%, ${68 + mouseY * 5}%) 100%)
            `;
        } else {
            body.style.background = `
                linear-gradient(135deg,
                    hsl(${220 + mouseX * 20}, 100%, ${3 + mouseY * 2}%) 0%,
                    hsl(${230 + mouseX * 15}, 80%, ${8 + mouseY * 3}%) 50%,
                    hsl(${215 + mouseX * 10}, 70%, ${6 + mouseY * 2}%) 100%)
            `;
        }
    });
}

// 导航栏滚动效果 - 增强液态玻璃
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.08)';
            navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.05)';
            navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
        }
    });

    // 导航链接高亮
    const sections = document.querySelectorAll('.section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// 数据计数器动画
function initDataCounters() {
    const dataCards = document.querySelectorAll('.data-card');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const valueElement = entry.target.querySelector('.data-value');
                const target = parseInt(valueElement.getAttribute('data-target'));
                animateCounter(valueElement, target);
                animateChart(entry.target.querySelector('.data-chart'));
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    dataCards.forEach(card => observer.observe(card));
}

// 数字递增动画
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 1500;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, stepTime);
}

// 图表动画 - 液态玻璃风格
function animateChart(chartElement) {
    const bars = 20;
    chartElement.innerHTML = '';

    for (let i = 0; i < bars; i++) {
        const bar = document.createElement('div');
        const height = Math.random() * 80 + 20;
        bar.style.cssText = `
            display: inline-block;
            width: ${100 / bars}%;
            height: ${height}%;
            background: linear-gradient(180deg,
                rgba(0, 122, 255, 0.6),
                rgba(88, 86, 214, 0.3));
            margin: 0;
            vertical-align: bottom;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            animation: barGrow 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.05}s backwards;
            border-radius: 4px 4px 0 0;
            box-shadow: 0 0 10px rgba(0, 122, 255, 0.3);
        `;
        chartElement.appendChild(bar);
    }

    // 添加条形图增长动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes barGrow {
            from {
                height: 0%;
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// 粒子背景效果 - 液态玻璃风格
function initParticles() {
    const canvas = document.getElementById('particleCanvas');

    // 如果 canvas 不存在，直接返回
    if (!canvas) {
        console.log('Particle canvas not found, skipping initialization');
        return;
    }

    const ctx = canvas.getContext('2d');

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = [];
    const particleCount = 100;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 3 + 1;
            this.opacity = Math.random() * 0.5 + 0.3;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
            gradient.addColorStop(0, `rgba(0, 122, 255, ${this.opacity})`);
            gradient.addColorStop(0.5, `rgba(88, 86, 214, ${this.opacity * 0.5})`);
            gradient.addColorStop(1, 'rgba(0, 122, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // 绘制连接线 - 液态效果
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    const opacity = 0.3 * (1 - distance / 120);
                    const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                    gradient.addColorStop(0, `rgba(0, 122, 255, ${opacity})`);
                    gradient.addColorStop(1, `rgba(88, 86, 214, ${opacity})`);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    animate();

    // 响应窗口大小变化
    window.addEventListener('resize', () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    });
}

// 彩蛋交互 - 液态玻璃效果
function initEasterEgg() {
    const easterBox = document.getElementById('easterBox');

    // 如果 easterBox 不存在（已被终端替换），直接返回
    if (!easterBox) {
        console.log('Easter egg box not found, skipping initialization');
        return;
    }

    let clickCount = 0;
    const messages = [
        '再点一次试试？',
        '继续点击...',
        '你很有耐心！',
        '快要发现秘密了...',
        '🎉 恭喜你发现了彩蛋！'
    ];

    easterBox.addEventListener('click', () => {
        clickCount++;

        if (clickCount < messages.length) {
            easterBox.querySelector('p').textContent = messages[clickCount];
            easterBox.style.transform = `scale(${1 + clickCount * 0.05}) rotate(${clickCount * 3}deg)`;
        } else {
            // 最终彩蛋效果
            triggerConfetti();
            easterBox.querySelector('p').textContent = '🎊 你真棒！';
            easterBox.style.background = 'rgba(0, 122, 255, 0.2)';
            easterBox.style.borderColor = 'rgba(0, 122, 255, 0.5)';
            easterBox.style.boxShadow = '0 12px 48px rgba(0, 122, 255, 0.4), 0 0 0 1px rgba(0, 122, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
        }

        // 添加点击动画
        easterBox.style.animation = 'none';
        setTimeout(() => {
            easterBox.style.animation = 'pulse 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 10);
    });

    // 添加脉冲动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
        }
    `;
    document.head.appendChild(style);
}


// 彩纸效果 - 液态玻璃风格
function triggerConfetti() {
    const colors = ['rgba(0, 122, 255, 0.8)', 'rgba(88, 86, 214, 0.8)', 'rgba(175, 82, 222, 0.8)', 'rgba(255, 149, 0, 0.8)'];
    const confettiCount = 80;
    const container = document.querySelector('.easter-container');

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        const size = Math.random() * 12 + 6;
        confetti.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: 50%;
            left: 50%;
            opacity: 1;
            pointer-events: none;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            box-shadow: 0 0 10px ${colors[Math.floor(Math.random() * colors.length)]};
            animation: confettiFall${i} ${Math.random() * 2 + 2}s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            transform: rotate(${Math.random() * 360}deg);
        `;
        container.appendChild(confetti);

        const style = document.createElement('style');
        style.textContent = `
            @keyframes confettiFall${i} {
                to {
                    top: ${100 + Math.random() * 20}%;
                    left: ${Math.random() * 100}%;
                    opacity: 0;
                    transform: rotate(${Math.random() * 720 - 360}deg) scale(0.5);
                }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => confetti.remove(), 4000);
    }
}

// 初始化旅行地图 - 使用高德地图
function initTravelMap() {
    // 地图主题配置（可以随时切换）
    const mapThemes = {
        dark: 'amap://styles/dark',           // 深色
        light: 'amap://styles/light',         // 浅色
        darkblue: 'amap://styles/darkblue',   // 极夜蓝（推荐）
        macaron: 'amap://styles/macaron',     // 马卡龙（推荐）
        blue: 'amap://styles/blue',           // 靛青蓝
        fresh: 'amap://styles/fresh',         // 草色青
        grey: 'amap://styles/grey',           // 雅士灰
        graffiti: 'amap://styles/graffiti',   // 涂鸦
        whitesmoke: 'amap://styles/whitesmoke', // 远山黛
        wine: 'amap://styles/wine'            // 酱籽
    };

    // 选择你喜欢的主题（改这里！）
    const darkTheme = 'darkblue';   // 深色模式下的主题
    const lightTheme = 'macaron';   // 浅色模式下的主题

    // 创建地图实例
    const map = new AMap.Map('travelMap', {
        zoom: 5,
        center: [110.0, 35.0],
        viewMode: '3D',
        pitch: 20,  // 倾斜角度，调小了 (0-83)，20度比较舒适
        mapStyle: mapThemes[darkTheme],
        showLabel: true,
        showBuildingBlock: true
    });

    // 定义去过的地方（只需要城市名和坐标）
    const places = [
        { name: '上海', coords: [121.4737, 31.2304] },
        { name: '常州', coords: [119.9692, 31.8122] },
        { name: '丹阳', coords: [119.6059, 32.0104] },
        { name: '北京', coords: [116.4074, 39.9042] },
        { name: '杭州', coords: [120.1551, 30.2741] },
        { name: '济南', coords: [117.1205, 36.6519] },
        { name: '青岛', coords: [120.3826, 36.0671] },
        { name: '福州', coords: [119.2965, 26.0745] },
        { name: '平潭', coords: [119.7909, 25.4983] },
        { name: '长沙', coords: [112.9388, 28.2282] },
        { name: '贵阳', coords: [106.6302, 26.6477] },
        { name: '安顺', coords: [105.9476, 26.2455] },
        { name: '毕节', coords: [105.2863, 27.3017] },
        { name: '铜仁', coords: [109.1895, 27.7183] },
        { name: '泰州', coords: [119.9229, 32.4849] },
        { name: '扬州', coords: [119.4129, 32.3912] },
        { name: '无锡', coords: [120.3019, 31.5747] },
        { name: '苏州', coords: [120.5954, 31.2989] },
        { name: '南京', coords: [118.7969, 32.0603] },
        { name: '海口', coords: [110.3312, 20.0311] },
        { name: '三亚', coords: [109.5082, 18.2528] },
        { name: '武汉', coords: [114.3055, 30.5931] },
        { name: '恩施', coords: [109.4869, 30.2729] },
        { name: '重庆', coords: [106.5516, 29.5630] },
        { name: '广安', coords: [106.6333, 30.4564] },
        { name: '乐山', coords: [103.7614, 29.5522] },
        { name: '眉山', coords: [103.8485, 30.0757] },
        { name: '南充', coords: [106.0826, 30.7993] },
        { name: '昆明', coords: [102.8329, 24.8801] },
        { name: '丽江', coords: [100.2270, 26.8551] },
        { name: '迪庆', coords: [99.7065, 27.8269] },
        { name: '九江', coords: [116.0019, 29.7051] },
        { name: '南昌', coords: [115.8581, 28.6832] },
        { name: '西安', coords: [108.9398, 34.3416] },
        { name: '渭南', coords: [109.5097, 34.4995] },
        { name: '京都', coords: [135.7681, 35.0116] },
        { name: '大阪', coords: [135.5022, 34.6937] },
        { name: '乌鲁木齐', coords: [87.6168, 43.8256] },
        { name: '伊犁', coords: [81.3179, 43.9167] },
        { name: '博尔塔拉', coords: [82.0667, 44.9000] },
        { name: '奎屯', coords: [84.9030, 44.4260] },
        { name: '兰州', coords: [103.8343, 36.0611] },
        { name: '西宁', coords: [101.7782, 36.6171] },
        { name: '海西', coords: [97.3708, 37.3747] },
        { name: '海北', coords: [100.9010, 36.9542] },
        { name: '海南', coords: [100.6196, 36.2804] },
        { name: '巴音郭楞', coords: [86.1459, 41.7686] },
        { name: '黄山', coords: [118.3378, 29.7146] },
        { name: '池州', coords: [117.4893, 30.6600] },
        { name: '湖州', coords: [120.0867, 30.8940] },
        { name: '宣城', coords: [118.7587, 30.9456] },
        { name: '绍兴', coords: [120.5820, 30.0291] },
        { name: '嘉兴', coords: [120.7505, 30.7462] },
        { name: '丽水', coords: [119.9220, 28.4517] },
        { name: '上饶', coords: [117.9434, 28.4444] }
    ];

    // 添加标记点
    places.forEach(place => {
        // 使用图片作为标记
        const markerContent = `
            <div class="amap-marker-pin-style">
                <img src="location.png" class="pin-image" alt="location pin">
            </div>
        `;

        const marker = new AMap.Marker({
            position: place.coords,
            content: markerContent,
            offset: new AMap.Pixel(-16, -40),
            title: place.name
        });

        // 创建简洁的信息窗体（只显示地名）
        const infoWindow = new AMap.InfoWindow({
            content: `<div class="amap-simple-label">${place.name}</div>`,
            offset: new AMap.Pixel(0, -36),
            closeWhenClickMap: true
        });

        // 鼠标悬停显示地名
        marker.on('mouseover', () => {
            infoWindow.open(map, place.coords);
        });

        // 鼠标移出隐藏地名
        marker.on('mouseout', () => {
            infoWindow.close();
        });

        marker.setMap(map);
    });

    // 根据主题切换地图样式
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            setTimeout(() => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                if (currentTheme === 'light') {
                    map.setMapStyle(mapThemes[lightTheme]);
                } else {
                    map.setMapStyle(mapThemes[darkTheme]);
                }
            }, 100);
        });
    }

    // 初始化时根据当前主题设置地图样式
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'light') {
        map.setMapStyle(mapThemes[lightTheme]);
    }
}

// 睡眠数据可视化
let sleepData = null;
let sleepCharts = {};

async function loadSleepData() {
    try {
        // 使用内嵌的数据
        if (window.SLEEP_DATA) {
            sleepData = window.SLEEP_DATA;
            updateSleepStats();
            renderSleepCharts('90', false); // 默认显示最近90天，不立即动画
        } else {
            console.error('睡眠数据未加载');
        }
    } catch (error) {
        console.error('睡眠数据加载失败:', error);
    }
}

function updateSleepStats() {
    const stats = sleepData.statistics;
    document.getElementById('sleepTotalDays').textContent = stats.totalDays;
    document.getElementById('sleepAvgHours').textContent = stats.avgSleepHours;

    // 初始化所有日期范围显示
    updateAllDateRanges();
}

function updateAllDateRanges() {
    const stats = sleepData.statistics;
    const ranges = ['30', '90', '180', '365', 'all'];

    ranges.forEach(range => {
        let startDate, endDate;

        if (range === 'all') {
            startDate = stats.dateRange.start;
            endDate = stats.dateRange.end;
        } else {
            const days = parseInt(range);
            const end = new Date(stats.dateRange.end);
            const start = new Date(end);
            start.setDate(start.getDate() - days);
            startDate = start.toISOString().split('T')[0];
            endDate = stats.dateRange.end;
        }

        // 格式化显示：YYYYMMDD - YYYYMMDD
        const formatDate = (dateStr) => dateStr.replace(/-/g, '');
        const dateText = `${formatDate(startDate)} - ${formatDate(endDate)}`;

        const element = document.getElementById(`range-${range}`);
        if (element) {
            element.textContent = dateText;
        }
    });
}

function updateDateRangeDisplay(range) {
    // 这个函数现在不需要了，因为所有日期都已经预先计算好了
}

function filterSleepData(days) {
    if (days === 'all') return sleepData.dailyData;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return sleepData.dailyData.filter(d => new Date(d.date) >= cutoffDate);
}

function renderSleepCharts(days = 'all', animate = true) {
    const filteredData = filterSleepData(days);

    // 销毁旧图表
    Object.values(sleepCharts).forEach(chart => chart.destroy());
    sleepCharts = {};

    // 根据数据量计算延迟，确保总动画时间在2-3秒
    const dataCount = filteredData.length;
    const maxDelay = 1500; // 最大延迟总时长1.5秒
    const delayPerPoint = Math.min(30, maxDelay / dataCount); // 每个点的延迟

    // 获取当前主题
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(29, 29, 31, 0.8)';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    // 睡眠时长趋势
    const ctx1 = document.getElementById('sleepDurationChart').getContext('2d');

    sleepCharts.duration = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: filteredData.map(d => d.date.replace(/-/g, '')),
            datasets: [{
                label: '总睡眠时长（小时）',
                data: filteredData.map(d => (d.totalAsleep / 60).toFixed(1)),
                borderColor: '#007aff',
                backgroundColor: 'rgba(0, 122, 255, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 2,
                pointHoverRadius: 5,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: animate ? {
                duration: 1500,
                easing: 'easeInOutQuart',
                delay: (context) => {
                    let delay = 0;
                    if (context.type === 'data' && context.mode === 'default') {
                        delay = context.dataIndex * delayPerPoint;
                    }
                    return delay;
                }
            } : false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: textColor,
                        font: {
                            family: "'Outfit', 'Noto Sans SC', sans-serif",
                            size: 12
                        },
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 15,
                        boxWidth: 6,
                        boxHeight: 6
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 4,
                    max: 10,
                    title: {
                        display: true,
                        text: '小时',
                        color: textColor,
                        font: {
                            size: 14,
                            weight: '500'
                        }
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            size: 13
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        maxTicksLimit: 10,
                        color: textColor,
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });

    // 睡眠阶段分布
    const ctx2 = document.getElementById('sleepStagesChart').getContext('2d');
    sleepCharts.stages = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: filteredData.map(d => d.date.replace(/-/g, '')),
            datasets: [
                {
                    label: '深睡（分钟）',
                    data: filteredData.map(d => d.deepMinutes),
                    backgroundColor: '#4c51bf',
                    stack: 'stack0'
                },
                {
                    label: 'REM（分钟）',
                    data: filteredData.map(d => d.remMinutes),
                    backgroundColor: '#667eea',
                    stack: 'stack0'
                },
                {
                    label: '浅睡（分钟）',
                    data: filteredData.map(d => d.coreMinutes),
                    backgroundColor: '#9f7aea',
                    stack: 'stack0'
                },
                {
                    label: '清醒（分钟）',
                    data: filteredData.map(d => d.awakeMinutes),
                    backgroundColor: '#ed8936',
                    stack: 'stack0'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: animate ? {
                duration: 1500,
                easing: 'easeInOutQuart',
                delay: (context) => {
                    let delay = 0;
                    if (context.type === 'data' && context.mode === 'default') {
                        delay = context.dataIndex * delayPerPoint;
                    }
                    return delay;
                }
            } : false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: textColor,
                        font: {
                            family: "'Outfit', 'Noto Sans SC', sans-serif",
                            size: 12
                        },
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 15,
                        boxWidth: 6,
                        boxHeight: 6
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        maxTicksLimit: 10,
                        color: textColor,
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: '分钟',
                        color: textColor,
                        font: {
                            size: 14,
                            weight: '500'
                        }
                    },
                    ticks: {
                        color: textColor,
                        font: {
                            size: 13
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                }
            }
        }
    });
}

// 时间范围选择器
document.querySelectorAll('.sleep-dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
        const range = e.currentTarget.getAttribute('data-range');

        // 更新激活状态
        document.querySelectorAll('.sleep-dropdown-item').forEach(i => i.classList.remove('active'));
        e.currentTarget.classList.add('active');

        // 更新按钮文本
        const label = e.currentTarget.querySelector('.sleep-range-label').textContent;
        document.getElementById('sleepRangeText').textContent = label;

        // 更新图表
        renderSleepCharts(range);
    });
});

// 滚动动画监听
const sleepChartsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // 每次进入视口都触发动画
            const currentRange = document.querySelector('.sleep-dropdown-item.active')?.getAttribute('data-range') || '90';
            renderSleepCharts(currentRange, true);
        }
    });
}, {
    threshold: 0.2 // 当20%的图表可见时触发
});

// 监听睡眠图表容器
const sleepContainer = document.querySelector('.sleep-container');
if (sleepContainer) {
    sleepChartsObserver.observe(sleepContainer);
}

// 主题切换时更新图表颜色
const originalInitTheme = initTheme;
initTheme = function() {
    originalInitTheme();
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        setTimeout(() => {
            if (sleepData) {
                const currentRange = document.getElementById('sleepTimeRange')?.value || 'all';
                renderSleepCharts(currentRange);
            }
        }, 100);
    });
};

// 在页面加载时初始化睡眠数据
document.addEventListener('DOMContentLoaded', () => {
    loadSleepData();
});

// 跑步轨迹滚动动画监听
const trackMatrixObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // 每次进入视口都重新触发动画
            renderTrackMatrix();
        }
    });
}, {
    threshold: 0.1 // 当10%的矩阵可见时触发
});

// 监听跑步轨迹容器
const runningContainer = document.querySelector('.running-container');
if (runningContainer) {
    trackMatrixObserver.observe(runningContainer);
}

// 跑步数据可视化
let runningData = null;

function loadRunningData() {
    try {
        if (window.RUNNING_DATA) {
            runningData = window.RUNNING_DATA;
            updateRunningStats();
            renderTrackMatrix();
        } else {
            console.error('跑步数据未加载');
        }
    } catch (error) {
        console.error('跑步数据加载失败:', error);
    }
}

function updateRunningStats() {
    // 只统计距离 >= 0.5km 且配速 <= 10 min/km 的跑步记录
    const validRuns = runningData.runs.filter(run => run.distance >= 0.5 && run.pace <= 10);

    const totalRuns = validRuns.length;
    const totalDistance = validRuns.reduce((sum, run) => sum + run.distance, 0);
    const totalDuration = validRuns.reduce((sum, run) => sum + run.duration, 0);
    const avgPace = totalDistance > 0 ? (totalDuration / 60 / totalDistance) : 0;

    document.getElementById('runningTotalRuns').textContent = totalRuns;
    document.getElementById('runningTotalDistance').textContent = totalDistance.toFixed(1);

    // 格式化配速为 分'秒"
    const paceMinutes = Math.floor(avgPace);
    const paceSeconds = Math.round((avgPace - paceMinutes) * 60);
    document.getElementById('runningAvgPace').textContent = `${paceMinutes}'${paceSeconds.toString().padStart(2, '0')}"`;
}

function renderTrackMatrix() {
    const container = document.getElementById('trackMatrix');

    // 清空容器
    container.innerHTML = '';

    // 只显示距离 >= 0.5km 且配速 <= 10 min/km 的跑步记录
    const filteredRuns = runningData.runs.filter(run => run.distance >= 0.5 && run.pace <= 10);

    // 创建随机延迟数组
    const delays = filteredRuns.map(() => Math.random() * 2000); // 0-2秒随机延迟

    filteredRuns.forEach((run, index) => {
        const trackItem = document.createElement('div');
        trackItem.className = 'track-item';
        trackItem.style.opacity = '0';
        trackItem.style.transform = 'scale(0.5)';

        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        trackItem.appendChild(canvas);

        // 绘制轨迹
        drawTrack(canvas, run.points, index);

        // 添加悬停事件
        trackItem.addEventListener('mouseenter', (e) => {
            showTooltip(e, run);
        });

        trackItem.addEventListener('mousemove', (e) => {
            updateTooltipPosition(e);
        });

        trackItem.addEventListener('mouseleave', () => {
            hideTooltip();
        });

        container.appendChild(trackItem);

        // 随机延迟后显示动画
        setTimeout(() => {
            trackItem.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            trackItem.style.opacity = '1';
            trackItem.style.transform = 'scale(1)';
        }, delays[index]);
    });
}

function drawTrack(canvas, points, index) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 10;
    const drawWidth = width - padding * 2;
    const drawHeight = height - padding * 2;

    // 清空画布
    ctx.clearRect(0, 0, width, height);

    // 获取当前跑步的距离，用于计算颜色深浅
    let distance = 5; // 默认值
    if (window.runningData && window.runningData.runs) {
        const filteredRuns = window.runningData.runs.filter(r => r.distance >= 0.5 && r.pace <= 10);
        if (filteredRuns[index]) {
            distance = filteredRuns[index].distance;
        }
    }

    // 根据距离计算颜色深浅 (距离越长，颜色越深)
    // 假设距离范围 0.5km - 15km
    const minDistance = 0.5;
    const maxDistance = 15;
    const normalizedDistance = Math.min(Math.max((distance - minDistance) / (maxDistance - minDistance), 0), 1);

    // 根据主题选择基础色调
    const currentTheme = document.documentElement.getAttribute('data-theme');
    let color;

    if (currentTheme === 'light') {
        // 浅色模式：蓝色系，从中蓝到深蓝（更深，更容易看清）
        const lightness = 55 - normalizedDistance * 30; // 55% -> 25%
        color = `hsl(210, 85%, ${lightness}%)`;
    } else {
        // 深色模式：青色系，从亮青到深青（增加对比度）
        const lightness = 70 - normalizedDistance * 40; // 70% -> 30%
        color = `hsl(180, 75%, ${lightness}%)`;
    }

    console.log(`Track ${index}: distance=${distance.toFixed(2)}km, normalized=${normalizedDistance.toFixed(2)}, color=${color}`);

    // 绘制轨迹
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    points.forEach((point, i) => {
        const x = padding + point[0] * drawWidth;
        const y = padding + (1 - point[1]) * drawHeight; // Y轴翻转

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();

    // 绘制起点（小圆点）
    if (points.length > 0) {
        const startX = padding + points[0][0] * drawWidth;
        const startY = padding + (1 - points[0][1]) * drawHeight;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(startX, startY, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

function showTooltip(e, run) {
    const tooltip = document.getElementById('trackTooltip');

    if (!tooltip) return;

    // 格式化时长
    const hours = Math.floor(run.duration / 3600);
    const minutes = Math.floor((run.duration % 3600) / 60);
    const seconds = run.duration % 60;
    let durationStr = '';
    if (hours > 0) {
        durationStr = `${hours}h ${minutes}m`;
    } else {
        durationStr = `${minutes}m ${seconds}s`;
    }

    // 格式化配速
    const paceMinutes = Math.floor(run.pace);
    const paceSeconds = Math.round((run.pace - paceMinutes) * 60);
    const paceStr = `${paceMinutes}'${paceSeconds.toString().padStart(2, '0')}"`;

    tooltip.querySelector('.tooltip-date').textContent = run.date;
    tooltip.querySelector('.tooltip-distance').textContent = `距离: ${run.distance} km`;
    tooltip.querySelector('.tooltip-duration').textContent = `时长: ${durationStr}`;
    tooltip.querySelector('.tooltip-pace').textContent = `配速: ${paceStr}/km`;

    tooltip.classList.add('show');
    tooltip.style.opacity = '1';
    tooltip.style.visibility = 'visible';

    updateTooltipPosition(e);
}

function updateTooltipPosition(e) {
    const tooltip = document.getElementById('trackTooltip');
    const offset = 15;

    tooltip.style.left = (e.clientX + offset) + 'px';
    tooltip.style.top = (e.clientY + offset) + 'px';
}

function hideTooltip() {
    const tooltip = document.getElementById('trackTooltip');
    tooltip.classList.remove('show');

    // 强制隐藏
    tooltip.style.opacity = '0';
    tooltip.style.visibility = 'hidden';
}

// 终端模拟器初始化
function initTerminal() {
    const terminal = new Terminal();
}

// 终端模拟器类
class Terminal {
    constructor() {
        this.output = document.getElementById('output');
        this.input = document.getElementById('terminalInput');
        this.body = document.getElementById('terminalBody');
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentPath = '~';

        this.commands = {
            help: this.showHelp.bind(this),
            about: this.showAbout.bind(this),
            skills: this.showSkills.bind(this),
            projects: this.showProjects.bind(this),
            contact: this.showContact.bind(this),
            clear: this.clearTerminal.bind(this),
            ls: this.listFiles.bind(this),
            cat: this.catFile.bind(this),
            whoami: this.whoami.bind(this),
            date: this.showDate.bind(this),
            echo: this.echo.bind(this),
            history: this.showHistory.bind(this),
            matrix: this.startMatrix.bind(this),
            joke: this.showJoke.bind(this),
            sudo: this.sudo.bind(this),
            pwd: this.pwd.bind(this),
            banner: this.showBanner.bind(this),
        };

        this.files = {
            'resume.txt': '这是符睿洋的简历...\n技能：Python, C++, JavaScript\n经验：机器学习、计算机视觉、硬件开发',
            'projects.txt': '项目列表：\n1. 个人主页 - 数据可视化展示\n2. 自动避障小车 - Arduino + RPLidar\n3. 数学建模竞赛 - MCM/ICM 2026',
            'secrets.txt': '🔒 权限不足：需要 sudo 访问',
        };

        this.jokes = [
            "为什么程序员总是分不清万圣节和圣诞节？\n因为 Oct 31 == Dec 25",
            "程序员的三大谎言：\n1. 代码写完了\n2. 测试通过了\n3. 文档已更新",
            "Bug 不是我写的，是编译器的问题！",
            "没有什么是重启解决不了的，如果有，那就重装系统。",
            "世界上最遥远的距离，是我在 if 里你在 else 里。",
        ];

        this.init();
    }

    init() {
        if (!this.input || !this.body || !this.output) {
            console.warn('Terminal elements not found, skipping initialization');
            return;
        }

        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.handleCommand();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory('up');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory('down');
            } else if (e.key === 'Tab') {
                e.preventDefault();
                this.autocomplete();
            }
        });

        // 点击终端任意位置聚焦输入框
        this.body.addEventListener('click', () => {
            this.input.focus();
        });

        // 使用 Intersection Observer 检测终端是否可见
        let isNavigating = false;

        // 监听导航点击
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', () => {
                isNavigating = true;
                setTimeout(() => {
                    isNavigating = false;
                }, 1000); // 1秒后恢复
            });
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isNavigating) {
                    // 终端进入视口时自动聚焦（但不在导航跳转时）
                    setTimeout(() => {
                        if (!isNavigating) {
                            this.input.focus();
                        }
                    }, 300);
                }
            });
        }, {
            threshold: 0.5 // 当终端 50% 可见时触发
        });

        observer.observe(this.body);
    }

    handleCommand() {
        const command = this.input.value.trim();
        if (!command) return;

        // 显示命令
        this.addOutput(`<span class="terminal-user">visitor</span>@<span class="terminal-path">homepage</span>:${this.currentPath}$ <span class="terminal-command">${this.escapeHtml(command)}</span>`);

        // 保存到历史
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;

        // 解析并执行命令
        const [cmd, ...args] = command.split(' ');

        if (this.commands[cmd]) {
            this.commands[cmd](args);
        } else {
            this.addOutput(`<span class="error">命令未找到: ${this.escapeHtml(cmd)}</span>`);
            this.addOutput(`<span class="info">输入 'help' 查看可用命令</span>`);
        }

        // 清空输入
        this.input.value = '';
        this.scrollToBottom();
    }

    addOutput(text, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.innerHTML = text;
        this.output.appendChild(line);
    }

    scrollToBottom() {
        this.body.scrollTop = this.body.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    navigateHistory(direction) {
        if (direction === 'up' && this.historyIndex > 0) {
            this.historyIndex--;
            this.input.value = this.commandHistory[this.historyIndex];
        } else if (direction === 'down' && this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            this.input.value = this.commandHistory[this.historyIndex];
        } else if (direction === 'down' && this.historyIndex === this.commandHistory.length - 1) {
            this.historyIndex = this.commandHistory.length;
            this.input.value = '';
        }
    }

    autocomplete() {
        const input = this.input.value;
        const matches = Object.keys(this.commands).filter(cmd => cmd.startsWith(input));

        if (matches.length === 1) {
            this.input.value = matches[0];
        } else if (matches.length > 1) {
            this.addOutput(`<span class="info">${matches.join('  ')}</span>`);
        }
    }

    // 命令实现
    showHelp() {
        const helpText = `
<span class="success">可用命令：</span>

  <span class="info">help</span>      - 显示此帮助信息
  <span class="info">about</span>     - 关于我
  <span class="info">skills</span>    - 技术栈
  <span class="info">projects</span>  - 项目列表
  <span class="info">contact</span>   - 联系方式
  <span class="info">ls</span>        - 列出文件
  <span class="info">cat</span>       - 查看文件内容 (用法: cat filename)
  <span class="info">whoami</span>    - 我是谁
  <span class="info">pwd</span>       - 显示当前路径
  <span class="info">date</span>      - 显示日期时间
  <span class="info">echo</span>      - 输出文本
  <span class="info">history</span>   - 显示命令历史
  <span class="info">joke</span>      - 随机笑话
  <span class="info">matrix</span>    - 代码雨效果
  <span class="info">banner</span>    - 显示欢迎横幅
  <span class="info">clear</span>     - 清屏

<span class="warning">提示：</span>
  - 使用 ↑↓ 键浏览历史命令
  - 使用 Tab 键自动补全命令
  - 试试 'sudo rm -rf /' 😈
        `;
        this.addOutput(helpText);
    }

    showAbout() {
        const aboutText = `
<span class="success">关于我</span>

嗨！我是符睿洋（Frey），上海交通大学在读学生 👨‍💻

我喜欢：
  • 用代码解决实际问题
  • 机器学习与计算机视觉
  • 硬件开发与自动化控制
  • 数据可视化
  • 旅行和徒步探索

这个终端是我主页的一个小彩蛋，希望你喜欢！
        `;
        this.addOutput(aboutText);
    }

    showSkills() {
        const skillsText = `
<span class="success">技术栈</span>

<span class="info">💻 编程语言</span>
  • Python - 算法设计与机器学习
  • C++ - 硬件控制与底层开发
  • JavaScript / HTML / CSS - 前端开发

<span class="info">🤖 机器学习</span>
  • 神经网络架构（Transformers, CNN）
  • 计算机视觉（目标检测、语义分割）
  • PyTorch / TensorFlow

<span class="info">🔧 硬件开发</span>
  • Arduino 开发
  • 传感器集成（RPLidar）
  • PID 控制算法

<span class="info">📊 数据分析</span>
  • 数据可视化（Chart.js, D3.js）
  • 数学建模
  • LaTeX 论文撰写
        `;
        this.addOutput(skillsText);
    }

    showProjects() {
        const projectsText = `
<span class="success">项目展示</span>

<span class="info">1. 个人主页</span>
   展示个人信息与数据可视化
   技术：HTML, CSS, JavaScript, Chart.js

<span class="info">2. 自动避障小车</span>
   基于 Arduino Mega + RPLidar + 麦克纳姆轮
   技术：C++, PID 控制, 雷达数据处理

<span class="info">3. 数学建模竞赛 (MCM/ICM 2026)</span>
   电池耗竭预测与河流污染物模拟
   技术：数学建模, Python, LaTeX

<span class="info">4. OpenClaw 智能体网关</span>
   集成多种 AI API 的本地网关系统
   技术：Node.js, API 集成

<span class="warning">更多项目正在开发中...</span>
        `;
        this.addOutput(projectsText);
    }

    showContact() {
        const contactText = `
<span class="success">联系方式</span>

📧 Email:
   • furuiyang17@gmail.com
   • 2766448920@qq.com
   • freyinsjtu@sjtu.edu.cn

🐙 GitHub: github.com/fryyyyyyyyyyyyyyyy
📷 Instagram: @ruirui748748

<span class="info">欢迎交流与合作！</span>
        `;
        this.addOutput(contactText);
    }

    clearTerminal() {
        this.output.innerHTML = '';
    }

    listFiles() {
        const files = Object.keys(this.files).join('  ');
        this.addOutput(`<span class="info">${files}</span>`);
    }

    catFile(args) {
        if (args.length === 0) {
            this.addOutput(`<span class="error">用法: cat [文件名]</span>`);
            return;
        }

        const filename = args[0];
        if (this.files[filename]) {
            if (filename === 'secrets.txt') {
                this.addOutput(`<span class="error">${this.files[filename]}</span>`);
            } else {
                this.addOutput(`<span class="info">${this.files[filename]}</span>`);
            }
        } else {
            this.addOutput(`<span class="error">文件不存在: ${this.escapeHtml(filename)}</span>`);
        }
    }

    whoami() {
        this.addOutput(`<span class="info">visitor</span>`);
        this.addOutput(`<span class="warning">但你真正的身份是... 一个好奇的探索者 🔍</span>`);
    }

    pwd() {
        this.addOutput(`<span class="info">/home/visitor${this.currentPath}</span>`);
    }

    showDate() {
        const now = new Date();
        this.addOutput(`<span class="info">${now.toString()}</span>`);
    }

    echo(args) {
        const text = args.join(' ');
        this.addOutput(`<span class="info">${this.escapeHtml(text)}</span>`);
    }

    showHistory() {
        if (this.commandHistory.length === 0) {
            this.addOutput(`<span class="info">历史记录为空</span>`);
            return;
        }

        this.commandHistory.forEach((cmd, index) => {
            this.addOutput(`<span class="info">${index + 1}  ${this.escapeHtml(cmd)}</span>`);
        });
    }

    showJoke() {
        const joke = this.jokes[Math.floor(Math.random() * this.jokes.length)];
        this.addOutput(`<span class="warning">${joke}</span>`);
    }

    sudo(args) {
        const command = args.join(' ');

        if (command === 'rm -rf /' || command === 'rm -rf /*') {
            this.addOutput(`<span class="error">⚠️  正在删除系统文件...</span>`);

            setTimeout(() => {
                this.addOutput(`<span class="error">删除 /usr...</span>`);
            }, 500);

            setTimeout(() => {
                this.addOutput(`<span class="error">删除 /var...</span>`);
            }, 1000);

            setTimeout(() => {
                this.addOutput(`<span class="error">删除 /home...</span>`);
            }, 1500);

            setTimeout(() => {
                this.addOutput(`<span class="success">哈哈，开玩笑的！你的系统很安全 😄</span>`);
                this.addOutput(`<span class="info">永远不要在真实系统上运行这个命令！</span>`);
            }, 2500);
        } else if (command.startsWith('cat secrets.txt')) {
            this.addOutput(`<span class="success">🔓 权限已授予</span>`);
            this.addOutput(`<span class="info">秘密内容：恭喜你发现了隐藏彩蛋！🎉</span>`);
        } else {
            this.addOutput(`<span class="error">[sudo] password for visitor: </span>`);
            setTimeout(() => {
                this.addOutput(`<span class="error">抱歉，你没有权限执行此操作</span>`);
            }, 500);
        }
    }

    startMatrix() {
        this.addOutput(`<span class="success">启动 Matrix 效果... 按 ESC 退出</span>`);

        const canvas = document.getElementById('matrixCanvas');
        if (!canvas) return;

        canvas.classList.remove('hidden');

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        let animationId;

        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0f0';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }

            animationId = requestAnimationFrame(draw);
        }

        draw();

        // ESC 键退出
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                cancelAnimationFrame(animationId);
                canvas.classList.add('hidden');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                document.removeEventListener('keydown', escHandler);
            }
        };

        document.addEventListener('keydown', escHandler);
    }

    showBanner() {
        const banner = `
<span class="ascii-art">
 _    _
| |  | |
| |__| | ___  _ __ ___   ___ _ __   __ _  __ _  ___
|  __  |/ _ \\| '_ \` _ \\ / _ \\ '_ \\ / _\` |/ _\` |/ _ \\
| |  | | (_) | | | | | |  __/ |_) | (_| | (_| |  __/
|_|  |_|\\___/|_| |_| |_|\\___| .__/ \\__,_|\\__, |\\___|
                            | |            __/ |
                            |_|           |___/
</span>
<span class="success">欢迎来到我的终端！</span>
<span class="info">输入 'help' 查看可用命令</span>
        `;
        this.addOutput(banner);
    }
}

