// Custom JavaScript for interactive documentation features

document.addEventListener('DOMContentLoaded', function() {
    // Copy code button functionality
    const addCopyButtons = () => {
        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            if (!block.parentElement.querySelector('.copy-button')) {
                const button = document.createElement('button');
                button.className = 'copy-button md-clipboard md-icon';
                button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"></path></svg>';
                button.title = 'Copy to clipboard';

                button.addEventListener('click', () => {
                    navigator.clipboard.writeText(block.textContent).then(() => {
                        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"></path></svg>';
                        button.classList.add('copied');

                        setTimeout(() => {
                            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"></path></svg>';
                            button.classList.remove('copied');
                        }, 2000);
                    });
                });

                block.parentElement.appendChild(button);
            }
        });
    };

    // API Endpoint Interactive Examples
    const setupApiExamples = () => {
        const apiExamples = document.querySelectorAll('.api-example');
        apiExamples.forEach(example => {
            const tryButton = document.createElement('button');
            tryButton.className = 'md-button md-button--primary';
            tryButton.textContent = 'Try it out';
            tryButton.addEventListener('click', () => {
                const endpoint = example.dataset.endpoint;
                const method = example.dataset.method;
                openApiTester(endpoint, method);
            });
            example.appendChild(tryButton);
        });
    };

    // API Tester Modal
    const openApiTester = (endpoint, method) => {
        const modal = document.createElement('div');
        modal.className = 'api-tester-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>API Tester</h3>
                <p><span class="method-${method.toLowerCase()}">${method}</span> <code>${endpoint}</code></p>
                <div class="form-group">
                    <label>Headers:</label>
                    <textarea id="headers" rows="3">{"Authorization": "Bearer YOUR_TOKEN"}</textarea>
                </div>
                <div class="form-group">
                    <label>Body (JSON):</label>
                    <textarea id="body" rows="5">{}</textarea>
                </div>
                <div class="button-group">
                    <button class="md-button md-button--primary" onclick="executeRequest('${endpoint}', '${method}')">Send Request</button>
                    <button class="md-button" onclick="closeModal()">Close</button>
                </div>
                <div id="response-output"></div>
            </div>
        `;
        document.body.appendChild(modal);
    };

    window.closeModal = () => {
        const modal = document.querySelector('.api-tester-modal');
        if (modal) modal.remove();
    };

    window.executeRequest = async (endpoint, method) => {
        const headers = JSON.parse(document.getElementById('headers').value);
        const body = method !== 'GET' ? document.getElementById('body').value : null;
        const output = document.getElementById('response-output');

        output.innerHTML = '<p>Sending request...</p>';

        try {
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                }
            };

            if (body) {
                options.body = body;
            }

            const response = await fetch(endpoint, options);
            const data = await response.json();

            output.innerHTML = `
                <h4>Response (${response.status} ${response.statusText})</h4>
                <pre><code>${JSON.stringify(data, null, 2)}</code></pre>
            `;
        } catch (error) {
            output.innerHTML = `
                <h4>Error</h4>
                <pre><code>${error.message}</code></pre>
            `;
        }
    };

    // Search Enhancements
    const enhanceSearch = () => {
        const searchInput = document.querySelector('.md-search__input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                if (e.target.value.length > 2) {
                    // Add search suggestions
                    fetchSearchSuggestions(e.target.value);
                }
            });
        }
    };

    const fetchSearchSuggestions = async (query) => {
        // Implement search suggestions
        const suggestions = [
            'Authentication',
            'Crew Management',
            'MCP Tools',
            'API Reference',
            'Testing'
        ].filter(s => s.toLowerCase().includes(query.toLowerCase()));

        // Display suggestions (implementation depends on UI)
        console.log('Search suggestions:', suggestions);
    };

    // Smooth Scroll for Anchor Links
    const setupSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    };

    // Version Selector Enhancement
    const enhanceVersionSelector = () => {
        const versionSelector = document.querySelector('.md-version__current');
        if (versionSelector) {
            versionSelector.addEventListener('click', () => {
                // Load available versions dynamically
                loadVersions();
            });
        }
    };

    const loadVersions = async () => {
        // Fetch available documentation versions
        const versions = ['v1.0.0', 'v0.9.0', 'v0.8.0'];
        console.log('Available versions:', versions);
    };

    // Keyboard Shortcuts
    const setupKeyboardShortcuts = () => {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('.md-search__input');
                if (searchInput) searchInput.focus();
            }

            // Ctrl/Cmd + / for keyboard shortcuts help
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                showKeyboardShortcuts();
            }
        });
    };

    const showKeyboardShortcuts = () => {
        alert(`Keyboard Shortcuts:
        Ctrl/Cmd + K: Focus search
        Ctrl/Cmd + /: Show this help
        g h: Go to home
        g a: Go to API docs
        g m: Go to MCP tools`);
    };

    // Progress Indicator for Long Pages
    const setupProgressIndicator = () => {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: var(--md-primary-fg-color);
            width: 0%;
            transition: width 0.2s;
            z-index: 1000;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;
            progressBar.style.width = `${progress}%`;
        });
    };

    // Initialize all features
    addCopyButtons();
    setupApiExamples();
    enhanceSearch();
    setupSmoothScroll();
    enhanceVersionSelector();
    setupKeyboardShortcuts();
    setupProgressIndicator();

    // Re-run on navigation (for single-page app behavior)
    const observer = new MutationObserver(() => {
        addCopyButtons();
        setupApiExamples();
    });

    observer.observe(document.querySelector('.md-content'), {
        childList: true,
        subtree: true
    });
});

// MathJax Configuration (if needed for formulas)
window.MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true
    },
    options: {
        ignoreHtmlClass: 'tex2jax_ignore',
        processHtmlClass: 'tex2jax_process'
    }
};