const opening = document.querySelector("#opening");
const countdown = document.querySelector("#countdown");
const countdownNumber = document.querySelector("#countdownNumber");
const invitation = document.querySelector("#invitation");
const ending = document.querySelector("#ending");
const startButton = document.querySelector("#startButton");
const yesButton = document.querySelector("#yesButton");
const noButton = document.querySelector("#noButton");
const actions = document.querySelector("#actions");
const directorNote = document.querySelector("#directorNote");
const skipCredits = document.querySelector("#skipCredits");
const creditsRoll = document.querySelector("#creditsRoll");
const petalRain = document.querySelector("#petalRain");
const musicButton = document.querySelector("#musicButton");
const musicContainer = document.querySelector("#musicContainer");
const musicBars = document.querySelector("#musicBars");
const musicState = document.querySelector("#musicState");

const noMessages = [
  "Pensa bem...",
  "Por favor!",
  "Tem certeza?",
  "Isso não estava no roteiro."
];

let noAttempts = 0;
let musicPlaying = false;
let lastRefusalAt = 0;

function startMusic() {
  musicContainer.innerHTML = `
    <iframe
      class="music-frame"
      src="https://www.youtube-nocookie.com/embed/Jne9t8sHpUc?autoplay=1&loop=1&playlist=Jne9t8sHpUc&controls=0&playsinline=1"
      title="Ironic — Alanis Morissette"
      allow="autoplay; encrypted-media"
      tabindex="-1">
    </iframe>`;

  musicPlaying = true;
  musicState.textContent = "ON";
  musicBars.classList.remove("is-paused");
  musicBars.innerHTML = "<i></i><i></i><i></i><i></i>";
  musicButton.setAttribute("aria-label", "Pausar Ironic, de Alanis Morissette");
}

function stopMusic() {
  musicContainer.replaceChildren();
  musicPlaying = false;
  musicState.textContent = "PLAY";
  musicBars.classList.add("is-paused");
  musicBars.textContent = "♪";
  musicButton.setAttribute("aria-label", "Tocar Ironic, de Alanis Morissette");
}

function beginSession() {
  startMusic();
  startButton.disabled = true;
  opening.classList.add("is-closing");

  window.setTimeout(() => {
    opening.classList.add("is-hidden");
    countdown.classList.remove("is-hidden");
  }, 560);

  [3, 2, 1].forEach((number, index) => {
    window.setTimeout(() => {
      countdownNumber.textContent = String(number);
    }, 620 + index * 620);
  });

  window.setTimeout(() => {
    countdown.classList.add("is-hidden");
    invitation.classList.remove("is-hidden");
    musicButton.classList.remove("is-hidden");
    window.requestAnimationFrame(() => invitation.classList.add("is-revealed"));
  }, 2700);
}

function showDirectorNote(message) {
  directorNote.textContent = message;
  directorNote.classList.remove("is-popping");
  void directorNote.offsetWidth;
  directorNote.classList.add("is-popping");
}

function moveNoButton(pointerX, pointerY) {
  const bounds = actions.getBoundingClientRect();
  const buttonBounds = noButton.getBoundingClientRect();
  const padding = 10;
  const minTop = 65;
  const maxLeft = Math.max(padding, bounds.width - buttonBounds.width - padding);
  const maxTop = Math.max(minTop, bounds.height - buttonBounds.height - padding);

  let nextLeft = padding;
  let nextTop = minTop;

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const candidateLeft = padding + Math.random() * (maxLeft - padding);
    const candidateTop = minTop + Math.random() * (maxTop - minTop);
    const centerX = bounds.left + candidateLeft + buttonBounds.width / 2;
    const centerY = bounds.top + candidateTop + buttonBounds.height / 2;
    const distance = Math.hypot(centerX - pointerX, centerY - pointerY);

    nextLeft = candidateLeft;
    nextTop = candidateTop;
    if (distance > 120) break;
  }

  noButton.style.right = "auto";
  noButton.style.left = `${Math.round(nextLeft)}px`;
  noButton.style.top = `${Math.round(nextTop)}px`;
}

function refuseAttempt(event) {
  const now = Date.now();
  if (now - lastRefusalAt < 180) return;
  lastRefusalAt = now;

  const message = noMessages[noAttempts % noMessages.length];
  noAttempts += 1;
  showDirectorNote(message);

  const bounds = noButton.getBoundingClientRect();
  const pointerX = Number.isFinite(event?.clientX) ? event.clientX : bounds.left + bounds.width / 2;
  const pointerY = Number.isFinite(event?.clientY) ? event.clientY : bounds.top + bounds.height / 2;
  moveNoButton(pointerX, pointerY);

  yesButton.style.transform = `scale(${Math.min(1 + noAttempts * .045, 1.22)})`;
  if (noAttempts >= 4) noButton.textContent = "Erro 404";
}

function makePetalRain() {
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < 22; index += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.textContent = index % 5 === 0 ? "🌷" : "•";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.setProperty("--drift", `${Math.round(Math.random() * 140 - 70)}px`);
    petal.style.animationDuration = `${5 + Math.random() * 6}s`;
    petal.style.animationDelay = `${Math.random() * -8}s`;
    fragment.appendChild(petal);
  }

  petalRain.appendChild(fragment);
}

function acceptInvitation() {
  invitation.classList.add("is-hidden");
  ending.classList.remove("is-hidden");
  makePetalRain();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

startButton.addEventListener("click", beginSession);
yesButton.addEventListener("click", acceptInvitation);
skipCredits.addEventListener("click", () => {
  creditsRoll.classList.add("is-skipped");
  skipCredits.classList.add("is-hidden");
});

musicButton.addEventListener("click", () => {
  if (musicPlaying) stopMusic();
  else startMusic();
});

noButton.addEventListener("pointerenter", (event) => {
  if (event.pointerType === "mouse") refuseAttempt(event);
});

noButton.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  refuseAttempt(event);
});

noButton.addEventListener("click", (event) => {
  if (event.detail === 0) refuseAttempt(event);
});
