export function animateWhenInView() {
    const targets:HTMLElement[] = Array.from(document.querySelectorAll('.-tobe-animated')) || [];
    
    checkAll();

    window.addEventListener('scroll', ()=>{
        checkAll();
    });

    function checkAll() {
        targets.forEach((item)=>{
            !item.classList.contains('-animate') && checkEligibility(item);
        })
    }
}

    
/**
 * 
 * @param {HTMLElement} item 
 * @returns {void}
 */
function checkEligibility(item:HTMLElement) {
    if (isElementInViewport(item)) {
        // Start the animation
        item.classList.add('-animate');
    }
}

/**
 * 
 * @param {HTMLElement} element 
 * @returns {boolean}
 */
function isElementInViewport(element:HTMLElement) {
    const rect = element.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    );
}