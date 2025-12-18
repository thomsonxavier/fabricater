// Toggle group - start

export const vtoggle__switch = () => {

    // script - start
    let mcj_ToggleGroupBtns = Array.from(document.querySelectorAll('.o-ias__vToggleGroup-btn')) || [];

    if( mcj_ToggleGroupBtns.length > 0 ) {
        mcj_ToggleGroupBtns.forEach( (item) => {
            item.addEventListener('click', ()=> {

                if(item.classList.contains('-active')){
                    return;
                }

                let parentClass = item.closest('.o-ias__vToggleGroup-wrap');
                let oldActive = parentClass.querySelector('.o-ias__vToggleGroup-btn.-active');
                oldActive.classList.remove('-active');
                // oldActive.setAttribute('tabindex','0');

                item.classList.add('-active');
                // item.setAttribute('tabindex','-1');
            });
        });
    }

    // script - end

    // Window variable
    // window.vtoggle__switch = vtoggle__switch;
}

// Toggle group - end
