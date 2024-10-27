// Array of background images
const backgroundImages = [
    'bg-1.webp',
    'bg-2.webp',
    'bg-3.webp',
    'bg-4.webp',
    'bg-5.webp'
];

let currentImageIndex = -1;

// Function to get a new random index different from the current one
function getNewRandomIndex(currentIndex, arrayLength) {
    // Get the last used index from session storage
    const lastUsedIndex = sessionStorage.getItem('lastImageIndex');
    const previousIndex = lastUsedIndex !== null ? parseInt(lastUsedIndex, 10) : currentIndex;
    
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * arrayLength);
    } while (newIndex === previousIndex && arrayLength > 1);
    return newIndex;
}

// Function to preload image and set as background only after loading
function setRandomBackgroundImage() {
    const landingElement = document.getElementById('landing');
    if (!landingElement || backgroundImages.length === 0) return;

    const newIndex = getNewRandomIndex(currentImageIndex, backgroundImages.length);
    const imagePath = `./img/bg-landing/${backgroundImages[newIndex]}`;
    
    // Create new image object to preload
    const img = new Image();
    img.onload = function() {
        landingElement.style.backgroundImage = `url('${imagePath}')`;
        currentImageIndex = newIndex;
        // Store the current index immediately after setting it
        sessionStorage.setItem('lastImageIndex', newIndex.toString());
    };
    img.onerror = function() {
        console.error('Failed to load image:', imagePath);
        // Try to load the first image as a fallback
        landingElement.style.backgroundImage = `url('./img/bg-landing/${backgroundImages[0]}')`;
    };
    img.src = imagePath;
}

// Function to scroll to top
function scrollToTop() {
    window.scrollTo(0, 0);
}

document.addEventListener('DOMContentLoaded', (event) => {
    const scrollUpArrow = document.querySelector('.scroll-up-arrow');
    const scrollDownArrow = document.querySelector('.scroll-arrow');
    const sections = document.querySelectorAll('.parallax, .section');

    // ... (rest of your existing code) ...

    // Initial setup
    setRandomBackgroundImage();
    scrollToTop();
    updateArrowsVisibility();

    // Reload behavior
    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('lastImageIndex', currentImageIndex.toString());
    });
});

// Set random background on page load
window.addEventListener('load', () => {
    const storedIndex = sessionStorage.getItem('lastImageIndex');
    if (storedIndex !== null) {
        currentImageIndex = parseInt(storedIndex, 10);
    }
    setRandomBackgroundImage();
    scrollToTop();
});

// Prevent automatic scroll restoration
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
