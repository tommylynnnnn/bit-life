let player = {
  age: 0,
  happiness: 50,
  smarts: 50,
  health: 50,
  looks: 50,
  money: 0,

  relationships: {
    family: [],
    friends: [],
    romantic: [],
    pets: []
  }
};

// Random NPC name generator
function randomName() {
  const first = ["Liam", "Noah", "Emma", "Olivia", "Ava", "Sophia", "Mason", "Lucas", "Mia", "Harper"];
  const last = ["Smith", "Johnson", "Brown", "Taylor", "Wilson", "Clark", "Hall", "Young", "King", "Wright"];
  return first[Math.floor(Math.random() * first.length)] + " " +
         last[Math.floor(Math.random() * last.length)];
}

let events = [];

// Load base events + DLC later
async function loadEvents() {
  const base = await fetch("data/events.json").then(r => r.json());
  events = [...base];
  console.log("Loaded events:", events);
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

  // RELATIONSHIPS TAB
  const familyList = document.getElementById("familyList");
  const friendsList = document.getElementById("friendsList");
  const romanticList = document.getElementById("romanticList");
  const petsList = document.getElementById("petsList");

  if (familyList) {
    familyList.innerHTML =
      player.relationships.family.length === 0
        ? "<p>No family relationships yet.</p>"
        : player.relationships.family.map(f => `<p>${f.name}</p>`).join("");
  }

  if (friendsList) {
    friendsList.innerHTML =
      player.relationships.friends.length === 0
        ? "<p>No friends yet.</p>"
        : player.relationships.friends.map(fr => `
            <p>${fr.name} — closeness ${fr.closeness}%</p>
          `).join("");
  }

  if (romanticList) {
    romanticList.innerHTML =
      player.relationships.romantic.length === 0
        ? "<p>No romantic relationships yet.</p>"
        : player.relationships.romantic.map(r => `<p>${r.name}</p>`).join("");
  }

  if (petsList) {
    petsList.innerHTML =
      player.relationships.pets.length === 0
        ? "<p>No pets yet.</p>"
        : player.relationships.pets.map(p => `<p>${p.name}</p>`).join("");
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

  // Generate NPC name if needed
  let npcName = null;
  if (event.text.includes("{name}")) {
    npcName = randomName();
  }

  // Replace placeholder
  const finalText = npcName ? event.text.replace("{name}", npcName) : event.text;
  eventText.textContent = finalText;

  choiceBox.innerHTML = "";

  event.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.onclick = () => applyChoice(choice.effects, npcName);
    choiceBox.appendChild(btn);
  });
}

// Apply choice effects
function applyChoice(effects, npcName = null) {
  for (let stat in effects) {
    if (stat === "addFriend" && npcName) {
      player.relationships.friends.push({
        name: npcName,
        closeness: 50,
        ageMet: player.age
      });
    } else if (player.hasOwnProperty(stat)) {
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
