const synth = window.speechSynthesis;

const inputForm = document.querySelector("form");
const inputTxt = document.querySelector("input");
const voiceSelect = document.querySelector("select");
const rate = document.querySelector("#speed");
const volume = document.querySelector("#volume");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

inputTxt.value = urlParams.get("q");
let voices;

function loadVoices() {
  voices = synth.getVoices();
  for (let i = 0; i < voices.length; i++) {
    voiceSelect.options[i] = new Option(
      `${voices[i].name} (${voices[i].lang})`
    );
    voiceSelect.options[i].value = i;
  }
}

// in Google Chrome the voices are not ready on page load
if ("onvoiceschanged" in synth) {
  synth.onvoiceschanged = loadVoices;
} else {
  loadVoices();
}

inputForm.onsubmit = (event) => {
  event.preventDefault();

  const utterThis = new SpeechSynthesisUtterance(inputTxt.value);
  utterThis.voice = voices[voiceSelect.value];
  utterThis.rate = rate.value;
  utterThis.volume = volume.value;
  synth.speak(utterThis);
};

// EventListeners
inputTxt.addEventListener("change", (e) => {
  updateURLParam("q", e.target.value);
});

rate.addEventListener("change", () => {
  if (rate.value <= 1) {
    rate.classList.remove("red-range");

    rate.classList.add("yellow-range");
  } else {
    rate.classList.remove("yellow-range");
    rate.classList.add("red-range");
  }
});

volume.addEventListener("change", () => {
  if (volume.value <= 0.5) {
    volume.classList.remove("red-range");

    volume.classList.add("yellow-range");
  } else {
    volume.classList.remove("yellow-range");
    volume.classList.add("red-range");
  }
});

function updateURLParam(key, value) {
  const url = new URL(window.location);
  if (value) {
    url.searchParams.set(key, value); // Update or swtich param
  } else {
    url.searchParams.delete(key); // Remove params if feild is empty
  }
  window.history.replaceState({}, "", url); // Update Url without refresh the page
}
