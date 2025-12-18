/**
 * Calls the functions in order, setsup eventlistener
 * @returns {void}
 */
export const themeToggle = () => {
    const TOGGLE:HTMLInputElement | null = document.querySelector('#app-theme-toggle') ?? null;
    if(!TOGGLE) return;

    TOGGLE.addEventListener('change', ()=>{
        if(TOGGLE.checked) {
            document.documentElement.setAttribute('data-theme', 'light');
        }
        else {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    });
}

/**
 * Calls the functions in order, setsup eventlistener
 * @returns {void}
 */
export const themeSwitch = () => {
    const TOGGLE:HTMLInputElement | null = document.querySelector('#app-theme-switch') ?? null;
    if(!TOGGLE) return;

    TOGGLE.addEventListener('click', ()=>{
        if(TOGGLE.getAttribute('data-theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
           TOGGLE.setAttribute('data-theme', 'light');
        }
        else {
            document.documentElement.setAttribute('data-theme', 'dark');
            TOGGLE.setAttribute('data-theme', 'dark');
        }
    });
}

/**
 *
 */
export type Theme = 'light' | 'dark';
const STORAGE_KEY = "theme-preference";
export const themeSwitch_2 = () => {
    const INITIAL_THEME = getColorPreference() ?? 'dark'; //defaults to dark
    setTheme(INITIAL_THEME);
    
    const TOGGLE:HTMLButtonElement | null = document.querySelector('#app-theme-switch') ?? null;
    if(!TOGGLE) return;

    TOGGLE.setAttribute('data-theme', INITIAL_THEME);

    TOGGLE.addEventListener('click', ()=>{
        if(TOGGLE.getAttribute('data-theme') === 'dark') {
           TOGGLE.setAttribute('data-theme', 'light');
           setTheme('light');
        }
        else {
            TOGGLE.setAttribute('data-theme', 'dark');
            setTheme('dark');
        }
    });

    window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', ({matches:isDark}) => {
      setTheme(isDark ? 'dark' : 'light');
      if(isDark) {
        TOGGLE.setAttribute('data-theme', 'dark');
        setTheme('dark');
      }
      else {
        TOGGLE.setAttribute('data-theme', 'light');
        setTheme('light');
      }
    });
}
function setTheme(theme='light') {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
}
function getColorPreference() {
    if (localStorage.getItem(STORAGE_KEY)) return localStorage.getItem(STORAGE_KEY) as Theme;
    else return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}   
