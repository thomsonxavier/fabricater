export const searchfield__toggles = () =>{
    const toggles:HTMLElement[] = [].slice.call(document.querySelectorAll('button.o-searchfield__toggle') as NodeListOf<HTMLElement>) || [];

    toggles.forEach((item:HTMLElement)=>{
        item.addEventListener('click', handletoggle);
    });
}

function handletoggle(event:Event) {
    const target:HTMLElement = event.currentTarget as HTMLElement;
    const parent:HTMLElement = (target.closest('.o-searchfield__wrap')) as HTMLElement;
    const input:HTMLInputElement = (parent.querySelector('.o-searchfield__input') as HTMLInputElement);

    if(!input) return;

    if(target.getAttribute('aria-expanded')=='false') {
        // show
        target.setAttribute('aria-expanded','true')
        input.setAttribute('aria-hidden','false');
        input.removeAttribute('tabindex');
    }
    else {
        // hide
        target.setAttribute('aria-expanded','false')
        input.setAttribute('aria-hidden','true');
        input.setAttribute('tabindex','-1');
    }
}

export const headerSearch = () => {
    const parent = document.querySelector('.c-headerSearch') || null;
    
    if(parent!=null) {
        const searchToggle = parent.querySelector('.c-genw-banner__searchIcon');
        const closeBtn = parent.querySelector('.c-headerSearch__close');

        searchToggle.addEventListener('click',()=>{
            parent.setAttribute('aria-expanded', 'true');
        })

        closeBtn.addEventListener('click', ()=>{
            parent.setAttribute('aria-expanded','false');
        })
    }
}