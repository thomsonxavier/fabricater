/* =============================================================================
Filter Panel Component
- Toggle filter panel visibility
- Minimize/maximize functionality
- Clear all filters
============================================================================== */

export function filterPanelINIT() {
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
