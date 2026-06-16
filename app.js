// Global Variables & State
let activeTab = 'generate';
let qrCanvas = null;
let qrCtx = null;
let customLogoImage = null; // Stores uploaded logo image object
let cameraStream = null;
let cameraIntervalId = null;

// DOM Element References
const themeToggle = document.getElementById('theme-toggle');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Form Inputs
const wifiSsid = document.getElementById('wifi-ssid');
const wifiPassword = document.getElementById('wifi-password');
const wifiSecurity = document.getElementById('wifi-security');
const wifiHidden = document.getElementById('wifi-hidden');
const passwordGroup = document.getElementById('password-group');
const togglePasswordVisibility = document.getElementById('toggle-password-visibility');

// New QR Type Selector & Groups
const qrTypePresets = document.querySelectorAll('input[name="qr-type"]');
const qrTypeGroups = document.querySelectorAll('.qr-type-group');
const groupWifi = document.getElementById('group-wifi');
const groupUrl = document.getElementById('group-url');
const groupText = document.getElementById('group-text');
const groupContact = document.getElementById('group-contact');

// URL & Text Inputs
const qrUrl = document.getElementById('qr-url');
const qrText = document.getElementById('qr-text');

// Contact Inputs
const contactFirstName = document.getElementById('contact-first-name');
const contactLastName = document.getElementById('contact-last-name');
const contactPhone = document.getElementById('contact-phone');
const contactEmail = document.getElementById('contact-email');
const contactWebsite = document.getElementById('contact-website');
const contactAddress = document.getElementById('contact-address');

// Customizer Inputs
const dotShapePresets = document.querySelectorAll('input[name="dot-shape"]');
const eyeShapePresets = document.querySelectorAll('input[name="eye-shape"]');
const qrSizeSelect = document.getElementById('qr-size');
const qrEccSelect = document.getElementById('qr-ecc');

const fillStylePresets = document.querySelectorAll('input[name="fill-style"]');
const solidColorControls = document.getElementById('solid-color-controls');
const gradientColorControls = document.getElementById('gradient-color-controls');

const colorFg = document.getElementById('color-fg');
const colorFgText = document.getElementById('color-fg-text');
const colorGrad1 = document.getElementById('color-grad-1');
const colorGrad1Text = document.getElementById('color-grad-1-text');
const colorGrad2 = document.getElementById('color-grad-2');
const colorGrad2Text = document.getElementById('color-grad-2-text');
const gradientType = document.getElementById('gradient-type');
const gradientAngle = document.getElementById('gradient-angle');
const gradientAngleVal = document.getElementById('gradient-angle-val');
const gradientAngleGroup = document.getElementById('gradient-angle-group');

const customEyeColorsCheckbox = document.getElementById('custom-eye-colors');
const eyeColorSelectors = document.getElementById('eye-color-selectors');
const colorEyeOuter = document.getElementById('color-eye-outer');
const colorEyeOuterText = document.getElementById('color-eye-outer-text');
const colorEyeInner = document.getElementById('color-eye-inner');
const colorEyeInnerText = document.getElementById('color-eye-inner-text');

const colorBg = document.getElementById('color-bg');
const colorBgText = document.getElementById('color-bg-text');
const transparentBg = document.getElementById('transparent-bg');

// Logo Options
const logoOptions = document.querySelectorAll('input[name="logo-option"]');
const customLogoUploader = document.getElementById('custom-logo-uploader');
const logoFile = document.getElementById('logo-file');
const customLogoName = document.getElementById('custom-logo-name');
const logoControls = document.getElementById('logo-controls');
const logoSize = document.getElementById('logo-size');
const logoSizeVal = document.getElementById('logo-size-val');
const logoClearBg = document.getElementById('logo-clear-bg');

// Preview Panel
const wifiStringText = document.getElementById('wifi-string-text');
const saveHistoryBtn = document.getElementById('save-history-btn');
const btnPrint = document.getElementById('btn-print');
const btnDownloadPng = document.getElementById('btn-download-png');
const btnDownloadSvg = document.getElementById('btn-download-svg');
const btnResetDesign = document.getElementById('btn-reset-design');
const qrWrapper = document.getElementById('qr-wrapper');
const btnCopyImage = document.getElementById('btn-copy-image');
const btnScanActionSecondary = document.getElementById('btn-scan-action-secondary');
const scanHistoryGrid = document.getElementById('scan-history-grid');
const scanHistoryEmpty = document.getElementById('scan-history-empty');
let activeHistorySubTab = 'generated';

// Scanner Elements
const scanDropZone = document.getElementById('scan-drop-zone');
const scanFileInput = document.getElementById('scan-file-input');
const startCameraBtn = document.getElementById('start-camera-btn');
const scanResultPlaceholder = document.getElementById('scan-result-placeholder');
const scanResultCard = document.getElementById('scan-result-card');
const scanSuccessBanner = document.getElementById('scan-success-banner');
const scanActions = document.getElementById('scan-actions');

// Scanner Results Grids
const scanResWifi = document.getElementById('scan-res-wifi');
const scanResUrl = document.getElementById('scan-res-url');
const scanResText = document.getElementById('scan-res-text');
const scanResContact = document.getElementById('scan-res-contact');

// WiFi Scanner Results
const resultSsid = document.getElementById('result-ssid');
const resultPassword = document.getElementById('result-password');
const resultPwdWrapper = document.getElementById('result-pwd-wrapper');
const resultPwdToggle = document.getElementById('result-pwd-toggle');
const resultSecurity = document.getElementById('result-security');
const resultHidden = document.getElementById('result-hidden');

// URL Scanner Results
const resultUrl = document.getElementById('result-url');

// Text Scanner Results
const resultText = document.getElementById('result-text');

// Contact Scanner Results
const resultContactName = document.getElementById('result-contact-name');
const resultContactPhone = document.getElementById('result-contact-phone');
const resultContactEmail = document.getElementById('result-contact-email');
const resultContactWebsite = document.getElementById('result-contact-website');
const resultContactAddress = document.getElementById('result-contact-address');

const resultRawPayload = document.getElementById('result-raw-payload');
const btnScanActionPrimary = document.getElementById('btn-scan-action-primary');
const btnLoadGenerator = document.getElementById('btn-load-generator');

// Camera Modal
const cameraModal = document.getElementById('camera-modal');
const cameraVideo = document.getElementById('camera-video');
const cameraCanvas = document.getElementById('camera-canvas');
const closeCameraBtn = document.getElementById('close-camera-btn');
const cameraSelect = document.getElementById('camera-select');

// History Elements
const btnClearHistory = document.getElementById('btn-clear-history');
const historyEmpty = document.getElementById('history-empty');
const historyItemsGrid = document.getElementById('history-items-grid');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    setupTheme();
    setupTabs();
    setupPasswordVisibility();
    setupColorInputs();
    setupEventListeners();
    setupScanner();
    setupCamera();
    setupDesignPresets();
    setupHistorySubTabs();
    loadHistory();
    
    // Initial Render
    qrCanvas = document.getElementById('qr-canvas');
    qrCtx = qrCanvas.getContext('2d');
    generateQRCode();
});

// ==========================================
// 0. Toast Notification System
// ==========================================
function showToast(message, type = 'error', duration = 4000) {
    // Remove existing toasts
    const existing = document.querySelectorAll('.spk-toast');
    existing.forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `spk-toast spk-toast-${type}`;

    const icons = { error: 'ti-alert-circle', success: 'ti-circle-check', info: 'ti-info-circle', warn: 'ti-alert-triangle' };
    const icon = icons[type] || icons.info;

    toast.innerHTML = `
        <i class="ti ${icon} spk-toast-icon"></i>
        <span class="spk-toast-msg">${message}</span>
        <button class="spk-toast-close" onclick="this.parentElement.remove()" aria-label="Close">&times;</button>
    `;

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('spk-toast-visible'));
    });

    // Auto dismiss
    setTimeout(() => {
        toast.classList.remove('spk-toast-visible');
        setTimeout(() => toast.remove(), 400);
    }, duration);
}

// ==========================================
// 1. Theme and Navigation Handlers
// ==========================================

function setupTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

function setupTabs() {
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            activeTab = tabId;
            
            // Toggle active buttons
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Toggle active sections
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.getAttribute('id') === `tab-${tabId}`) {
                    content.classList.add('active');
                }
            });
            
            // If going back to history tab, refresh list
            if (tabId === 'history') {
                loadHistory();
            }
        });
    });
}

function setupPasswordVisibility() {
    togglePasswordVisibility.addEventListener('click', () => {
        const type = wifiPassword.type === 'password' ? 'text' : 'password';
        wifiPassword.type = type;
        
        const icon = togglePasswordVisibility.querySelector('i');
        if (type === 'password') {
            icon.className = 'ti ti-eye';
        } else {
            icon.className = 'ti ti-eye-off';
        }
    });

    resultPwdToggle.addEventListener('click', () => {
        const isHidden = resultPassword.style.webkitTextSecurity === 'disc' || resultPassword.style.textSecurity === 'disc' || resultPassword.getAttribute('data-hidden') === 'true';
        if (isHidden) {
            resultPassword.style.webkitTextSecurity = 'none';
            resultPassword.style.textSecurity = 'none';
            resultPassword.setAttribute('data-hidden', 'false');
            resultPwdToggle.querySelector('i').className = 'ti ti-eye-off';
        } else {
            resultPassword.style.webkitTextSecurity = 'disc';
            resultPassword.style.textSecurity = 'disc';
            resultPassword.setAttribute('data-hidden', 'true');
            resultPwdToggle.querySelector('i').className = 'ti ti-eye';
        }
    });
}

// ==========================================
// 2. Color Input Helpers
// ==========================================
function setupColorInputs() {
    // Helper to sync Color Picker and Hex text inputs
    const syncColors = (picker, textInput) => {
        picker.addEventListener('input', () => {
            textInput.value = picker.value;
            generateQRCode();
        });
        
        textInput.addEventListener('change', () => {
            let val = textInput.value.trim();
            if (!val.startsWith('#')) val = '#' + val;
            
            // Regex to check valid 3 or 6 digit hex code
            if (/^#[0-9A-F]{6}$/i.test(val) || /^#[0-9A-F]{3}$/i.test(val)) {
                picker.value = val;
                textInput.value = val;
                generateQRCode();
            } else {
                // reset to color picker value
                textInput.value = picker.value;
            }
        });
    };
    
    syncColors(colorFg, colorFgText);
    syncColors(colorGrad1, colorGrad1Text);
    syncColors(colorGrad2, colorGrad2Text);
    syncColors(colorEyeOuter, colorEyeOuterText);
    syncColors(colorEyeInner, colorEyeInnerText);
    syncColors(colorBg, colorBgText);
}

// ==========================================
// 3. Event Listeners for Live Re-rendering
// ==========================================
function setupEventListeners() {
    // QR Type Presets change
    qrTypePresets.forEach(radio => {
        radio.addEventListener('change', () => {
            const type = radio.value;
            qrTypeGroups.forEach(group => {
                if (group.id === `group-${type}`) {
                    group.classList.remove('hidden');
                } else {
                    group.classList.add('hidden');
                }
            });
            generateQRCode();
        });
    });

    // Credentials changes
    [wifiSsid, wifiPassword, wifiSecurity, wifiHidden].forEach(el => {
        el.addEventListener('input', () => {
            // Hide password field if Security is None
            if (wifiSecurity.value === 'nopass') {
                passwordGroup.classList.add('hidden');
            } else {
                passwordGroup.classList.remove('hidden');
            }
            generateQRCode();
        });
    });

    // URL changes
    qrUrl.addEventListener('input', generateQRCode);

    // Text changes
    qrText.addEventListener('input', generateQRCode);

    // Contact changes
    [contactFirstName, contactLastName, contactPhone, contactEmail, contactWebsite, contactAddress].forEach(el => {
        el.addEventListener('input', generateQRCode);
    });

    // Customizer Preset Buttons (Radio Buttons)
    const handleRadioChange = (elements) => {
        elements.forEach(radio => {
            radio.addEventListener('change', () => {
                generateQRCode();
            });
        });
    };
    
    handleRadioChange(dotShapePresets);
    handleRadioChange(eyeShapePresets);
    
    // Select inputs
    [qrSizeSelect, qrEccSelect, gradientType].forEach(el => {
        el.addEventListener('change', () => {
            generateQRCode();
        });
    });

    // Fill Style Toggles
    fillStylePresets.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'solid') {
                solidColorControls.classList.remove('hidden');
                gradientColorControls.classList.add('hidden');
            } else {
                solidColorControls.classList.add('hidden');
                gradientColorControls.classList.remove('hidden');
            }
            generateQRCode();
        });
    });

    // Gradient Angle slider
    gradientAngle.addEventListener('input', () => {
        gradientAngleVal.textContent = gradientAngle.value;
        generateQRCode();
    });

    gradientType.addEventListener('change', () => {
        if (gradientType.value === 'linear') {
            gradientAngleGroup.classList.remove('hidden');
        } else {
            gradientAngleGroup.classList.add('hidden');
        }
    });

    // Custom Eye Colors Checkbox
    customEyeColorsCheckbox.addEventListener('change', () => {
        if (customEyeColorsCheckbox.checked) {
            eyeColorSelectors.classList.remove('hidden');
        } else {
            eyeColorSelectors.classList.add('hidden');
        }
        generateQRCode();
    });

    // Transparent Background Checkbox
    transparentBg.addEventListener('change', () => {
        if (transparentBg.checked) {
            colorBg.disabled = true;
            colorBgText.disabled = true;
        } else {
            colorBg.disabled = false;
            colorBgText.disabled = false;
        }
        generateQRCode();
    });

    // Logo Option Handlers
    logoOptions.forEach(radio => {
        radio.addEventListener('change', () => {
            const val = radio.value;
            
            // Show/Hide custom uploader
            if (val === 'custom') {
                customLogoUploader.classList.remove('hidden');
            } else {
                customLogoUploader.classList.add('hidden');
            }
            
            // Show/Hide logo control sliders
            if (val === 'none') {
                logoControls.classList.add('hidden');
            } else {
                logoControls.classList.remove('hidden');
            }
            generateQRCode();
        });
    });

    // Logo size slider
    logoSize.addEventListener('input', () => {
        logoSizeVal.textContent = logoSize.value;
        generateQRCode();
    });
    
    logoClearBg.addEventListener('change', () => {
        generateQRCode();
    });

    // Custom Logo File Uploader
    logoFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            customLogoName.textContent = file.name;
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    customLogoImage = img;
                    generateQRCode();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            customLogoName.textContent = "No file selected";
            customLogoImage = null;
            generateQRCode();
        }
    });

    // Actions
    saveHistoryBtn.addEventListener('click', saveProfile);
    btnPrint.addEventListener('click', () => {
        window.print();
    });
    btnDownloadPng.addEventListener('click', downloadPNG);
    btnDownloadSvg.addEventListener('click', downloadSVG);
    btnCopyImage.addEventListener('click', copyQRImageToClipboard);

    btnResetDesign.addEventListener('click', () => {
        // Reset dot shape radio
        const targetDot = document.querySelector('input[name="dot-shape"][value="square"]');
        if (targetDot) targetDot.checked = true;
        
        const targetEye = document.querySelector('input[name="eye-shape"][value="square"]');
        if (targetEye) targetEye.checked = true;
        
        qrSizeSelect.value = "512";
        qrEccSelect.value = "H";
        
        const targetFill = document.querySelector('input[name="fill-style"][value="solid"]');
        if (targetFill) targetFill.checked = true;
        
        solidColorControls.classList.remove('hidden');
        gradientColorControls.classList.add('hidden');
        
        colorFg.value = "#000000";
        colorFgText.value = "#000000";
        colorGrad1.value = "#6366f1";
        colorGrad1Text.value = "#6366f1";
        colorGrad2.value = "#a855f7";
        colorGrad2Text.value = "#a855f7";
        gradientType.value = "linear";
        gradientAngle.value = "135";
        gradientAngleVal.textContent = "135";
        gradientAngleGroup.classList.remove('hidden');
        
        customEyeColorsCheckbox.checked = false;
        eyeColorSelectors.classList.add('hidden');
        colorEyeOuter.value = "#000000";
        colorEyeOuterText.value = "#000000";
        colorEyeInner.value = "#000000";
        colorEyeInnerText.value = "#000000";
        
        colorBg.value = "#ffffff";
        colorBgText.value = "#ffffff";
        transparentBg.checked = false;
        colorBg.disabled = false;
        colorBgText.disabled = false;
        
        const targetLogo = document.querySelector('input[name="logo-option"][value="none"]');
        if (targetLogo) targetLogo.checked = true;
        
        customLogoUploader.classList.add('hidden');
        logoControls.classList.add('hidden');
        logoSize.value = "20";
        logoSizeVal.textContent = "20";
        logoClearBg.checked = true;
        logoFile.value = "";
        customLogoName.textContent = "No file selected";
        customLogoImage = null;

        // Reset Quick Preset buttons active state
        document.querySelectorAll('.preset-theme-btn').forEach(b => b.classList.remove('active'));
        const defaultPresetBtn = document.querySelector('.preset-theme-btn[data-preset="default"]');
        if (defaultPresetBtn) defaultPresetBtn.classList.add('active');
        
        generateQRCode();
    });
}

// ==========================================
// 4. WiFi Specifications & String Escaper
// ==========================================
function escapeWifiString(val) {
    let escaped = "";
    for (let i = 0; i < val.length; i++) {
        const c = val[i];
        if (c === '\\' || c === ';' || c === ',' || c === ':') {
            escaped += '\\' + c;
        } else {
            escaped += c;
        }
    }
    return escaped;
}

function buildWifiPayload() {
    const ssid = wifiSsid.value.trim();
    const pwd = wifiPassword.value;
    const security = wifiSecurity.value;
    const isHidden = wifiHidden.checked;
    
    if (!ssid) return "";

    // Escape SSID and Password according to WiFi QR Code protocol spec
    const escSSID = escapeWifiString(ssid);
    const escPwd = security !== 'nopass' ? escapeWifiString(pwd) : '';
    
    let payload = `WIFI:S:${escSSID};T:${security};`;
    if (security !== 'nopass') {
        payload += `P:${escPwd};`;
    }
    if (isHidden) {
        payload += `H:true;`;
    }
    payload += ';';
    
    return payload;
}

function getSelectedQRType() {
    const checkedRadio = document.querySelector('input[name="qr-type"]:checked');
    return checkedRadio ? checkedRadio.value : 'wifi';
}

function buildQRContent() {
    const type = getSelectedQRType();
    if (type === 'wifi') {
        return buildWifiPayload();
    } else if (type === 'url') {
        let url = qrUrl.value.trim();
        if (!url) return "";
        if (!/^https?:\/\//i.test(url)) {
            if (url.includes('.') || url.startsWith('localhost')) {
                url = 'https://' + url;
            }
        }
        return url;
    } else if (type === 'text') {
        return qrText.value;
    } else if (type === 'contact') {
        const fName = contactFirstName.value.trim();
        const lName = contactLastName.value.trim();
        const phone = contactPhone.value.trim();
        const email = contactEmail.value.trim();
        const website = contactWebsite.value.trim();
        const address = contactAddress.value.trim();
        
        if (!fName && !lName) return "";
        
        let vcard = "BEGIN:VCARD\nVERSION:3.0\n";
        vcard += `N:${lName};${fName};;;\n`;
        vcard += `FN:${fName} ${lName}\n`.trim() + "\n";
        if (phone) vcard += `TEL;TYPE=CELL:${phone}\n`;
        if (email) vcard += `EMAIL:${email}\n`;
        if (website) vcard += `URL:${website}\n`;
        if (address) vcard += `ADR:;;${address};;;;\n`;
        vcard += "END:VCARD";
        return vcard;
    }
    return "";
}

function getQRFilename(ext) {
    const type = getSelectedQRType();
    let base = 'spk_qr';
    if (type === 'wifi') {
        base = wifiSsid.value.trim() || 'wifi';
    } else if (type === 'url') {
        base = qrUrl.value.trim().replace(/^https?:\/\//i, '') || 'link';
    } else if (type === 'text') {
        base = 'text_message';
    } else if (type === 'contact') {
        base = `${contactFirstName.value.trim()}_${contactLastName.value.trim()}` || 'contact';
    }
    return base.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_qr.' + ext;
}

function validateInputs() {
    const type = getSelectedQRType();
    let isValid = true;
    
    // Clear all invalid classes first
    const allInputs = document.querySelectorAll('.qr-type-group input, .qr-type-group select, .qr-type-group textarea');
    allInputs.forEach(el => el.classList.remove('invalid'));
    
    if (type === 'wifi') {
        const ssid = wifiSsid.value.trim();
        const pwd = wifiPassword.value;
        const security = wifiSecurity.value;
        
        if (!ssid) {
            wifiSsid.classList.add('invalid');
            isValid = false;
        }
        
        if (security !== 'nopass') {
            if (security === 'WPA' && pwd.length < 8) {
                wifiPassword.classList.add('invalid');
                isValid = false;
            } else if (security === 'WEP' && pwd.length < 5) {
                wifiPassword.classList.add('invalid');
                isValid = false;
            }
        }
    } else if (type === 'url') {
        const url = qrUrl.value.trim();
        if (url) {
            const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
            if (!urlPattern.test(url)) {
                qrUrl.classList.add('invalid');
                isValid = false;
            }
        } else {
            qrUrl.classList.add('invalid');
            isValid = false;
        }
    } else if (type === 'text') {
        const text = qrText.value.trim();
        if (!text) {
            qrText.classList.add('invalid');
            isValid = false;
        }
    } else if (type === 'contact') {
        const fName = contactFirstName.value.trim();
        const lName = contactLastName.value.trim();
        const email = contactEmail.value.trim();
        const website = contactWebsite.value.trim();
        const phone = contactPhone.value.trim();
        
        if (!fName && !lName) {
            contactFirstName.classList.add('invalid');
            contactLastName.classList.add('invalid');
            isValid = false;
        }
        
        if (email) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                contactEmail.classList.add('invalid');
                isValid = false;
            }
        }
        
        if (website) {
            const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
            if (!urlPattern.test(website)) {
                contactWebsite.classList.add('invalid');
                isValid = false;
            }
        }
        
        if (phone) {
            const phonePattern = /^[\d\s\-\+\(\)]+$/;
            if (!phonePattern.test(phone)) {
                contactPhone.classList.add('invalid');
                isValid = false;
            }
        }
    }
    
    return isValid;
}

// ==========================================
// 5. Canvas Custom Rendering Engine
// ==========================================
function generateQRCode() {
    const isValid = validateInputs();
    const payload = buildQRContent();
    if (!payload || !isValid) {
        wifiStringText.textContent = !payload ? "Please input content" : "Invalid input detected";
        const targetSize = parseInt(qrSizeSelect.value);
        qrCanvas.width = targetSize;
        qrCanvas.height = targetSize;
        qrCtx.clearRect(0, 0, targetSize, targetSize);
        return;
    }
    
    wifiStringText.textContent = payload;
    
    // Set print parameters on container for printer stylesheet
    const previewBox = document.querySelector('.qr-preview-box');
    const type = getSelectedQRType();
    let printDetails = '';
    if (type === 'wifi') {
        const securitySelectText = wifiSecurity.options[wifiSecurity.selectedIndex].text;
        printDetails = `WiFi SSID: ${wifiSsid.value}\nSecurity: ${securitySelectText}`;
        if (wifiSecurity.value !== 'nopass' && wifiPassword.value) {
            printDetails += `\nPassword: ${wifiPassword.value}`;
        }
    } else if (type === 'url') {
        printDetails = `Website Link (URL):\n${qrUrl.value}`;
    } else if (type === 'text') {
        printDetails = `Plain Text Content:\n${qrText.value}`;
    } else if (type === 'contact') {
        printDetails = `Contact Card (vCard)\nName: ${contactFirstName.value} ${contactLastName.value}`.trim();
        if (contactPhone.value.trim()) printDetails += `\nPhone: ${contactPhone.value.trim()}`;
        if (contactEmail.value.trim()) printDetails += `\nEmail: ${contactEmail.value.trim()}`;
        if (contactWebsite.value.trim()) printDetails += `\nWebsite: ${contactWebsite.value.trim()}`;
        if (contactAddress.value.trim()) printDetails += `\nAddress: ${contactAddress.value.trim()}`;
    }
    previewBox.setAttribute('data-print-details', printDetails);

    // Parse options
    const targetSize = parseInt(qrSizeSelect.value);
    const eccLevel = qrEccSelect.value;
    const dotShape = document.querySelector('input[name="dot-shape"]:checked').value;
    const eyeShape = document.querySelector('input[name="eye-shape"]:checked').value;
    const fillStyle = document.querySelector('input[name="fill-style"]:checked').value;
    const isTransparent = transparentBg.checked;
    const bgColor = colorBg.value;
    
    // Setup Canvas Resolution
    qrCanvas.width = targetSize;
    qrCanvas.height = targetSize;
    
    // Clear canvas
    qrCtx.clearRect(0, 0, targetSize, targetSize);
    
    // Generate raw QR matrix using Library
    let qr;
    try {
        qr = qrcode(0, eccLevel);
        qr.addData(payload);
        qr.make();
    } catch (e) {
        console.error("QR Code generation error, resetting ECC:", e);
        // Fallback for long data strings
        qr = qrcode(0, 'L');
        qr.addData(payload);
        qr.make();
    }
    
    const moduleCount = qr.getModuleCount();
    
    // Layout Calculations
    const padding = Math.floor(targetSize * 0.08); // 8% padding
    const usableSize = targetSize - padding * 2;
    const moduleSize = usableSize / moduleCount;
    
    // 1. Draw Background
    if (!isTransparent) {
        qrCtx.fillStyle = bgColor;
        qrCtx.fillRect(0, 0, targetSize, targetSize);
    }
    
    // 2. Prepare Foreground Paint Style
    let mainStyle = colorFg.value;
    if (fillStyle === 'gradient') {
        const x1 = padding;
        const y1 = padding;
        const x2 = padding + usableSize;
        const y2 = padding + usableSize;
        
        if (gradientType.value === 'linear') {
            const angleRad = (parseInt(gradientAngle.value) * Math.PI) / 180;
            const r = usableSize / 2;
            const cx = padding + usableSize / 2;
            const cy = padding + usableSize / 2;
            const dx = Math.cos(angleRad) * r;
            const dy = Math.sin(angleRad) * r;
            
            const grad = qrCtx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
            grad.addColorStop(0, colorGrad1.value);
            grad.addColorStop(1, colorGrad2.value);
            mainStyle = grad;
        } else {
            // Radial
            const cx = padding + usableSize / 2;
            const cy = padding + usableSize / 2;
            const r = usableSize / 1.4;
            const grad = qrCtx.createRadialGradient(cx, cy, 0, cx, cy, r);
            grad.addColorStop(0, colorGrad1.value);
            grad.addColorStop(1, colorGrad2.value);
            mainStyle = grad;
        }
    }
    
    // 3. Logo Calculations
    const logoOption = document.querySelector('input[name="logo-option"]:checked').value;
    const sizePct = parseInt(logoSize.value) / 100;
    const logoSizePx = usableSize * sizePct;
    const cx = targetSize / 2;
    const cy = targetSize / 2;
    const clearSize = logoSizePx * 1.25; // padding factor for clear mask
    const logoClearEnabled = logoClearBg.checked;
    
    // Helper to check if a block overlaps the logo clearing area
    const isInLogoZone = (row, col) => {
        if (logoOption === 'none' || !logoClearEnabled) return false;
        
        const mx = padding + col * moduleSize + moduleSize / 2;
        const my = padding + row * moduleSize + moduleSize / 2;
        
        return (mx >= cx - clearSize/2 && mx <= cx + clearSize/2 &&
                my >= cy - clearSize/2 && my <= cy + clearSize/2);
    };

    // Helper to check if block is part of the 3 large corner Finder Patterns
    const isInFinderPattern = (row, col) => {
        // Top-left
        if (row < 7 && col < 7) return true;
        // Top-right
        if (row < 7 && col >= moduleCount - 7) return true;
        // Bottom-left
        if (row >= moduleCount - 7 && col < 7) return true;
        
        return false;
    };
    
    // 4. Draw Standard Modules (Dots)
    qrCtx.fillStyle = mainStyle;
    qrCtx.beginPath();
    
    for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
            // Skip finder eyes and logo overlay zone
            if (isInFinderPattern(r, c) || isInLogoZone(r, c)) {
                continue;
            }
            
            if (qr.isDark(r, c)) {
                const x = padding + c * moduleSize;
                const y = padding + r * moduleSize;
                const cx = x + moduleSize / 2;
                const cy = y + moduleSize / 2;
                
                if (dotShape === 'circle') {
                    // Draw circular dots
                    qrCtx.moveTo(cx + moduleSize * 0.4, cy);
                    qrCtx.arc(cx, cy, moduleSize * 0.4, 0, Math.PI * 2);
                } else if (dotShape === 'rounded') {
                    // Draw rounded squares
                    drawRoundedRectPath(qrCtx, cx - moduleSize*0.45, cy - moduleSize*0.45, moduleSize*0.9, moduleSize*0.9, moduleSize*0.25);
                } else {
                    // Standard square block
                    qrCtx.rect(x, y, moduleSize, moduleSize);
                }
            }
        }
    }
    qrCtx.fill();
    
    // 5. Draw Custom Finder Pattern Eyes
    const outerEyeColor = customEyeColorsCheckbox.checked ? colorEyeOuter.value : null;
    const innerEyeColor = customEyeColorsCheckbox.checked ? colorEyeInner.value : null;
    
    // Top-Left Eye
    drawEye(qrCtx, padding, padding, moduleSize, eyeShape, outerEyeColor, innerEyeColor, mainStyle);
    // Top-Right Eye
    drawEye(qrCtx, padding + (moduleCount - 7) * moduleSize, padding, moduleSize, eyeShape, outerEyeColor, innerEyeColor, mainStyle);
    // Bottom-Left Eye
    drawEye(qrCtx, padding, padding + (moduleCount - 7) * moduleSize, moduleSize, eyeShape, outerEyeColor, innerEyeColor, mainStyle);
    
    // 6. Draw Logo & Handle Clearing Behind it
    if (logoOption !== 'none') {
        if (logoClearEnabled) {
            // Clear space in canvas (handles transparent background too)
            qrCtx.save();
            qrCtx.globalCompositeOperation = 'destination-out';
            qrCtx.beginPath();
            drawRoundedRectPath(qrCtx, cx - clearSize/2, cy - clearSize/2, clearSize, clearSize, clearSize * 0.25);
            qrCtx.fill();
            qrCtx.restore();
            
            // Draw background fill for clear area if canvas is opaque
            if (!isTransparent) {
                qrCtx.save();
                qrCtx.fillStyle = bgColor;
                qrCtx.beginPath();
                drawRoundedRectPath(qrCtx, cx - clearSize/2, cy - clearSize/2, clearSize, clearSize, clearSize * 0.25);
                qrCtx.fill();
                qrCtx.restore();
            }
        }
        
        // Draw the selected logo
        if (logoOption === 'wifi') {
            const wifiLogoColor = customEyeColorsCheckbox.checked ? colorEyeOuter.value : (fillStyle === 'gradient' ? colorGrad1.value : colorFg.value);
            drawWifiLogo(qrCtx, cx, cy, logoSizePx, wifiLogoColor);
        } else if (logoOption === 'custom' && customLogoImage) {
            qrCtx.drawImage(customLogoImage, cx - logoSizePx/2, cy - logoSizePx/2, logoSizePx, logoSizePx);
        }
    }
}

// Canvas rounded rect drawing utility
function drawRoundedRectPath(ctx, x, y, w, h, r) {
    if (r > w / 2) r = w / 2;
    if (r > h / 2) r = h / 2;
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

// Draw individual Finder Pattern Eye
function drawEye(ctx, x, y, m, shape, outerColor, innerColor, mainStyle) {
    ctx.save();
    
    // 1. Draw Outer Frame
    ctx.fillStyle = outerColor || mainStyle;
    ctx.beginPath();
    if (shape === 'circle') {
        ctx.arc(x + 3.5*m, y + 3.5*m, 3.5*m, 0, Math.PI*2);
    } else if (shape === 'rounded') {
        drawRoundedRectPath(ctx, x, y, 7*m, 7*m, 1.8*m);
    } else {
        ctx.rect(x, y, 7*m, 7*m);
    }
    ctx.fill();
    
    // 2. Cut out inner frame to make hollow (destination-out preserves alpha channels)
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    if (shape === 'circle') {
        ctx.arc(x + 3.5*m, y + 3.5*m, 2.5*m, 0, Math.PI*2);
    } else if (shape === 'rounded') {
        drawRoundedRectPath(ctx, x + m, y + m, 5*m, 5*m, 1.0*m);
    } else {
        ctx.rect(x + m, y + m, 5*m, 5*m);
    }
    ctx.fill();
    
    ctx.restore();
    
    // 3. Draw Pupil (Inner 3x3)
    ctx.save();
    ctx.fillStyle = innerColor || mainStyle;
    ctx.beginPath();
    if (shape === 'circle') {
        ctx.arc(x + 3.5*m, y + 3.5*m, 1.5*m, 0, Math.PI*2);
    } else if (shape === 'rounded') {
        drawRoundedRectPath(ctx, x + 2*m, y + 2*m, 3*m, 3*m, 0.6*m);
    } else {
        ctx.rect(x + 2*m, y + 2*m, 3*m, 3*m);
    }
    ctx.fill();
    ctx.restore();
}

// Built-in WiFi Center Logo Arc Renderer
function drawWifiLogo(ctx, cx, cy, size, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = size * 0.09;
    ctx.lineCap = 'round';
    
    const bottomCenterY = cy + size * 0.22;
    
    // Draw Dot
    ctx.beginPath();
    ctx.arc(cx, bottomCenterY, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw Lower Arc
    ctx.beginPath();
    ctx.arc(cx, bottomCenterY, size * 0.32, -Math.PI * 0.8, -Math.PI * 0.2);
    ctx.stroke();
    
    // Draw Upper Arc
    ctx.beginPath();
    ctx.arc(cx, bottomCenterY, size * 0.58, -Math.PI * 0.8, -Math.PI * 0.2);
    ctx.stroke();
    
    ctx.restore();
}

// ==========================================
// 6. Vector SVG Export Generator
// ==========================================
function generateSVGString() {
    const payload = buildQRContent();
    if (!payload) return "";
    
    const size = parseInt(qrSizeSelect.value);
    const eccLevel = qrEccSelect.value;
    const dotShape = document.querySelector('input[name="dot-shape"]:checked').value;
    const eyeShape = document.querySelector('input[name="eye-shape"]:checked').value;
    const fillStyle = document.querySelector('input[name="fill-style"]:checked').value;
    const isTransparent = transparentBg.checked;
    const bgColor = colorBg.value;
    
    let qr = qrcode(0, eccLevel);
    qr.addData(payload);
    qr.make();
    
    const moduleCount = qr.getModuleCount();
    const padding = Math.floor(size * 0.08);
    const usableSize = size - padding * 2;
    const moduleSize = usableSize / moduleCount;
    
    // SVG Boilerplate
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="100%" height="100%">\n`;
    
    // Background
    if (!isTransparent) {
        svg += `  <rect width="${size}" height="${size}" fill="${bgColor}" />\n`;
    }
    
    // Defs & Gradients
    let fillValue = colorFg.value;
    if (fillStyle === 'gradient') {
        fillValue = 'url(#qr-grad-svg)';
        if (gradientType.value === 'linear') {
            const angleRad = (parseInt(gradientAngle.value) * Math.PI) / 180;
            const r = 50; // percentage based circle
            const dx = Math.cos(angleRad) * r;
            const dy = Math.sin(angleRad) * r;
            
            const x1 = 50 - dx;
            const y1 = 50 - dy;
            const x2 = 50 + dx;
            const y2 = 50 + dy;
            
            svg += `  <defs>\n    <linearGradient id="qr-grad-svg" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">\n`;
            svg += `      <stop offset="0%" stop-color="${colorGrad1.value}" />\n`;
            svg += `      <stop offset="100%" stop-color="${colorGrad2.value}" />\n`;
            svg += `    </linearGradient>\n  </defs>\n`;
        } else {
            svg += `  <defs>\n    <radialGradient id="qr-grad-svg" cx="50%" cy="50%" r="70%">\n`;
            svg += `      <stop offset="0%" stop-color="${colorGrad1.value}" />\n`;
            svg += `      <stop offset="100%" stop-color="${colorGrad2.value}" />\n`;
            svg += `    </radialGradient>\n  </defs>\n`;
        }
    }
    
    // Eye colors
    const outerEyeColor = customEyeColorsCheckbox.checked ? colorEyeOuter.value : fillValue;
    const innerEyeColor = customEyeColorsCheckbox.checked ? colorEyeInner.value : fillValue;
    
    // Logo zone mask helpers
    const logoOption = document.querySelector('input[name="logo-option"]:checked').value;
    const sizePct = parseInt(logoSize.value) / 100;
    const logoSizePx = usableSize * sizePct;
    const cx = size / 2;
    const cy = size / 2;
    const clearSize = logoSizePx * 1.25;
    const logoClearEnabled = logoClearBg.checked;
    
    const isInLogoZone = (row, col) => {
        if (logoOption === 'none' || !logoClearEnabled) return false;
        const mx = padding + col * moduleSize + moduleSize / 2;
        const my = padding + row * moduleSize + moduleSize / 2;
        return (mx >= cx - clearSize/2 && mx <= cx + clearSize/2 &&
                my >= cy - clearSize/2 && my <= cy + clearSize/2);
    };

    const isInFinderPattern = (row, col) => {
        if (row < 7 && col < 7) return true;
        if (row < 7 && col >= moduleCount - 7) return true;
        if (row >= moduleCount - 7 && col < 7) return true;
        return false;
    };

    // Draw normal dots
    let dotsPathData = "";
    
    for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
            if (isInFinderPattern(r, c) || isInLogoZone(r, c)) continue;
            
            if (qr.isDark(r, c)) {
                const x = padding + c * moduleSize;
                const y = padding + r * moduleSize;
                const centerValX = x + moduleSize / 2;
                const centerValY = y + moduleSize / 2;
                
                if (dotShape === 'circle') {
                    const radius = moduleSize * 0.4;
                    dotsPathData += `M ${centerValX + radius} ${centerValY} A ${radius} ${radius} 0 1 1 ${centerValX - radius} ${centerValY} A ${radius} ${radius} 0 1 1 ${centerValX + radius} ${centerValY} `;
                } else if (dotShape === 'rounded') {
                    // Inlined SVG rounded rect path drawing
                    const w = moduleSize * 0.9;
                    const rx = moduleSize * 0.25;
                    const ox = centerValX - w / 2;
                    const oy = centerValY - w / 2;
                    dotsPathData += `M ${ox + rx} ${oy} h ${w - rx*2} a ${rx} ${rx} 0 0 1 ${rx} ${rx} v ${w - rx*2} a ${rx} ${rx} 0 0 1 -${rx} ${rx} h -${w - rx*2} a ${rx} ${rx} 0 0 1 -${rx} -${rx} v -${w - rx*2} a ${rx} ${rx} 0 0 1 ${rx} -${rx} Z `;
                } else {
                    dotsPathData += `M ${x} ${y} h ${moduleSize} v ${moduleSize} h -${moduleSize} Z `;
                }
            }
        }
    }
    
    if (dotsPathData) {
        svg += `  <path d="${dotsPathData}" fill="${fillValue}" />\n`;
    }
    
    // Draw Eyes (Top-Left, Top-Right, Bottom-Left)
    const appendSVGEye = (x, y) => {
        const mx = x + 3.5 * moduleSize;
        const my = y + 3.5 * moduleSize;
        
        let eyePath = "";
        let pupilPath = "";
        
        // Outer Eye Border
        if (eyeShape === 'circle') {
            // Circle with cutout (using evenodd)
            eyePath = `M ${mx} ${y} A 3.5 3.5 0 1 0 ${mx + 0.001} ${y} M ${mx} ${y + moduleSize} A 2.5 2.5 0 1 1 ${mx - 0.001} ${y + moduleSize}`;
            pupilPath = `<circle cx="${mx}" cy="${my}" r="${1.5 * moduleSize}" fill="${innerEyeColor}" />`;
        } else if (eyeShape === 'rounded') {
            const rx1 = 1.8 * moduleSize;
            const rx2 = 1.0 * moduleSize;
            eyePath = `M ${x + rx1} ${y} h ${7*moduleSize - rx1*2} a ${rx1} ${rx1} 0 0 1 ${rx1} ${rx1} v ${7*moduleSize - rx1*2} a ${rx1} ${rx1} 0 0 1 -${rx1} ${rx1} h -${7*moduleSize - rx1*2} a ${rx1} ${rx1} 0 0 1 -${rx1} -${rx1} v -${7*moduleSize - rx1*2} a ${rx1} ${rx1} 0 0 1 ${rx1} -${rx1} Z ` +
                      `M ${x + moduleSize + rx2} ${y + moduleSize} v ${5*moduleSize - rx2*2} a ${rx2} ${rx2} 0 0 0 ${rx2} ${rx2} h ${5*moduleSize - rx2*2} a ${rx2} ${rx2} 0 0 0 ${rx2} -${rx2} v -${5*moduleSize - rx2*2} a ${rx2} ${rx2} 0 0 0 -${rx2} -${rx2} h -${5*moduleSize - rx2*2} a ${rx2} ${rx2} 0 0 0 -${rx2} ${rx2} Z`;
            
            const rx3 = 0.6 * moduleSize;
            const px = x + 2*moduleSize;
            const py = y + 2*moduleSize;
            const pw = 3*moduleSize;
            pupilPath = `<rect x="${px}" y="${py}" width="${pw}" height="${pw}" rx="${rx3}" fill="${innerEyeColor}" />`;
        } else {
            // Standard Square Eyes
            eyePath = `M ${x} ${y} h ${7*moduleSize} v ${7*moduleSize} h -${7*moduleSize} Z M ${x + moduleSize} ${y + moduleSize} v ${5*moduleSize} h ${5*moduleSize} v -${5*moduleSize} Z`;
            pupilPath = `<rect x="${x + 2*moduleSize}" y="${y + 2*moduleSize}" width="${3*moduleSize}" height="${3*moduleSize}" fill="${innerEyeColor}" />`;
        }
        
        svg += `  <path d="${eyePath}" fill="${outerEyeColor}" fill-rule="evenodd" />\n`;
        svg += `  ${pupilPath}\n`;
    };
    
    appendSVGEye(padding, padding);
    appendSVGEye(padding + (moduleCount - 7) * moduleSize, padding);
    appendSVGEye(padding, padding + (moduleCount - 7) * moduleSize);
    
    // Draw Logo in SVG
    if (logoOption !== 'none') {
        if (logoClearEnabled) {
            // Cutout standard overlay shape behind logo inside background layer
            if (isTransparent) {
                // If transparent, we mask it via destination-out in SVG mask. To keep it simple,
                // we'll place a clipping block matching the background or omit it if transparent.
                // However, a colored card background makes SVG look clean
            } else {
                const r = clearSize * 0.25;
                const ox = cx - clearSize/2;
                const oy = cy - clearSize/2;
                svg += `  <rect x="${ox}" y="${oy}" width="${clearSize}" height="${clearSize}" rx="${r}" fill="${bgColor}" />\n`;
            }
        }
        
        if (logoOption === 'wifi') {
            const wifiLogoColor = customEyeColorsCheckbox.checked ? colorEyeOuter.value : (fillStyle === 'gradient' ? colorGrad1.value : colorFg.value);
            const w = logoSizePx;
            const bottomCenterY = cy + w * 0.22;
            
            // WiFi symbol elements as standard vector nodes
            svg += `  <g stroke="${wifiLogoColor}" fill="${wifiLogoColor}" stroke-linecap="round">\n`;
            svg += `    <circle cx="${cx}" cy="${bottomCenterY}" r="${w * 0.08}" />\n`;
            svg += `    <path d="M ${cx - w*0.22} ${bottomCenterY - w*0.22} A ${w*0.32} ${w*0.32} 0 0 1 ${cx + w*0.22} ${bottomCenterY - w*0.22}" fill="none" stroke-width="${w*0.09}" />\n`;
            svg += `    <path d="M ${cx - w*0.41} ${bottomCenterY - w*0.41} A ${w*0.58} ${w*0.58} 0 0 1 ${cx + w*0.41} ${bottomCenterY - w*0.41}" fill="none" stroke-width="${w*0.09}" />\n`;
            svg += `  </g>\n`;
        } else if (logoOption === 'custom' && customLogoImage) {
            // Embed Custom image as dynamic Base64 PNG inside SVG
            const customImgSrc = customLogoImage.src;
            svg += `  <image href="${customImgSrc}" x="${cx - logoSizePx/2}" y="${cy - logoSizePx/2}" width="${logoSizePx}" height="${logoSizePx}" />\n`;
        }
    }
    
    svg += "</svg>";
    return svg;
}

// Download Trigger APIs
function downloadPNG() {
    const payload = buildQRContent();
    if (!payload) return;
    
    const filename = getQRFilename('png');
    const link = document.createElement('a');
    link.download = filename;
    link.href = qrCanvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function downloadSVG() {
    const svgContent = generateSVGString();
    if (!svgContent) return;
    
    const filename = getQRFilename('svg');
    const blob = new Blob([svgContent], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // cleanup
    setTimeout(() => { URL.revokeObjectURL(url); }, 100);
}

// ==========================================
// 7. QR Scanner Image Decoder
// ==========================================
function setupScanner() {
    // Click anywhere on the drop zone to open file picker,
    // but skip if the click originated from the label or the file input itself
    // (the label already handles opening the picker via its `for` attribute).
    scanDropZone.addEventListener('click', (e) => {
        if (e.target.closest('label') || e.target === scanFileInput) return;
        scanFileInput.click();
    });
    
    scanFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleImageFile(file);
        // Reset so the same file can be selected again if needed
        e.target.value = '';
    });

    // Drag over styling triggers
    ['dragenter', 'dragover'].forEach(eventName => {
        scanDropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            scanDropZone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        scanDropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            scanDropZone.classList.remove('dragover');
        }, false);
    });

    scanDropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        if (file) handleImageFile(file);
    });

    btnLoadGenerator.addEventListener('click', () => {
        const type = btnLoadGenerator.getAttribute('data-scanned-type') || 'text';
        const payload = btnLoadGenerator.getAttribute('data-scanned-payload') || '';
        
        // Set target radio active
        const targetRadio = document.querySelector(`input[name="qr-type"][value="${type}"]`);
        if (targetRadio) {
            targetRadio.checked = true;
            targetRadio.dispatchEvent(new Event('change'));
        }
        
        if (type === 'wifi') {
            const ssid = resultSsid.textContent;
            const pwd = resultPassword.textContent === '(Open / No Password)' ? '' : resultPassword.textContent;
            const securityVal = resultSecurity.getAttribute('data-security-value') || 'nopass';
            const hidden = resultHidden.textContent === 'Yes';
            
            wifiSsid.value = ssid;
            wifiPassword.value = pwd;
            wifiSecurity.value = securityVal;
            wifiHidden.checked = hidden;
            
            if (securityVal === 'nopass') {
                passwordGroup.classList.add('hidden');
            } else {
                passwordGroup.classList.remove('hidden');
            }
        } else if (type === 'url') {
            qrUrl.value = resultUrl.textContent;
        } else if (type === 'text') {
            qrText.value = resultText.textContent;
        } else if (type === 'contact') {
            let fName = "";
            let lName = "";
            let phone = "";
            let email = "";
            let website = "";
            let address = "";
            
            const lines = payload.split(/\r?\n/);
            lines.forEach(line => {
                if (line.startsWith('N:')) {
                    const parts = line.substring(2).split(';');
                    lName = parts[0] || "";
                    fName = parts[1] || "";
                } else if (line.startsWith('TEL;')) {
                    const parts = line.split(':');
                    phone = parts[1] || "";
                } else if (line.startsWith('EMAIL:')) {
                    email = line.substring(6);
                } else if (line.startsWith('URL:')) {
                    website = line.substring(4);
                } else if (line.startsWith('ADR:')) {
                    const parts = line.substring(4).split(';');
                    address = parts.filter(p => p).join(', ');
                }
            });
            
            contactFirstName.value = fName;
            contactLastName.value = lName;
            contactPhone.value = phone;
            contactEmail.value = email;
            contactWebsite.value = website;
            contactAddress.value = address;
        }
        
        // Redraw
        generateQRCode();
        
        // Switch tab
        const genTabBtn = document.querySelector('.tab-btn[data-tab="generate"]');
        genTabBtn.click();
    });

    // Paste Image from Clipboard event listener
    document.addEventListener('paste', (e) => {
        if (activeTab !== 'scan') return;
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                handleImageFile(file);
                break;
            }
        }
    });
}

// ─── Multi-strategy robust QR image scanner ───────────────────────────────
// jsQR can fail on complex / high-density codes in a single pass.
// We try several approaches in sequence and stop at the first success.

/**
 * Draw an image onto a new canvas at the given target size (longest side),
 * then return the canvas and its ImageData.
 */
function _renderToCanvas(img, targetSize) {
    const scale = targetSize / Math.max(img.width, img.height);
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);
    const cv = document.createElement('canvas');
    cv.width  = w;
    cv.height = h;
    const cx = cv.getContext('2d');
    cx.fillStyle = '#ffffff';
    cx.fillRect(0, 0, w, h);
    cx.drawImage(img, 0, 0, w, h);
    return { canvas: cv, ctx: cx, imageData: cx.getImageData(0, 0, w, h) };
}

/**
 * Apply a simple contrast-boost + grayscale threshold to ImageData in-place.
 * Helps jsQR on washed-out or low-contrast photos.
 */
function _boostContrast(imageData) {
    const d = imageData.data;
    for (let i = 0; i < d.length; i += 4) {
        // Convert to luminance
        const lum = 0.299 * d[i] + 0.587 * d[i+1] + 0.114 * d[i+2];
        // Hard threshold around midpoint — forces pure black or white
        const v = lum < 128 ? 0 : 255;
        d[i] = d[i+1] = d[i+2] = v;
    }
    return imageData;
}

/**
 * Try to decode a jsQR result from an ImageData object using both inversion modes.
 */
function _tryDecode(imageData) {
    try {
        const attemptBoth = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'attemptBoth' });
        if (attemptBoth) return attemptBoth;
    } catch (e) {
        console.warn("jsQR attemptBoth error:", e);
    }
    try {
        const dontInvert = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' });
        if (dontInvert) return dontInvert;
    } catch (e) {
        console.warn("jsQR dontInvert error:", e);
    }
    try {
        const onlyInvert = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'onlyInvert' });
        if (onlyInvert) return onlyInvert;
    } catch (e) {
        console.warn("jsQR onlyInvert error:", e);
    }
    return null;
}

function handleImageFile(file) {
    if (!file.type.match('image.*')) {
        showToast('Invalid file type. Please upload a PNG, JPG, or WEBP image containing a QR code.', 'error');
        return;
    }

    // Scanning indicator
    const dropZoneText = scanDropZone.querySelector('.drop-text');
    const origText = dropZoneText ? dropZoneText.textContent : '';
    if (dropZoneText) dropZoneText.textContent = 'Scanning…';
    scanDropZone.classList.add('scanning');

    const restoreDropZone = () => {
        if (dropZoneText) dropZoneText.textContent = origText;
        scanDropZone.classList.remove('scanning');
    };

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            let result = null;

            // Strategy 1 – original size (works for most standard screenshots)
            {
                const { imageData } = _renderToCanvas(img, Math.max(img.width, img.height));
                result = _tryDecode(imageData);
            }

            // Strategy 2 – scale to 800 px (jsQR sweet-spot for most cameras)
            if (!result) {
                const { imageData } = _renderToCanvas(img, 800);
                result = _tryDecode(imageData);
            }

            // Strategy 3 – scale down to 400 px (faster, sometimes better for dense codes)
            if (!result) {
                const { imageData } = _renderToCanvas(img, 400);
                result = _tryDecode(imageData);
            }

            // Strategy 4 – scale up to 1200 px (helps tiny / low-res images)
            if (!result) {
                const { imageData } = _renderToCanvas(img, 1200);
                result = _tryDecode(imageData);
            }

            // Strategy 5 – contrast-boost at 800 px (washed-out / screenshot QR codes)
            if (!result) {
                const { ctx, imageData } = _renderToCanvas(img, 800);
                _boostContrast(imageData);
                ctx.putImageData(imageData, 0, 0);
                const refreshed = ctx.getImageData(0, 0, imageData.width, imageData.height);
                result = _tryDecode(refreshed);
            }

            // Strategy 6 – contrast-boost at original size
            if (!result) {
                const { ctx, imageData } = _renderToCanvas(img, Math.max(img.width, img.height));
                _boostContrast(imageData);
                ctx.putImageData(imageData, 0, 0);
                const refreshed = ctx.getImageData(0, 0, imageData.width, imageData.height);
                result = _tryDecode(refreshed);
            }

            restoreDropZone();

            if (result) {
                decodeQRString(result.data);
                showToast('QR code decoded successfully!', 'success', 2500);
            } else {
                showToast(
                    'Could not read the QR code. Make sure the image has no blur, no shadow, and the full code is visible. Screenshot-based QR codes usually work best.',
                    'error',
                    6000
                );
            }
        };
        img.onerror = () => {
            restoreDropZone();
            showToast('Failed to load the image. The file may be corrupted.', 'error');
        };
        img.src = e.target.result;
    };
    reader.onerror = () => {
        restoreDropZone();
        showToast('Failed to read the file. Please try again.', 'error');
    };
    reader.readAsDataURL(file);
}


function decodeQRString(payload) {
    if (!payload) return;
    
    // Hide all scanner result grids
    scanResWifi.classList.add('hidden');
    scanResUrl.classList.add('hidden');
    scanResText.classList.add('hidden');
    scanResContact.classList.add('hidden');
    btnScanActionSecondary.classList.add('hidden');
    
    let qrType = 'text';
    
    if (payload.startsWith('WIFI:')) {
        qrType = 'wifi';
        scanResWifi.classList.remove('hidden');
        scanSuccessBanner.innerHTML = '<i class="ti ti-wifi"></i> WiFi Network Detected!';
        
        const cleanStr = payload.substring(5);
        let ssid = "";
        let pwd = "";
        let security = "nopass";
        let hidden = false;
        
        let i = 0;
        while (i < cleanStr.length) {
            if (cleanStr[i + 1] === ':') {
                const key = cleanStr[i];
                i += 2;
                let val = "";
                while (i < cleanStr.length) {
                    if (cleanStr[i] === '\\') {
                        if (i + 1 < cleanStr.length) {
                            val += cleanStr[i + 1];
                            i += 2;
                        } else {
                            val += cleanStr[i];
                            i++;
                        }
                    } else if (cleanStr[i] === ';') {
                        i++;
                        break;
                    } else {
                        val += cleanStr[i];
                        i++;
                    }
                }
                if (key === 'S') ssid = val;
                else if (key === 'P') pwd = val;
                else if (key === 'T') security = val;
                else if (key === 'H') hidden = (val === 'true' || val === '1');
            } else {
                i++;
            }
        }
        
        resultSsid.textContent = ssid;
        if (security === 'nopass' || !pwd) {
            resultPassword.textContent = '(Open / No Password)';
            resultPwdWrapper.classList.add('hidden');
        } else {
            resultPassword.textContent = pwd;
            resultPassword.style.webkitTextSecurity = 'disc';
            resultPassword.style.textSecurity = 'disc';
            resultPassword.setAttribute('data-hidden', 'true');
            resultPwdToggle.querySelector('i').className = 'ti ti-eye';
            resultPwdWrapper.classList.remove('hidden');
        }
        
        let secFriendly = "WPA/WPA2/WPA3";
        if (security.toUpperCase() === 'WEP') secFriendly = "WEP";
        else if (security === 'nopass') secFriendly = "None (Open)";
        resultSecurity.textContent = secFriendly;
        resultSecurity.setAttribute('data-security-value', security);
        resultHidden.textContent = hidden ? 'Yes' : 'No';
        
        btnScanActionPrimary.innerHTML = '<i class="ti ti-copy"></i> Copy Password';
        btnScanActionPrimary.onclick = () => {
            if (security !== 'nopass' && pwd) {
                navigator.clipboard.writeText(pwd).then(() => {
                    const origHTML = btnScanActionPrimary.innerHTML;
                    btnScanActionPrimary.innerHTML = '<i class="ti ti-circle-check"></i> Copied Password!';
                    setTimeout(() => { btnScanActionPrimary.innerHTML = origHTML; }, 2000);
                });
            }
        };
        
    } else if (payload.startsWith('BEGIN:VCARD')) {
        qrType = 'contact';
        scanResContact.classList.remove('hidden');
        scanSuccessBanner.innerHTML = '<i class="ti ti-user-pin"></i> Contact Card Detected!';
        
        let fName = "";
        let lName = "";
        let phone = "";
        let email = "";
        let website = "";
        let address = "";
        
        const lines = payload.split(/\r?\n/);
        lines.forEach(line => {
            if (line.startsWith('N:')) {
                const parts = line.substring(2).split(';');
                lName = parts[0] || "";
                fName = parts[1] || "";
            } else if (line.startsWith('TEL;')) {
                const parts = line.split(':');
                phone = parts[1] || "";
            } else if (line.startsWith('EMAIL:')) {
                email = line.substring(6);
            } else if (line.startsWith('URL:')) {
                website = line.substring(4);
            } else if (line.startsWith('ADR:')) {
                const parts = line.substring(4).split(';');
                address = parts.filter(p => p).join(', ');
            }
        });
        
        resultContactName.textContent = `${fName} ${lName}`.trim() || "-";
        resultContactPhone.textContent = phone || "-";
        resultContactEmail.textContent = email || "-";
        resultContactWebsite.textContent = website || "-";
        resultContactAddress.textContent = address || "-";
        
        btnScanActionPrimary.innerHTML = '<i class="ti ti-copy"></i> Copy Contact Info';
        btnScanActionPrimary.onclick = () => {
            const contactInfo = `Name: ${fName} ${lName}\nPhone: ${phone}\nEmail: ${email}\nWebsite: ${website}\nAddress: ${address}`;
            navigator.clipboard.writeText(contactInfo).then(() => {
                const origHTML = btnScanActionPrimary.innerHTML;
                btnScanActionPrimary.innerHTML = '<i class="ti ti-circle-check"></i> Copied Info!';
                setTimeout(() => { btnScanActionPrimary.innerHTML = origHTML; }, 2000);
            });
        };

        btnScanActionSecondary.classList.remove('hidden');
        btnScanActionSecondary.innerHTML = '<i class="ti ti-download"></i> Save Contact (.vcf)';
        btnScanActionSecondary.onclick = () => {
            const blob = new Blob([payload], { type: 'text/vcard;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const filename = `${fName || 'Contact'}_${lName || ''}`.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.vcf';
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => { URL.revokeObjectURL(url); }, 100);
        };
        
    } else if (/^https?:\/\//i.test(payload) || (payload.includes('.') && !payload.includes(' '))) {
        qrType = 'url';
        scanResUrl.classList.remove('hidden');
        scanSuccessBanner.innerHTML = '<i class="ti ti-link"></i> Website Link Detected!';
        
        let url = payload;
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }
        
        resultUrl.href = url;
        resultUrl.textContent = url;
        
        btnScanActionPrimary.innerHTML = '<i class="ti ti-external-link"></i> Open Website';
        btnScanActionPrimary.onclick = () => {
            window.open(url, '_blank');
        };
        
    } else {
        qrType = 'text';
        scanResText.classList.remove('hidden');
        scanSuccessBanner.innerHTML = '<i class="ti ti-notes"></i> Plain Text Detected!';
        
        resultText.textContent = payload;
        
        btnScanActionPrimary.innerHTML = '<i class="ti ti-copy"></i> Copy Text';
        btnScanActionPrimary.onclick = () => {
            navigator.clipboard.writeText(payload).then(() => {
                const origHTML = btnScanActionPrimary.innerHTML;
                btnScanActionPrimary.innerHTML = '<i class="ti ti-circle-check"></i> Copied!';
                setTimeout(() => { btnScanActionPrimary.innerHTML = origHTML; }, 2000);
            });
        };
    }
    
    resultRawPayload.textContent = payload;
    
    btnLoadGenerator.setAttribute('data-scanned-type', qrType);
    btnLoadGenerator.setAttribute('data-scanned-payload', payload);
    
    scanResultPlaceholder.classList.add('hidden');
    scanResultCard.classList.remove('hidden');
    scanActions.classList.remove('hidden');

    saveToScanHistory(qrType, payload);
}


// ==========================================
// 8. Device Camera Stream Scanner
// ==========================================
function setupCamera() {
    startCameraBtn.addEventListener('click', startCameraScanner);
    closeCameraBtn.addEventListener('click', stopCameraScanner);
    cameraSelect.addEventListener('change', switchCameraDevice);
}

async function startCameraScanner() {
    cameraModal.classList.add('active');
    
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        
        // Populate camera drop list selector
        cameraSelect.innerHTML = '';
        if (videoDevices.length === 0) {
            cameraSelect.innerHTML = '<option value="">No cameras detected</option>';
        } else {
            videoDevices.forEach((device, index) => {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.textContent = device.label || `Camera ${index + 1}`;
                cameraSelect.appendChild(option);
            });
        }
        
        // Start default stream using environmental camera if available
        const constraints = {
            video: {
                facingMode: { ideal: "environment" }
            }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleCameraStream(stream);
    } catch (err) {
        console.error("Camera access error:", err);
        showToast("Could not access camera. Please make sure camera permissions are enabled in your browser.", "error");
        stopCameraScanner();
    }
}

function handleCameraStream(stream) {
    cameraStream = stream;
    cameraVideo.srcObject = stream;
    cameraVideo.setAttribute("playsinline", true); // required for iOS Safari
    cameraVideo.play();
    
    // Trigger tick scanner loop
    cameraIntervalId = requestAnimationFrame(tickCameraScanner);
}

function switchCameraDevice() {
    if (!cameraStream) return;
    
    // Stop current stream tracks
    cameraStream.getTracks().forEach(track => track.stop());
    
    const deviceId = cameraSelect.value;
    const constraints = {
        video: { deviceId: { exact: deviceId } }
    };
    
    navigator.mediaDevices.getUserMedia(constraints)
        .then(handleCameraStream)
        .catch(err => {
            console.error("Error switching cameras:", err);
            showToast("Could not connect to selected camera device.", "error");
        });
}

function tickCameraScanner() {
    if (cameraVideo.readyState === cameraVideo.HAVE_ENOUGH_DATA) {
        const canvas = cameraCanvas;
        const ctx = canvas.getContext('2d');
        
        canvas.width = cameraVideo.videoWidth;
        canvas.height = cameraVideo.videoHeight;
        
        ctx.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        let code = null;
        try {
            code = jsQR(imgData.data, canvas.width, canvas.height, {
                inversionAttempts: "attemptBoth"
            });
        } catch (e) {
            console.warn("jsQR camera tick error:", e);
        }
        
        if (code && code.data) {
            // Detected valid QR Code, shut down camera and show results!
            stopCameraScanner();
            decodeQRString(code.data);
            return;
        }
    }
    
    if (cameraStream) {
        cameraIntervalId = requestAnimationFrame(tickCameraScanner);
    }
}

function stopCameraScanner() {
    cameraModal.classList.remove('active');
    
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    
    if (cameraIntervalId) {
        cancelAnimationFrame(cameraIntervalId);
        cameraIntervalId = null;
    }
    
    cameraVideo.srcObject = null;
}

// ==========================================
// 9. LocalStorage WiFi Profiles History Database
// ==========================================
function saveProfile() {
    const type = getSelectedQRType();
    let name = "SPK QR";
    let data = {};
    
    if (type === 'wifi') {
        const ssid = wifiSsid.value.trim();
        const pwd = wifiPassword.value;
        const security = wifiSecurity.value;
        const hidden = wifiHidden.checked;
        
        if (!ssid) {
            showToast('Please enter a Network Name (SSID) before saving.', 'warn');
            wifiSsid.focus();
            return;
        }
        name = ssid;
        data = { ssid, password: pwd, security, hidden };
    } else if (type === 'url') {
        const url = qrUrl.value.trim();
        if (!url) {
            showToast('Please enter a Website URL before saving.', 'warn');
            qrUrl.focus();
            return;
        }
        name = url;
        data = { url };
    } else if (type === 'text') {
        const text = qrText.value.trim();
        if (!text) {
            showToast('Please enter some text content before saving.', 'warn');
            qrText.focus();
            return;
        }
        name = text.substring(0, 20) + (text.length > 20 ? '...' : '');
        data = { text };
    } else if (type === 'contact') {
        const fName = contactFirstName.value.trim();
        const lName = contactLastName.value.trim();
        if (!fName && !lName) {
            showToast('Please enter at least a First Name or Last Name before saving.', 'warn');
            contactFirstName.focus();
            return;
        }
        name = `${fName} ${lName}`.trim();
        data = {
            firstName: fName,
            lastName: lName,
            phone: contactPhone.value.trim(),
            email: contactEmail.value.trim(),
            website: contactWebsite.value.trim(),
            address: contactAddress.value.trim()
        };
    }
    
    const profiles = JSON.parse(localStorage.getItem('wifi_profiles') || '[]');
    
    const duplicateIndex = profiles.findIndex(p => (p.type || 'wifi') === type && p.name === name);
    if (duplicateIndex > -1) {
        if (!confirm(`A saved QR profile named "${name}" already exists. Do you want to update its details?`)) {
            return;
        }
        profiles.splice(duplicateIndex, 1);
    }
    
    const newProfile = {
        id: Date.now(),
        type: type,
        name: name,
        data: data,
        timestamp: new Date().toLocaleDateString()
    };
    
    profiles.unshift(newProfile);
    localStorage.setItem('wifi_profiles', JSON.stringify(profiles));
    
    saveHistoryBtn.disabled = true;
    const origHTML = saveHistoryBtn.innerHTML;
    saveHistoryBtn.innerHTML = '<i class="ti ti-circle-check"></i> Saved!';
    saveHistoryBtn.classList.remove('btn-primary');
    saveHistoryBtn.style.background = '#10b981';
    
    setTimeout(() => {
        saveHistoryBtn.innerHTML = origHTML;
        saveHistoryBtn.style.background = '';
        saveHistoryBtn.classList.add('btn-primary');
        saveHistoryBtn.disabled = false;
    }, 2000);

    loadHistory();
}

function loadHistory() {
    // Hide all lists and empty states first
    historyItemsGrid.classList.add('hidden');
    scanHistoryGrid.classList.add('hidden');
    historyEmpty.classList.add('hidden');
    scanHistoryEmpty.classList.add('hidden');
    
    if (activeHistorySubTab === 'generated') {
        const profiles = JSON.parse(localStorage.getItem('wifi_profiles') || '[]');
        
        if (profiles.length === 0) {
            historyEmpty.classList.remove('hidden');
            btnClearHistory.classList.add('hidden');
            return;
        }
        
        btnClearHistory.classList.remove('hidden');
        historyItemsGrid.classList.remove('hidden');
        historyItemsGrid.innerHTML = '';
        
        profiles.forEach(profile => {
            const card = document.createElement('div');
            card.className = 'history-card';
            
            let typeBadge = "";
            let detailsHtml = "";
            
            const type = profile.type || 'wifi';
            const name = profile.name || profile.ssid || "WiFi Profile";
            const data = profile.data || profile;
            
            if (type === 'wifi') {
                const security = data.security;
                const hidden = data.hidden;
                let secName = "WPA/WPA2/WPA3";
                if (security === 'WEP') secName = "WEP";
                else if (security === 'nopass') secName = "Open";
                
                typeBadge = `<span class="history-security-badge" style="background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2);"><i class="ti ti-wifi"></i> WiFi</span>`;
                detailsHtml = `
                    <div class="history-detail-row">
                        <span class="history-detail-label">Security:</span>
                        <span class="history-detail-value">${secName}</span>
                    </div>
                    <div class="history-detail-row">
                        <span class="history-detail-label">Hidden:</span>
                        <span class="history-detail-value">${hidden ? 'Yes' : 'No'}</span>
                    </div>
                `;
            } else if (type === 'url') {
                const url = data.url || "";
                typeBadge = `<span class="history-security-badge" style="background: rgba(99, 102, 241, 0.1); color: #6366f1; border: 1px solid rgba(99, 102, 241, 0.2);"><i class="ti ti-link"></i> Link</span>`;
                detailsHtml = `
                    <div class="history-detail-row">
                        <span class="history-detail-label">URL:</span>
                        <span class="history-detail-value" style="word-break: break-all;" title="${url}">${url}</span>
                    </div>
                `;
            } else if (type === 'text') {
                const text = data.text || "";
                typeBadge = `<span class="history-security-badge" style="background: rgba(168, 85, 247, 0.1); color: #a855f7; border: 1px solid rgba(168, 85, 247, 0.2);"><i class="ti ti-notes"></i> Text</span>`;
                detailsHtml = `
                    <div class="history-detail-row">
                        <span class="history-detail-label">Snippet:</span>
                        <span class="history-detail-value">${text.substring(0, 30)}${text.length > 30 ? '...' : ''}</span>
                    </div>
                `;
            } else if (type === 'contact') {
                const phone = data.phone || "";
                const email = data.email || "";
                typeBadge = `<span class="history-security-badge" style="background: rgba(236, 72, 153, 0.1); color: #ec4899; border: 1px solid rgba(236, 72, 153, 0.2);"><i class="ti ti-user-pin"></i> Contact</span>`;
                detailsHtml = `
                    <div class="history-detail-row">
                        <span class="history-detail-label">Phone:</span>
                        <span class="history-detail-value">${phone || 'None'}</span>
                    </div>
                    <div class="history-detail-row">
                        <span class="history-detail-label">Email:</span>
                        <span class="history-detail-value">${email || 'None'}</span>
                    </div>
                `;
            }
            
            card.innerHTML = `
                <div class="history-info">
                    <div class="history-card-header">
                        <span class="history-ssid" title="${name}">${name}</span>
                        ${typeBadge}
                    </div>
                    <div class="history-details">
                        ${detailsHtml}
                        <div class="history-detail-row">
                            <span class="history-detail-label">Saved:</span>
                            <span class="history-detail-value" style="font-family: inherit;">${profile.timestamp}</span>
                        </div>
                    </div>
                </div>
                <div class="history-card-actions">
                    <button class="btn btn-primary btn-sm load-profile-btn" data-id="${profile.id}">
                        <i class="ti ti-external-link"></i> Load
                    </button>
                    <button class="btn btn-outline btn-sm delete-profile-btn" data-id="${profile.id}" title="Delete profile">
                        <i class="ti ti-trash"></i>
                    </button>
                </div>
            `;
            
            historyItemsGrid.appendChild(card);
        });
        
        document.querySelectorAll('.load-profile-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.getAttribute('data-id'));
                loadProfileById(id);
            });
        });

        document.querySelectorAll('.delete-profile-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.getAttribute('data-id'));
                deleteProfileById(id);
            });
        });
    } else {
        const logs = JSON.parse(localStorage.getItem('scanned_qr_history') || '[]');
        
        if (logs.length === 0) {
            scanHistoryEmpty.classList.remove('hidden');
            btnClearHistory.classList.add('hidden');
            return;
        }
        
        btnClearHistory.classList.remove('hidden');
        scanHistoryGrid.classList.remove('hidden');
        scanHistoryGrid.innerHTML = '';
        
        logs.forEach(log => {
            const card = document.createElement('div');
            card.className = 'history-card';
            
            let typeBadge = "";
            let detailsHtml = "";
            
            const type = log.type;
            const name = log.name;
            const payload = log.payload;
            
            if (type === 'wifi') {
                typeBadge = `<span class="history-security-badge" style="background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2);"><i class="ti ti-wifi"></i> WiFi</span>`;
                detailsHtml = `
                    <div class="history-detail-row">
                        <span class="history-detail-label">SSID:</span>
                        <span class="history-detail-value">${name}</span>
                    </div>
                `;
            } else if (type === 'url') {
                typeBadge = `<span class="history-security-badge" style="background: rgba(99, 102, 241, 0.1); color: #6366f1; border: 1px solid rgba(99, 102, 241, 0.2);"><i class="ti ti-link"></i> Link</span>`;
                detailsHtml = `
                    <div class="history-detail-row">
                        <span class="history-detail-label">Link:</span>
                        <span class="history-detail-value" style="word-break: break-all;" title="${payload}">${payload}</span>
                    </div>
                `;
            } else if (type === 'text') {
                typeBadge = `<span class="history-security-badge" style="background: rgba(168, 85, 247, 0.1); color: #a855f7; border: 1px solid rgba(168, 85, 247, 0.2);"><i class="ti ti-notes"></i> Text</span>`;
                detailsHtml = `
                    <div class="history-detail-row">
                        <span class="history-detail-label">Text:</span>
                        <span class="history-detail-value" style="word-break: break-all;">${name}</span>
                    </div>
                `;
            } else if (type === 'contact') {
                typeBadge = `<span class="history-security-badge" style="background: rgba(236, 72, 153, 0.1); color: #ec4899; border: 1px solid rgba(236, 72, 153, 0.2);"><i class="ti ti-user-pin"></i> Contact</span>`;
                detailsHtml = `
                    <div class="history-detail-row">
                        <span class="history-detail-label">Contact:</span>
                        <span class="history-detail-value">${name}</span>
                    </div>
                `;
            }
            
            card.innerHTML = `
                <div class="history-info">
                    <div class="history-card-header">
                        <span class="history-ssid" title="${name}">${name}</span>
                        ${typeBadge}
                    </div>
                    <div class="history-details">
                        ${detailsHtml}
                        <div class="history-detail-row">
                            <span class="history-detail-label">Scanned:</span>
                            <span class="history-detail-value" style="font-family: inherit;">${log.timestamp}</span>
                        </div>
                    </div>
                </div>
                <div class="history-card-actions">
                    <button class="btn btn-primary btn-sm load-scanned-btn" data-id="${log.id}">
                        <i class="ti ti-external-link"></i> Load
                    </button>
                    <button class="btn btn-outline btn-sm delete-scanned-btn" data-id="${log.id}" title="Delete scan log">
                        <i class="ti ti-trash"></i>
                    </button>
                </div>
            `;
            
            scanHistoryGrid.appendChild(card);
        });
        
        document.querySelectorAll('.load-scanned-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.getAttribute('data-id'));
                loadScannedById(id);
            });
        });

        document.querySelectorAll('.delete-scanned-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.getAttribute('data-id'));
                deleteScannedById(id);
            });
        });
    }
}

function loadProfileById(id) {
    const profiles = JSON.parse(localStorage.getItem('wifi_profiles') || '[]');
    const profile = profiles.find(p => p.id === id);
    
    if (profile) {
        const type = profile.type || 'wifi';
        const data = profile.data || profile;
        
        const targetRadio = document.querySelector(`input[name="qr-type"][value="${type}"]`);
        if (targetRadio) {
            targetRadio.checked = true;
            targetRadio.dispatchEvent(new Event('change'));
        }
        
        if (type === 'wifi') {
            wifiSsid.value = data.ssid || "";
            wifiPassword.value = data.password || "";
            wifiSecurity.value = data.security || "nopass";
            wifiHidden.checked = !!data.hidden;
            
            if (wifiSecurity.value === 'nopass') {
                passwordGroup.classList.add('hidden');
            } else {
                passwordGroup.classList.remove('hidden');
            }
        } else if (type === 'url') {
            qrUrl.value = data.url || "";
        } else if (type === 'text') {
            qrText.value = data.text || "";
        } else if (type === 'contact') {
            contactFirstName.value = data.firstName || "";
            contactLastName.value = data.lastName || "";
            contactPhone.value = data.phone || "";
            contactEmail.value = data.email || "";
            contactWebsite.value = data.website || "";
            contactAddress.value = data.address || "";
        }
        
        generateQRCode();
        
        const genTabBtn = document.querySelector('.tab-btn[data-tab="generate"]');
        genTabBtn.click();
    }
}

function deleteProfileById(id) {
    let profiles = JSON.parse(localStorage.getItem('wifi_profiles') || '[]');
    profiles = profiles.filter(p => p.id !== id);
    localStorage.setItem('wifi_profiles', JSON.stringify(profiles));
    loadHistory();
}

// Clear all records database
btnClearHistory.addEventListener('click', () => {
    if (activeHistorySubTab === 'generated') {
        if (confirm("Are you sure you want to delete all saved QR profiles? This action cannot be undone.")) {
            localStorage.removeItem('wifi_profiles');
            loadHistory();
        }
    } else {
        if (confirm("Are you sure you want to delete all scanned QR logs? This action cannot be undone.")) {
            localStorage.removeItem('scanned_qr_history');
            loadHistory();
        }
    }
});

// Quick Design Presets data
const designPresets = {
    default: {
        dotShape: 'square',
        eyeShape: 'square',
        fillStyle: 'solid',
        colorFg: '#000000',
        colorBg: '#ffffff',
        transparentBg: false,
        customEyeColors: false
    },
    'midnight-gold': {
        dotShape: 'rounded',
        eyeShape: 'circle',
        fillStyle: 'gradient',
        colorGrad1: '#f59e0b',
        colorGrad2: '#78350f',
        gradientType: 'linear',
        gradientAngle: '135',
        colorBg: '#121214',
        transparentBg: false,
        customEyeColors: true,
        colorEyeOuter: '#f59e0b',
        colorEyeInner: '#d97706'
    },
    cyberpunk: {
        dotShape: 'circle',
        eyeShape: 'circle',
        fillStyle: 'gradient',
        colorGrad1: '#06b6d4',
        colorGrad2: '#d946ef',
        gradientType: 'radial',
        colorBg: '#0f172a',
        transparentBg: false,
        customEyeColors: true,
        colorEyeOuter: '#ec4899',
        colorEyeInner: '#f43f5e'
    },
    emerald: {
        dotShape: 'rounded',
        eyeShape: 'rounded',
        fillStyle: 'gradient',
        colorGrad1: '#10b981',
        colorGrad2: '#064e3b',
        gradientType: 'linear',
        gradientAngle: '135',
        colorBg: '#ffffff',
        transparentBg: false,
        customEyeColors: false
    },
    ocean: {
        dotShape: 'rounded',
        eyeShape: 'circle',
        fillStyle: 'gradient',
        colorGrad1: '#3b82f6',
        colorGrad2: '#1e3a8a',
        gradientType: 'linear',
        gradientAngle: '135',
        colorBg: '#ffffff',
        transparentBg: false,
        customEyeColors: true,
        colorEyeOuter: '#2563eb',
        colorEyeInner: '#1d4ed8'
    }
};

function setupDesignPresets() {
    const presetButtons = document.querySelectorAll('.preset-theme-btn');
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const presetKey = btn.getAttribute('data-preset');
            applyDesignPreset(presetKey);
            
            presetButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function applyDesignPreset(key) {
    const settings = designPresets[key];
    if (!settings) return;
    
    // Update form values
    if (settings.dotShape) {
        const radio = document.querySelector(`input[name="dot-shape"][value="${settings.dotShape}"]`);
        if (radio) radio.checked = true;
    }
    if (settings.eyeShape) {
        const radio = document.querySelector(`input[name="eye-shape"][value="${settings.eyeShape}"]`);
        if (radio) radio.checked = true;
    }
    if (settings.fillStyle) {
        const radio = document.querySelector(`input[name="fill-style"][value="${settings.fillStyle}"]`);
        if (radio) {
            radio.checked = true;
            radio.dispatchEvent(new Event('change'));
        }
    }
    if (settings.colorFg) {
        colorFg.value = settings.colorFg;
        colorFgText.value = settings.colorFg;
    }
    if (settings.colorGrad1) {
        colorGrad1.value = settings.colorGrad1;
        colorGrad1Text.value = settings.colorGrad1;
    }
    if (settings.colorGrad2) {
        colorGrad2.value = settings.colorGrad2;
        colorGrad2Text.value = settings.colorGrad2;
    }
    if (settings.gradientType) {
        gradientType.value = settings.gradientType;
        gradientType.dispatchEvent(new Event('change'));
    }
    if (settings.gradientAngle) {
        gradientAngle.value = settings.gradientAngle;
        gradientAngleVal.textContent = settings.gradientAngle;
    }
    if (settings.colorBg) {
        colorBg.value = settings.colorBg;
        colorBgText.value = settings.colorBg;
    }
    if (settings.transparentBg !== undefined) {
        transparentBg.checked = settings.transparentBg;
        transparentBg.dispatchEvent(new Event('change'));
    }
    if (settings.customEyeColors !== undefined) {
        customEyeColorsCheckbox.checked = settings.customEyeColors;
        customEyeColorsCheckbox.dispatchEvent(new Event('change'));
    }
    if (settings.colorEyeOuter) {
        colorEyeOuter.value = settings.colorEyeOuter;
        colorEyeOuterText.value = settings.colorEyeOuter;
    }
    if (settings.colorEyeInner) {
        colorEyeInner.value = settings.colorEyeInner;
        colorEyeInnerText.value = settings.colorEyeInner;
    }
    
    generateQRCode();
}

function setupHistorySubTabs() {
    const subTabButtons = document.querySelectorAll('.history-tab-btn');
    subTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const subtab = btn.getAttribute('data-subtab');
            activeHistorySubTab = subtab;
            
            subTabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            loadHistory();
        });
    });
}

function saveToScanHistory(type, payload) {
    if (!payload) return;
    
    const logs = JSON.parse(localStorage.getItem('scanned_qr_history') || '[]');
    
    let name = "Scanned QR";
    if (type === 'wifi') {
        const match = payload.match(/S:([^;]+);/);
        name = match ? match[1] : "WiFi Network";
    } else if (type === 'url') {
        name = payload;
    } else if (type === 'text') {
        name = payload.substring(0, 30) + (payload.length > 30 ? '...' : '');
    } else if (type === 'contact') {
        const match = payload.match(/FN:([^\n]+)\n/);
        name = match ? match[1].trim() : "Contact Card";
    }
    
    const duplicateIndex = logs.findIndex(log => log.payload === payload);
    if (duplicateIndex > -1) {
        logs.splice(duplicateIndex, 1);
    }
    
    const newLog = {
        id: Date.now(),
        type: type,
        name: name,
        payload: payload,
        timestamp: new Date().toLocaleString()
    };
    
    logs.unshift(newLog);
    localStorage.setItem('scanned_qr_history', JSON.stringify(logs));
}

function loadScannedById(id) {
    const logs = JSON.parse(localStorage.getItem('scanned_qr_history') || '[]');
    const log = logs.find(l => l.id === id);
    if (log) {
        decodeQRString(log.payload);
        const scanTabBtn = document.querySelector('.tab-btn[data-tab="scan"]');
        if (scanTabBtn) scanTabBtn.click();
    }
}

function deleteScannedById(id) {
    let logs = JSON.parse(localStorage.getItem('scanned_qr_history') || '[]');
    logs = logs.filter(l => l.id !== id);
    localStorage.setItem('scanned_qr_history', JSON.stringify(logs));
    loadHistory();
}

async function copyQRImageToClipboard() {
    const isValid = validateInputs();
    if (!isValid) return;
    try {
        qrCanvas.toBlob(async (blob) => {
            if (!blob) {
                showToast('Failed to generate QR image. Please try regenerating the code.', 'error');
                return;
            }
            try {
                const data = [new ClipboardItem({ 'image/png': blob })];
                await navigator.clipboard.write(data);
                
                btnCopyImage.disabled = true;
                const origHTML = btnCopyImage.innerHTML;
                btnCopyImage.innerHTML = '<i class="ti ti-circle-check"></i> Copied!';
                showToast('QR image copied to clipboard!', 'success', 2500);
                setTimeout(() => {
                    btnCopyImage.innerHTML = origHTML;
                    btnCopyImage.disabled = false;
                }, 2000);
            } catch (err) {
                console.error("Clipboard Item write failed:", err);
                showToast('Clipboard access denied. Make sure the page is served over HTTPS or localhost.', 'warn', 5000);
            }
        }, 'image/png');
    } catch (err) {
        console.error("Clipboard API error:", err);
        showToast('Your browser does not support clipboard image writing.', 'warn');
    }
}
