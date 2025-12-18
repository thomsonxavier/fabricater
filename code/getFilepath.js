const getFilepath = (fileData, folder, ext) => {
  const fileDataArray = fileData.split(".");
  const finalArray = fileDataArray.map((item, index) => {
    const fileItem = item.split("-");
    fileItem.shift();
    let fileName = fileItem.join("-");
    if (fileDataArray.length === index + 1) {
      if (ext === "ts" || ext === "js") {
        fileName += `.${ext}`;
      } else if (ext === "scss") {
        if (folder === "elements") {
          fileName = `_o-${fileName}.scss`;
        } else {
          fileName = `_c-${fileName}.scss`;
        }
      }
    }
    return fileName;
  });
  const finalPath = `${folder}/${finalArray.join("/")}`;
  return finalPath;
};

module.exports = getFilepath;
