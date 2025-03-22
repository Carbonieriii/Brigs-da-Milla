document.addEventListener("DOMContentLoaded", function () {
    // Função para inicializar cada carrossel
    function initCarousel(carousel) {
        const track = carousel.querySelector(".carousel-track");
        const prevButton = carousel.querySelector(".prev");
        const nextButton = carousel.querySelector(".next");
        const products = carousel.querySelectorAll(".product");
        
        // Clone os primeiros itens para o efeito de loop
        const cloneProducts = Array.from(products).slice(0, 3).map(product => product.cloneNode(true));
        track.append(...cloneProducts);

        let isAnimating = false;
        let currentIndex = 0;
        const itemWidth = products[0].offsetWidth + 20;

        function moveToIndex() {
            if (isAnimating) return;
            
            isAnimating = true;
            track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        }

        function handleTransitionEnd() {
            if (currentIndex >= products.length) {
                track.style.transition = 'none';
                track.style.transform = 'translateX(0)';
                currentIndex = 0;
            }
            isAnimating = false;
        }

        // Controles
        nextButton.addEventListener("click", () => {
            if (currentIndex >= products.length) return;
            currentIndex++;
            moveToIndex();
        });

        prevButton.addEventListener("click", () => {
            if (currentIndex <= 0) return;
            currentIndex--;
            moveToIndex();
        });

        // Touch
        let touchStartX = 0;
        track.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
        });

        track.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) {
                diff > 0 ? currentIndex++ : currentIndex--;
                currentIndex = Math.max(0, Math.min(currentIndex, products.length));
                moveToIndex();
            }
        });

        // Auto-scroll
        let autoScroll = setInterval(() => {
            currentIndex++;
            moveToIndex();
        }, 5000);

        track.addEventListener('mouseenter', () => clearInterval(autoScroll));
        track.addEventListener('mouseleave', () => {
            autoScroll = setInterval(() => {
                currentIndex++;
                moveToIndex();
            }, 5000);
        });

        track.addEventListener('transitionend', handleTransitionEnd);
    }

    // Inicializar todos os carrosséis
    document.querySelectorAll('.carousel').forEach(carousel => {
        initCarousel(carousel);
    });
});