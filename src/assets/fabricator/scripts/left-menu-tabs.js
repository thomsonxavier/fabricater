import {
  addClassToElement,
  addEventListener,
  elementHasClass,
  getElementById,
  getHtmlElmentsByClass,
  removeClassFromElements,
} from "../../toolkit/scripts/ui-scripts";

const activeTabOnLoad = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const menuParam = urlParams.get("menu");
  if (menuParam) {
    const selectedTab = document.querySelector(
      `[data-menu-tab='${menuParam}']`
    );

    const level = selectedTab.getAttribute("data-level");
    if (level === "level-2") {
      const parent = selectedTab.closest("ul");
      const firstElement = parent.previousElementSibling;
      firstElement.click();
      selectedTab.click();
    } else if(level === "level-3") {
      const parent = selectedTab.closest("ul");
      const secondElement = parent.previousElementSibling;
      const secondParent = secondElement.closest("ul");
      const firstElement = secondParent.previousElementSibling;
      firstElement.click();
      secondElement.click();
      selectedTab.click();
    }
    console.log(level);
  }
};

export const leftMenuTabs = () => {
  const menuTabs = getHtmlElmentsByClass("f-menu-tabs__heading");
  menuTabs.map((menu) => {
    addEventListener(menu, "click", () => {
      const menuContent = menu.nextElementSibling;
      const level = menu.getAttribute("data-level");
      if (menuContent) {
        if (level === "level-1") {
          removeClassFromElements("f-menu-tabs__level-two", "-active");
          removeClassFromElements("-heading-level-two", "-active");
          if (!elementHasClass(menuContent, "-active")) {
            removeClassFromElements("f-menu-tabs__level-one", "-active");
            removeClassFromElements("-heading-level-one", "-active");
            addClassToElement(menu, "-active");
            addClassToElement(menuContent, "-active");
          } else {
            removeClassFromElements("f-menu-tabs__level-one", "-active");
            removeClassFromElements("-heading-level-one", "-active");
          }
        } else if (level === "level-2") {
          if (!elementHasClass(menuContent, "-active")) {
            removeClassFromElements("f-menu-tabs__level-two", "-active");
            removeClassFromElements("-heading-level-two", "-active");
            addClassToElement(menu, "-active");
            addClassToElement(menuContent, "-active");
          } else {
            removeClassFromElements("f-menu-tabs__level-two", "-active");
            removeClassFromElements("-heading-level-two", "-active");
          }
        }
      } else {
        removeClassFromElements("-heading-level-last", "-last-active");
        addClassToElement(menu, "-last-active");
      }

      const dataMenuTab = menu.getAttribute("data-menu-tab");
      const menuView = getElementById(dataMenuTab);
      if (menuView) {
        removeClassFromElements("f-item-group", "-active");
        addClassToElement(menuView, "-active");
      }

      if (elementHasClass(menu, "-last-active")) {
        const menuAttr = menu.getAttribute("data-menu-tab");
        history.pushState({}, "", `?menu=${menuAttr}`);
      }
    });
  });
  activeTabOnLoad();
};