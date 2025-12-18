const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 488.3 488.3">
<g>
		<path d="M314.25,85.4h-227c-21.3,0-38.6,17.3-38.6,38.6v325.7c0,21.3,17.3,38.6,38.6,38.6h227c21.3,0,38.6-17.3,38.6-38.6V124    C352.75,102.7,335.45,85.4,314.25,85.4z M325.75,449.6c0,6.4-5.2,11.6-11.6,11.6h-227c-6.4,0-11.6-5.2-11.6-11.6V124    c0-6.4,5.2-11.6,11.6-11.6h227c6.4,0,11.6,5.2,11.6,11.6V449.6z"/>
		<path d="M401.05,0h-227c-21.3,0-38.6,17.3-38.6,38.6c0,7.5,6,13.5,13.5,13.5s13.5-6,13.5-13.5c0-6.4,5.2-11.6,11.6-11.6h227    c6.4,0,11.6,5.2,11.6,11.6v325.7c0,6.4-5.2,11.6-11.6,11.6c-7.5,0-13.5,6-13.5,13.5s6,13.5,13.5,13.5c21.3,0,38.6-17.3,38.6-38.6    V38.6C439.65,17.3,422.35,0,401.05,0z"/>
	</g>
</svg>`;

const htmlCollectionToArray = (collection) => {
  let HtmlArray = [];
  for (let i = 0; i < collection.length; i++) {
    HtmlArray.push(collection[i]);
  }
  return HtmlArray;
};

const hasCodeBlock = (collection) => {
  const blocks = htmlCollectionToArray(collection);
  let hasCode = false;
  blocks.map((block) => {
    if (block.localName === "code") {
      hasCode = true;
    }
  });

  return hasCode;
};

export const addEventListener = (element, eventName, eventHandler) => {
  if (element && element.addEventListener) {
    element.addEventListener(eventName, eventHandler, false);
  } else if (element && element.attachEvent) {
    element.attachEvent("on" + eventName, eventHandler);
  }
};

const selectAndCopyCode = (block, spanCopyText) => {
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(block.querySelector("code"));
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand("copy");
  spanCopyText.classList.add("-show");
  setTimeout(() => {
    spanCopyText.classList.remove("-show");
  },1000)
};

export const copyCode = () => {
  const preTagsCollection = document.getElementsByTagName("pre");
  const preTags = htmlCollectionToArray(preTagsCollection);
  preTags.map((preTag) => {
    if (hasCodeBlock(preTag.children)) {
      const spanElement = document.createElement("span");
      spanElement.setAttribute("class", "f-code-block-copy");
      const spanCopyText = document.createElement("span");
      spanCopyText.innerText = "Copied";
      spanCopyText.setAttribute("class", "f-code-copy-text");
      spanElement.insertAdjacentHTML("beforeend", svgIcon);
      preTag.append(spanElement);
      preTag.append(spanCopyText);
      addEventListener(spanElement, "click", () => {
        selectAndCopyCode(preTag, spanCopyText);
      });
    }
  });
};
