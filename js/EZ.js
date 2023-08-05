// varlible \\
const DAY = {
  value: 86400000,
  unit: "ms",
};
const cdn = '<script src="./EZ.js"></script>';
const cdnStyle = '<link rel="stylesheet" href="./EZ.css">';
const libraryName = "EZ";

canvas = 0;
ctx = 0;
base64 = "";
FadeInterval = 0;
VoiceSrcFile = "";
JsonData = [];

// --------------------------------------------- Adminstrations --------------------------------------------- \\
// html \\

const CloseIt = (e) => {
  //console.log(e.srcElement);
  fadeOut(e.srcElement.parentNode);
};

const removeIt = (elm) => {
  // console.log(elm)
  elm.parentNode.remove();
};

document.addEventListener("DOMContentLoaded", () => {
  console.log('Welcome to ZeusJS library.\nfor menu call to "help()" function');
  // document.head.innerHTML += cdnStyle;
  const canArray = elm("canvas");
  if (canArray.length != 0) {
    if (canArray[0].id == "") {
      canArray[0].id = "mycanvas";
    }
    setupCanvas(canArray[0].id);
  }

  const closeBtn = elm(".close");
  if (closeBtn != undefined) {
    for (let i = 0; i < closeBtn.length; i++) {
      const element = closeBtn[i];
      element.onclick = CloseIt;
    }
  }
});

const help = (menu = 0) => {
  let str = ``;
  if (menu == 0) {
    str = `Welcome to ZeusJS library.\n`;
    str += `functions menu:\nfor more details info call "help()" functin according this parmeters \nTimes & Date = 1\nDOM = 2\nMath = 3\ncanvas = 4\nAI-models = 5\nGeneral = 0`;
  } else if (menu == 1) {
    str += `-----------------Times & Date-----------------\n`;
    str += `getDate(date) --->\n`;
    str += `this function get date type varlible and return it String format (dd-mm-yyyy)\n`;
    str += `------------------------------------------------\n`;
    str += `getTime(date) --->\n`;
    str += `this function get date type varlible and return the time in String format (hh:mm)\n`;
    str += `------------------------------------------------\n`;
    str += `timeDiff(dateStart,dateEnd) --->\n`;
    str += `this function get 2 dates type varlible calculate the different and return an object\n`;
    str += `object={\ndays : dd,\nhours : hh,\nminutes : mm,\nseconds : ss}`;
  } else if (menu == 2) {
    str += `-----------------DOM-----------------\n`;
    str += `elm(CssTag) --->\n`;
    str += `this function get Css tag like #id or .class or tag name and return the element\n`;
  } else if (menu == 3) {
    str += `-----------------Math-----------------\n`;
    str += `randBetween(startNumber,endNumber) --->\n`;
    str += `this function get two numbers and return random number between the values,(include the end number)\n`;
    str += `------------------------------------------------\n`;
    str += `isPrime(number) --->\n`;
    str += `this function get number and determine if it prime, (true mean its prime number)`;
    str += `------------------------------------------------\n`;
    str += `roundD(number,digit) --->\n`;
    str += `this function get number and amount of digit after the point and return the number after it round`;
  } else if (menu == 4) {
  } else if (menu == 5) {
  }

  console.log(str);
  return "Made by Gilad Meirson.";
};

// --------------------------------------------- Times & Date --------------------------------------------- \\
const getDate = (date = new Date()) => {
  let day = parseInt(date.getDate());
  let month = parseInt(date.getMonth()) + 1;
  let year = parseInt(date.getFullYear());
  day < 10 ? (day = "0" + day) : (day = day);
  month < 10 ? (month = "0" + month) : (month = month);

  return day + "-" + month + "-" + year;
};

const getTime = (date = new Date()) => {
  let hour = parseInt(date.getHours());
  let min = parseInt(date.getMinutes());
  let sec = parseInt(date.getSeconds());
  hour < 10 ? (hour = "0" + hour) : (hour = hour);
  min < 10 ? (min = "0" + min) : (min = min);
  sec < 10 ? (sec = "0" + sec) : (sec = sec);
  return hour + ":" + min + ":" + sec;
};

const timeDiff = (start, end) => {
  if (
    start == "" ||
    end == "" ||
    start == null ||
    end == null ||
    start == undefined ||
    end == undefined
  ) {
    console.log("Error---> this function need 2 parameters to calaulate.");
    return false;
  }

  let d = new Date(start);
  let t = new Date(end);
  //Days
  let DAYSDiff = (t - d) / DAY.value;
  let leftDays = DAYSDiff % 1;
  DAYSDiff = Math.floor(DAYSDiff);

  //hours
  let HoursDiff = leftDays * 24;
  let leftHours = HoursDiff % 1;
  HoursDiff = Math.floor(HoursDiff);

  //min
  let minDiff = leftHours * 60;
  leftMin = minDiff % 1;
  minDiff = Math.floor(minDiff);

  //sec
  let SecDiff = leftMin * 60;
  SecDiff = Math.floor(SecDiff);

  if (DAYSDiff < 10) {
    DAYSDiff = "0" + DAYSDiff;
  }
  if (HoursDiff < 10) {
    HoursDiff = "0" + HoursDiff;
  }
  if (minDiff < 10) {
    minDiff = "0" + minDiff;
  }
  if (SecDiff < 10) {
    SecDiff = "0" + SecDiff;
  }

  if (DAYSDiff < 1) {
    DAYSDiff = "00";
  }

  if (HoursDiff < 1) {
    HoursDiff = "00";
  }
  if (minDiff < 1) {
    minDiff = "00";
  }

  const returnObject = {
    days: DAYSDiff.toString(),
    hours: HoursDiff,
    minutes: minDiff,
    seconds: SecDiff,
  };

  return returnObject;

  //console.log(returnObject.days,returnObject.hours,returnObject.minutes,returnObject.seconds)
};

// --------------------------------------------- Dom --------------------------------------------- \\

const elm = (tag) => {
  if (tag.includes(".")) {
    //class
    const classs = tag.replace(".", "");
    return document.getElementsByClassName(classs);
  } else if (tag.includes("#")) {
    //id
    const id = tag.replace("#", "");
    return document.getElementById(id);
  } else {
    return document.getElementsByTagName(tag);
  }
};

// --------------------------------------------- Math --------------------------------------------- \\

const randBetween = (startNumber, endNumber) => {
  if (startNumber >= endNumber) {
    console.log("Error---> the end number smaller or even to startnumber");
    return false;
  }
  if (endNumber == "") {
    return Math.random() * startNumber;
  }
  if (startNumber == "") {
    return Math.random();
  }
  return startNumber + Math.round(Math.random() * (endNumber - startNumber));
};

const isPrime = (num) => {
  let flag = false;
  for (let i = 2; i < Math.round(Math.sqrt(num)) + 1; i++) {
    if (num % i == 0) {
      return flag;
    }
  }

  return !flag;
};

const roundD = (num, digit = 0) => {
  if (num == "") {
    console.log("Error the number parm is empty");
    return false;
  }
  if (digit == 0) {
    return Math.floor(num);
  } else {
    return Math.floor(num * 10 ** digit) / 10 ** digit;
  }
};

// --------------------------------------------- canvas --------------------------------------------- \\
const setupCanvas = (canvasId) => {
  canvas = elm(`#${canvasId}`);
  ctx = canvas.getContext("2d");
  return true;
};
const canvasToPng = () => {
  base64 = canvas.toDataURL();
  return base64;
};

const circle = (
  x = canvas.width / 2,
  y = canvas.height / 2,
  radius = 15,
  fillColor = "#000",
  lineColor = "#000"
) => {
  if (canvas == 0) {
    console.log("Error---> there is no canvas element on your html page.");
    return false;
  }
  ctx.beginPath();
  ctx.fillStyle = fillColor;
  ctx.fillStroke = lineColor;
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
  ctx.closePath();
  return true;
};

const clearCanvas = () => {
  if (canvas == 0) {
    console.log("Error---> there is no canvas element on your html page.");
    return false;
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return true;
  }
};

const square = (
  x = canvas.width / 2,
  y = canvas.height / 2,
  size = 25,
  fillColor = "#000",
  lineColor = "#000"
) => {
  if (canvas == 0) {
    console.log("Error---> there is no canvas element on your html page.");
    return false;
  }
  ctx.fillStyle = fillColor;
  ctx.fillStroke = lineColor;
  ctx.rect(x - size / 2, y - size / 2, size, size);
  ctx.stroke();
  ctx.fill();
  return true;
};

const pointMiddleCanvas = (radius, color) => {
  if (canvas == 0) {
    console.log("Error---> there is no canvas element on your html page.");
    return false;
  }
  circle(canvas.width / 2, canvas.height / 2, radius, color);
  return true;
};

const lineIt = (
  ctxx = ctx,
  X_array = [0, 1, 2, 3, 4, 5],
  Y_array = [0, 50, 60, 100, 30, 60],
  AxisColor = "#ff0000",
  LineColor = "#000",
  AxisWidth = 3,
  LineWidth = 1
) => {
  if (ctxx == undefined || ctxx == "" || ctxx == null) {
    console.log("Error --> no canvas context (ctx) was suplied");
    return false;
  }

  const w = ctx.canvas.width;
  const h = ctx.canvas.height - 10;
  const jumpX = w / X_array.length;
  const jumpY = w / Y_array.length;
  const maxLength =
    X_array.length >= Y_array.length ? X_array.length : Y_array.length;
  const XMax = Math.max(...X_array);
  const YMax = Math.max(...Y_array);

  //draw axis x,y
  ctxx.beginPath();
  ctxx.moveTo(5, h);
  ctxx.lineWidth = AxisWidth;
  ctxx.strokeStyle = AxisColor;
  ctxx.lineTo(5, 0);
  ctxx.moveTo(5, h);
  ctxx.lineTo(w, h);
  ctxx.moveTo(5, h);
  ctxx.stroke();
  ctxx.closePath();

  //draw the mini lines
  ctxx.lineWidth = LineWidth;
  for (let i = 0; i < X_array.length; i++) {
    const x = (X_array[i] / XMax) * w + 5;
    ctxx.beginPath();
    ctxx.moveTo(x, h + 2);
    ctxx.lineTo(x, h + 20);
    ctx.fillText(`${x}`, x, h - 1);
    ctxx.stroke();
    ctxx.closePath();

    const y = (1 - Y_array[i] / YMax) * h;
    ctxx.beginPath();
    ctxx.moveTo(5, y);
    ctxx.lineTo(-5, y);
    ctx.fillText(`${Y_array[i]}`, 6, y + 5);
    ctxx.stroke();
    ctxx.closePath();
  }

  //draw graph
  ctxx.lineWidth = LineWidth;
  ctxx.strokeStyle = LineColor;
  ctxx.beginPath();
  for (let i = 0; i < maxLength; i++) {
    const x = (X_array[i] / XMax) * w + 5;
    const y = (1 - Y_array[i] / YMax) * h;
    ctxx.lineTo(x, y);
  }

  ctxx.stroke();
  ctxx.closePath();
};

const barIt = (
  placeHolderTag = "body",
  labels = ["red", "green", "blue", "yellow", "Purple"],
  values = [50, 100, 75, 25, 50],
  boardWidth = 50,
  colors = true,
  rotate = 0
) => {
  if (labels.length != values.length) {
    defultCallBack("Error ---> the arrays isnt in a same length");
    return false;
  }
  if (colors == false) {
    colors = ["blue"];
  } else if (colors == true) {
    colors = [
      "red",
      "green",
      "blue",
      "yellow",
      "Purple",
      "PapayaWhip",
      "Orange",
      "LightPink",
      "LightSeaGreen",
      "LightSlateGray",
      "OliveDrab",
      "Peru",
    ];
  }
  let forLater = ``;
  MaxVal = Math.max(...values);
  let htmlstring = `<div  style="border: 1px black solid; border-left:3px black solid;border-bottom:3px black solid; width: ${boardWidth}vw; height: ${boardWidth}vh;"
  id="conBoard">
  <div style="display: flex;
  height: 100%;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-evenly;" id="contentGraph">`;
  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    const label = labels[i];
    const color = colors[i % colors.length];

    htmlstring += `<div class="barItBar" title="the values is : ${val}\n the label is : ${label}" style="background: ${color}; border:1px black solid;border-bottom: none; width: ${
      (boardWidth * 0.75) / values.length
    }vw; height: ${(val / MaxVal) * (boardWidth * 0.9)}vh;" id="level${i}">
    </div>`;
    forLater += `<p style="width: ${
      (boardWidth * 0.3) / values.length
    }vw; rotate:${rotate}deg; margin:0;">${label}</p>`;
  }
  htmlstring += `</div><div style="display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-evenly;" id="contentGraph">${forLater}
  </div></div>`;

  ph = elm(placeHolderTag);
  ph.innerHTML = htmlstring;
};

// --------------------------------------------- Call Backs --------------------------------------------- \\

const errorCBMnist = (err) => {
  console.log("Error in the Ajax to the Api Model\n", err);
};

const succsesTextToVoice = (dataError) => {
  if (dataError.data[0].name != "" || dataError.data[0].name != undefined) {
    VoiceSrcFile =
      "https://matthijs-speecht5-tts-demo.hf.space/file=" +
      dataError.data[0].name;
    console.log(
      'The Src Output is store in varlible called "VoiceSrcFile" --->',
      VoiceSrcFile
    );
    return VoiceSrcFile;
  } else {
    console.log("Error --->", dataError);
    return false;
  }
};

const sucssesYolo = (dataError) => {
  //console.log(dataError)
  if (dataError.data[0] == undefined || dataError.data[0] == "") {
    defultCallBack();
  } else {
    base64 = dataError.data[0];
    const img = document.createElement("img");
    img.src = base64;
    document.body.append(img);
  }
};
const succsesimageVar = (res) => {
  let imageArray = [];
  let prefix = `https://lambdalabs-stable-diffusion-image-variations.hf.space/file=`;
  if (res.data[0] != undefined) {
    for (let index = 0; index < res.data[0].length; index++) {
      const element = res.data[0][index];
      imageArray.push(element);
    }
  } else {
    console.log("Error---> from Callback---->", res);
  }
};

const succsesCreateTone = (dataError) => {
  if (dataError.data[0].name != "" || dataError.data[0].name != undefined) {
    VoiceSrcFile =
      "https://gradio-generate-tone-main.hf.space/file=" +
      dataError.data[0].name;
    console.log(
      'The Src Output is store in varlible called "VoiceSrcFile" --->',
      VoiceSrcFile
    );
    return VoiceSrcFile;
  } else {
    console.log("Error --->", dataError);
    return false;
  }
};
const defultCallBack = (dataError) => {
  console.log("Defult CallBack --->", dataError);
  // if (dataError.data[0].length>1500) {
  //   base64ToImgTag(dataError.data[0]);
  // }
  return true;
};

function connect(api, body, callback = defultCallBack, method = "POST") {
  // main.js

  // POST request using fetch()
  fetch(api, {
    // Adding method type
    method: method,

    // Adding body or contents to send
    body: JSON.stringify(body),

    // Adding headers to the request
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    // Converting to JSON
    .then((response) => response.json())

    // Displaying results to console
    .then((json) => callback(json));
}

// --------------------------------------------- AI models --------------------------------------------- \\
const runModel = (modelName, input, CallBack = defultCallBack) => {
  const ttvApi = `https://matthijs-speecht5-tts-demo.hf.space/run/predict`; // text to voice
  const MnistApi = `https://giladthefixer-mnist-classifier.hf.space/run/predict`;
  const Mnist2 = `https://gradio-digit-classifier.hf.space/run/predict`;
  const sentimentApi = `https://giladthefixer-test-sentiment.hf.space/api/predict`;
  const ItDApi = `https://akhaliq-arcanegan.hf.space/api/predict`; // img to draw
  const scApi =
    "https://giladthefixer-sketch-classifier2.hf.space/api/predict/"; //sketch claaifier
  const ivApi =
    "https://lambdalabs-stable-diffusion-image-variations.hf.space/run/predict"; //img varitation
  const GtApi = `https://gradio-generate-tone-main.hf.space/run/predict`; // create sound
  const vttApi =
    "https://gradio-automatic-speech-recognition-main.hf.space/run/predict"; //sound to text
  const yoloApi = `https://kadirnar-yolov8.hf.space/run/predict`;
  const yoloApi2 = "https://kadirnar-yolov7.hf.space/run/predict";

  //text input ------>text to voice work and sentiment analysis work and create tone work !
  if (modelName == "text to voice") {
    if (input[0] == "" || input[0] == undefined) {
      defultCallBack("Error ---> the input text is empty");
      return;
    }
    if (input[1] == "" || input[1] == undefined) {
      input[1] = "BDL (male)";
    }

    const objectToSend = {
      data: input,
    };
    if (CallBack == undefined || CallBack == "") {
      CallBack = succsesTextToVoice;
    }
    connect(ttvApi, objectToSend, CallBack);
  } else if (modelName == "sentiment analysis") {
    const objectToSend = {
      data: input,
    };
    if (CallBack == undefined || CallBack == "") {
      CallBack = defultCallBack;
    }

    connect(sentimentApi, objectToSend, CallBack);
  } else if (modelName == "create tone") {
    const objectToSend = {
      data: input,
    };
    if (CallBack == undefined || CallBack == "") {
      CallBack = succsesCreateTone;
    }
    connect(GtApi, objectToSend, CallBack);
  } else if (modelName == "yolo") {
    if (input.length < 5) {
      if (input[0] == "" || input[0] == undefined) {
        console.log("Error ---> empty values ! ");
      } else {
        input[1] = "kadirnar/yolov8n-v8.0";
        input[2] = 640;
        input[3] = 0.25;
        input[4] = 0.45;
      }
    }
    const objectToSend = {
      data: input,
    };
    if (CallBack == undefined || CallBack == "") {
      CallBack = sucssesYolo;
    }
    connect(yoloApi, objectToSend, CallBack);
  } else if (modelName == "yolo2") {
    if (input.length < 5) {
      if (input[0] == "" || input[0] == undefined) {
        console.log("Error ---> empty values ! ");
      } else {
        input[1] = "kadirnar/yolov7-tiny-v0.1";
        input[2] = 640;
        input[3] = 0.25;
        input[4] = 0.45;
      }
    }
    const objectToSend = {
      data: input,
    };
    if (CallBack == undefined || CallBack == "") {
      CallBack = sucssesYolo;
    }
    connect(yoloApi2, objectToSend, CallBack);
  } else if (modelName == "sketch classifier") {
    if (input[0] == "" || input[0] == undefined) {
      console.log("Error --> empty wrong values");
      return false;
    } else {
      const objectToSend = {
        data: input,
      };
      if (CallBack == undefined || CallBack == "") {
        CallBack = defultCallBack;
      }
      connect(scApi, objectToSend, CallBack);
    }
  } else if (modelName == "mnist") {
    if (input[0] == "" || input[0] == undefined) {
      console.log("Error --> empty wrong values");
      return false;
    } else {
      const objectToSend = {
        data: input,
      };
      if (CallBack == undefined || CallBack == "") {
        CallBack = defultCallBack;
      }
      connect(MnistApi, objectToSend, CallBack);
    }
  } else if (modelName == "image to draw") {
    if (input[0] == "" || input[0] == undefined) {
      console.log("Error --> empty wrong values");
      return false;
    }
    if (input[1] == "" || input[1] == undefined) {
      input[1] = "version 0.4";
    }

    const objectToSend = {
      data: input,
    };
    if (CallBack == undefined || CallBack == "") {
      CallBack = defultCallBack;
    }
    connect(ItDApi, objectToSend, CallBack);
  } else if (modelName == "image variations") {
    if (input[0] == "" || input[0] == undefined) {
      console.log("Error --> empty wrong values");
      return false;
    }
    if (input[1] == "" || input[1] == undefined) {
      input[1] = 3;
    }
    if (input[2] == "" || input[2] == undefined) {
      input[2] = 1;
    }
    if (input[3] == "" || input[3] == undefined) {
      input[3] = 25;
    }
    if (input[4] == "" || input[4] == undefined) {
      input[4] = 0;
    }

    const objectToSend = {
      data: input,
    };
    if (CallBack == undefined || CallBack == "") {
      CallBack = succsesimageVar;
    }
    connect(ivApi, objectToSend, CallBack);
  }
  //sound file input
};

// --------------------------------------------- Colors --------------------------------------------- \\
function rgbToHsv(r, g, b) {
  (r /= 255), (g /= 255), (b /= 255);

  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    v = max;

  let d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h, s, v };
}

function hsvToRgb(h, s, v) {
  let r, g, b;
  let i = Math.floor(h * 6);
  let f = h * 6 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function hexToRgb(hex) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return { r, g, b };
}

function rgbToHsl(r, g, b) {
  (r /= 255), (g /= 255), (b /= 255);
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h, s, l };
}

function hslToRgb(h, s, l) {
  let r, g, b;
  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function rgbToHex(r, g, b) {
  const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  };
  const hexR = componentToHex(r);
  const hexG = componentToHex(g);
  const hexB = componentToHex(b);
  return "#" + hexR + hexG + hexB;
}

function GetArrayOfColorsWithVarition(
  hexColor = "#aaddff",
  val = 0.2,
  amount = 255
) {
  // Remove the '#' character from the hex color string
  hexColor = hexColor.replace("#", "");

  // Split the hex color string into three substrings for the red, green, and blue values
  let red = parseInt(hexColor.substring(0, 2), 16);
  let green = parseInt(hexColor.substring(2, 4), 16);
  let blue = parseInt(hexColor.substring(4, 6), 16);

  // Determine the minimum and maximum value for the RGB components
  let minRGB = Math.min(red, green, blue);
  let maxRGB = Math.max(red, green, blue);

  // Calculate the difference between the maximum and minimum values
  let diff = maxRGB - minRGB;

  // Initialize an empty array for the output colors
  let outputColors = [];

  // Generate colors with varying shades
  for (let i = 0; i <= amount; i++) {
    let r = red + (i - 128) * (diff / 256) + (-val + Math.random() * val * 2);
    let g = green + (i - 128) * (diff / 256) + (-val + Math.random() * val * 2);
    let b = blue + (i - 128) * (diff / 256) + (-val + Math.random() * val * 2);

    // Ensure that RGB values are within the valid range (0-255)
    r = Math.max(0, Math.min(255, Math.round(r)));
    g = Math.max(0, Math.min(255, Math.round(g)));
    b = Math.max(0, Math.min(255, Math.round(b)));

    // Convert the RGB values to a hex color string and add it to the output array
    let hex =
      "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    outputColors.push(hex);
  }

  // Return the array of output colors
  return outputColors;
}

// --------------------------------------------- encrypt strings --------------------------------------------- \\

const encryptDecrypt = (InputStr, flag = true) => {
  InputStr = InputStr.toString();
  let res = "";
  if (flag) {
    for (let i = 0; i < InputStr.length; i++) {
      let CharCode = InputStr.charCodeAt(i);
      if (CharCode % 2 == 0) {
        CharCode = CharCode * 2 + 1;
      } else {
        CharCode = (CharCode - 1) * 2;
      }
      res += String.fromCharCode(CharCode);
    }
    return res;
  } else {
    return decrypt(InputStr);
  }
};

const decrypt = (InputStr) => {
  InputStr = InputStr.toString();
  let res = "";
  for (let i = 0; i < InputStr.length; i++) {
    let CharCode = InputStr.charCodeAt(i);
    console.log("before de", CharCode);
    if (CharCode % 2 != 0) {
      CharCode = (CharCode - 1) / 2;
    } else {
      CharCode = CharCode / 2 + 1;
    }
    console.log("after de", CharCode);
    res += String.fromCharCode(CharCode);
  }
  return res;
};

// --------------------------------------------- Array --------------------------------------------- \\

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

// --------------------------------------------- styling --------------------------------------------- \\

// const fadeOut = (elm) => {
//   let fadelvl = 1;
//   FadeInterval = setInterval(() => {
//     elm.style.opacity = fadelvl;
//     fadelvl = fadelvl - 0.03;
//     if (fadelvl <= 0) {
//       clearInterval(FadeInterval);
//     }
//   }, 10);
// };
// const fadeIn = (elm) => {
//   let fadelvl = 0;
//   FadeInterval = setInterval(() => {
//     elm.style.opacity = fadelvl;
//     fadelvl = fadelvl + 0.03;
//     if (fadelvl >= 1) {
//       clearInterval(FadeInterval);
//     }
//   }, 10);
// };

const popIt = (
  title = "this is a title",
  message = "content content content content content",
  status = "good",
  button = "OK"
) => {
  if (status == "good") {
    const divpop = document.createElement("div");
    divpop.classList.add("popup-m", "wrap-C", "popStyleGood");
    divpop.style.opacity = 0;
    document.body.appendChild(divpop);
    divpop.innerHTML += `<h1 class="titleContent">${title}</h1>`;
    divpop.innerHTML += `<p class="contentContent">${message}</p>`;
    divpop.innerHTML += `<button onclick="removeIt(this)" class="btn-long btnContent">${button}</button>`;

    fadeIn(divpop);
    return true;
  } else if (status == "bad") {
    const divpop = document.createElement("div");
    divpop.classList.add("popup-m", "wrap-C", "popStylebad");
    divpop.style.opacity = 0;
    document.body.appendChild(divpop);
    divpop.innerHTML += `<h1 class="titleContent">${title}</h1>`;
    divpop.innerHTML += `<p class="contentContent">${message}</p>`;
    divpop.innerHTML += `<button onclick="removeIt(this)" class="btn-long btnContentbad">${button}</button>`;

    fadeIn(divpop);
    return true;
  } else {
    console.log(
      'Error ---> status input must be "good" or "bad", check this argument. '
    );
    return false;
  }
};

const colorIt = (tag = "body", hexColor = "#ffff00") => {
  const el = elm(tag);
  if (el.length == undefined) {
    el.style.backgroundColor = hexColor;
    return true;
  } else {
    for (let i = 0; i < el.length; i++) {
      const element = el[i];
      element.style.backgroundColor = hexColor;
    }
  }
};

const tableIt = (
  tag = "body",
  json = {
    col: ["col1", "col2", "col3"],
    data: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
  },
  flag = true
) => {
  const Colums = json.col;
  const Data = json.data;
  let len = Colums.length;
  let str = `<table id="${libraryName}Table" class="${libraryName}Table">`;
  str += `<tr>`;
  if (flag) {
    str += `<th>Row</th>`;
    len++;
  }
  for (let i = 0; i < Colums.length; i++) {
    const th = Colums[i];
    str += `<th>${th}</th>`;
  }
  let counter = 0;
  for (let i = 0; i < Data.length; i++) {
    if (i % Colums.length == 0) {
      counter++;
      str += `</tr>`;
      str += `<tr>`;
      if (flag) {
        str += `<td>${counter}</td>`;
      }
    }
    const somestring = Data[i];
    str += `<td>${somestring}</td>`;
  }
  str += `</tr>`;
  let ph = elm(tag);
  if (ph.length > 0) {
    ph = ph[0];
  }
  ph.innerHTML += str;
  return true;
};

// --------------------------------------------- files --------------------------------------------- \\

const TextFile = (
  FileName = "sample.txt",
  Content = "Content Content Content Content\nContent Content Content Content"
) => {
  const link = document.createElement("a");
  const content = Content;
  const file = new Blob([content], { type: "text/plain" });
  link.href = URL.createObjectURL(file);
  link.download = FileName;
  link.click();
  URL.revokeObjectURL(link.href);
};

function convertTo64(file, CallBack) {
  var reader = new FileReader();
  reader.readAsDataURL(file.files[0]);
  reader.onload = function () {
    //console.log(reader.result);
    base64 = reader.result;
    return CallBack(base64);
  };

  reader.onerror = function (error) {
    console.log("Error: ", error);
  };
}

const fileToBase64 = (inputTypeFile, CallBack = defultCallBack) => {
  return convertTo64(inputTypeFile, CallBack);
};

const base64ToImgTag = (Basse64, placeHolderTag = "body") => {
  const ph = elm(placeHolderTag);
  if (ph.length >= 1) {
    ph[0].innerHTML += `<img src="${Basse64}" alt="">`;
  } else {
    ph.innerHTML += `<img src="${Basse64}" alt="">`;
  }
  return true;
};

function handleFileSelect() {
  var file = this.event.target.files[0];

  var reader = new FileReader();
  reader.onload = function (event) {
    var csvData = event.target.result;
    var jsonData = csvToJson(csvData);
    // console.log(jsonData);
    JsonData.push(jsonData);
    
    return jsonData;
  };

  reader.readAsText(file);
}

function readTextFile(cb) {
  var file = this.event.target.files[0];

  var reader = new FileReader();
  reader.onload = function (event) {
    var stringText = event.target.result;
   
    //console.log(stringText);
    cb(stringText);
    
  };

  reader.readAsText(file);
  
}

function csvToJson(csvData) {
  var lines = csvData.split("\n");
  var result = [];

  var headers = lines[0].split(",");
  for (var i = 1; i < lines.length - 1; i++) {
    var obj = {};
    var currentLine = lines[i].split(",");

    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentLine[j];
    }

    result.push(obj);
  }

  toreturn = JSON.stringify(result);
  return JSON.parse(toreturn);
}
// --------------------------------------------- service --------------------------------------------- \\

class EZ {
  constructor() {
    // --------- About --------- \\

    this.version = "1.0.0";
    this.cdn = '<script src="./EZ.js"></script>';
    this.cdnStyle = `<link rel="stylesheet" href="./EZ.css">`;
    this.name = "EZ";
    // --------- Vars --------- \\
    this.canvas = 0;
    this.ctx = 0;
    this.base64String = "";
    this.fadeInterval = 0;
    this.voiceSrcFileString = "";
    this.VoiceSrcPrefix = "https://matthijs-speecht5-tts-demo.hf.space/file=";
    this.day = DAY;
    this.api = {
      textToVoice: `https://matthijs-speecht5-tts-demo.hf.space/run/predict`,
      mnist: `https://giladthefixer-mnist-classifier.hf.space/run/predict`,
      sentimentAnalysis: `https://giladthefixer-test-sentiment.hf.space/api/predict`,
      imageToDraw: "https://akhaliq-arcanegan.hf.space/api/predict",
      sketchClassifier:
        "https://giladthefixer-sketch-classifier2.hf.space/api/predict/",
      imageVariations:
        "https://lambdalabs-stable-diffusion-image-variations.hf.space/run/predict",
      createSound:
        "https://gradio-automatic-speech-recognition-main.hf.space/run/predict",
      yolo: "https://kadirnar-yolov8.hf.space/run/predict",
      yolo2: "https://kadirnar-yolov7.hf.space/run/predict",
    };
    this.jsonStore = [];
    this.modelsNames = [
      "text to voice",
      "sentiment analysis",
      "create tone",
      "yolo",
      "yolo2",
      "sketch classifier",
      "mnist",
      "image to draw",
      "image variations",
    ];

    // --------- functions --------- \\

    //dates
    this.dateToString = getDate;
    this.timeToString = getTime;
    this.timeDiff = timeDiff;
    //element
    this.elm = elm;
    //math
    this.rand = randBetween;
    this.isPrime = isPrime;
    this.round = roundD;
    //canvas
    this.CanvasToString = canvasToPng;
    this.cirlce = circle;
    this.square = square;
    this.clearCanvas = clearCanvas;
    this.middle = pointMiddleCanvas;
    this.lineIt = lineIt;
    this.barIt = barIt;

    //comuncation
    this.connectTo = connect;
    //AI Models
    this.runModel = runModel;
    //colors
    this.rgbToHsv = rgbToHsv;
    this.hsvToRgb = hsvToRgb;
    this.hexToRgb = hexToRgb;
    this.rgbToHsl = rgbToHsl;
    this.rgbToHex = rgbToHex;
    this.GetArrayOfColorsVarition = GetArrayOfColorsWithVarition;
    //Encripters
    this.encryptDecrypt = encryptDecrypt;
    //Array
    this.shuffle = shuffle;
    //styling
    this.fadeIn = fadeIn;
    this.fadeOut = fadeOut;
    this.plop = popIt;
    this.colorIt = colorIt;
    this.tableIt = tableIt;
    //files
    this.downloadTextFile = TextFile;
    this.fileToBase64String = fileToBase64;
    this.base64StringToImgTag = base64ToImgTag;
    this.inChangeFileToJson = handleFileSelect;
    this.csvStringToJson = csvToJson;
  }
}
