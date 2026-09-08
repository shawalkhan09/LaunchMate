// Skeleton Loader State Management
let isLoading = true;

function createSkeletonLoader() {
    // Set body background for skeleton
    document.body.style.backgroundColor = 'rgb(241, 245, 249)';
    document.documentElement.classList.contains('dark') && (document.body.style.backgroundColor = 'rgb(15, 23, 42)');

    const sections = [
        {
            id: 'nav-skeleton',
            className: 'fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm',
            height: 'h-16'
        },
        {
            id: 'hero-skeleton',
            className: 'pt-32 pb-20 px-6',
            content: `
                <div class="max-w-7xl mx-auto">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div class="space-y-8 animate-pulse">
                            <div class="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4"></div>
                            <div class="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-full"></div>
                            <div class="space-y-3">
                                <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                                <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6"></div>
                            </div>
                            <div class="flex gap-4">
                                <div class="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg w-32"></div>
                                <div class="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg w-32"></div>
                            </div>
                        </div>
                        <div class="hidden lg:block h-96 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                    </div>
                </div>
            `
        },
        {
            id: 'features-skeleton',
            className: 'py-20 px-6',
            content: `
                <div class="max-w-7xl mx-auto">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                        ${Array(6).fill().map(() => `
                            <div class="p-6 rounded-2xl bg-slate-200 dark:bg-slate-700 h-48"></div>
                        `).join('')}
                    </div>
                </div>
            `
        }
    ];

    sections.forEach(section => {
        const sectionEl = document.createElement('section');
        sectionEl.id = section.id;
        sectionEl.className = `${section.className} animate-pulse`;
        if (section.content) {
            sectionEl.innerHTML = section.content;
        } else if (section.height) {
            sectionEl.className += ` ${section.height} bg-slate-200 dark:bg-slate-700`;
        }
        document.body.appendChild(sectionEl);
    });
}

function removeSkeletonLoader() {
    const skeletons = document.querySelectorAll('[id$="-skeleton"]');
    skeletons.forEach(skeleton => {
        skeleton.classList.add('fade-out');
        setTimeout(() => skeleton.remove(), 300);
    });
}

// Create skeleton loader immediately
createSkeletonLoader();

document.addEventListener('DOMContentLoaded', function () {
    
    // Theme Management
    const themeToggle = document.getElementById('theme-toggle');

    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const html = document.documentElement;

    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.classList.toggle('dark', currentTheme === 'dark');

    function toggleTheme() {
        const isDark = html.classList.contains('dark');
        html.classList.add('transition-colors', 'duration-300');
        html.classList.toggle('dark', !isDark);
        localStorage.setItem('theme', !isDark ? 'dark' : 'light');

        void html.offsetWidth;
    }

    themeToggle?.addEventListener('click', toggleTheme);
    mobileThemeToggle?.addEventListener('click', toggleTheme);

    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuBtn?.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('opacity-0');
        mobileMenu.classList.toggle('opacity-100');
        mobileMenu.classList.toggle('translate-y-2');
        mobileMenu.classList.toggle('translate-y-0');
    });

    // Elements collection
    const elements = {
        generateBtn: document.getElementById('generateBtn'),
        courseSelect: document.getElementById('courseSelect'),
        difficultySelect: document.getElementById('difficultySelect'),
        title: document.getElementById('title'),
        description: document.getElementById('description'),
        tools: document.getElementById('tools'),
        fileStructure: document.getElementById('fileStructure'),
        learningOutcomes: document.getElementById('learningOutcomes'),
        resources: document.getElementById('resources'),
        buildSteps: document.getElementById('buildSteps'),
        apiLinks: document.getElementById('apiLinks'),
        estimatedTime: document.getElementById('estimatedTime'),
        projectLoader: document.getElementById('projectLoader'),
        result: document.getElementById('result'),
        generateBtnText: document.getElementById('generateBtnText'),
        generateSpinner: document.getElementById('generateSpinner')
    };

    // Helper to add loading state to buttons
    function setLoadingState(button, isLoading) {
        if (isLoading) {
            button.classList.add('loading', 'opacity-75', 'cursor-not-allowed');
            button.querySelector('.btn-text')?.classList.add('hidden');
            button.querySelector('.spinner')?.classList.remove('hidden');
        } else {
            button.classList.remove('loading', 'opacity-75', 'cursor-not-allowed');
            button.querySelector('.btn-text')?.classList.remove('hidden');
            button.querySelector('.spinner')?.classList.add('hidden');
        }
    }

    // Debounce function for resize/scroll events
    function debounce(func, wait = 100) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(this, args);
            }, wait);
        };
    }

    // Loading steps management
    const loadingSteps = [
        { duration: 2000, text: "Analyzing your requirements..." },
        { duration: 2500, text: "Generating project ideas..." },
        { duration: 2000, text: "Creating project structure..." },
        { duration: 1500, text: "Finalizing your blueprint..." }
    ];

    let currentStep = 0;
    let progress = 0;
    let loadingInterval;

    // Smooth Scrolling
    const scrollToElement = selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Close mobile menu if open
            mobileMenu.classList.add('hidden');
        }
    };

    document.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('click', () => {
            elements.courseSelect.value = card.dataset.course;
            scrollToElement('#generator');
        });
    });

    document.querySelectorAll('.nav-link, a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            scrollToElement(link.getAttribute('href'));
        });
    });

    function updateLoadingStep(stepIndex, isActive, isCompleted) {
        const stepElements = document.querySelectorAll('.loading-step');
        const stepElement = stepElements[stepIndex];
        const stepIcon = stepElement.querySelector('.step-icon');
        const stepText = stepElement.querySelector('p');

        // Reset classes
        stepElement.className = 'loading-step flex items-center gap-4 p-3 rounded-lg transition-all duration-300';
        stepIcon.className = 'step-icon w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300';

        if (isActive) {
            stepElement.classList.add('bg-blue-100', 'dark:bg-blue-900/30', 'scale-105');
            stepIcon.classList.add('bg-blue-600', 'text-white', 'animate-pulse-slow');
            stepText.classList.add('text-blue-700', 'dark:text-blue-300');

            // Add bouncing dots using the new animation
            if (!stepElement.querySelector('.bouncing-dots')) {
                const dots = document.createElement('div');
                dots.className = 'bouncing-dots flex space-x-1';
                dots.innerHTML = `
                    <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce-slow"></div>
                    <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce-slow" style="animation-delay: 0.1s;"></div>
                    <div class="w-2 h-2 bg-blue-600 rounded-full animate-bounce-slow" style="animation-delay: 0.2s;"></div>
                `;
                stepElement.appendChild(dots);
            }
        } else if (isCompleted) {
            stepElement.classList.add('bg-green-50', 'dark:bg-green-900/20');
            stepIcon.classList.add('bg-green-500', 'text-white');
            stepText.classList.add('text-green-700', 'dark:text-green-300');
            stepIcon.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            `;

            // Remove bouncing dots
            const dots = stepElement.querySelector('.bouncing-dots');
            if (dots) dots.remove();
        } else {
            stepElement.classList.add('bg-slate-50', 'dark:bg-slate-800/50');
            stepIcon.classList.add('bg-slate-300', 'dark:bg-slate-600', 'text-slate-500', 'dark:text-slate-400');
            stepText.classList.add('text-slate-600', 'dark:text-slate-400');

            // Remove bouncing dots
            const dots = stepElement.querySelector('.bouncing-dots');
            if (dots) dots.remove();
        }
    }

    function startLoading() {
        currentStep = 0;
        progress = 0;

        const totalDuration = loadingSteps.reduce((sum, step) => sum + step.duration, 0);
        let elapsed = 0;

        // Reset all steps
        loadingSteps.forEach((_, index) => {
            updateLoadingStep(index, false, false);
        });

        loadingInterval = setInterval(() => {
            elapsed += 100;
            const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
            progress = newProgress;

            // Update progress bar
            document.getElementById('progressBar').style.width = `${progress}%`;
            document.getElementById('progressPercent').textContent = `${Math.round(progress)}%`;

            // Update current step
            let stepElapsed = 0;
            for (let i = 0; i < loadingSteps.length; i++) {
                stepElapsed += loadingSteps[i].duration;
                if (elapsed <= stepElapsed) {
                    if (currentStep !== i) {
                        // Mark previous steps as completed
                        for (let j = 0; j < i; j++) {
                            updateLoadingStep(j, false, true);
                        }
                        // Mark current step as active
                        updateLoadingStep(i, true, false);
                        // Mark future steps as inactive
                        for (let j = i + 1; j < loadingSteps.length; j++) {
                            updateLoadingStep(j, false, false);
                        }
                        currentStep = i;
                    }
                    break;
                }
            }

            if (elapsed >= totalDuration) {
                clearInterval(loadingInterval);
                // Mark all steps as completed
                loadingSteps.forEach((_, index) => {
                    updateLoadingStep(index, false, true);
                });
            }
        }, 100);
    }

    // Enable/disable generate button based on selections
    function updateGenerateButton() {
        const course = elements.courseSelect.value;
        const difficulty = elements.difficultySelect.value;
        elements.generateBtn.disabled = !course || !difficulty;
    }

    elements.courseSelect?.addEventListener('change', updateGenerateButton);
    elements.difficultySelect?.addEventListener('change', updateGenerateButton);

    elements.generateBtn?.addEventListener('click', async function () {
        const course = elements.courseSelect.value;
        const difficulty = elements.difficultySelect.value;

        if (!course || !difficulty) {
            showToast('Please select both course and difficulty level', 'error');
            return;
        }

        elements.result?.classList.add('hidden');                // hide old result
        elements.projectLoader?.classList.remove('hidden');       // show loader
        setLoadingState(elements.generateBtn, true);
        startLoading();

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ course, difficulty })
            });

            const projectData = await response.json();

            if (response.ok) {
                updateResultUI(projectData);
                showToast('Project generated successfully!', 'success');
                elements.result.classList.remove('hidden');
                scrollToElement('#result');
            } else {
                showToast(projectData.error || 'Failed to generate project', 'error');
            }
        } catch (error) {
            showToast('An error occurred while generating the project', 'error');
        } finally {
            elements.projectLoader?.classList.add('hidden');       // hide loader
            setLoadingState(elements.generateBtn, false);
        }
    });

    // Download and Copy functionality
    const downloadBtn = document.getElementById('downloadBtn');
    const copyBtn = document.getElementById('copyBtn');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            downloadBtn.classList.add('animate-pulse');
            setTimeout(() => {
                downloadBtn.classList.remove('animate-pulse');
            }, 1000);

            const content = generateDownloadContent();
            downloadFile(content, `${elements.title.textContent.replace(/\s+/g, '_')}_Project.md`);
        });
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            // Add visual feedback
            copyBtn.classList.add('animate-pulse');
            copyBtn.disabled = true;
            
            try {
                // Generate the same content as download
                const content = generateDownloadContent();
                
                // Try to copy to clipboard
                await navigator.clipboard.writeText(content);
                showToast('✨ Project content copied to clipboard!', 'success');
            } catch (err) {
                console.error('Copy failed:', err);
                // Fallback for browsers that don't support clipboard API
                try {
                    const textarea = document.createElement('textarea');
                    textarea.value = content;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    showToast('✨ Project content copied to clipboard!', 'success');
                } catch (fallbackErr) {
                    showToast('❌ Failed to copy content to clipboard', 'error');
                }
            } finally {
                // Reset button state
                setTimeout(() => {
                    copyBtn.classList.remove('animate-pulse');
                    copyBtn.disabled = false;
                }, 1000);
            }
        });
    }

    // Helper Functions
    function updateResultUI(data) {
        elements.title.textContent = data.title || 'Untitled Project';
        elements.description.textContent = data.description || 'No description available.';

        // Update tools
        elements.tools.innerHTML = '';
        if (Array.isArray(data.tools)) {
            data.tools.forEach(tool => {
                const span = document.createElement('span');
                span.className = 'badge badge-blue';
                span.textContent = tool;
                elements.tools.appendChild(span);
            });
        }

        // Update file structure
        elements.fileStructure.textContent = Array.isArray(data.file_structure)
            ? data.file_structure.join('\n')
            : data.file_structure || '—';

        // Update learning outcomes
        updateList(elements.learningOutcomes, data.learning_outcomes);

        // Update build steps
        updateList(elements.buildSteps, data.build_steps);

        // Update API links
        updateLinks(elements.apiLinks, data.external_resources);

        // Update estimated time
        elements.estimatedTime.textContent = data.estimated_time || '—';
    }

    function updateList(container, items) {
        container.innerHTML = '';
        if (Array.isArray(items) && items.length > 0) {
            items.forEach(item => {
                const li = document.createElement('li');
                const icon = document.createElement('span');
                icon.innerHTML = container.id === 'buildSteps' ? '🔨' : '✨';
                icon.className = 'text-lg text-primary';
                li.className = 'flex items-center gap-3 hover:translate-x-1 transition-all duration-300';
                li.appendChild(icon);
                li.appendChild(document.createTextNode(item));
                container.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = '—';
            container.appendChild(li);
        }
    }

    function updateLinks(container, links) {
        if (!container) return;

        container.innerHTML = '';
        if (Array.isArray(links) && links.length > 0) {
            const ul = document.createElement('ul');
            ul.className = 'space-y-2';

            links.forEach(link => {
                const url = link.url || link;
                // AI-generated content — only allow http(s) links, never javascript:/data: etc.
                if (!/^https?:\/\//i.test(url)) return;

                const li = document.createElement('li');
                const a = document.createElement('a');
                const icon = document.createElement('span');
                icon.innerHTML = '🔗';
                icon.className = 'text-lg';
                a.href = url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.className = 'text-primary hover:text-primary-light transition-all duration-300 flex items-center gap-3 hover:translate-x-1';
                a.appendChild(icon);
                a.appendChild(document.createTextNode(link.name || link));

                li.appendChild(a);
                ul.appendChild(li);
            });

            container.appendChild(ul);
        } else {
            container.textContent = '—';
        }
    }

    function generateDownloadContent() {
        return `# ${elements.title.textContent}

## Description
${elements.description.textContent}

## Tools & Technologies
${Array.from(elements.tools.children).map(tool => `- ${tool.textContent}`).join('\n')}

## File Structure
\`\`\`
${elements.fileStructure.textContent}
\`\`\`

## Learning Outcomes
${Array.from(elements.learningOutcomes.children).map(li => `- ${li.textContent}`).join('\n')}

## Build Steps
${Array.from(elements.buildSteps.children).map((li, i) => `${i + 1}. ${li.textContent}`).join('\n')}

## Useful Resources
${Array.from(elements.apiLinks.children).map(a => `- [${a.textContent}](${a.href})`).join('\n')}

## Estimated Time
${elements.estimatedTime.textContent}

---

📝 This is an AI-generated project suggestion from LaunchMate. Use it as inspiration, modify it freely, and make it yours.

`;
    }

    function downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');

        // Create toast with Tailwind classes
        const toast = document.createElement('div');
        toast.className = `animate-[toastIn_0.3s_ease-out] p-4 rounded-lg shadow-md border flex items-center justify-between 
            ${type === 'success' ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200' :
                type === 'error' ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200' :
                    type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200' :
                        'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200' // default/info
            }
            animate-[toastIn_0.3s_ease-out]`;

        // Toast content
        toast.innerHTML = `
            <span>${message}</span>
            <button class="text-current opacity-70 hover:opacity-100 transition-opacity">
                &times;
            </button>
        `;

        container.appendChild(toast);

        // Auto-remove
        const timer = setTimeout(() => {
            removeToast(toast);
        }, duration);

        // Manual close
        toast.querySelector('button').addEventListener('click', () => {
            clearTimeout(timer);
            removeToast(toast);
        });

        function removeToast(toastElement) {
            toastElement.classList.remove('animate-[toastIn_0.3s_ease-out]');
            toastElement.classList.add('animate-[toastOut_0.3s_ease-out]');

            // Fallback timeout in case animationend is missed
            const fallback = setTimeout(() => toastElement.remove(), 500);
            toastElement.addEventListener('animationend', () => toastElement.remove(), { once: true });
        }
    }

    // Add fade-out animation styles
    const style = document.createElement('style');
    style.textContent = `
        .fade-out { opacity: 0; transition: opacity 0.3s ease-out; }
        .content-hidden { display: none; }
    `;
    document.head.appendChild(style);

    // Hide main content initially
    document.querySelectorAll('body > *:not([id$="-skeleton"])').forEach(el => {
        el.classList.add('content-hidden');
    });

    // Handle page load completion
    window.addEventListener('load', () => {
        setTimeout(() => {
            isLoading = false;
            removeSkeletonLoader();
            // Show main content
            document.querySelectorAll('.content-hidden').forEach(el => {
                el.classList.remove('content-hidden');
            });
            // Restore original background
            document.body.style.backgroundColor = '';
        }, 1500);
    });

    (async () => {
        const urlParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = urlParams.get("access_token");

        if (!accessToken) return;

        try {
            const res = await fetch("/auth/callback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ access_token: accessToken })
            });

            if (res.ok) {
                // Force full reload with updated session; also clears the hash
                window.location.replace("/");
            } else {
                const data = await res.json();
                console.error("Auth callback failed:", data.error);
            }
        } catch (error) {
            console.error("Error during auth callback:", error);
        }
    })();

    document.getElementById('save-project-btn').onclick = async (e) => {
    const btn = e.currentTarget;

    // 🛡 Prevent multiple clicks
    btn.disabled = true;
    btn.textContent = "Saving...";

    const title = document.getElementById('title')?.textContent;
    const course = document.getElementById('courseSelect')?.value || "unknown";
    const description = document.getElementById('description')?.textContent;

    const tags = Array.from(document.querySelectorAll('#tools span')).map(el => el.textContent.trim());
    const tools = tags;

    const file_structure = document.getElementById('fileStructure')?.textContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => line);

    const learning_outcomes = Array.from(document.querySelectorAll('#learningOutcomes li')).map(li => li.textContent.trim());
    const build_steps = Array.from(document.querySelectorAll('#buildSteps li')).map(li => li.textContent.trim());
    const external_resources = Array.from(document.querySelectorAll('#apiLinks a')).map(a => a.href.trim());
    const estimated_time = document.getElementById('estimatedTime')?.textContent.trim() || "";
    const bonus = document.getElementById('bonus')?.textContent.trim() || "";

    if (!title || !course || !description) {
        showToast("❌ Missing essential project info.", "error");
        btn.disabled = false;
        btn.textContent = "Save Project";
        return;
    }

    try {
        const response = await fetch('/save-project', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                course,
                description,
                tags,
                tools,
                file_structure,
                bonus,
                learning_outcomes,
                build_steps,
                estimated_time,
                external_resources
            })
        });

        const result = await response.json();

        if (response.ok) {
            console.log("✅ response.ok is TRUE");
            console.log("Returned result:", result);

            const msg = result.message?.includes("already")
                ? "ℹ️ Project already exists!"
                : "✅ Project saved successfully!";
            showToast(msg, "success");

            btn.textContent = "Saved!";
        } else {
            showToast(`❌ Failed to save project: ${result.error || "Unknown error"}`, "error");
            btn.textContent = "Save Project";
            btn.disabled = false;
        }
    } catch (err) {
        console.error("Save error:", err);
        showToast("❌ Error saving project.", "error");
        btn.disabled = false;
        btn.textContent = "Save Project";
    }
};
});


