window.addEventListener("DOMContentLoaded", () => {
  const elements = [
    { id: "H", name: "Hydrogen", symbol: "H", atomicNumber: 1, property: "light, flammable gas", emoji: "💧" },
    { id: "O", name: "Oxygen", symbol: "O", atomicNumber: 8, property: "supports combustion", emoji: "🌬️" },
    { id: "C", name: "Carbon", symbol: "C", atomicNumber: 6, property: "forms strong bonds", emoji: "🧱" },
    { id: "N", name: "Nitrogen", symbol: "N", atomicNumber: 7, property: "fertilizer-building gas", emoji: "🌱" },
    { id: "Na", name: "Sodium", symbol: "Na", atomicNumber: 11, property: "soft, reactive metal", emoji: "⚡" },
    { id: "Cl", name: "Chlorine", symbol: "Cl", atomicNumber: 17, property: "forms salts quickly", emoji: "🧂" },
    { id: "Fe", name: "Iron", symbol: "Fe", atomicNumber: 26, property: "strong structural metal", emoji: "🏗️" },
    { id: "Si", name: "Silicon", symbol: "Si", atomicNumber: 14, property: "semiconductor", emoji: "🔦" },
    { id: "Cu", name: "Copper", symbol: "Cu", atomicNumber: 29, property: "great electrical conductor", emoji: "🔌" },
    { id: "S", name: "Sulfur", symbol: "S", atomicNumber: 16, property: "smells like matches", emoji: "🔥" },
    { id: "He", name: "Helium", symbol: "He", atomicNumber: 2, property: "lighter-than-air gas", emoji: "🎈" },
    { id: "Ne", name: "Neon", symbol: "Ne", atomicNumber: 10, property: "glows in signs", emoji: "🎇" }
  ];

  const compoundEntries = [
    {
      elements: ["C", "O"],
      name: "Carbon Dioxide",
      formula: "CO₂",
      funFact: "CO₂ keeps greenhouse plants thriving in controlled environments."
    },
    {
      elements: ["Fe", "C"],
      name: "Steel",
      formula: "Fe+C",
      funFact: "Steel mixes iron with carbon to build skyscrapers and bridges."
    },
    {
      elements: ["H", "N"],
      name: "Ammonia",
      formula: "NH₃",
      funFact: "Ammonia stores nitrogen that fuels fertilizers and fuel cells."
    },
    {
      elements: ["H", "O"],
      name: "Water",
      formula: "H₂O",
      funFact: "Water dissolves and transports ions in batteries and living cells."
    },
    {
      elements: ["Na", "Cl"],
      name: "Sodium Chloride",
      formula: "NaCl",
      funFact: "Road crews spread NaCl brine to melt ice before storms."
    },
    {
      elements: ["Si", "O"],
      name: "Silicon Dioxide",
      formula: "SiO₂",
      funFact: "SiO₂ becomes glass fiber that guides internet light signals."
    },
    {
      elements: ["Cu", "S"],
      name: "Copper Sulfide",
      formula: "CuS",
      funFact: "Copper sulfide shows up in solar cells that harvest sunlight."
    }
  ];

  const knownCompounds = compoundEntries.reduce((map, entry) => {
    const key = entry.elements.slice().sort().join(",");
    map[key] = entry;
    return map;
  }, {});

  const challenges = [
    {
      id: "water",
      prompt: "Create the compound that keeps astronauts hydrated during long missions.",
      focus: "Think about life-support materials and universal solvents.",
      requiredElements: ["H", "O"],
      success: "You built water—mission control applauds your life-support skills!"
    },
    {
      id: "salt",
      prompt: "Whip up the de-icing compound that street crews spray before a snowstorm.",
      focus: "Look for a metal + halogen pair that forms a crystal lattice.",
      requiredElements: ["Na", "Cl"],
      success: "Salty success! Those roads will stay safe for commuters."
    },
    {
      id: "ammonia",
      prompt: "Combine elements that farmers use to boost plant growth and rocket engineers use in fuel.",
      focus: "One gas is super common in air, the other is the lightest element.",
      requiredElements: ["N", "H"],
      success: "Ammonia secured—fertilizer factories and fuel depots cheer."
    },
    {
      id: "steel",
      prompt: "Forge the alloy backbone found inside bridges and skyscrapers.",
      focus: "Blend a structural metal with the element that loves forming chains.",
      requiredElements: ["Fe", "C"],
      success: "Steel strength achieved! Your virtual bridge is rock solid."
    },
    {
      id: "silica",
      prompt: "Build the glassy compound etched into every phone screen and fiber-optic cable.",
      focus: "Pair a semiconductor with the gas that helps fires burn brighter.",
      requiredElements: ["Si", "O"],
      success: "Sparkling silica! Data can zoom through those glass fibers."
    }
  ];

  const careerSparks = [
    "Materials scientists tweak alloys so skyscrapers sway safely in the wind.",
    "Battery engineers mix precise compounds so electric cars can sprint farther.",
    "Semiconductor designers pattern silicon wafers that route billions of signals.",
    "Ceramic specialists fuse silica-based glass that protects spacecraft windows.",
    "Chemical engineers refine fertilizers so crops grow with less water.",
    "Metallurgists combine iron and carbon to form steel cables for suspension bridges."
  ];

  const state = {
    round: 0,
    score: 0,
    attempts: 0,
    currentChallenge: null,
    displayedElements: [],
    missionLog: [],
    selectedIndices: []
  };

  const promptEl = document.getElementById("prompt");
  const focusEl = document.getElementById("challenge-focus");
  const roundEl = document.getElementById("round");
  const scoreEl = document.getElementById("score");
  const attemptsEl = document.getElementById("attempts");
  const elementGridEl = document.getElementById("element-grid");
  const selectedElementsEl = document.getElementById("selected-elements");
  const feedbackSection = document.getElementById("feedback");
  const feedbackBody =
    document.getElementById("feedback-body") ||
    (() => {
      if (!feedbackSection) return null;
      const body = document.createElement("div");
      body.id = "feedback-body";
      feedbackSection.appendChild(body);
      return body;
    })();
  const missionLogList = document.getElementById("mission-log-list");
  const missionLogEmpty = document.getElementById("mission-log-empty");
  const comboForm = document.getElementById("combo-form");
  const comboInput = document.getElementById("combo-input");
  const nextButton = document.getElementById("next-round");
  const restartButton = document.getElementById("restart");

  function setFeedback(html) {
    if (feedbackBody) {
      feedbackBody.innerHTML = html;
    } else if (feedbackSection) {
      feedbackSection.innerHTML = `
        <h2 class="section-heading">Feedback</h2>
        ${html}
      `;
    }
  }

  function shuffle(list) {
    const arr = [...list];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function generateElementSet(requiredIds) {
    const required = elements.filter((el) => requiredIds.includes(el.id));
    const remaining = shuffle(elements.filter((el) => !requiredIds.includes(el.id)));
    const set = [...required];
    while (set.length < 5 && remaining.length) {
      set.push(remaining.pop());
    }
    return shuffle(set);
  }

  function chooseChallenge() {
    if (!state.remainingChallenges || state.remainingChallenges.length === 0) {
      state.remainingChallenges = shuffle(challenges);
    }
    return state.remainingChallenges.pop();
  }

  function updateSelectionHint() {
    if (!state.selectedIndices.length) {
      selectedElementsEl.textContent = "No elements selected yet.";
      return;
    }
    const picks = state.selectedIndices
      .map((index) => state.displayedElements[index])
      .map((el) => `${el.emoji} ${el.name}`);
    selectedElementsEl.textContent = `Selected: ${picks.join(" + ")}`;
  }

  function renderElements() {
    if (!elementGridEl) return;
    elementGridEl.innerHTML = state.displayedElements
      .map((el, index) => {
        const isSelected = state.selectedIndices.includes(index) ? " selected" : "";
        return `
          <button type="button" class="element-card${isSelected}" data-index="${index}">
            <span class="element-emoji" aria-hidden="true">${el.emoji}</span>
            <span class="element-name">${index + 1}. ${el.name} (${el.symbol})</span>
            <span class="element-detail">#${el.atomicNumber} · ${el.property}</span>
          </button>
        `;
      })
      .join("");
  }

  function updateUIForRound() {
    roundEl.textContent = state.round;
    attemptsEl.textContent = state.attempts;
    promptEl.textContent = state.currentChallenge.prompt;
    focusEl.textContent = state.currentChallenge.focus;
    renderElements();
    updateSelectionHint();
  }

  function syncInputWithSelection() {
    comboInput.value = state.selectedIndices.map((index) => index + 1).join(" + ");
  }

  function toggleSelection(index) {
    const existing = state.selectedIndices.indexOf(index);
    if (existing >= 0) {
      state.selectedIndices.splice(existing, 1);
    } else {
      if (state.selectedIndices.length === 2) {
        state.selectedIndices.shift();
      }
      state.selectedIndices.push(index);
    }
    renderElements();
    updateSelectionHint();
    syncInputWithSelection();
  }

  function normalizeSelection(input) {
    return input
      .split(/\s|\+/)
      .map((part) => part.trim())
      .filter(Boolean);
  }

  function translateSelection(selection) {
    const ids = selection
      .map((value) => {
        const index = Number(value);
        if (Number.isNaN(index)) {
          return null;
        }
        const element = state.displayedElements[index - 1];
        return element ? element.id : null;
      })
      .filter(Boolean);
    return [...new Set(ids)];
  }

  function buildKey(ids) {
    return ids.slice().sort().join(",");
  }

  function awardPoints(attempts) {
    const base = 120;
    const penalty = (attempts - 1) * 25;
    return Math.max(40, base - penalty);
  }

  function randomSpark() {
    return careerSparks[Math.floor(Math.random() * careerSparks.length)];
  }

  function renderMissionLog() {
    if (!state.missionLog.length) {
      missionLogEmpty.hidden = false;
      missionLogList.hidden = true;
      missionLogList.innerHTML = "";
      return;
    }

    missionLogEmpty.hidden = true;
    missionLogList.hidden = false;
    missionLogList.innerHTML = state.missionLog
      .map(
        (entry) => `
          <li>
            <strong>Round ${entry.round}:</strong> ${entry.compound} (${entry.formula})<br />
            <span class="hint">${entry.successLine}</span><br />
            <small class="hint">${entry.spark}</small>
          </li>
        `
      )
      .join("");
  }

  function startRound() {
    state.round += 1;
    state.attempts = 0;
    state.currentChallenge = chooseChallenge();
    state.displayedElements = generateElementSet(state.currentChallenge.requiredElements);
    state.selectedIndices = [];
    updateUIForRound();
    comboInput.value = "";
    setFeedback("<p>Pick two elements to tackle the mission.</p>");
    comboInput.focus();
    nextButton.disabled = true;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const raw = comboInput.value.trim();
    if (!raw) {
      setFeedback("<p>Please enter two element numbers.</p>");
      return;
    }
    state.attempts += 1;
    attemptsEl.textContent = state.attempts;
    const selection = normalizeSelection(raw);
    if (selection.length < 2) {
      setFeedback("<p>Enter at least two numbers separated by spaces or + signs.</p>");
      return;
    }
    const chosenIds = translateSelection(selection);
    if (chosenIds.length < 2) {
      setFeedback("<p>Make sure the numbers match the list above.</p>");
      return;
    }
    const key = buildKey(chosenIds);
    const requiredKey = buildKey(state.currentChallenge.requiredElements);
    if (key === requiredKey) {
      const compound = knownCompounds[key];
      if (!compound) {
        setFeedback(`
          <p class="celebrate">${state.currentChallenge.success}</p>
          <p>Mission cleared, but the fact card went missing. Tap Next Challenge to keep building!</p>
        `);
        nextButton.disabled = false;
        return;
      }
      const spark = randomSpark();
      const points = awardPoints(state.attempts);
      state.score += points;
      scoreEl.textContent = state.score;
      setFeedback(`
        <p class="celebrate">${state.currentChallenge.success}</p>
        <p>You combined <strong>${compound.name}</strong> (${compound.formula}).</p>
        <p class="hint">Fun Fact: ${compound.funFact}</p>
        <p class="hint">Career Spark: ${spark}</p>
        <p>Points earned: ${points}</p>
      `);
      state.missionLog.unshift({
        round: state.round,
        compound: compound.name,
        formula: compound.formula,
        successLine: state.currentChallenge.success,
        spark
      });
      state.missionLog = state.missionLog.slice(0, 3);
      renderMissionLog();
      nextButton.disabled = false;
    } else if (knownCompounds[key]) {
      const compound = knownCompounds[key];
      setFeedback(`
        <p class="hint">Close, but not quite.</p>
        <p>You formed <strong>${compound.name}</strong> (${compound.formula}), which is useful because ${compound.funFact}</p>
        <p class="hint">Hint: ${state.currentChallenge.focus}</p>
      `);
    } else {
      const chosenNames = chosenIds
        .map((id) => elements.find((el) => el.id === id)?.name || id)
        .join(" + ");
      setFeedback(`
        <p class="hint">That combo fizzled.</p>
        <p>${chosenNames} did not meet the challenge. Some elements, like neon, barely bond at all!</p>
        <p class="hint">Hint: ${state.currentChallenge.focus}</p>
      `);
    }
  }

  comboForm.addEventListener("submit", handleSubmit);
  elementGridEl.addEventListener("click", (event) => {
    const card = event.target.closest(".element-card");
    if (!card) return;
    const index = Number(card.dataset.index);
    if (Number.isNaN(index)) return;
    toggleSelection(index);
  });

  nextButton.addEventListener("click", () => {
    if (!nextButton.disabled) {
      startRound();
    }
  });

  restartButton.addEventListener("click", () => {
    state.round = 0;
    state.score = 0;
    scoreEl.textContent = 0;
    state.missionLog = [];
    renderMissionLog();
    startRound();
  });

  renderMissionLog();
  startRound();
});
