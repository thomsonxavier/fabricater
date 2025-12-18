const fixedTopValue = 116;

const navScroll = () => {
  const sections = document.querySelectorAll<HTMLElement>(".c-privacy__item");
  // let scrollY = window.scrollY;
  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    // const sectionTop = current.offsetTop - 50;
    const sectionId = current.getAttribute("id");

    const childRect = current.getBoundingClientRect();

    const relativeTop = (childRect.top - fixedTopValue);

    if (relativeTop <= 5 && relativeTop >= ((sectionHeight * -1) - 5)) {

      console.log(current.offsetTop);

      let tabItems = document.querySelectorAll<HTMLElement>('.c-privacy-ques__item');
      tabItems.forEach(tabItem => {
        tabItem.classList.remove("-active");
      });
      const elem = document.querySelector<HTMLElement>(
        ".c-privacy-ques__item[data-href*=" + sectionId + "]"
      );
      elem?.classList.add("-active");
    }

  });
};

const navItemsClick = () => {
  const navItems = document.querySelectorAll<HTMLElement>(".c-privacy-ques__item");

  navItems.forEach(navItem => {
    navItem.addEventListener('click', (event) => {
      const id = navItem.getAttribute("data-href");
      const element = document.getElementById(id);
      if (element) {
        const topValue = element.offsetTop;
        window.scrollTo({
          top: topValue - fixedTopValue + 120,
          left: 0,
          behavior: "smooth",
        });
      }
    });
  });
};

export const privacyScroll = () => {
  navScroll();
  navItemsClick();
  document.addEventListener("scroll", () => {
    navScroll();
  });
};