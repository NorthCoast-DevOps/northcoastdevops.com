// Array of background images
const backgroundImages = [
    'bg-1.webp',
    'bg-2.webp',
    'bg-3.webp',
    'bg-4.webp',
    'bg-5.webp'
];

let currentImageIndex = -1;
let isLoadingImage = false; // Add a flag to prevent multiple simultaneous loads

// Function to get a new random index different from the current one
function getNewRandomIndex(currentIndex, arrayLength) {
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
    // Prevent multiple simultaneous loads
    if (isLoadingImage) return;
    
    const landingElement = document.getElementById('landing');
    if (!landingElement || backgroundImages.length === 0) return;

    isLoadingImage = true;
    
    const newIndex = getNewRandomIndex(currentImageIndex, backgroundImages.length);
    const imagePath = `./img/bg-landing/${backgroundImages[newIndex]}`;
    
    const img = new Image();
    img.onload = function() {
        landingElement.style.backgroundImage = `url('${imagePath}')`;
        currentImageIndex = newIndex;
        sessionStorage.setItem('lastImageIndex', newIndex.toString());
        isLoadingImage = false;
    };
    img.onerror = function() {
        console.error('Failed to load image:', imagePath);
        landingElement.style.backgroundImage = `url('./img/bg-landing/${backgroundImages[0]}')`;
        isLoadingImage = false;
    };
    img.src = imagePath;
}

// Single initialization function
function initializePage() {
    const storedIndex = sessionStorage.getItem('lastImageIndex');
    if (storedIndex !== null) {
        currentImageIndex = parseInt(storedIndex, 10);
    }
    setRandomBackgroundImage();
    scrollToTop();
}

// Consolidated event listeners
document.addEventListener('DOMContentLoaded', (event) => {
    const scrollUpArrow = document.querySelector('.scroll-up-arrow');
    const scrollDownArrow = document.querySelector('.scroll-arrow');
    const sections = document.querySelectorAll('.parallax, .section');

    initializePage();
    updateArrowsVisibility();

    // Store current index before unload
    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('lastImageIndex', currentImageIndex.toString());
    });
});

// Prevent automatic scroll restoration
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
