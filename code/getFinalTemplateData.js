const getVersionUpdatesObject = (mainObj) => {
  try {
    const { data: { versionUpdates = "" } = {} } = mainObj;
    const versionUpdatesJson = versionUpdates.replace(/<\/?[^>]+(>|$)/g, "");
    const data = versionUpdatesJson.replace(/&quot;/g, '"').replace(/\\n/g, "");
    const versionUpdatesObj = JSON.parse(data);
    return versionUpdatesObj.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  } catch (error) {
    return undefined;
  }
};
const getFinalTemplateData = (templateData) => {
  const finalData = [];
  const dir = (name) => (name === "Elements" ? "elements" : "components");
  for (const property in templateData) {
    const firstName = templateData[property].name;
    const firstItems = templateData[property].items;
    const versionUpdates = getVersionUpdatesObject(templateData[property]);
    if (firstItems) {
      for (const property in firstItems) {
        const secondName = firstItems[property].name;
        const secondItems = firstItems[property].items;
        const versionUpdates = getVersionUpdatesObject(firstItems[property]);
        if (secondItems) {
          for (const property in secondItems) {
            const thirdName = secondItems[property].name;
            const versionUpdates = getVersionUpdatesObject(
              secondItems[property]
            );
            finalData.push({
              id: property,
              name: thirdName,
              firstName,
              secondName,
              thirdName,
              versionUpdates,
              directory: dir(firstName),
            });
          }
        } else {
          finalData.push({
            id: property,
            name: secondName,
            firstName,
            secondName,
            versionUpdates,
            directory: dir(firstName),
          });
        }
      }
    } else {
      finalData.push({
        id: property,
        name: firstName,
        firstName,
        versionUpdates,
        directory: dir(firstName),
      });
    }
  }
  return finalData;
};

module.exports = getFinalTemplateData;
