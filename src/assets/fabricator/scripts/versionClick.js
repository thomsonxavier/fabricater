import {
  addEventListener,
  getHtmlElmentsByClass,
} from "../../toolkit/scripts/ui-scripts";
export const versionClick = () => {
  const versionTrigElements = getHtmlElmentsByClass("f-item-group__notes-trig");
  versionTrigElements.map((element) => {
    addEventListener(element, "click", () => {
      const parentElement = element.closest(".f-item-group");
      const versionContainer = parentElement.querySelector(
        ".f-item-nodes-block"
      );
      window.scrollTo({
        top: versionContainer.offsetTop,
        behavior: "smooth",
      });
    });
  });
};
