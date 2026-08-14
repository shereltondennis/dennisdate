// ===========================
// Sign Up Form Handler
// ===========================

let currentStep = 1;
const totalSteps = 7;

// Video Recording Variables
let mediaStream = null;
let mediaRecorder = null;
let recordedChunks = [];
let recordingStartTime = null;
let recordingTimer = null;
let isRecording = false;
const MAX_RECORDING_TIME = 60000; // 60 seconds in milliseconds

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Sign Up page loaded');
    showStep(1);
    setupFormValidation();
    initializeVideoRecording();
});

// ===========================
// Video Recording Functions
// ===========================

function initializeVideoRecording() {
    // Request camera access when user navigates to step 7
    // This will be done in showStep function
}

async function startRecording() {
    try {
        recordedChunks = [];
        
        // Request camera access
        if (!mediaStream) {
            mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: true
            });
        }

        // Get video element and display stream
        const videoPreview = document.getElementById('videoPreview');
        const videoPlaceholder = document.getElementById('videoPlaceholder');
        
        videoPreview.srcObject = mediaStream;
        videoPlaceholder.style.display = 'none';

        // Wait for video to be ready
        videoPreview.onloadedmetadata = () => {
            videoPreview.play();
        };

        // Setup media recorder
        const options = { mimeType: 'video/webm' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options.mimeType = 'video/mp4';
        }

        mediaRecorder = new MediaRecorder(mediaStream, options);
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            handleRecordingStop();
        };

        mediaRecorder.start();
        isRecording = true;
        recordingStartTime = Date.now();

        // Update UI
        document.getElementById('startRecordBtn').style.display = 'none';
        document.getElementById('stopRecordBtn').style.display = 'block';
        document.getElementById('videoStatus').className = 'video-status recording';
        document.getElementById('videoStatus').textContent = '🔴 Recording... Speak clearly and show your personality!';

        // Start timer
        startRecordingTimer();

        console.log('Recording started');
    } catch (error) {
        console.error('Error accessing camera:', error);
        showVideoError('Unable to access camera. Please check permissions and try again.');
        alert('Camera access denied. Please allow camera access and try again.');
    }
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        
        // Stop all tracks
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;

        // Stop timer
        if (recordingTimer) {
            clearInterval(recordingTimer);
        }

        // Update UI
        document.getElementById('stopRecordBtn').style.display = 'none';
        document.getElementById('retakeBtn').style.display = 'block';
        document.getElementById('startRecordBtn').style.display = 'none';
        document.getElementById('videoStatus').className = 'video-status success';
        document.getElementById('videoStatus').textContent = '✅ Video recorded successfully!';

        console.log('Recording stopped');
    }
}

function retakeVideo() {
    // Reset recording
    recordedChunks = [];
    mediaRecorder = null;
    isRecording = false;
    recordingStartTime = null;

    // Reset timer
    document.getElementById('recordingTime').textContent = '00:00';
    if (recordingTimer) {
        clearInterval(recordingTimer);
    }

    // Reset UI
    const videoPreview = document.getElementById('videoPreview');
    const videoPlaceholder = document.getElementById('videoPlaceholder');
    const videoPlaybackSection = document.getElementById('videoPlaybackSection');

    videoPreview.srcObject = null;
    videoPlaceholder.style.display = 'flex';
    videoPlaybackSection.style.display = 'none';

    document.getElementById('startRecordBtn').style.display = 'block';
    document.getElementById('stopRecordBtn').style.display = 'none';
    document.getElementById('retakeBtn').style.display = 'none';
    document.getElementById('videoStatus').className = '';
    document.getElementById('videoStatus').textContent = '';

    // Clear video data
    document.getElementById('videoData').value = '';
}

function startRecordingTimer() {
    let elapsedTime = 0;

    recordingTimer = setInterval(() => {
        elapsedTime += 1;
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        
        document.getElementById('recordingTime').textContent = 
            String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');

        // Auto-stop at 60 seconds
        if (elapsedTime >= 60) {
            stopRecording();
            clearInterval(recordingTimer);
        }
    }, 1000);
}

function handleRecordingStop() {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const videoUrl = URL.createObjectURL(blob);

    // Show playback section
    const videoPlayback = document.getElementById('videoPlayback');
    const videoPlaybackSection = document.getElementById('videoPlaybackSection');
    
    videoPlayback.src = videoUrl;
    videoPlaybackSection.style.display = 'block';

    // Store video blob for submission
    // Convert blob to base64 for storage
    const reader = new FileReader();
    reader.onloadend = () => {
        document.getElementById('videoData').value = reader.result;
    };
    reader.readAsDataURL(blob);

    // Hide live preview
    const videoPreview = document.getElementById('videoPreview');
    videoPreview.srcObject = null;
}

function showVideoError(message) {
    document.getElementById('videoStatus').className = 'video-status error';
    document.getElementById('videoStatus').textContent = '❌ ' + message;
}

function initializeCameraAccess() {
    // Request camera permissions when user reaches step 7
    if (!mediaStream && !isRecording) {
        const startBtn = document.getElementById('startRecordBtn');
        startBtn.textContent = '🔴 Start Recording';
        // Camera will be requested when user clicks Start Recording
    }
}

function showStep(n) {
    const form = document.getElementById('signupForm');
    const steps = form.querySelectorAll('.form-section');

    // Validate step before moving forward
    if (n > currentStep) {
        if (!validateStep(currentStep)) {
            return;
        }
    }

    // Hide all steps
    steps.forEach(step => {
        step.style.display = 'none';
    });

    // Show current step
    if (n > 0 && n <= totalSteps) {
        steps[n - 1].style.display = 'block';
        currentStep = n;
        updateStepIndicator();
        updateNavButtons();
        window.scrollTo(0, 0);

        // Initialize camera access for step 7 (video)
        if (n === 7) {
            initializeCameraAccess();
        }
    }
}

function changeStep(n) {
    showStep(currentStep + n);
}

function updateStepIndicator() {
    document.getElementById('currentStep').textContent = currentStep;
}

function updateNavButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitDiv = document.getElementById('submitDiv');

    // Previous button
    if (currentStep === 1) {
        prevBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
    }

    // Next button and Submit
    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        submitDiv.style.display = 'flex';
    } else {
        nextBtn.style.display = 'block';
        submitDiv.style.display = 'none';
    }
}

// ===========================
// Form Validation
// ===========================

function validateStep(step) {
    const form = document.getElementById('signupForm');
    const currentSection = document.getElementById(`step${step}`);

    if (!currentSection) return true;

    const requiredFields = currentSection.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
            showError(field, 'This field is required');
        } else {
            clearError(field);
        }
    });

    // Email validation
    const emailField = currentSection.querySelector('#email');
    if (emailField && emailField.value && !isValidEmail(emailField.value)) {
        showError(emailField, 'Please enter a valid email address');
        isValid = false;
    }

    // Password match validation
    const passwordField = currentSection.querySelector('#password');
    const confirmPasswordField = currentSection.querySelector('#confirmPassword');
    if (passwordField && confirmPasswordField) {
        if (passwordField.value !== confirmPasswordField.value) {
            showError(confirmPasswordField, 'Passwords do not match');
            isValid = false;
        }
    }

    // Password strength validation
    if (passwordField && passwordField.value) {
        if (passwordField.value.length < 8) {
            showError(passwordField, 'Password must be at least 8 characters');
            isValid = false;
        }
    }

    return isValid;
}

function validateField(field) {
    if (field.type === 'checkbox') {
        return field.checked;
    }
    return field.value.trim() !== '';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(field, message) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;

    formGroup.classList.add('error');
    
    // Remove existing error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
}

function clearError(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;

    formGroup.classList.remove('error');
    const errorDiv = formGroup.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function setupFormValidation() {
    const form = document.getElementById('signupForm');
    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
            if (input.value.trim() !== '') {
                clearError(input);
            }
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('error-class')) {
                clearError(input);
            }
        });
    });
}

// ===========================
// Form Submission
// ===========================

document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();

    // Final validation
    if (!validateStep(currentStep)) {
        alert('Please fill in all required fields correctly');
        return;
    }

    // Get form data
    const formData = new FormData(document.getElementById('signupForm'));
    const profileData = Object.fromEntries(formData);

    // Log the data (in a real app, you'd send this to a server)
    console.log('Profile Data Submitted:', profileData);

    // Save to localStorage for demo purposes
    localStorage.setItem('userProfile', JSON.stringify(profileData));

    // Show success message
    showSuccessMessage();

    // Redirect after 2 seconds
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
});

function showSuccessMessage() {
    const submitDiv = document.getElementById('submitDiv');
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message show';
    successMsg.innerHTML = `
        <h4>🎉 Welcome to LibDate!</h4>
        <p>Your profile has been created successfully. Redirecting to home page...</p>
    `;
    submitDiv.replaceWith(successMsg);

    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.style.display = 'none';
    }
}

// ===========================
// Utility Functions
// ===========================

function getFormData() {
    const form = document.getElementById('signupForm');
    return new FormData(form);
}

function saveFormProgress() {
    const formData = getFormData();
    const data = Object.fromEntries(formData);
    localStorage.setItem('signupProgress', JSON.stringify(data));
}

function loadFormProgress() {
    const saved = localStorage.getItem('signupProgress');
    if (saved) {
        const data = JSON.parse(saved);
        const form = document.getElementById('signupForm');
        
        Object.keys(data).forEach(key => {
            const field = form.elements[key];
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = data[key] === 'on';
                } else {
                    field.value = data[key];
                }
            }
        });
    }
}

// Save progress periodically
setInterval(() => {
    saveFormProgress();
}, 30000); // Every 30 seconds

// ===========================
// Phone Number Formatting
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phoneNumber');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) {
                    e.target.value = value;
                } else if (value.length <= 6) {
                    e.target.value = value.slice(0, 3) + ' ' + value.slice(3);
                } else {
                    e.target.value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6, 10);
                }
            }
        });
    }
});

// ===========================
// Age Range Validation
// ===========================

const ageInput = document.getElementById('age');
if (ageInput) {
    ageInput.addEventListener('change', (e) => {
        const age = parseInt(e.target.value);
        if (age < 18) {
            showError(ageInput, 'You must be at least 18 years old');
        } else if (age > 100) {
            showError(ageInput, 'Please enter a valid age');
        } else {
            clearError(ageInput);
        }
    });
}

// ===========================
// Password Strength Indicator
// ===========================

const passwordInput = document.getElementById('password');
if (passwordInput) {
    passwordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        let strength = 'weak';

        if (password.length >= 8) {
            if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
                strength = 'strong';
            } else if (/[A-Z]/.test(password) || /[0-9]/.test(password)) {
                strength = 'medium';
            }
        }

        console.log('Password Strength:', strength);
    });
}

console.log('Sign Up form script loaded');
