const synth = window.speechSynthesis;

const inputForm = document.querySelector("form");
const inputTxt = document.querySelector("input");
const voiceSelect = document.querySelector("select");
//
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
  synth.speak(utterThis);
};

inputTxt.addEventListener("change", (e) => {
  updateURLParam("q", e.target.value);
  console.log(e.target.value);
});
console.log(urlParams.get("q"));

function updateURLParam(key, value) {
  const url = new URL(window.location);
  if (value) {
    url.searchParams.set(key, value); // מוסיף או מעדכן פרמטר
  } else {
    url.searchParams.delete(key); // מסיר פרמטר אם השדה ריק
  }
  window.history.replaceState({}, "", url); // מעדכן את ה-URL ללא רענון הדף
}
