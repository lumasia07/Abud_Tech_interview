document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    let currentSlideIndex = 0;
    
    const slideTimings = {
        firstSlide: 8000,
        otherSlides: 2000, 
    };

    const shakeConfig = {
        xIntensity: 2,
        yIntensity: 3,
        duration: 80,  
        fps: 60
    };

    const pointerConfig = {
        scaleMin: 0.1,
        scaleMax: 0.3,
        duration: 1500,
        fps: 60
    };

    function wrapNumberImages() {
        const numberImages = document.querySelectorAll('.number-img');
        numberImages.forEach(img => {
            if (img.id === 'pointer' || img.parentElement.classList.contains('number-wrapper')) {
                return;
            }
            
            const wrapper = document.createElement('div');
            wrapper.className = 'number-wrapper';
            
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);
        });
    }

    function initializeSlides() {
        wrapNumberImages();
        
        slides.forEach((slide, index) => {
            if (index === 0) {
                slide.classList.add('active');
                if (slide.id === 'slide1') {
                    initializeAnimations();
                }
            } else {
                slide.classList.remove('active');
            }
        });
    }

    function initializeAnimations() {
        const allNumbers = document.querySelectorAll('.number-img');
        const pointer = document.getElementById('pointer');
        
        allNumbers.forEach(img => {
            if (img.id !== 'pointer') {
                startVigorousShake(img);
            }
        });

        startPointerPulse(pointer);
    }

    function startVigorousShake(element) {
        let startTime = performance.now();
        
        function shake(currentTime) {
            const elapsed = currentTime - startTime;

            const xOffset = (
                Math.sin(elapsed * 0.01) * shakeConfig.xIntensity +
                Math.sin(elapsed * 0.05) * (shakeConfig.xIntensity * 0.5)
            );
            
            const yOffset = (
                Math.cos(elapsed * 0.01) * shakeConfig.yIntensity +
                Math.cos(elapsed * 0.02) * (shakeConfig.yIntensity * 0.5)
            );

            const jitterX = (Math.random() - 0.5) * 0.5;
            const jitterY = (Math.random() - 0.5) * 0.5;
            
            element.style.transform = `translate(${xOffset + jitterX}px, ${yOffset + jitterY}px)`;
            
            if (element.closest('.slide').classList.contains('active')) {
                requestAnimationFrame(shake);
            } else {
                element.style.transform = '';
            }
        }
        
        requestAnimationFrame(shake);
    }

    function startPointerPulse(element) {
        let startTime = performance.now();
        
        function pulse(currentTime) {
            const elapsed = currentTime - startTime;
            
            const progress = (elapsed % pointerConfig.duration) / pointerConfig.duration;
            const scale = pointerConfig.scaleMin + 
                (Math.sin(progress * Math.PI * 2) * 0.5 + 0.5) * 
                (pointerConfig.scaleMax - pointerConfig.scaleMin);

            const rotation = Math.sin(elapsed * 0.005) * 5;
            
            element.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
            
            if (element.closest('.slide').classList.contains('active')) {
                requestAnimationFrame(pulse);
            } else {
                element.style.transform = '';
            }
        }
        
        requestAnimationFrame(pulse);
    }

    function displaySlide(index) {
        slides.forEach(slide => {
            slide.classList.remove('active');
            const elements = slide.querySelectorAll('img');
            elements.forEach(el => el.style.transform = '');
        });

        slides[index].classList.add('active');
        
        if (slides[index].id === 'slide1') {
            initializeAnimations();
        }

        const nextTimeout = index === 0 ? slideTimings.firstSlide : slideTimings.otherSlides;
        setTimeout(nextSlide, nextTimeout);
    }

    function nextSlide() {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        displaySlide(currentSlideIndex);
    }

    initializeSlides();
    displaySlide(0);
});