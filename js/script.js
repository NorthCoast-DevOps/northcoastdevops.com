// Array of background images
const backgroundImages = [
    'bg-1.webp',
    'bg-2.webp',
    'bg-3.webp',
    'bg-4.webp',
    'bg-5.webp'
];

// Global variables for DOM elements
let scrollUpArrow;
let scrollDownArrow;
let sections;
let currentImageIndex = -1;
let isLoadingImage = false;
let titleUpdateTimeout;

// Function to get a new random index different from the current one
function getNewRandomIndex() {
    const lastUsedIndex = sessionStorage.getItem('lastImageIndex');
    const previousIndex = lastUsedIndex !== null ? parseInt(lastUsedIndex, 10) : -1;
    
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * backgroundImages.length);
    } while (newIndex === previousIndex && backgroundImages.length > 1);
    
    return newIndex;
}

// Function to set background image
function setBackgroundImage(imagePath) {
    const landingElement = document.getElementById('landing');
    if (landingElement) {
        landingElement.style.backgroundImage = `url('${imagePath}')`;
    }
}

// Function to load and set random background image
async function setRandomBackgroundImage() {
    // If already loading an image, don't start another load
    if (isLoadingImage) {
        return;
    }

    try {
        isLoadingImage = true;
        
        const newIndex = getNewRandomIndex();
        const imagePath = `./img/bg-landing/${backgroundImages[newIndex]}`;

        // Create a promise to load the image
        const imageLoadPromise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(imagePath);
            img.onerror = () => reject(new Error(`Failed to load image: ${imagePath}`));
            img.src = imagePath;
        });

        // Wait for image to load
        const loadedImagePath = await imageLoadPromise;
        
        // Set the background and update tracking variables
        setBackgroundImage(loadedImagePath);
        currentImageIndex = newIndex;
        sessionStorage.setItem('lastImageIndex', newIndex.toString());

    } catch (error) {
        console.error(error);
        // On error, try to use the first image as fallback
        setBackgroundImage(`./img/bg-landing/${backgroundImages[0]}`);
    } finally {
        isLoadingImage = false;
    }
}

// Function to scroll to top
function scrollToTop() {
    window.scrollTo(0, 0);
}
// Function to update arrows visibility
function updateArrowsVisibility() {
    // Only proceed if DOM elements are initialized
    if (!sections || !scrollUpArrow || !scrollDownArrow) return;

    let scrollPosition = window.pageYOffset;
    let windowHeight = window.innerHeight;
    let currentSectionIndex = Math.floor(scrollPosition / windowHeight);

    // Update page title and GA with debounce
    clearTimeout(titleUpdateTimeout);
    titleUpdateTimeout = setTimeout(() => {
        const currentSection = sections[currentSectionIndex];
        if (currentSection) {
            const sectionId = currentSection.id;
            updatePageTitle(sectionId);
            sendGAPageView(sectionId);
        }
    }, 100);

    // Show down arrow when there's a next frame
    if (currentSectionIndex < sections.length - 1) {
        scrollDownArrow.style.display = 'block';
        scrollDownArrow.style.opacity = '1';
    } else {
        scrollDownArrow.style.opacity = '0';
        setTimeout(() => {
            scrollDownArrow.style.display = 'none';
        }, 300);
    }

    // Show up arrow when not at the first frame
    if (currentSectionIndex > 0) {
        scrollUpArrow.classList.add('visible');
    } else {
        scrollUpArrow.classList.remove('visible');
    }
}

// Single initialization function
function initializePage() {
    // Initialize DOM elements first
    scrollUpArrow = document.querySelector('.scroll-up-arrow');
    scrollDownArrow = document.querySelector('.scroll-arrow');
    sections = document.querySelectorAll('.parallax, .section');

    const storedIndex = sessionStorage.getItem('lastImageIndex');
    if (storedIndex !== null) {
        currentImageIndex = parseInt(storedIndex, 10);
    }
    setRandomBackgroundImage();
    scrollToTop();
    
    // Only call updateArrowsVisibility after DOM elements are initialized
    updateArrowsVisibility();
}

// Consolidated event listeners
document.addEventListener('DOMContentLoaded', (event) => {
    initializeDarkMode();
    initializePage();

    // Add scroll event listener for arrow visibility
    window.addEventListener('scroll', updateArrowsVisibility);
    window.addEventListener('resize', updateArrowsVisibility);

    // Add click handlers for arrows
    if (scrollUpArrow) {
        scrollUpArrow.addEventListener('click', () => {
            let currentSectionIndex = Math.floor(window.pageYOffset / window.innerHeight);
            if (currentSectionIndex > 0) {
                sections[currentSectionIndex - 1].scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (scrollDownArrow) {
        scrollDownArrow.addEventListener('click', () => {
            let currentSectionIndex = Math.floor(window.pageYOffset / window.innerHeight);
            if (currentSectionIndex < sections.length - 1) {
                sections[currentSectionIndex + 1].scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Store current index before unload
    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('lastImageIndex', currentImageIndex.toString());
    });
});

// Prevent automatic scroll restoration
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

function sendEmail(event) {
    event.preventDefault();

    const form = document.getElementById('contact-form');
    const formData = new FormData(form);

    // Prepare the data to send
    const data = {
        from_name: formData.get('name'),
        from_email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message')
    };

    // Send the email using EmailJS
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", data)
    .then((result) => {
        console.log('Email sent successfully:', result.text);
        showSuccessMessage();
        form.reset();
    }, (error) => {
        console.error('Error sending email:', error.text);
        alert('Failed to send message. Please try again later.');
    });
}

function showSuccessMessage() {
    const form = document.getElementById('contact-form');
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <h4>Thank You!</h4>
        <p>Your inquiry has been submitted successfully.</p>
        <p>We will review your request and get back to you shortly via email or phone.</p>
    `;
    
    // Replace form with success message
    form.style.opacity = '0';
    setTimeout(() => {
        form.parentNode.replaceChild(successMessage, form);
        successMessage.style.opacity = '1';
    }, 300);
}

// Add this new function to update the page title
function updatePageTitle(currentSection) {
    const baseName = "NorthCoast DevOps";
    let newTitle;
    
    switch(currentSection) {
        case 'home':
            newTitle = baseName;
            break;
        case 'about':
            newTitle = `About | ${baseName}`;
            break;
        case 'services':
            newTitle = `Services | ${baseName}`;
            break;
        case 'contact':
            newTitle = `Contact | ${baseName}`;
            break;
        default:
            newTitle = baseName;
    }
    
    document.title = newTitle;
}

// Add this function to handle GA pageview events
function sendGAPageView(sectionId) {
    // For GA4
    gtag('event', 'page_view', {
        page_title: document.title,
        page_location: `${window.location.origin}/#${sectionId}`,
        page_path: `/#${sectionId}`,
        // Optional additional parameters
        send_to: 'G-S4DQ76FZQE',  // Your GA4 measurement ID
        user_engagement: true
    });

    // Optional: Send a separate section_view event
    gtag('event', 'section_view', {
        section_name: sectionId,
        time_stamp: new Date().toISOString()
    });
}
// keyboard navigation
document.addEventListener('keydown', (e) => {
    let currentSectionIndex = Math.floor(window.pageYOffset / window.innerHeight);
    
    if (e.key === 'ArrowDown' && currentSectionIndex < sections.length - 1) {
        sections[currentSectionIndex + 1].scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'ArrowUp' && currentSectionIndex > 0) {
        sections[currentSectionIndex - 1].scrollIntoView({ behavior: 'smooth' });
    }
});// form validation
function validateForm(formData) {
    const email = formData.get('email');
    const phone = formData.get('phone');
    
    if (phone && !/^\+?[\d\s-()]{10,}$/.test(phone)) {
        throw new Error('Please enter a valid phone number');
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Please enter a valid email address');
    }
}
// section indicator
function updateSectionIndicator() {
    const dots = document.querySelectorAll('.section-dot');
    let scrollPosition = window.pageYOffset;
    let windowHeight = window.innerHeight;
    let currentSectionIndex = Math.floor(scrollPosition / windowHeight);

    dots.forEach((dot, index) => {
        if (index === currentSectionIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Add this to your existing scroll event listener
window.addEventListener('scroll', () => {
    updateArrowsVisibility();
    updateSectionIndicator();
});

// Add click handlers for the dots
document.querySelectorAll('.section-dot').forEach((dot, index) => {
    dot.addEventListener('click', () => {
        sections[index].scrollIntoView({ behavior: 'smooth' });
    });
});
// toggle dark mode
function initializeDarkMode() {
    const toggle = document.querySelector('.dark-mode-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = localStorage.getItem('theme');

    // Set initial state
    if (storedTheme === 'dark' || (!storedTheme && prefersDark.matches)) {
        document.documentElement.classList.add('dark-mode');
        toggle.classList.add('dark');
    }

    toggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark-mode');
        toggle.classList.toggle('dark');
        
        const isDark = document.documentElement.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}
