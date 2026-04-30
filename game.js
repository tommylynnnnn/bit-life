let player = {
  age: 0,
  happiness: 50,
  smarts: 50,
  health: 50,
  looks: 50,
  money: 0
};

let events = [];

// Load base events + DLC later
async function loadEvents() {
  const base = await fetch("data/events.json").then(r => r.json());
  events = [...base];
}

// Clamp stats between 0–100
function clamp(val) {
  return Math.max(0, Math.min(100, val));
}

// Update UI for BitLife-style layout
function updateUI() {
  // Age label in header
  const ageLabel = document.getElementById("ageLabel");
  if (ageLabel) {
    ageLabel.textContent = `Age: ${player.age} years`;
  }

  // Update stat bars + percentages
  const stats = [
    { key: "happiness", id: "happiness" },
    { key: "health", id: "health" },
    { key: "smarts", id: "smarts" },
    { key: "looks", id: "looks" }
  ];

  stats.forEach(s => {
    const val = clamp(player[s.key]);
    const bar = document.getElementById(`stat-${s.id}`);
    const text = document.getElementById(`stat-${s.id}-text`);

    if (bar) bar.style.width = val + "%";
    if (text) text.textContent = val + "%";
  });

  // Personal tab content
  const personal = document.getElementById("personal");
  if (personal) {
    personal.innerHTML = `
      <p>Happiness: ${clamp(player.happiness)}%</p>
      <p>Health: ${clamp(player.health)}%</p>
      <p>Smarts: ${clamp(player.smarts)}%</p>
      <p>Looks: ${clamp(player.looks)}%</p>
      <p>Money: $${player.money}</p>
    `;
  }
}

// Age up logic
function ageUp() {
  player.age++;
  runEvent();
  updateUI();
}

// Event system
function runEvent() {
  const possible = events.filter(e => {
    return player.age >= e.ageRange[0] && player.age <= e.ageRange[1];
  });

  const eventText = document.getElementById("eventText");
  const choiceBox = document.getElementById("choices");

  if (possible.length === 0) {
    eventText.textContent = "Nothing special happened this year.";
    choiceBox.innerHTML = "";
    return;
  }

  const event = possible[Math.floor(Math.random() * possible.length)];

  eventText.textContent = event.text;
  choiceBox.innerHTML = "";

  event.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.onclick = () => applyChoice(choice.effects);
    choiceBox.appendChild(btn);
  });
}

// Apply choice effects
function applyChoice(effects) {
  for (let stat in effects) {
    if (player.hasOwnProperty(stat)) {
      player[stat] += effects[stat];
    }
  }

  document.getElementById("choices").innerHTML = "";
  document.getElementById("eventText").textContent = "You made your choice.";
  updateUI();
}

// Tabs
document.querySelectorAll(".tabBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// Age button
document.getElementById("ageBtn").addEventListener("click", ageUp);

// Start game
loadEvents().then(updateUI);
