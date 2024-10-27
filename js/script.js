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
    // Initialize global DOM element references
    scrollUpArrow = document.querySelector('.scroll-up-arrow');
    scrollDownArrow = document.querySelector('.scroll-arrow');
    sections = document.querySelectorAll('.parallax, .section');

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
