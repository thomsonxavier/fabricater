/* ==============================================================================
Feedback Modal Component
- Star rating hover and click functionality
- Updates data-rating attribute on click
============================================================================== */

export function feedbackModalINIT() {
    const starRatings = document.querySelectorAll('.c-feedback-modal__star-rating');
    
    starRatings.forEach(ratingContainer => {
        const stars = ratingContainer.querySelectorAll('.c-feedback-modal__star');
        let currentRating = parseInt(ratingContainer.getAttribute('data-rating')) || 0;
        
        stars.forEach((star, index) => {
            const starValue = parseInt(star.getAttribute('data-value'));
            const defaultIcon = star.querySelector('.icon-defaultstar');
            const goldIcon = star.querySelector('.icon-goldstar');
            
            // Hover effect - show gold stars up to hovered star
            star.addEventListener('mouseenter', () => {
                stars.forEach((s, i) => {
                    const sDefault = s.querySelector('.icon-defaultstar');
                    const sGold = s.querySelector('.icon-goldstar');
                    if (i <= index) {
                        if (sDefault) sDefault.style.display = 'none';
                        if (sGold) sGold.style.display = 'block';
                    } else {
                        if (sDefault) sDefault.style.display = 'block';
                        if (sGold) sGold.style.display = 'none';
                    }
                });
            });
            
            // Mouse leave - restore to current rating
            ratingContainer.addEventListener('mouseleave', () => {
                updateStarDisplay(ratingContainer, currentRating);
            });
            
            // Click handler - set rating
            star.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                currentRating = starValue;
                ratingContainer.setAttribute('data-rating', currentRating);
                updateStarDisplay(ratingContainer, currentRating);
            });
        });
    });
}

function updateStarDisplay(ratingContainer, rating) {
    const stars = ratingContainer.querySelectorAll('.c-feedback-modal__star');
    stars.forEach((star, index) => {
        const starValue = parseInt(star.getAttribute('data-value'));
        const defaultIcon = star.querySelector('.icon-defaultstar');
        const goldIcon = star.querySelector('.icon-goldstar');
        
        if (starValue <= rating) {
            if (defaultIcon) defaultIcon.style.display = 'none';
            if (goldIcon) goldIcon.style.display = 'block';
        } else {
            if (defaultIcon) defaultIcon.style.display = 'block';
            if (goldIcon) goldIcon.style.display = 'none';
        }
    });
}

export default feedbackModalINIT;
