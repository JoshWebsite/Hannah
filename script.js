const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");
const page3 = document.getElementById("page3");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const music = document.getElementById("music");
const musicToggle = document.getElementById("musicToggle");
const video = document.getElementById("romanticVideo");
const placeholder = document.getElementById("videoPlaceholder");
const datePicker = document.getElementById("datePicker");
const selectedDate = document.getElementById("selectedDate");
const finalizeBtn = document.getElementById("finalizeBtn");
const validation = document.getElementById("validation");
const toast = document.getElementById("toast");
const finalDate = document.getElementById("finalDate");
const finalPlan = document.getElementById("finalPlan");

let chosenPlan = "";
let chosenDate = "";

function todayISO() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().split("T")[0];
}
datePicker.min = todayISO();

function showPage(page) {
  [page1,page2,page3].forEach(p => p.classList.remove("active"));
  page.classList.add("active");
  window.scrollTo({top:0, behavior:"smooth"});
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2300);
}

// Music: browsers may block autoplay until user interacts.
function startMusic() {
  music.play().then(() => {
    musicToggle.textContent = "Ⅱ";
  }).catch(() => {});
}
window.addEventListener("load", startMusic);
document.addEventListener("pointerdown", startMusic, {once:true});

musicToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  if (music.paused) {
    music.play();
    musicToggle.textContent = "Ⅱ";
  } else {
    music.pause();
    musicToggle.textContent = "▶";
  }
});

video.addEventListener("loadeddata", () => placeholder.style.display = "none");
video.addEventListener("error", () => placeholder.style.display = "grid");

// Evasive NO button
const noTexts = ["NO 😏","Are you sure? 😭","Try again 😂","Nope! 😏","Catch me! ❤️","Think again 🥺"];

function moveNoButton(pointerX, pointerY) {
  const rect = noBtn.getBoundingClientRect();
  const distance = Math.hypot(
    pointerX - (rect.left + rect.width/2),
    pointerY - (rect.top + rect.height/2)
  );
  if (distance < 130) {
    const margin = 12;
    const maxX = Math.max(margin, window.innerWidth - rect.width - margin);
    const maxY = Math.max(margin, window.innerHeight - rect.height - margin);
    const x = margin + Math.random() * (maxX - margin);
    const y = margin + Math.random() * (maxY - margin);
    noBtn.style.position = "fixed";
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
    noBtn.textContent = noTexts[Math.floor(Math.random() * noTexts.length)];
  }
}

document.addEventListener("pointermove", e => {
  if (page1.classList.contains("active")) moveNoButton(e.clientX, e.clientY);
});
noBtn.addEventListener("pointerenter", e => moveNoButton(e.clientX, e.clientY));
noBtn.addEventListener("touchstart", e => {
  e.preventDefault();
  moveNoButton(e.touches[0].clientX, e.touches[0].clientY);
});
noBtn.addEventListener("click", e => {
  e.preventDefault();
  moveNoButton(Math.random()*innerWidth, Math.random()*innerHeight);
  showToast("Hmm... I think YES is the correct answer. 😌❤️");
});

yesBtn.addEventListener("click", () => {
  yesBtn.animate([
    {transform:"scale(1)"},{transform:"scale(1.08)"},{transform:"scale(1)"}
  ], {duration:300});
  startMusic();
  setTimeout(() => showPage(page2), 250);
});

// Date cards
document.querySelectorAll(".date-card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".date-card").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    chosenPlan = card.dataset.plan;
    updateFinalize();
  });
});

datePicker.addEventListener("change", () => {
  chosenDate = datePicker.value;
  if (chosenDate) {
    const d = new Date(chosenDate + "T00:00:00");
    selectedDate.textContent = d.toLocaleDateString("en-US", {
      month:"long", day:"numeric", year:"numeric"
    }) + " ❤️";
  } else {
    selectedDate.textContent = "No date selected yet.";
  }
  updateFinalize();
});

function updateFinalize() {
  finalizeBtn.disabled = !(chosenPlan && chosenDate);
}

finalizeBtn.addEventListener("click", () => {
  if (!chosenPlan || !chosenDate) {
    validation.textContent = !chosenPlan
      ? "Pick our date activity first. 🥺❤️"
      : "Choose a date first. 📅❤️";
    return;
  }
  validation.textContent = "";
  const d = new Date(chosenDate + "T00:00:00");
  finalDate.textContent = d.toLocaleDateString("en-US", {
    month:"long", day:"numeric", year:"numeric"
  });
  finalPlan.textContent = chosenPlan;
  showPage(page3);
  burstHearts(24);
});


// Floating hearts
const hearts = document.getElementById("hearts");
function floatingHeart() {
  const h = document.createElement("span");
  h.className = "heart";
  h.textContent = ["♥","♡","❤","✦"][Math.floor(Math.random()*4)];
  h.style.left = Math.random()*100 + "%";
  h.style.fontSize = (12 + Math.random()*18) + "px";
  h.style.animationDuration = (6 + Math.random()*6) + "s";
  hearts.appendChild(h);
  setTimeout(() => h.remove(), 13000);
}
setInterval(floatingHeart, 650);

function burstHearts(count) {
  for(let i=0;i<count;i++){
    setTimeout(() => floatingHeart(), i*50);
  }
}


document.getElementById("backBtn").addEventListener("click", async () => {

    const backBtn = document.getElementById("backBtn");

    // Temporarily hide screenshot button
    backBtn.style.visibility = "hidden";

    // Freeze all animations and transitions
    const screenshotStyle = document.createElement("style");

    screenshotStyle.id = "screenshotStyle";

    screenshotStyle.innerHTML = `
        *,
        *::before,
        *::after {
            animation: none !important;
            transition: none !important;
        }

        .final-popup {
            opacity: 1 !important;
            transform: scale(1) !important;
        }
    `;

    document.head.appendChild(screenshotStyle);

    // Give browser time to render everything
    await new Promise(resolve => setTimeout(resolve, 200));

    const canvas = await html2canvas(document.documentElement, {
        scale: 2,

        useCORS: true,
        allowTaint: true,

        backgroundColor: null,

        width: window.innerWidth,
        height: window.innerHeight,

        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,

        scrollX: 0,
        scrollY: 0,

        logging: false
    });

    // Remove temporary screenshot settings
    screenshotStyle.remove();

    // Show button again
    backBtn.style.visibility = "visible";

    // Download image
    const link = document.createElement("a");

    link.download = "our-little-date.png";
    link.href = canvas.toDataURL("image/png");

    document.body.appendChild(link);
    link.click();
    link.remove();
});