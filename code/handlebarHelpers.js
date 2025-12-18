const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const Prism = require("prismjs");
require('prismjs/components/prism-typescript');

const getFinalTemplateData = require("./getFinalTemplateData");
const getFilepath = require("./getFilepath");

/**
 *
 */
handlebars.registerHelper("localize", function (context, options) {
  if (options.hash.language) {
    return options.fn(context[options.hash.language]);
  }
});

/**
 *
 */
handlebars.registerHelper("swapif", function (v1, v2, options) {
  if (typeof v2 !== "undefined") {
    return v2;
  } else {
    return v1;
  }
});

/**
 *
 */
handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

/**
 *
 */
handlebars.registerHelper("loopArray", function (arrayData, opt) {
  try {
    let results = "";
    const data = JSON.parse(arrayData);
    const finalArray = Array.isArray(data) ? data : [];
    finalArray.forEach((item) => {
      results += opt.fn(item);
    });
    return results;
  } catch (error) {
    return "";
  }
});

/**
 *
 */
handlebars.registerHelper("json", function (context) {
  try {
    return JSON.stringify(context);
  } catch (error) {
    return "";
  }
});

/**
 *
 */
handlebars.registerHelper("printScss", function (fileData, folder) {
  try {
    const filePath = getFilepath(fileData, folder, "scss");
    const filename = path.join(
      __dirname,
      `../src/assets/toolkit/styles/${filePath}`
    );
    const contents = fs.readFileSync(filename);
    const code = contents.toString();
    return Prism.highlight(code, Prism.languages.css, "css");
  } catch (error) {
    const code = " Style not available ";
    return Prism.highlight(code, Prism.languages.css, "css");
  }
});

/**
 *
 */
handlebars.registerHelper("printJs", function (fileData, folder) {
  try {
    const filePath = getFilepath(fileData, folder, "ts");
    const filename = path.join(
      __dirname,
      `../src/assets/toolkit/scripts/${filePath}`
    );
    const contents = fs.readFileSync(filename);
    const code = contents.toString();
    return Prism.highlight(code, Prism.languages.typescript, "typescript");
  } 
  catch (error) {
    try {
      const filePath = getFilepath(fileData, folder, "js");
    const filename = path.join(
      __dirname,
      `../src/assets/toolkit/scripts/${filePath}`
    );
    const contents = fs.readFileSync(filename);
    const code = contents.toString();
    return Prism.highlight(code, Prism.languages.javascript, "javascript");
    }
    catch(err) {
      const code = " Script not available.";
      return Prism.highlight(code, Prism.languages.javascript, "javascript");
    }
  }
});

/**
 *
 */
handlebars.registerHelper("loopTemplates", function (arrayData, opt) {
  try {
    let results = "";
    const data = getFinalTemplateData(arrayData);
    const finalArray = Array.isArray(data) ? data : [];
    finalArray.forEach((item) => {
      results += opt.fn(item);
    });
    return results;
  } catch (error) {
    return "";
  }
});
/**
 *
 */
handlebars.registerHelper("production", () => {
  return process.env.NODE_ENV === "production";
});
/**
 *
 */
handlebars.registerHelper("development", () => {
  return process.env.NODE_ENV === "development";
});

//Handlebars Helpers
//
// checking for initialization of a variable
handlebars.registerHelper('isdefined', function(value) {
  return value !== undefined;
});

// custom block helper to swap passed parameters with default values
//
handlebars.registerHelper('swap', function(v1, v2, options) {
  return (typeof v2 !== 'undefined')? v2 : v1;
});

// convert list of options to buttons for button group element
//
handlebars.registerHelper('buttonlist', function(items){
  items = items.split(',');
  let itemsAsHTML = '';
  items.map(item => {
    let disabledIndex = item.indexOf('|disabled'),
        activeIndex = item.indexOf('|active');
    if(activeIndex !== -1) {
      itemsAsHTML += '<button type="button" class="-active">' + item.slice(0,activeIndex) + '</button>\n';
    } else if(disabledIndex !== -1) {
      itemsAsHTML += '<button type="button" disabled>' + item.slice(0,disabledIndex) +'</button>\n';
    } else {
      itemsAsHTML += '<button type="button">' + item + '</button>\n';
    }
  });
  return itemsAsHTML;
});

// convert list of options to custom select options
//
handlebars.registerHelper('optionlist', function(items){
  items = items.split(',');
  let itemsAsHTML = '';
  items.map(item => {
    let disabledIndex = item.indexOf('|disabled'),
        selectedIndex = item.indexOf('|selected');
    if(selectedIndex !== -1) {
      itemsAsHTML += '<option value="" selected>' + item.slice(0,selectedIndex) + '</option>\n';
    } else if(disabledIndex !== -1) {
      itemsAsHTML += '<option value="" disabled>' + item.slice(0,disabledIndex) +'</option>\n';
    } else {
      itemsAsHTML += '<option value="">' + item + '</option>\n';
    }
  });
  return itemsAsHTML;
});

// convert list of options to menu items
//
handlebars.registerHelper('menulist', function(items){
  items = items.split(',');
  let itemsAsHTML = '';
  items.map(item => {
    let disabledIndex = item.indexOf('|disabled');
    if(disabledIndex !== -1) {
      itemsAsHTML += '<li role="none"><a href="javascript:void(0);" class="-disabled" role="menuitem">' + item.slice(0,disabledIndex) + '</a></li>\n';
    } else if(item.indexOf('separator') !== -1) {
      itemsAsHTML += '<li role="separator"></li>\n';
    } else {
      itemsAsHTML += '<li role="none"><a href="javascript:void(0);" role="menuitem">' + item + '</a></li>\n';
    }
  });
  return itemsAsHTML;
});

//

handlebars.registerHelper('for', function(from, to, incr, block) {
  var accum = '';
  for(var i = from; i < to; i += incr)
      accum += block.fn(i);
  return accum;
});

handlebars.registerHelper('times', function(n, block) {
  var accum = '';
  for(var i = 0; i < n; ++i)
      accum += block.fn(i);
  return accum;
});

handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

handlebars.registerHelper('capitalizeFirst', function(str) {
  str2 = str.charAt(0).toUpperCase() + str.slice(1);
  return str2; 
});

// Allows a json object to be passed through partial
handlebars.registerHelper('object', function({hash}) {
  return hash;
});

// Allows an array object to be passed through partial - use this for small arrays
handlebars.registerHelper('array', function() {
  return Array.from(arguments).slice(0, arguments.length-1)
});