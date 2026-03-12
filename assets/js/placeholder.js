const directions = {
  page1: [
    { label: "JonnyBoy-2", path: "directions/page1/jonnyboy-2/index.html" },
    { label: "Kid_Mikey", path: "directions/page1/kid-mikey/index.html" },
    { label: "Kid_Mikey_2", path: "directions/page1/kid-mikey-2/index.html" },
    { label: "SugerJen", path: "directions/page1/sugerjen/index.html" },
    { label: "RealNana", path: "directions/page1/realnana/index.html" },
    { label: "Babybucketa", path: "directions/page1/babybucketa/index.html" },
    { label: "AquaAce", path: "directions/page1/aquaace/index.html" },
    { label: "For You", path: "directions/page1/for-you/index.html" }
  ],
  game: [
    { label: "daily-5", path: "directions/game/daily-5/index.html" },
    { label: "daily-5-vertical", path: "directions/game/daily-5-vertical/index.html" },
    { label: "quad-goals-v1", path: "directions/game/quad-goals-v1/index.html" },
    { label: "quad-goals-v2", path: "directions/game/quad-goals-v2/index.html" },
    { label: "shuffle-v1", path: "directions/game/shuffle-v1/index.html" },
    { label: "shuffle-v2", path: "directions/game/shuffle-v2/index.html" },
    { label: "shuffle-v3", path: "directions/game/shuffle-v3/index.html" },
    { label: "pickem-v1", path: "directions/game/pickem-v1/index.html" },
    { label: "pickem-v2", path: "directions/game/pickem-v2/index.html" }
  ],
  presentation: [
    { label: "whiteboard", path: "directions/presentation/whiteboard/index.html" },
    { label: "points-added", path: "directions/presentation/points-added/index.html" },
    { label: "points-added-v2", path: "directions/presentation/points-added-v2/index.html" },
    { label: "points-added-v3", path: "directions/presentation/points-added-v3/index.html" }
  ],
  animation: [
    { label: "shuffle", path: "directions/animation/shuffle/index.html" },
    { label: "pick-em", path: "directions/animation/pick-em/index.html" },
    { label: "perfect-9", path: "directions/animation/perfect-9/index.html" },
    { label: "5-daily", path: "directions/animation/5-daily/index.html" },
    { label: "quad-goals", path: "directions/animation/quad-goals/index.html" },
    { label: "survivor", path: "directions/animation/survivor/index.html" }
  ]
};

const directoryPanel = document.getElementById("directoryPanel");
const billboardPreview = document.getElementById("billboardPreview");
const emptyState = document.getElementById("emptyState");

function setActiveButton(selectedButton) {
  const buttons = directoryPanel.querySelectorAll(".direction-item");
  buttons.forEach((button) => button.classList.remove("active"));
  selectedButton.classList.add("active");
}

function loadDirection(path, button) {
  billboardPreview.src = path;
  billboardPreview.style.display = "block";
  emptyState.style.display = "none";
  setActiveButton(button);
}

Object.entries(directions).forEach(([sectionName, items]) => {
  const section = document.createElement("section");
  section.className = "directory-section";

  const title = document.createElement("h2");
  title.textContent = sectionName;
  section.appendChild(title);

  items.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "direction-item";
    button.textContent = item.label;
    button.addEventListener("click", () => loadDirection(item.path, button));
    section.appendChild(button);
  });

  directoryPanel.appendChild(section);
});
