// 终端模拟器逻辑
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
            'resume.txt': '这是我的简历内容...\n技能：JavaScript, Python, React\n经验：3年开发经验',
            'projects.txt': '项目列表：\n1. 个人主页\n2. 跑步数据可视化\n3. 睡眠追踪系统',
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

嗨！我是一个热爱编程的开发者 👨‍💻

我喜欢：
  • 用代码解决实际问题
  • 数据可视化
  • 跑步和健康追踪
  • 探索新技术

这个终端是我主页的一个小彩蛋，希望你喜欢！
        `;
        this.addOutput(aboutText);
    }

    showSkills() {
        const skillsText = `
<span class="success">技术栈</span>

<span class="info">💻 前端开发</span>
  • JavaScript / TypeScript
  • HTML5 / CSS3
  • React / Vue
  • Chart.js / D3.js

<span class="info">🎨 设计工具</span>
  • Figma
  • Tailwind CSS

<span class="info">🔧 其他技能</span>
  • Python
  • Git / GitHub
  • 数据可视化
        `;
        this.addOutput(skillsText);
    }

    showProjects() {
        const projectsText = `
<span class="success">项目展示</span>

<span class="info">1. 个人主页</span>
   一个展示个人信息的创意主页
   技术：HTML, CSS, JavaScript

<span class="info">2. 跑步数据可视化</span>
   基于 Apple Health 数据的跑步分析
   技术：Python, Chart.js

<span class="info">3. 睡眠追踪系统</span>
   睡眠质量分析和可视化
   技术：JavaScript, 数据可视化

<span class="warning">更多项目正在开发中...</span>
        `;
        this.addOutput(projectsText);
    }

    showContact() {
        const contactText = `
<span class="success">联系方式</span>

📧 Email: your.email@example.com
🐙 GitHub: github.com/yourusername
💼 LinkedIn: linkedin.com/in/yourprofile

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

// 初始化终端
document.addEventListener('DOMContentLoaded', () => {
    new Terminal();
});
