const STORAGE_KEY = "tip-calculator-state";

const billInput = document.getElementById("billInput");
const customTipInput = document.getElementById("customTipInput");
const peopleInput = document.getElementById("peopleInput");
const decreasePeople = document.getElementById("decreasePeople");
const increasePeople = document.getElementById("increasePeople");
const tipButtons = Array.from(document.querySelectorAll(".tip-button"));
const errorText = document.getElementById("errorText");
const tipAmount = document.getElementById("tipAmount");
const totalAmount = document.getElementById("totalAmount");
const perPersonAmount = document.getElementById("perPersonAmount");
const tipPerPerson = document.getElementById("tipPerPerson");
const roundButton = document.getElementById("roundButton");
const resetButton = document.getElementById("resetButton");

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR"
});

let selectedTip = 10;
let roundPerPerson = false;

function readNumber(input) {
  if (input.value.trim() === "") return null;
  const value = Number(input.value);
  return Number.isFinite(value) ? value : NaN;
}

function formatMoney(value) {
  return currency.format(value);
}

function currentState() {
  return {
    bill: readNumber(billInput),
    tipPercent: customTipInput.value.trim() === "" ? selectedTip : readNumber(customTipInput),
    people: readNumber(peopleInput),
    roundPerPerson
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    bill: billInput.value,
    selectedTip,
    customTip: customTipInput.value,
    people: peopleInput.value,
    roundPerPerson
  }));
}

function setResults(tip, total, perPerson, tipEach) {
  tipAmount.textContent = formatMoney(tip);
  totalAmount.textContent = formatMoney(total);
  perPersonAmount.textContent = formatMoney(perPerson);
  tipPerPerson.textContent = formatMoney(tipEach);
}

function showError(message) {
  errorText.textContent = message;
  errorText.hidden = false;
}

function clearError() {
  errorText.textContent = "";
  errorText.hidden = true;
}

function calculate() {
  const state = currentState();
  saveState();

  if (state.bill === null && state.people === 1) {
    clearError();
    setResults(0, 0, 0, 0);
    return state;
  }

  if (state.bill === null || Number.isNaN(state.bill) || state.bill < 0) {
    showError("Enter a valid bill amount of zero or more.");
    setResults(0, 0, 0, 0);
    return state;
  }

  if (state.tipPercent === null || Number.isNaN(state.tipPercent) || state.tipPercent < 0) {
    showError("Enter a valid tip percentage.");
    setResults(0, 0, 0, 0);
    return state;
  }

  if (state.people === null || Number.isNaN(state.people) || state.people < 1) {
    showError("At least one person is required.");
    setResults(0, 0, 0, 0);
    return state;
  }

  clearError();
  const tip = state.bill * state.tipPercent / 100;
  const total = state.bill + tip;
  const tipEach = tip / state.people;
  const perPerson = state.roundPerPerson ? Math.ceil(total / state.people) : total / state.people;
  setResults(tip, total, perPerson, tipEach);
  return state;
}

function selectPresetTip(value) {
  selectedTip = Number(value);
  customTipInput.value = "";
  tipButtons.forEach((button) => {
    const active = Number(button.dataset.tip) === selectedTip;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  calculate();
}

function changePeople(delta) {
  const current = readNumber(peopleInput) || 0;
  peopleInput.value = String(Math.max(1, current + delta));
  calculate();
}

function resetCalculator() {
  billInput.value = "";
  customTipInput.value = "";
  peopleInput.value = "1";
  roundPerPerson = false;
  roundButton.textContent = "Round per person up";
  selectPresetTip(10);
  calculate();
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return;
    billInput.value = String(saved.bill || "");
    customTipInput.value = String(saved.customTip || "");
    peopleInput.value = String(saved.people || "1");
    roundPerPerson = Boolean(saved.roundPerPerson);
    if (customTipInput.value === "" && Number.isFinite(Number(saved.selectedTip))) {
      selectedTip = Number(saved.selectedTip);
      tipButtons.forEach((button) => {
        const active = Number(button.dataset.tip) === selectedTip;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    } else {
      tipButtons.forEach((button) => {
        button.classList.remove("active");
        button.setAttribute("aria-pressed", "false");
      });
    }
    roundButton.textContent = roundPerPerson ? "Use exact split" : "Round per person up";
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

tipButtons.forEach((button) => button.addEventListener("click", () => selectPresetTip(button.dataset.tip)));
billInput.addEventListener("input", calculate);
peopleInput.addEventListener("input", calculate);
customTipInput.addEventListener("input", () => {
  tipButtons.forEach((button) => {
    button.classList.remove("active");
    button.setAttribute("aria-pressed", "false");
  });
  calculate();
});
decreasePeople.addEventListener("click", () => changePeople(-1));
increasePeople.addEventListener("click", () => changePeople(1));
roundButton.addEventListener("click", () => {
  roundPerPerson = !roundPerPerson;
  roundButton.textContent = roundPerPerson ? "Use exact split" : "Round per person up";
  calculate();
});
resetButton.addEventListener("click", resetCalculator);

window.tipCalculator = {
  getState() {
    return {
      ...currentState(),
      error: errorText.hidden ? "" : errorText.textContent,
      results: {
        tipAmount: tipAmount.textContent,
        totalAmount: totalAmount.textContent,
        perPersonAmount: perPersonAmount.textContent,
        tipPerPerson: tipPerPerson.textContent
      }
    };
  }
};

loadState();
calculate();
