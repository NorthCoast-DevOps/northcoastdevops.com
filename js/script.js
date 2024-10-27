// Array of background images
const backgroundImages = [
    'bg-1.webp',
    'bg-2.webp',
    'bg-3.webp',
    'bg-4.webp',
    'bg-5.webp'
];

let lastUsedImageIndex = -1;

// Function to set a random background image
function setRandomBackgroundImage() {
    const landingElement = document.getElementById('landing');
    if (landingElement && backgroundImages.length > 1) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * backgroundImages.length);
        } while (randomIndex === lastUsedImageIndex);

        lastUsedImageIndex = randomIndex;
        const randomImage = backgroundImages[randomIndex];
        const imagePath = `./img/bg-landing/${randomImage}`;
        landingElement.style.backgroundImage = `url('${imagePath}')`;
        console.log('Set background image:', imagePath); // Debugging line
    } else {
        console.error('Landing element not found or not enough background images defined');
    }
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
        sessionStorage.setItem('lastImageIndex', lastUsedImageIndex.toString());
    });
});

// Set random background on page load
window.addEventListener('load', () => {
    const storedIndex = sessionStorage.getItem('lastImageIndex');
    if (storedIndex !== null) {
        lastUsedImageIndex = parseInt(storedIndex, 10);
    }
    setRandomBackgroundImage();
    scrollToTop();
});

// Prevent automatic scroll restoration
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
