// Levels per section
const sections = {
  basic: 50,
  intermediate: 30,
  advanced: 20,
};

// Track completed levels
let completed = {
  basic: 0,
  intermediate: 0,
  advanced: 0,
};

// Map DOM IDs to section keys
const sectionMap = {
  basicGrid: "basic",
  intermediateGrid: "intermediate",
  advancedGrid: "advanced",
};

// Modal elements
const modal = document.getElementById("levelModal");
const modalTitle = document.getElementById("modalTitle");
const completeBtn = document.getElementById("completeBtn");
const closeBtn = document.querySelector(".close");

let currentSection = null;
let currentLevel = null;

function renderLevels(sectionId, totalLevels, completedCount) {
  const grid = document.getElementById(sectionId);
  grid.innerHTML = "";

  for (let i = 1; i <= totalLevels; i++) {
    const level = document.createElement("div");
    level.classList.add("level");

    if (i <= completedCount) {
      level.classList.add("completed");
      level.textContent = i;
    } else if (i === completedCount + 1) {
      level.classList.add("unlocked");
      level.textContent = i;
      level.addEventListener("click", () => openLevel(sectionId, i));
    } else {
      level.classList.add("locked");
      level.textContent = i;
      const lock = document.createElement("span");
      lock.textContent = "🔒";
      lock.classList.add("lock-icon");
      level.appendChild(lock);
    }

    grid.appendChild(level);
  }
}

function completeLevel(sectionId, levelNum) {
  const sectionKey = sectionMap[sectionId];
  if (levelNum === completed[sectionKey] + 1) {
    completed[sectionKey]++;
    renderAllSections();
  }
}

function renderAllSections() {
  renderLevels("basicGrid", sections.basic, completed.basic);

  if (completed.basic === sections.basic) {
    renderLevels("intermediateGrid", sections.intermediate, completed.intermediate);
  } else {
    lockWholeSection("intermediateGrid", sections.intermediate);
  }

  if (completed.intermediate === sections.intermediate) {
    renderLevels("advancedGrid", sections.advanced, completed.advanced);
  } else {
    lockWholeSection("advancedGrid", sections.advanced);
  }
}

function lockWholeSection(sectionId, totalLevels) {
  const grid = document.getElementById(sectionId);
  grid.innerHTML = "";
  for (let i = 1; i <= totalLevels; i++) {
    const level = document.createElement("div");
    level.classList.add("level", "locked");
    level.textContent = i;
    const lock = document.createElement("span");
    lock.textContent = "🔒";
    lock.classList.add("lock-icon");
    level.appendChild(lock);
    grid.appendChild(level);
  }
}

// Modal handling
function openLevel(sectionId, levelNum) {
  currentSection = sectionId;
  currentLevel = levelNum;
  modalTitle.textContent = `Level ${levelNum} - ${sectionMap[sectionId]}`;
  modal.style.display = "flex";
}

completeBtn.addEventListener("click", () => {
  if (currentSection && currentLevel) {
    completeLevel(currentSection, currentLevel);
  }
  modal.style.display = "none";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Initial render
renderAllSections();
