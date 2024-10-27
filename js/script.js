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

// Function to scroll to top
function scrollToTop() {
    window.scrollTo(0, 0);
}

// Function to update arrows visibility
function updateArrowsVisibility() {
    let scrollPosition = window.pageYOffset;
    let windowHeight = window.innerHeight;
    let currentSectionIndex = Math.floor(scrollPosition / windowHeight);

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

    // Add scroll event listener for arrow visibility
    window.addEventListener('scroll', updateArrowsVisibility);
    window.addEventListener('resize', updateArrowsVisibility);

    // Add click handlers for arrows
    scrollUpArrow.addEventListener('click', () => {
        let currentSectionIndex = Math.floor(window.pageYOffset / window.innerHeight);
        if (currentSectionIndex > 0) {
            sections[currentSectionIndex - 1].scrollIntoView({ behavior: 'smooth' });
        }
    });

    scrollDownArrow.addEventListener('click', () => {
        let currentSectionIndex = Math.floor(window.pageYOffset / window.innerHeight);
        if (currentSectionIndex < sections.length - 1) {
            sections[currentSectionIndex + 1].scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Store current index before unload
    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('lastImageIndex', currentImageIndex.toString());
    });
});

// Prevent automatic scroll restoration
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
