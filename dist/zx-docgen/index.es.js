/*!
 * zx-sml version 0.7.0
 * Author: Xing Zhong<zx198401@gmail.com>
 * Repository: https://github.com/capricorncd/zx-sml
 * Released on: 2023-05-13 08:49:44 (GMT+0000)
 */
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
const BLANK_LINE = "";
const DOC_TYPES = {
  method: "method",
  type: "type",
  document: "document",
  constant: "constant",
  property: "property"
};
function isArray(input) {
  return Array.isArray(input);
}
function isObject(input) {
  return typeof input === "object" && input !== null && !isArray(input);
}
function restoreUSLocalString(input) {
  return input.replace(/^-?[1-9]\d{0,2}(,\d{3})+/, (match) => match.replace(/,/g, ""));
}
function toNumber(input, isStrictMode = false) {
  if (typeof input === "number")
    return input;
  if (typeof input === "string") {
    if (!isStrictMode && /^(-?\d+(?:\.\d+)?)\D*/.test(restoreUSLocalString(input))) {
      return toNumber(RegExp.$1, true);
    }
    const n = Number(input);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}
const colors = {
  red: "\x1B[31m",
  green: "\x1B[32m",
  yellow: "\x1B[33m",
  white: "\x1B[37m"
};
function log(...args) {
  console.log("\u{1F60E}", colors.green, ...args, colors.white);
}
function warn(...args) {
  console.log("\u{1F615}", colors.yellow, ...args, colors.white);
}
function error(...args) {
  console.log("\u{1F621}", colors.red, ...args, colors.white);
}
const TABLE_ALIGN_LEFT = "left";
const DEF_TABLE_ALIGN = ":--";
const TABLE_ALIGNS = {
  left: DEF_TABLE_ALIGN,
  center: ":--:",
  right: "--:"
};
function mkdirSync(dir) {
  if (!dir || fs.existsSync(dir)) {
    warn(`The directory already exists, or is null, ${dir}`);
    return;
  }
  const index = dir.lastIndexOf("/");
  if (index === -1) {
    warn(`The 'dir' maybe a valid directory name, ${dir}`);
    return;
  }
  const parent = dir.substring(0, index);
  if (fs.existsSync(parent)) {
    fs.mkdirSync(dir);
  } else {
    mkdirSync(parent);
    mkdirSync(dir);
  }
}
function isFileLike(filePath) {
  if (typeof filePath === "string") {
    return /.+\.\w+$/.test(filePath);
  }
  return false;
}
function isValidArray(i) {
  return Array.isArray(i) && i.length > 0;
}
function toStrForStrArray(arr, spliceSymbol = " ", defaultReturnValue = "-") {
  const newArr = arr.filter((str) => !!str);
  return newArr.length ? newArr.join(spliceSymbol) : defaultReturnValue;
}
function findCharIndex(str, char, times) {
  let index = -1;
  for (let i = 0; i < times; i++) {
    index = str.indexOf(char, index + 1);
    if (index === -1)
      break;
  }
  return index;
}
function formatAsArray(input) {
  if (typeof input === "undefined")
    return [];
  return Array.isArray(input) ? input : [input];
}
function formatAsTypes(input) {
  input = input.trim();
  if (input.endsWith(";")) {
    input = input.substr(0, input.length - 1);
  }
  if (!input.includes("|") || /^(\w+<([^<]|\([^(]+\)\[\]|\w+<[^<]+>)+>|\([^(]+\)\[\])$/.test(input)) {
    return [input];
  }
  return input.split(/\s*\|\s*/);
}
function replaceVerticalBarsInTables(input) {
  return input.replace(/\|/g, "\\|");
}
function getSpDescription(input) {
  const index = findCharIndex(input, "`", 2);
  return index === -1 ? "" : input.substr(index + 1);
}
function handleParam(input) {
  input = input.replace("@param", "").trim();
  const data = {
    raw: input,
    name: "",
    required: false,
    types: [],
    desc: []
  };
  if (/(\w+\??)\s+`([^`]+)`(.*)/.test(input)) {
    const name = RegExp.$1;
    data.name = name.replace("?", "");
    data.required = !name.includes("?");
    data.types.push(...formatAsTypes(RegExp.$2));
    const desc = RegExp.$3 || getSpDescription(input);
    data.desc.push(desc.trim());
  }
  return data;
}
function handleReturn(input) {
  input = input.replace(/@returns?/, "").trim();
  const data = {
    raw: input,
    types: [],
    desc: []
  };
  if (/`([^`]+)`\s*(.*)/.test(input)) {
    data.types.push(...formatAsTypes(RegExp.$1));
    data.desc.push(RegExp.$2);
  }
  return data;
}
function handleSort(line) {
  if (/@sort\s*(-?\d+)/.test(line)) {
    return toNumber(RegExp.$1);
  }
  return 0;
}
function getTypeName(fullName) {
  return fullName.replace(/^([\w.]+).*/, "$1");
}
function createPropsTable(props, docType, typeName = "Name", options = {}) {
  if (!isValidArray(props))
    return [];
  const alias = options.alias || {};
  const tableHeadAlias = alias.tableHead || {};
  let requiredValues = {
    0: "no",
    1: "yes"
  };
  if (alias.requiredValues) {
    if (alias.requiredValues[docType]) {
      requiredValues = alias.requiredValues[docType];
    } else if (alias.requiredValues[0] && alias.requiredValues[1]) {
      requiredValues = alias.requiredValues;
    }
  }
  const align = options.tableAlign || {};
  const tableData = {
    align: {
      [typeName]: align[typeName] || TABLE_ALIGN_LEFT,
      Types: align["Types"] || TABLE_ALIGN_LEFT,
      Required: align["Required"] || TABLE_ALIGN_LEFT,
      Description: align["Description"] || TABLE_ALIGN_LEFT
    },
    thead: [
      tableHeadAlias[typeName] || typeName,
      tableHeadAlias["Types"] || "Types",
      tableHeadAlias["Required"] || "Required",
      tableHeadAlias["Description"] || "Description"
    ],
    tbody: props.map((item) => {
      var _a;
      return [
        item.name,
        "`" + replaceVerticalBarsInTables((_a = item.types) == null ? void 0 : _a.join("`/`")) + "`",
        requiredValues[+item.required],
        replaceVerticalBarsInTables(toStrForStrArray(item.desc))
      ];
    })
  };
  const lines = toTableLines(tableData);
  lines.push(BLANK_LINE);
  return lines;
}
function mergeIntoArray(data, options) {
  const mergeData = Object.keys(data).reduce((prev, filePath) => {
    Object.keys(data[filePath]).forEach((key) => {
      prev[key] = data[filePath][key];
    });
    return prev;
  }, {});
  return toArray(mergeData, options);
}
function toArray(data, options = {}) {
  const arr = [];
  const keys = Object.keys(data);
  if (!options.disableKeySorting) {
    keys.sort();
  }
  keys.forEach((key) => arr.push(data[key]));
  if (arr.some((item) => item.sort)) {
    arr.sort((a, b) => a.sort - b.sort);
  }
  return arr;
}
function handleProps(item, types) {
  if (item.props)
    return item.props;
  const arr = [];
  const firstCodeLine = item.codes[0] || "";
  if (/\sextends\s+(.+)\s*\{/.test(firstCodeLine)) {
    const extendTypes = RegExp.$1.split(/\s*,\s*/).map((name) => getTypeName(name.trim()));
    extendTypes.forEach((extendName) => {
      const typeItem = types.find((item2) => item2.name === extendName);
      if (typeItem) {
        if (!typeItem.props) {
          typeItem.props = handleProps(typeItem, types);
        }
        arr.push(...typeItem.props);
      }
    });
  }
  let isCodeStart = false;
  let description = [];
  item.codes.forEach((line) => {
    if (!isCodeStart && /\{\s*$/.test(line)) {
      return isCodeStart = true;
    }
    if (/^\s*(?:(?:readonly|static|public)\s+)?((?:(?:\w|\[.+\])+|(?:'.+')|(?:".+"))\??)\s*:\s*([^/]*)(?:\/\/(.*))?/.test(line)) {
      const name = RegExp.$1;
      const types2 = formatAsTypes(RegExp.$2);
      description.push(RegExp.$3.trim());
      const data = {
        raw: line,
        name: name.replace(/('|")(.+)\1/, "$2").replace(/\?/g, ""),
        required: !name.includes("?"),
        desc: description.filter(Boolean),
        types: types2
      };
      const index = arr.findIndex((item2) => item2.name === data.name);
      if (index >= 0) {
        arr.splice(index, 1);
      }
      arr.push(data);
      description = [];
    } else if (/^\s*\/\/(.+)/.test(line)) {
      if (!description)
        description = [];
      description.push(RegExp.$1.trim());
    }
  });
  return arr;
}
function toTableLines(data) {
  if (!isObject(data) || !isValidArray(data.tbody))
    return [];
  const { align, thead, tbody } = data;
  const lines = [];
  let i = 0;
  if (isValidArray(thead)) {
    lines.push(thead.join("|"));
    if (align) {
      lines.push(thead.map((field) => TABLE_ALIGNS[align[field]] || DEF_TABLE_ALIGN).join("|"));
    } else {
      lines.push(thead.map(() => DEF_TABLE_ALIGN).join("|"));
    }
  } else {
    lines.push(tbody[0].join("|"), tbody[0].map(() => DEF_TABLE_ALIGN).join("|"));
    i = 1;
  }
  for (; i < tbody.length; i++) {
    lines.push(tbody[i].join("|"));
  }
  return lines;
}
function handleFile(filePath, data, options = {}) {
  const targetTypes = Object.keys(DOC_TYPES);
  if (isValidArray(options.expendTypes)) {
    options.expendTypes.forEach((t) => {
      if (t && !targetTypes.includes(t)) {
        targetTypes.push(t);
      }
    });
  }
  const typesRegExp = new RegExp(`^\\*\\s*@(${targetTypes.join("|")})\\s*(.+)`);
  const codeTypes = [DOC_TYPES.type, DOC_TYPES.constant];
  if (isValidArray(options.codeTypes)) {
    options.codeTypes.forEach((t) => {
      codeTypes.push(t);
    });
  }
  let isTargetComment = false;
  let isCode = false;
  let type = "";
  let typeName = "";
  let dataKey = "";
  let tempStr = "";
  fs.readFileSync(filePath, "utf8").toString().split(new RegExp(os.EOL)).forEach((line) => {
    var _a;
    const originalLine = line;
    line = line.trim();
    if (typesRegExp.test(line)) {
      isTargetComment = true;
      type = RegExp.$1;
      const fullName = RegExp.$2.trim();
      typeName = getTypeName(fullName);
      dataKey = `${type}_${typeName}`;
      data[dataKey] = {
        type,
        sort: 0,
        name: typeName,
        fullName,
        desc: [],
        params: [],
        returns: [],
        codes: [],
        private: false,
        path: filePath
      };
      return;
    } else if (line === "*/" && isTargetComment) {
      isTargetComment = false;
      return;
    }
    if (line === "/**") {
      typeName = "";
    }
    if (!isTargetComment || !typeName) {
      if (typeName && codeTypes.includes(type) && line) {
        data[dataKey].codes.push(originalLine.replace(/^export(\s+default)?\s*/, ""));
      }
      return;
    }
    if (typeof ((_a = options.expendTypesHandlers) == null ? void 0 : _a[type]) === "function") {
      options.expendTypesHandlers[type](data[dataKey], line);
    } else {
      if (/^\*\s*(```\w+|@code)/.test(line)) {
        isCode = true;
      }
      if (/^\*(.*)/.test(line)) {
        tempStr = RegExp.$1;
        const temp = tempStr.trim();
        if (temp.startsWith("@param")) {
          data[dataKey].params.push(handleParam(temp));
        } else if (temp.startsWith("@return")) {
          data[dataKey].returns.push(handleReturn(temp));
        } else if (temp.startsWith("@private")) {
          data[dataKey].private = true;
        } else if (temp.startsWith("@sort")) {
          data[dataKey].sort = handleSort(temp);
        } else if (isCode) {
          if (temp.startsWith("@code")) {
            if (options.isExtractCodeFromComments) {
              data[dataKey].codes.push("");
            }
            tempStr = tempStr.replace(/@code\w*/, "").trim();
          }
          const codeStr = tempStr.replace(/^\s/, "").replace("*\\/", "*/");
          if (options.isExtractCodeFromComments) {
            data[dataKey].codes.push(codeStr);
          } else {
            data[dataKey].desc.push(codeStr);
          }
        } else {
          data[dataKey].desc.push(temp.replace("@description", "").trim());
        }
      }
      if (isCode && /^\*\s*```$/.test(line)) {
        isCode = false;
      }
    }
  });
  return data;
}
function getCommentsData(input, needArray, options = {}) {
  const data = {};
  if (isObject(needArray)) {
    options = needArray;
    needArray = false;
  }
  _getCommentsData(input, data, options);
  handleTypes(data, options);
  return needArray ? mergeIntoArray(data, options) : data;
}
function _getCommentsData(input, data, options) {
  const { fileType = /\.(ts|js)$/ } = options;
  if (Array.isArray(input)) {
    input.forEach((str) => {
      _getCommentsData(str, data, options);
    });
  } else {
    const stat = fs.statSync(input);
    if (stat.isDirectory()) {
      fs.readdirSync(input).forEach((file) => {
        _getCommentsData(path.join(input, file), data, options);
      });
    } else if (stat.isFile() && fileType.test(input)) {
      data[input] = {};
      handleFile(input, data[input], options);
    }
  }
}
function getTypes(data) {
  if (Array.isArray(data)) {
    return data.filter((item2) => item2.type === DOC_TYPES.type);
  }
  const types = [];
  let item;
  Object.keys(data).forEach((filePath) => {
    Object.keys(data[filePath]).forEach((typeName) => {
      item = data[filePath][typeName];
      if (item.type === DOC_TYPES.type) {
        types.push(item);
      }
    });
  });
  return types;
}
function handleTypes(data, options) {
  const types = getTypes(data);
  if (isValidArray(options.types)) {
    types.push(...options.types);
  }
  types.forEach((item) => {
    item.props = handleProps(item, types);
  });
}
function createMethodsDoc(item, lines, options = {}) {
  if (!item.returns.length) {
    item.returns.push({
      raw: "`void`",
      types: ["void"],
      desc: []
    });
  }
  lines.push(`### ${item.fullName}`, BLANK_LINE, ...item.desc, BLANK_LINE, ...options.methodWithRaw ? item.params.map((param) => `- @param ${param.raw}`) : createPropsTable(item.params, DOC_TYPES.method, "Param", options), BLANK_LINE, ...item.returns.map((ret) => `- @returns ${ret.raw}`), BLANK_LINE);
  pushCodesIntoLines(item.codes, lines);
}
function pushCodesIntoLines(codes, lines) {
  if (isValidArray(codes)) {
    lines.push(...codes, BLANK_LINE);
  }
}
function createTypesDoc(item, lines, options = {}) {
  var _a;
  lines.push(`### ${item.fullName}`, BLANK_LINE, ...item.desc, BLANK_LINE);
  const typeTable = createPropsTable(item.props, DOC_TYPES.type, "Prop", options);
  const codes = ["```ts", ...item.codes, "```", BLANK_LINE];
  const sourceCodeSummary = (_a = options.alias) == null ? void 0 : _a.sourceCodeSummary;
  const details = [
    "<details>",
    `<summary>${sourceCodeSummary || "Source Code"}</summary>`,
    BLANK_LINE,
    ...codes,
    BLANK_LINE,
    "</details>",
    BLANK_LINE
  ];
  const { typeWithSourceCode, typeWithTable, typeWithAuto } = options;
  if (typeWithSourceCode && typeWithTable) {
    lines.push(...typeTable, ...codes);
  } else if (typeWithSourceCode) {
    lines.push(...codes);
  } else if (typeWithTable) {
    lines.push(...typeTable);
  } else {
    if (typeTable.length) {
      lines.push(...typeTable, ...details);
    } else {
      if (typeWithAuto) {
        lines.push(...codes);
      } else {
        lines.push(...details);
      }
    }
  }
}
function removeConsecutiveBlankLine(lines) {
  let blankLineCount = 0;
  const outputLines = [];
  lines.forEach((line) => {
    if (line === BLANK_LINE) {
      blankLineCount++;
    } else {
      blankLineCount = 0;
    }
    if (blankLineCount > 1)
      return;
    outputLines.push(line);
  });
  return outputLines;
}
function handleDocumentLines(arr, options, lines) {
  var _a, _b, _c;
  if (!isValidArray(arr))
    return;
  const typesAlias = ((_a = options.alias) == null ? void 0 : _a.types) || {};
  const linesAfterTitles = formatAsArray((_c = (_b = options.lines) == null ? void 0 : _b.afterTitle) == null ? void 0 : _c[DOC_TYPES.document]);
  let outputFileName = null;
  arr.forEach((item, i) => {
    if (i === 0) {
      outputFileName = item.name + ".md";
      lines.push(`# ${typesAlias[DOC_TYPES.document] || item.fullName}`, BLANK_LINE);
      if (isValidArray(linesAfterTitles)) {
        lines.push(...linesAfterTitles, BLANK_LINE);
      }
    } else {
      lines.push(`### ${item.fullName}`, BLANK_LINE);
    }
    lines.push(...item.desc, BLANK_LINE);
    pushCodesIntoLines(item.codes, lines);
  });
  return outputFileName;
}
function handleMethodLines(arr, options, lines) {
  if (!isValidArray(arr))
    return;
  handleMarkdownTitle(DOC_TYPES.method, options, lines);
  arr.forEach((item) => {
    createMethodsDoc(item, lines, options);
  });
}
function handleTypesLines(arr, options, lines) {
  if (!isValidArray(arr))
    return;
  handleMarkdownTitle(DOC_TYPES.type, options, lines);
  arr.forEach((item) => {
    createTypesDoc(item, lines, options);
  });
}
function handleMarkdownTitle(type, options, lines) {
  var _a, _b, _c;
  const typesAlias = ((_a = options.alias) == null ? void 0 : _a.types) || {};
  const mdTitles = {
    document: "Document",
    method: "Methods",
    type: "Types",
    constant: "Constants",
    property: "Property"
  };
  lines.push(`## ${typesAlias[type] || mdTitles[type] || type}`, BLANK_LINE);
  const linesAfterTitles = formatAsArray((_c = (_b = options.lines) == null ? void 0 : _b.afterTitle) == null ? void 0 : _c[type]);
  if (isValidArray(linesAfterTitles)) {
    lines.push(...linesAfterTitles, BLANK_LINE);
  }
}
function handleConstLines(arr, options, lines) {
  if (!isValidArray(arr))
    return;
  handleMarkdownTitle(DOC_TYPES.constant, options, lines);
  arr.forEach((item) => {
    lines.push(`### ${item.fullName}`, BLANK_LINE, ...item.desc, BLANK_LINE);
    if (isValidArray(item.codes)) {
      lines.push("```ts", ...item.codes, "```", BLANK_LINE);
    }
  });
}
function handlePropertyLines(arr, options, lines) {
  if (!isValidArray(arr))
    return;
  handleMarkdownTitle(DOC_TYPES.property, options, lines);
  arr.forEach((item) => {
    lines.push(`### ${item.fullName}`, BLANK_LINE, ...item.desc, BLANK_LINE);
    pushCodesIntoLines(item.codes, lines);
  });
}
function handleOutput(arr, outputDir, options = {}) {
  var _a, _b, _c;
  console.log("Output file is start ...");
  const originalData = {};
  let outputFileName = null;
  arr.forEach((item) => {
    if (!originalData[item.type]) {
      originalData[item.type] = [];
    }
    originalData[item.type].push(item);
  });
  const lines = [];
  const startLines = formatAsArray((_a = options.lines) == null ? void 0 : _a.start);
  if (isValidArray(startLines)) {
    lines.push(...startLines, BLANK_LINE);
  }
  const linesAfterType = ((_b = options.lines) == null ? void 0 : _b.afterType) || {};
  const outputDocTypesAndOrder = isValidArray(options.outputDocTypesAndOrder) ? options.outputDocTypesAndOrder : ["document", "method", "type", "constant"];
  outputDocTypesAndOrder.forEach((type) => {
    var _a2;
    const handler = (_a2 = options.handlers) == null ? void 0 : _a2[type];
    if (typeof handler === "function") {
      handler(originalData[type], options, lines);
    } else {
      if (type === DOC_TYPES.document) {
        outputFileName = handleDocumentLines(originalData[type], options, lines);
      } else if (type === DOC_TYPES.property) {
        handlePropertyLines(originalData[type], options, lines);
      } else if (type === DOC_TYPES.method) {
        handleMethodLines(originalData[type], options, lines);
      } else if (type === DOC_TYPES.type) {
        handleTypesLines(originalData[type], options, lines);
      } else if (type === DOC_TYPES.constant) {
        handleConstLines(originalData[type], options, lines);
      }
    }
    if (linesAfterType[type]) {
      lines.push(...formatAsArray(linesAfterType[type]), BLANK_LINE);
    }
  });
  const endLines = formatAsArray((_c = options.lines) == null ? void 0 : _c.end);
  if (isValidArray(endLines)) {
    lines.push(...endLines, BLANK_LINE);
  }
  const outputLines = removeConsecutiveBlankLine(lines);
  if (outputDir) {
    if (isFileLike(outputDir)) {
      outputFileName = outputDir;
    } else if (outputFileName) {
      outputFileName = path.join(outputDir, outputFileName);
    }
    if (outputFileName)
      writeFileSync(outputFileName, outputLines);
  }
  log(outputFileName || "no files were output!");
  console.log("Output file is ended.");
  return {
    outputFileName,
    lines: outputLines,
    data: arr
  };
}
function writeFileSync(outputFileName, outputLines) {
  if (Array.isArray(outputLines)) {
    outputLines = outputLines.join(os.EOL);
  }
  fs.writeFileSync(outputFileName, outputLines, "utf8");
}
function outputFile(input, outputDirOrFile, options) {
  if (isObject(outputDirOrFile)) {
    options = outputDirOrFile;
    outputDirOrFile = void 0;
  }
  options = options || {};
  if (typeof input === "string" || isValidArray(input) && input.every((str) => typeof str === "string")) {
    input = getCommentsData(input, true, options);
  }
  const optionsLines = options.lines || {};
  const optionsAlias = options.alias || {};
  options = __spreadProps(__spreadValues({}, options), {
    lines: optionsLines,
    alias: optionsAlias
  });
  if (outputDirOrFile && !fs.existsSync(outputDirOrFile)) {
    if (isFileLike(outputDirOrFile)) {
      const outputDir = outputDirOrFile.split("/");
      outputDir.pop();
      mkdirSync(outputDir.join("/"));
    } else {
      mkdirSync(outputDirOrFile);
    }
  }
  if (Array.isArray(input)) {
    return handleOutput(input, outputDirOrFile, options);
  } else {
    return handleOutput(mergeIntoArray(input, options), outputDirOrFile, options);
  }
}
export { BLANK_LINE, DOC_TYPES, createPropsTable, error, findCharIndex, formatAsArray, formatAsTypes, getCommentsData, getTypeName, getTypes, handleParam, handleProps, handleReturn, handleSort, isFileLike, isValidArray, log, mergeIntoArray, mkdirSync, outputFile, replaceVerticalBarsInTables, toArray, toStrForStrArray, toTableLines, warn, writeFileSync };
