/* =============================================================================
Filter Panel Component
- Toggle filter panel visibility
- Minimize/maximize functionality
- Clear all filters
============================================================================== */

// Position filter button at absolute left edge, aligned with toolbar
function positionFilterButton() {
    const filterButtons = document.querySelectorAll('.c-requests-wrapper__filter-btn');
    
    filterButtons.forEach(btn => {
        // Skip if button is hidden (when filter panel is open)
        if (btn.getAttribute('aria-expanded') === 'true' || btn.style.display === 'none') {
            return;
        }
        
        // Find the action toolbar to align with
        const requestsWrapper = btn.closest('.c-requests-wrapper');
        if (requestsWrapper) {
            const toolbar = requestsWrapper.querySelector('.c-action-toolbar');
            if (toolbar) {
                const toolbarRect = toolbar.getBoundingClientRect();
                
                // Position button at left edge (0), aligned with toolbar's vertical center
                const buttonHeight = btn.offsetHeight || 32; // Default to 32px if not rendered yet
                const topPosition = toolbarRect.top + (toolbarRect.height / 2) - (buttonHeight / 2);
                btn.style.top = `${Math.max(0, topPosition)}px`; // Ensure it's not negative
            }
        }
    });
}

export function filterPanelINIT() {
    // Position filter buttons at absolute left edge after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Small delay to ensure layout is complete
            setTimeout(positionFilterButton, 100);
        });
    } else {
        // DOM already loaded
        setTimeout(positionFilterButton, 100);
    }
    
    // Reposition on window resize and scroll
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(positionFilterButton, 100);
    });
    
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(positionFilterButton, 50);
    });
    
    // Filter button selectors
    const filterButtons = document.querySelectorAll('.c-requests-wrapper__filter-btn');
    const minimizeButtons = document.querySelectorAll('.c-filter-panel__minimize');
    const clearButtons = document.querySelectorAll('.c-filter-panel__clear');

    // Toggle filter panel when clicking filter button
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', !isExpanded);
            
            // Find the filter panel in the same column
            const filterCol = btn.closest('.c-requests-wrapper__filter-col');
            if (filterCol) {
                const panelWrapper = filterCol.querySelector('.c-requests-wrapper__filter-panel');
                if (panelWrapper) {
                    panelWrapper.classList.toggle('-show', !isExpanded);
                }
            }
        });
    });

    // Also support c-action-toolbar__filter-btn
    const toolbarFilterButtons = document.querySelectorAll('.c-action-toolbar__filter-btn');
    toolbarFilterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', !isExpanded);
            
            const wrapper = btn.closest('.c-requests-wrapper');
            if (wrapper) {
                const panel = wrapper.querySelector('.c-filter-panel');
                if (panel) {
                    panel.classList.toggle('-show', !isExpanded);
                }
            }
        });
    });

    // Minimize/close filter panel - shows the filter button again
    minimizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const panel = btn.closest('.c-filter-panel');
            if (panel) {
                // Find the wrapper and close the panel
                const panelWrapper = panel.closest('.c-requests-wrapper__filter-panel');
                if (panelWrapper) {
                    panelWrapper.classList.remove('-show');
                    
                    // Find and reset the filter button
                    const filterCol = panelWrapper.closest('.c-requests-wrapper__filter-col');
                    if (filterCol) {
                        const filterBtn = filterCol.querySelector('.c-requests-wrapper__filter-btn');
                        if (filterBtn) {
                            filterBtn.setAttribute('aria-expanded', 'false');
                            // Reposition button after it becomes visible again
                            setTimeout(positionFilterButton, 50);
                        }
                    }
                }
            }
        });
    });

    // Clear all filters
    clearButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const panel = btn.closest('.c-filter-panel');
            if (panel) {
                // Reset all inputs in the panel
                const inputs = panel.querySelectorAll('input, select');
                inputs.forEach(input => {
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        input.checked = false;
                    } else {
                        input.value = '';
                    }
                });
                
                // Dispatch custom event
                panel.dispatchEvent(new CustomEvent('filtersCleared'));
            }
        });
    });
}

export default filterPanelINIT;
