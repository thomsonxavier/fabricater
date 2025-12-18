const SHOW_CLASS_TARGET = '-open';

/**
 * 1.1 - Function to handle event listeners
 * @param {Event} event 
 */
function handleChartControlClick(event:Event) {
    const TARGETED_BUTTON = (event.currentTarget) as HTMLElement;
    if(TARGETED_BUTTON.getAttribute('aria-expanded') === 'true') {
        hideChild(TARGETED_BUTTON);
    }
    else {
        showChild(TARGETED_BUTTON);
    }
}

/**
 * 1.2 Expand node
 * @param {HTMLElement} targetedButton 
 */
function showChild(targetedButton:HTMLElement) {
    const PARENT = targetedButton.closest('.c-mysppxc__row') as HTMLElement;
    const TARGET = PARENT.querySelector('.c-mysppxc__targetwrap') as HTMLElement;
    const PARENT_TARGET = PARENT.closest('.c-mysppxc__targetwrap') as HTMLElement || null;

    TARGET.classList.add(SHOW_CLASS_TARGET);
    computeEdge(TARGET);
    PARENT_TARGET && computeEdge(PARENT_TARGET);
    targetedButton.setAttribute('aria-expanded', 'true');
}

/**
 * 1.3 Collapse node
 * @param {HTMLElement} targetedButton 
 */
function hideChild(targetedButton:HTMLElement) {
    const PARENT = targetedButton.closest('.c-mysppxc__row') as HTMLElement;
    const TARGET = PARENT.querySelector('.c-mysppxc__targetwrap') as HTMLElement;
    const PARENT_TARGET = PARENT.closest('.c-mysppxc__targetwrap') as HTMLElement || null;

    TARGET.classList.remove(SHOW_CLASS_TARGET);
    computeEdge(TARGET);
    PARENT_TARGET && computeEdge(PARENT_TARGET);
    targetedButton.setAttribute('aria-expanded', 'false');
}

/**2.1 - Pass the li.c-mysppxc__row element and get the connecting edge's height and top positions calculated
 * @param {HTMLElement} parent
 */
function computeEdge(parent:HTMLElement) {
    const DATA_LEVEL = parent.getAttribute('data-level');
    const CHILDREN:HTMLElement[] = Array.from(parent.querySelectorAll(`.c-mysppxc__row[data-level='${DATA_LEVEL}']:not(.-backup) .c-mysppxc__item[data-level='${DATA_LEVEL}']`) as NodeListOf<HTMLElement>);
    const EDGE_ELEMENT:HTMLElement | null = parent.querySelector(`.c-mysppxc__edge[data-level='${DATA_LEVEL}']`) || null;

    if(CHILDREN.length <= 1 || !EDGE_ELEMENT) return;

    const PARENT_RECT = parent.getBoundingClientRect(), 
        FIRST_CHILD_RECT = CHILDREN[0].getBoundingClientRect(),
        LAST_CHILD_RECT = CHILDREN[CHILDREN.length - 1].getBoundingClientRect();

    const firstChildTop = FIRST_CHILD_RECT.top - PARENT_RECT.top, firstChildHeight = FIRST_CHILD_RECT.height,
    lastChildTop = LAST_CHILD_RECT.top - PARENT_RECT.top, lastChildHeight = LAST_CHILD_RECT.height;

    // calculate edge's top value - (distance from parent-top to first-child's 50% height)
    const TOP_VAL = firstChildTop + (firstChildHeight / 2);

    // calculate edge's height value - (distance from TOP_VAL to last-child's 50% height)
    const HEIGHT_VAL = (lastChildTop + (lastChildHeight / 2)) - TOP_VAL;

    EDGE_ELEMENT.style.setProperty('--edge-top-value', `${TOP_VAL}px`);
    EDGE_ELEMENT.style.setProperty('--edge-height-value', `${HEIGHT_VAL}px`);
}

/**
 * Calls the functions in order, setsup eventlistener
 * @returns {void}
 */
export const myspValueProposition = () => {
    const CHART_CONTROLS:HTMLElement[] = Array.from(document.querySelectorAll('.c-mysppxc__controlbtn')) || [];
    const CHART_BREADTH_ROWS:HTMLElement[] = Array.from(document.querySelectorAll(`.c-mysppxc__tablebody .c-mysppxc__targetwrap`)) || [];

    CHART_CONTROLS.forEach((chartControl)=>{
        chartControl.addEventListener('click', handleChartControlClick);
    });
    
    CHART_BREADTH_ROWS.forEach((breadthRow)=>{
        computeEdge(breadthRow);
    })
}