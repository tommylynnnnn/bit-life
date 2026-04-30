let player = {
  age: 0,
  happiness: 50,
  smarts: 50,
  health: 50,
  looks: 50,
  money: 0,

  name: "",
  gender: "",
  emoji: "",

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

// Random gender generator
function randomGender() {
  return Math.random() < 0.5 ? "male" : "female";
}

// Avatar emoji based on gender + age
function genderEmoji(gender, age) {
  if (age <= 5) return "👶";
  if (age <= 12) return gender === "male" ? "👦" : "👧";
  if (age <= 19) return "🧑";
  return gender === "male" ? "👨" : "👩";
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

// ------------------------------
// START GAME + FAMILY GENERATOR
// ------------------------------
function startGame() {

  function generateFamily() {
    const roll = Math.random();
    let hasMom = false;
    let hasDad = false;

    if (roll < 0.33) {
      hasMom = true;
      hasDad = true;
    } else if (roll < 0.66) {
      hasMom = true;
    } else {
      hasDad = true;
    }

    if (hasMom) {
      const momAge = Math.floor(Math.random() * 15) + 25;
      player.relationships.family.push({
        name: randomName(),
        gender: "female",
        age: momAge,
        emoji: genderEmoji("female", momAge),
        closeness: 80,
        relation: "Mother"
      });
    }

    if (hasDad) {
      const dadAge = Math.floor(Math.random() * 15) + 25;
      player.relationships.family.push({
        name: randomName(),
        gender: "male",
        age: dadAge,
        emoji: genderEmoji("male", dadAge),
        closeness: 80,
        relation: "Father"
      });
    }

    if (Math.random() < 0.5) {
      const petNames = ["Buddy", "Luna", "Max", "Bella", "Charlie", "Milo", "Coco"];
      const pet = petNames[Math.floor(Math.random() * petNames.length)];

      player.relationships.pets.push({
        name: pet,
        gender: randomGender(),
        age: 0,
        emoji: "🐶",
        closeness: 70,
        relation: "Pet"
      });
    }
  }

  const name = document.getElementById("playerNameInput").value.trim();
  const gender = document.getElementById("playerGenderInput").value;

  if (!name) return alert("Please enter a name.");

  player.name = name;
  player.gender = gender;
  player.emoji = genderEmoji(gender, player.age);

  generateFamily();

  document.getElementById("startScreen").style.display = "none";
  updateUI();
}

// ------------------------------
// UPDATE UI
// ------------------------------
function updateUI() {
  const header = document.getElementById("playerHeader");
  if (header) header.textContent = player.name ? `${player.emoji} ${player.name}` : "";

  const ageLabel = document.getElementById("ageLabel");
  if (ageLabel) ageLabel.textContent = `Age: ${player.age} years`;

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

  const familyList = document.getElementById("familyList");
  const friendsList = document.getElementById("friendsList");
  const romanticList = document.getElementById("romanticList");
  const petsList = document.getElementById("petsList");

  if (familyList) {
    familyList.innerHTML =
      player.relationships.family.length === 0
        ? "<p>No family relationships yet.</p>"
        : player.relationships.family.map(f => `
            <p>${f.emoji} ${f.relation}: ${f.name} — age ${f.age}, closeness ${f.closeness}%</p>
          `).join("");
  }

  if (friendsList) {
    friendsList.innerHTML =
      player.relationships.friends.length === 0
        ? "<p>No friends yet.</p>"
        : player.relationships.friends.map((fr, index) => `
            <p class="clickableFriend" data-index="${index}">
              ${fr.emoji} ${fr.name} — age ${fr.age}, closeness ${fr.closeness}%
            </p>
          `).join("");

    document.querySelectorAll(".clickableFriend").forEach(el => {
      el.addEventListener("click", () => openFriendPopup(el.dataset.index));
    });
  }

  if (romanticList) {
    romanticList.innerHTML =
      player.relationships.romantic.length === 0
        ? "<p>No romantic relationships yet.</p>"
        : player.relationships.romantic.map(r => `<p>${r.emoji} ${r.name}</p>`).join("");
  }

  if (petsList) {
    petsList.innerHTML =
      player.relationships.pets.length === 0
        ? "<p>No pets yet.</p>"
        : player.relationships.pets.map(p => `
            <p>${p.emoji} ${p.name} — age ${p.age}, closeness ${p.closeness}%</p>
          `).join("");
  }
}

// ------------------------------
// AGE UP
// ------------------------------
function ageUp() {
  player.age++;
  player.emoji = genderEmoji(player.gender, player.age);

  player.relationships.friends.forEach(fr => {
    fr.age++;
    fr.emoji = genderEmoji(fr.gender, fr.age);
    fr.closeness = clamp(fr.closeness - Math.floor(Math.random() * 4));
  });

  player.relationships.family.forEach(f => {
    f.age++;
    f.emoji = genderEmoji(f.gender, f.age);
  });

  player.relationships.pets.forEach(p => {
    p.age++;
  });

  runEvent();
  updateUI();
}

// ------------------------------
// EVENTS
// ------------------------------
function runEvent() {
  const possible = events.filter(e => player.age >= e.ageRange[0] && player.age <= e.ageRange[1]);

  const eventText = document.getElementById("eventText");
  const choiceBox = document.getElementById("choices");

  if (possible.length === 0) {
    eventText.textContent = "Nothing special happened this year.";
    choiceBox.innerHTML = "";
    return;
  }

  const event = possible[Math.floor(Math.random() * possible.length)];

  let npcName = null;
  if (event.text.includes("{name}")) npcName = randomName();

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

// ------------------------------
// APPLY CHOICE
// ------------------------------
function applyChoice(effects, npcName = null) {
  for (let stat in effects) {
    if (stat === "addFriend" && npcName) {
      const gender = randomGender();
      player.relationships.friends.push({
        name: npcName,
        gender: gender,
        age: player.age,
        emoji: genderEmoji(gender, player.age),
        closeness: 50
      });
    } else if (player.hasOwnProperty(stat)) {
      player[stat] += effects[stat];
    }
  }

  document.getElementById("choices").innerHTML = "";
  document.getElementById("eventText").textContent = "You made your choice.";
  updateUI();
}

// ------------------------------
// POPUP SYSTEM
// ------------------------------
function openFriendPopup(index) {
  const fr = player.relationships.friends[index];

  let buttons = `
    <button class="popupBtn" onclick="interact(${index}, 'hangout')">Hang Out</button>
    <button class="popupBtn" onclick="interact(${index}, 'talk')">Talk To</button>
  `;

  if (player.age <= 12) buttons += `<button class="popupBtn" onclick="interact(${index}, 'play')">Play</button>`;
  if (player.age >= 10) buttons += `<button class="popupBtn" onclick="interact(${index}, 'study')">Study</button>`;
  if (player.age >= 16) buttons += `<button class="popupBtn" onclick="interact(${index}, 'party')">Party</button>`;

  buttons += `<button class="popupBtn popupClose" onclick="closePopup()">Close</button>`;

  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>${fr.emoji} ${fr.name}</h2>
      <p>Age: ${fr.age}</p>
      <p>Closeness: ${fr.closeness}%</p>
      ${buttons}
    </div>
  `;

  popup.style.display = "flex";
}

function interact(index, type) {
  const fr = player.relationships.friends[index];

  let result = "";
  let change = 0;

  if (type === "hangout") {
    change = Math.floor(Math.random() * 10) + 1;
    result = `You hung out with ${fr.name}. It went well!`;
  }

  if (type === "talk") {
    change = Math.floor(Math.random() * 6) + 1;
    result = `You had a nice conversation with ${fr.name}.`;
  }

  if (type === "play" && player.age <= 12) {
    change = Math.floor(Math.random() * 12) + 3;
    result = `You played games with ${fr.name}.`;
  }

  if (type === "study" && player.age >= 10) {
    change = Math.floor(Math.random() * 8) + 2;
    result = `You studied together with ${fr.name}.`;
  }

  if (type === "party" && player.age >= 16) {
    change = Math.floor(Math.random() * 15) + 5;
    result = `You partied with ${fr.name}.`;
  }

  fr.closeness = clamp(fr.closeness + change);

  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>${fr.emoji} ${fr.name}</h2>
      <p>${result}</p>
      <p>Closeness is now ${fr.closeness}%</p>
      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;

  updateUI();
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

// ------------------------------
// TABS + AGE BUTTON
// ------------------------------
document.querySelectorAll(".tabBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

document.getElementById("ageBtn").addEventListener("click", ageUp);

// Start game
loadEvents().then(updateUI);
