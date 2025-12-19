/* ==============================================================================
myApplicationID Header Component
- Tooltip show on hover
- Close button functionality
============================================================================== */

export function myappidHeaderINIT() {
    const tooltipCloseButtons = document.querySelectorAll('.c-myappid-header__tooltip-close');
    
    tooltipCloseButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const tooltip = btn.closest('.c-myappid-header__tooltip');
            if (tooltip) {
                tooltip.classList.add('-closed');
            }
        });
    });

    // Reset tooltip when mouse leaves the wrapper completely
    const amethystWraps = document.querySelectorAll('.c-myappid-header__amethyst-wrap');
    amethystWraps.forEach(wrap => {
        wrap.addEventListener('mouseleave', () => {
            const tooltip = wrap.querySelector('.c-myappid-header__tooltip');
            if (tooltip) {
                // Remove closed class after a delay so it can show again on next hover
                setTimeout(() => {
                    tooltip.classList.remove('-closed');
                }, 300);
            }
        });
    });
}

export default myappidHeaderINIT;
