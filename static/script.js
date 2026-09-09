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
        const label = button.querySelector('.btn-text');
        if (isLoading) {
            button.classList.add('loading', 'opacity-75', 'cursor-not-allowed');
            if (label) {
                label.dataset.originalText = label.textContent;
                label.textContent = 'Generating...';
            }
        } else {
            button.classList.remove('loading', 'opacity-75', 'cursor-not-allowed');
            if (label && label.dataset.originalText) {
                label.textContent = label.dataset.originalText;
            }
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
            stepElement.classList.add('bg-accent-soft', 'dark:bg-accent-soft-dark', 'scale-105');
            stepIcon.classList.add('bg-accent', 'text-white', 'animate-pulse-slow');
            stepText.classList.add('text-accent', 'dark:text-accent-dark');

            // Add bouncing dots using the new animation
            if (!stepElement.querySelector('.bouncing-dots')) {
                const dots = document.createElement('div');
                dots.className = 'bouncing-dots flex space-x-1';
                dots.innerHTML = `
                    <div class="w-2 h-2 bg-accent rounded-full animate-bounce-slow"></div>
                    <div class="w-2 h-2 bg-accent rounded-full animate-bounce-slow" style="animation-delay: 0.1s;"></div>
                    <div class="w-2 h-2 bg-accent rounded-full animate-bounce-slow" style="animation-delay: 0.2s;"></div>
                `;
                stepElement.appendChild(dots);
            }
        } else if (isCompleted) {
            stepElement.classList.add('bg-accent-soft', 'dark:bg-accent-soft-dark');
            stepIcon.classList.add('bg-accent', 'text-white');
            stepText.classList.add('text-accent', 'dark:text-accent-dark');

            // Remove bouncing dots
            const dots = stepElement.querySelector('.bouncing-dots');
            if (dots) dots.remove();
        } else {
            stepElement.classList.add('bg-paper', 'dark:bg-paper-dark');
            stepIcon.classList.add('bg-hairline', 'dark:bg-hairline-dark', 'text-ink-soft', 'dark:text-ink-soft-dark');
            stepText.classList.add('text-ink-soft', 'dark:text-ink-soft-dark');

            // Remove bouncing dots
            const dots = stepElement.querySelector('.bouncing-dots');
            if (dots) dots.remove();
        }
    }

    // Real generation time varies (observed ~16s, sometimes more), so this loops
    // indefinitely and never claims completion until the response actually arrives.
    const STEP_DURATION_MS = 2200;

    function startLoading() {
        currentStep = -1;
        progress = 0;
        let elapsed = 0;

        // Reset all steps to pending
        loadingSteps.forEach((_, index) => {
            updateLoadingStep(index, false, false);
        });

        loadingInterval = setInterval(() => {
            elapsed += 100;

            // Approaches but never reaches 100% while still waiting on the real response.
            progress = 92 * (1 - Math.exp(-elapsed / 4000));
            document.getElementById('progressBar').style.width = `${progress}%`;
            document.getElementById('progressPercent').textContent = `${Math.round(progress)}%`;

            const stepIndex = Math.floor(elapsed / STEP_DURATION_MS) % loadingSteps.length;
            if (stepIndex !== currentStep) {
                loadingSteps.forEach((_, i) => updateLoadingStep(i, i === stepIndex, false));
                currentStep = stepIndex;
            }
        }, 100);
    }

    function stopLoading() {
        clearInterval(loadingInterval);
        document.getElementById('progressBar').style.width = '100%';
        document.getElementById('progressPercent').textContent = '100%';
        loadingSteps.forEach((_, index) => updateLoadingStep(index, false, true));
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
            stopLoading();

            if (response.ok) {
                updateResultUI(projectData);
                showToast('Project generated successfully!', 'success');
                elements.result.classList.remove('hidden');
                scrollToElement('#result');
            } else {
                showToast(projectData.error || 'Failed to generate project', 'error');
            }
        } catch (error) {
            stopLoading();
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
                showToast('Project content copied to clipboard!', 'success');
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
                    showToast('Project content copied to clipboard!', 'success');
                } catch (fallbackErr) {
                    showToast('Failed to copy content to clipboard', 'error');
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
                span.className = 'px-3 py-1 rounded-full text-sm font-medium bg-accent-soft dark:bg-accent-soft-dark text-accent dark:text-accent-dark';
                span.textContent = tool;
                elements.tools.appendChild(span);
            });
        }

        // Update file structure
        elements.fileStructure.textContent = Array.isArray(data.file_structure)
            ? data.file_structure.join('\n')
            : data.file_structure || 'N/A';

        // Update learning outcomes
        updateList(elements.learningOutcomes, data.learning_outcomes);

        // Update build steps
        updateList(elements.buildSteps, data.build_steps);

        // Update API links
        updateLinks(elements.apiLinks, data.external_resources);

        // Update estimated time
        elements.estimatedTime.textContent = data.estimated_time || 'N/A';
    }

    function updateList(container, items) {
        container.innerHTML = '';
        if (Array.isArray(items) && items.length > 0) {
            items.forEach(item => {
                const li = document.createElement('li');
                li.className = 'hover:translate-x-1 transition-all duration-300';
                li.appendChild(document.createTextNode(item));
                container.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'N/A';
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
                // AI-generated content: only allow http(s) links, never javascript:/data: etc.
                if (!/^https?:\/\//i.test(url)) return;

                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.className = 'text-accent hover:text-accent-dark transition-all duration-300 hover:translate-x-1 inline-block';
                a.appendChild(document.createTextNode(link.name || link));

                li.appendChild(a);
                ul.appendChild(li);
            });

            container.appendChild(ul);
        } else {
            container.textContent = 'N/A';
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

This is an AI-generated project suggestion from LaunchMate. Use it as inspiration, modify it freely, and make it yours.

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

    const MAX_VISIBLE_TOASTS = 3;

    function showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');

        // Cap visible toasts so a burst of messages can never push one off-screen
        // and out of reach; drop the oldest ones immediately.
        while (container.children.length >= MAX_VISIBLE_TOASTS) {
            container.children[0].remove();
        }

        // Create toast with Tailwind classes
        const toast = document.createElement('div');
        toast.className = `animate-[toastIn_0.3s_ease-out] p-4 rounded-lg shadow-md border flex items-center justify-between 
            ${type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-200' :
                type === 'error' ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200' :
                    type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200' :
                        'bg-accent-soft border-accent text-accent dark:bg-accent-soft-dark dark:border-accent-dark dark:text-accent-dark' // default/info
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

    if (btn.dataset.loggedIn !== 'true') {
        window.location.href = '/login';
        return;
    }

    // Prevent multiple clicks
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
        showToast("Missing essential project info.", "error");
        btn.disabled = false;
        btn.textContent = "Save Project";
        return;
    }

    try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
        const response = await fetch('/save-project', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
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
            console.log("response.ok is TRUE");
            console.log("Returned result:", result);

            const msg = result.message?.includes("already")
                ? "Project already exists!"
                : "Project saved successfully!";
            showToast(msg, "success");

            btn.textContent = "Saved!";
        } else {
            showToast(`Failed to save project: ${result.error || "Unknown error"}`, "error");
            btn.textContent = "Save Project";
            btn.disabled = false;
        }
    } catch (err) {
        console.error("Save error:", err);
        showToast("Error saving project.", "error");
        btn.disabled = false;
        btn.textContent = "Save Project";
    }
};
});


