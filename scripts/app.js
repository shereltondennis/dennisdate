// ===========================
// LibDate - Dating Website
// Main JavaScript Application
// ===========================

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('LibDate app initialized');
    initializeEventListeners();
    setupProfileClickHandlers();
    setupViewProfileButtons();
    setupDailyMatchCardClicks();
    setupMessageInput();
    setupFilterHandlers();
    setupButtonHandlers();
});

// ===========================
// Event Listeners Setup
// ===========================

function initializeEventListeners() {
    // Search button on home page
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }

    // CTA button
    const ctaBtn = document.querySelector('.cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            window.location.href = 'signup.html';
        });
    }

    // Login/Sign up buttons
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginModal();
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'signup.html';
        });
    }
}

// ===========================
// Profile Card Handlers
// ===========================

function setupProfileClickHandlers() {
    const profileCards = document.querySelectorAll('.profile-card');
    profileCards.forEach(card => {
        const card_element = card.querySelector('.profile-image');
        if (card_element) {
            card_element.addEventListener('click', () => {
                const profileName = card.querySelector('.profile-name').textContent;
                console.log('Viewing profile:', profileName);
                window.location.href = 'profile.html';
            });
            card_element.style.cursor = 'pointer';
        }
    });

    // Match cards with overlay effect
    const matchCards = document.querySelectorAll('.daily-match-card');
    matchCards.forEach(card => {
        card.addEventListener('click', () => {
            const name = card.querySelector('p').textContent;
            console.log('Viewing match:', name);
            window.location.href = 'profile.html';
        });
    });
}

// Universal View Profile Button Handler
function setupViewProfileButtons() {
    const viewProfileBtns = document.querySelectorAll('.view-profile-btn:not(.daily-match-card)');
    viewProfileBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const profileName = btn.closest('.profile-card, .result-item, .match-item, .daily-match-item')?.querySelector('h4, h3, .profile-name, p')?.textContent;
            console.log('Viewing profile:', profileName || 'Unknown');
            window.location.href = 'profile.html';
        });
    });
}

// Handle daily match cards (they use the class as a clickable element)
function setupDailyMatchCardClicks() {
    const dailyMatchCards = document.querySelectorAll('.daily-match-card[data-action="view-profile"]');
    dailyMatchCards.forEach(card => {
        card.addEventListener('click', () => {
            console.log('Viewing daily match profile');
            window.location.href = 'profile.html';
        });
    });
}

// ===========================
// Messaging Handlers
// ===========================

function setupMessageInput() {
    const sendBtn = document.querySelector('.send-btn');
    const messageInput = document.querySelector('.message-input');

    if (sendBtn && messageInput) {
        sendBtn.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // Conversation click handlers
    const conversationItems = document.querySelectorAll('.conversation-item');
    conversationItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            conversationItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');

            const name = item.querySelector('h4').textContent;
            updateConversation(name);
        });

        // Add view profile functionality to conversation items
        item.addEventListener('dblclick', () => {
            console.log('Viewing conversation profile');
            window.location.href = 'profile.html';
        });
    });
}

function sendMessage() {
    const messageInput = document.querySelector('.message-input');
    const messagesContainer = document.querySelector('.messages-container');

    if (messageInput && messageInput.value.trim() !== '') {
        const messageText = messageInput.value;

        // Create new message element
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message outgoing';
        messageDiv.innerHTML = `
            <p>${escapeHtml(messageText)}</p>
            <span class="msg-time">${getCurrentTime()}</span>
        `;

        if (messagesContainer) {
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        // Clear input
        messageInput.value = '';

        // Simulate incoming message
        setTimeout(() => {
            const replyDiv = document.createElement('div');
            replyDiv.className = 'message incoming';
            replyDiv.innerHTML = `
                <p>That's great! Looking forward to it!</p>
                <span class="msg-time">${getCurrentTime()}</span>
            `;
            if (messagesContainer) {
                messagesContainer.appendChild(replyDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }, 1000);
    }
}

function updateConversation(name) {
    const threadHeader = document.querySelector('.thread-header');
    if (threadHeader) {
        const h3 = threadHeader.querySelector('h3');
        if (h3) {
            h3.textContent = name;
        }
        // In a real app, this would fetch new messages
        console.log('Loading conversation with:', name);
    }
}

// ===========================
// Search Handlers
// ===========================

function handleSearch() {
    const ageFilter = document.querySelector('#ageFilter');
    const locationFilter = document.querySelector('#locationFilter');

    const age = ageFilter ? ageFilter.value : '';
    const location = locationFilter ? locationFilter.value : '';

    console.log('Searching with filters:', { age, location });
    window.location.href = 'search.html';
}

function setupFilterHandlers() {
    const applyFiltersBtn = document.querySelector('.search-btn');
    if (applyFiltersBtn && document.querySelector('.search-filters-panel')) {
        applyFiltersBtn.addEventListener('click', () => {
            const filters = {
                age: document.querySelector('#ageFilter')?.value || '',
                location: document.querySelector('#locationFilter')?.value || '',
                interests: document.querySelector('input[placeholder*="e.g."]')?.value || ''
            };
            console.log('Applied filters:', filters);
            // Results are already shown on the page
        });
    }
}

// ===========================
// Button Handlers
// ===========================

function setupButtonHandlers() {
    // Send Message buttons (on profile page)
    const sendMessageBtns = document.querySelectorAll('.btn-primary');
    sendMessageBtns.forEach(btn => {
        if (btn.textContent.includes('Send Message')) {
            btn.addEventListener('click', () => {
                window.location.href = 'messaging.html';
            });
        }
    });

    // Send Wink buttons (on profile page)
    const winkBtns = document.querySelectorAll('.btn-secondary');
    winkBtns.forEach(btn => {
        if (btn.textContent.includes('Wink')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Wink sent! ❤️');
                btn.textContent = 'Wink Sent ✓';
                btn.disabled = true;
                setTimeout(() => {
                    btn.textContent = 'Send Wink';
                    btn.disabled = false;
                }, 3000);
            });
        }
    });
}

// ===========================
// Modal Dialogs
// ===========================

function showLoginModal() {
    const email = prompt('Enter your email:');
    if (email) {
        const password = prompt('Enter your password:');
        if (password) {
            alert(`Welcome back! Logged in as ${email}`);
            console.log('User logged in:', email);
        }
    }
}

// ===========================
// Utility Functions
// ===========================

function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// ===========================
// Local Storage
// ===========================

function saveUserPreferences(preferences) {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    console.log('Preferences saved:', preferences);
}

function getUserPreferences() {
    const saved = localStorage.getItem('userPreferences');
    return saved ? JSON.parse(saved) : {};
}

function saveSearchFilters(filters) {
    localStorage.setItem('searchFilters', JSON.stringify(filters));
    console.log('Search filters saved:', filters);
}

function getSearchFilters() {
    const saved = localStorage.getItem('searchFilters');
    return saved ? JSON.parse(saved) : {};
}

// ===========================
// Theme/Dark Mode (Optional)
// ===========================

function initTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        document.body.classList.add('dark-mode');
    }
}

document.addEventListener('DOMContentLoaded', initTheme);

// ===========================
// Analytics (Optional)
// ===========================

function trackPageView(pageName) {
    console.log('Page viewed:', pageName);
    // Send to analytics service
}

function trackEvent(eventName, eventData) {
    console.log('Event tracked:', eventName, eventData);
    // Send to analytics service
}

// Track page views
document.addEventListener('DOMContentLoaded', () => {
    const pageName = document.title;
    trackPageView(pageName);
});
