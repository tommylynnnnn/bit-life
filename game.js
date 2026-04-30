let player = {
  age: 0,
  happiness: 50,
  smarts: 50,
  health: 50,
  money: 0
};

let events = [];

// Load base events + DLC later
async function loadEvents() {
  const base = await fetch("data/events.json").then(r => r.json());
  events = [...base];
}

function updateUI() {
  document.getElementById("ageStat").textContent = "Age: " + player.age;
  document.getElementById("moneyStat").textContent = "$" + player.money;

  document.getElementById("personal").innerHTML = `
    <p>Happiness: ${player.happiness}</p>
    <p>Smarts: ${player.smarts}</p>
    <p>Health: ${player.health}</p>
    <p>Money: $${player.money}</p>
  `;
}

function ageUp() {
  player.age++;
  runEvent();
  updateUI();
}

function runEvent() {
  const possible = events.filter(e => {
    return player.age >= e.ageRange[0] && player.age <= e.ageRange[1];
  });

  if (possible.length === 0) {
    document.getElementById("eventText").textContent = "Nothing special happened this year.";
    document.getElementById("choices").innerHTML = "";
    return;
  }

  const event = possible[Math.floor(Math.random() * possible.length)];

  document.getElementById("eventText").textContent = event.text;

  const choiceBox = document.getElementById("choices");
  choiceBox.innerHTML = "";

  event.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.onclick = () => applyChoice(choice.effects);
    choiceBox.appendChild(btn);
  });
}

function applyChoice(effects) {
  for (let stat in effects) {
    player[stat] += effects[stat];
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
