document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.slider-tab');
    const slides = document.querySelectorAll('.slide');
    const intervalTime = 5000; // 5 seconds
    let activeIndex = 0;
    let intervalId;

    if (!tabs.length || !slides.length) return;

    function setActiveSlide(index) {
        // Remove active class from all
        tabs.forEach(t => t.classList.remove('active'));
        slides.forEach(s => s.classList.remove('active'));

        // Add active class to current
        tabs[index].classList.add('active');
        const targetSlide = tabs[index].getAttribute('data-slide');
        const activeSlide = document.querySelector(`.slide[data-slide="${targetSlide}"]`);
        if (activeSlide) {
            activeSlide.classList.add('active');
        }
        activeIndex = index;
    }

    function nextSlide() {
        let nextIndex = activeIndex + 1;
        if (nextIndex >= tabs.length) {
            nextIndex = 0;
        }
        setActiveSlide(nextIndex);
    }

    function startAutoPlay() {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(nextSlide, intervalTime);
    }

    function stopAutoPlay() {
        if (intervalId) clearInterval(intervalId);
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            stopAutoPlay(); // Stop auto-play on user interaction
            setActiveSlide(index);
            startAutoPlay(); // Restart auto-play
        });
    });

    // Find currently active index if any
    tabs.forEach((tab, index) => {
        if (tab.classList.contains('active')) {
            activeIndex = index;
        }
    });

    // Start auto-play initially
    startAutoPlay();
});
