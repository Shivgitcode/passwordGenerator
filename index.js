const inputSlider = document.querySelector(".slider");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

// lengthDisplay.textContent = inputSlider.value;
let password = "";
let passwordLength = 10;
let checkCount = 0;
let symbol = "!@#$%^&*()_-+={[}];:'|><?/";
handleSlider();

setIndicator("#ccc");

function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}
function setIndicator(color) {
  indicator.style.backgroundColor = color;
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRandomInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol() {
  const symbolarray = symbol.split("");
  let len = symbolarray.length;
  console.log(symbolarray[getRandomInteger(0, len)]);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

function shufflePassword(array) {
  // fisher Yates method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "failed";
  }
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function handleCheckboxCount() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

inputSlider.addEventListener("input", (evt) => {
  passwordLength = evt.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckboxCount);
});

generateBtn.addEventListener("click", () => {
  if (checkCount == 0) return;
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  password = "";

  // if (uppercaseCheck.checked) {
  //   password += generateUpperCase();
  // }
  // if (lowercaseCheck.checked) {
  //   password += generateLowerCase();
  // }
  // if (numbersCheck.checked) {
  //   password += generateRandomNumber();
  // }
  let funcArr = [];
  if (uppercaseCheck.checked) {
    funcArr.push(generateUpperCase);
  }
  if (lowercaseCheck.checked) {
    funcArr.push(generateLowerCase);
  }
  if (numbersCheck.checked) {
    funcArr.push(generateRandomNumber);
  }
  if (symbolsCheck.checked) {
    funcArr.push(generateSymbol);
  }

  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRandomInteger(0, funcArr.length);

    password += funcArr[randIndex]();
  }

  password = shufflePassword(Array.from(password));

  passwordDisplay.value = password;

  calcStrength();
});
