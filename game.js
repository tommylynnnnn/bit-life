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
  lastName: "",   // family last name ONLY

  relationships: {
    family: [],
    siblings: [],
    friends: [],
    romantic: [],
    pets: [],
    deceased: [],
    classmates: []
  },

  education: {
    grades: {
      math: 50,
      reading: 50,
      science: 50,
      art: 50
    },
    clubs: ["Chess Club", "Art Club", "Band", "Study Club"],
    teachers: []
  }
};

// ------------------------------
// NAME POOLS (gender-correct)
// ------------------------------
const maleFirst = [
  "Liam","Noah","Oliver","Elijah","James","William","Benjamin","Lucas","Henry","Alexander",
  "Mason","Michael","Ethan","Daniel","Jacob","Logan","Jackson","Levi","Sebastian","Mateo",
  "Jayden","Grayson","Wyatt","Carter","Julian","Isaac","Luke","Anthony","Dylan","Lincoln"
];

const femaleFirst = [
  "Emma","Olivia","Ava","Sophia","Isabella","Mia","Charlotte","Amelia","Harper","Evelyn",
  "Abigail","Ella","Elizabeth","Sofia","Avery","Scarlett","Grace","Chloe","Nora","Hazel",
  "Lily","Aria","Ellie","Zoey","Hannah","Lillian","Addison","Aubrey","Stella","Natalie"
];

const lastNames = [
  "Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez",
  "Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin",
  "Lee","Perez","Thompson","White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson",
  "Walker","Young","Allen","King","Wright","Scott","Torres","Nguyen","Hill","Flores"
];

// ------------------------------
// RANDOM NAME (gender-aware)
// ------------------------------
function randomName(gender) {
  const first = gender === "male" ? maleFirst : femaleFirst;
  const f = first[Math.floor(Math.random() * first.length)];
  const l = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${f} ${l}`;
}

// ------------------------------
// RANDOM GENDER
// ------------------------------
function randomGender() {
  return Math.random() < 0.5 ? "male" : "female";
}

// ------------------------------
// EMOJI BASED ON GENDER + AGE
// ------------------------------
function genderEmoji(gender, age) {
  if (age <= 5) return "👶";
  if (age <= 12) return gender === "male" ? "👦" : "👧";
  if (age <= 19) return gender === "male" ? "👨‍🦱" : "👩‍🦱";
  return gender === "male" ? "👨" : "👩";
}

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

// ------------------------------
// START GAME + FAMILY GENERATOR
// ------------------------------
function startGame() {

  function generateFamily() {

    // ------------------------------
    // ASSIGN FAMILY LAST NAME
    // ------------------------------
    player.lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    // Parents
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
        name: randomName("female").split(" ")[0] + " " + player.lastName,
        gender: "female",
        age: momAge,
        emoji: genderEmoji("female", momAge),
        closeness: 80,
        relation: "Mother",
        type: "parent"
      });
    }

    if (hasDad) {
      const dadAge = Math.floor(Math.random() * 15) + 25;
      player.relationships.family.push({
        name: randomName("male").split(" ")[0] + " " + player.lastName,
        gender: "male",
        age: dadAge,
        emoji: genderEmoji("male", dadAge),
        closeness: 80,
        relation: "Father",
        type: "parent"
      });
    }

    // ------------------------------
    // SIBLINGS (0–3) — FIXED + IMPROVED
    // ------------------------------
    const siblingCount = Math.floor(Math.random() * 4);

    for (let i = 0; i < siblingCount; i++) {
      const gender = randomGender();

      // Age difference between -10 and +10 years
      const ageDifference = Math.floor(Math.random() * 21) - 10;
      const siblingAge = Math.max(0, player.age + ageDifference);

      let relation = "";
      if (siblingAge > player.age) relation = gender === "male" ? "Older Brother" : "Older Sister";
      else if (siblingAge < player.age) relation = gender === "male" ? "Younger Brother" : "Younger Sister";
      else relation = gender === "male" ? "Brother" : "Sister";

      player.relationships.siblings.push({
        name: randomName(gender).split(" ")[0] + " " + player.lastName,
        gender: gender,
        age: siblingAge,
        emoji: genderEmoji(gender, siblingAge),
        closeness: 60,
        relation: relation,
        type: "sibling"
      });
    }

    // Pets (50% chance)
    if (Math.random() < 0.5) {
      const petNames = ["Buddy", "Luna", "Max", "Bella", "Charlie", "Milo", "Coco"];
      const pet = petNames[Math.floor(Math.random() * petNames.length)];

      player.relationships.pets.push({
        name: pet,
        gender: randomGender(),
        age: 0,
        emoji: "🐶",
        closeness: 70,
        relation: "Pet",
        type: "pet"
      });
    }
  }

  // Player setup
  const name = document.getElementById("playerNameInput").value.trim();
  const gender = document.getElementById("playerGenderInput").value;

  if (!name) return alert("Please enter a name.");

  // Player DOES NOT get a last name
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
  // ------------------------------
  // HEADER + STATS
  // ------------------------------
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

  // ------------------------------
  // PERSONAL TAB
  // ------------------------------
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

  // ------------------------------
  // EDUCATION
  // ------------------------------
  const schoolLevel = document.getElementById("schoolLevel");
  const classmatesList = document.getElementById("classmatesList");
  const gradesList = document.getElementById("gradesList");
  const clubSelector = document.getElementById("clubSelector");
  const joinedClubs = document.getElementById("joinedClubs");
  const teachersList = document.getElementById("teachersList");

  // SCHOOL LEVEL + CLASSMATES
  if (player.age < 3) {
    schoolLevel.textContent = "Too young for school.";
    classmatesList.innerHTML = "<p>No classmates yet.</p>";

    gradesList.style.display = "none";
    clubSelector.style.display = "none";
    joinedClubs.style.display = "none";
    teachersList.style.display = "none";
  }
  else if (player.age <= 5) {
    schoolLevel.textContent = "Preschool";

    classmatesList.innerHTML = player.relationships.classmates.length === 0
      ? "<p>No classmates yet.</p>"
      : player.relationships.classmates.map((c, index) => `
          <p class="clickablePreschoolClassmate" data-index="${index}">
            ${c.emoji} ${c.name} — age ${c.age}, closeness ${c.closeness}%
          </p>
        `).join("");

    document.querySelectorAll(".clickablePreschoolClassmate").forEach(el => {
      el.addEventListener("click", () => openClassmatePopup(el.dataset.index));
    });

    gradesList.style.display = "none";
    clubSelector.style.display = "none";
    joinedClubs.style.display = "none";
    teachersList.style.display = "none";
  }
  else if (player.age <= 13) {
    schoolLevel.textContent = "Elementary School";

    classmatesList.innerHTML = player.relationships.classmates.length === 0
      ? "<p>No classmates yet.</p>"
      : player.relationships.classmates.map((c, index) => `
          <p class="clickableElementaryClassmate" data-index="${index}">
            ${c.emoji} ${c.name} — age ${c.age}, closeness ${c.closeness}%
          </p>
        `).join("");

    document.querySelectorAll(".clickableElementaryClassmate").forEach(el => {
      el.addEventListener("click", () => openElementaryClassmatePopup(el.dataset.index));
    });

    gradesList.style.display = "block";
    clubSelector.style.display = "block";
    joinedClubs.style.display = "block";
    teachersList.style.display = "block";
  }
  else if (player.age <= 18) {
    schoolLevel.textContent = "High School";
    classmatesList.innerHTML = "<p>High school classmates coming soon.</p>";

    gradesList.style.display = "block";
    clubSelector.style.display = "block";
    joinedClubs.style.display = "block";
    teachersList.style.display = "block";
  }
  else {
    schoolLevel.textContent = "College / University";
    classmatesList.innerHTML = "<p>College classmates coming soon.</p>";

    gradesList.style.display = "block";
    clubSelector.style.display = "block";
    joinedClubs.style.display = "block";
    teachersList.style.display = "block";
  }

  // GRADES
  gradesList.innerHTML = `
    <p>Math: ${player.education.grades.math}%</p>
    <p>Reading: ${player.education.grades.reading}%</p>
    <p>Science: ${player.education.grades.science}%</p>
    <p>Art: ${player.education.grades.art}%</p>
    <button class="popupBtn" onclick="study()">Study</button>
  `;

  // CLUB SELECTOR
  clubSelector.innerHTML = player.education.clubs.map(club => `
    <button class="popupBtn" onclick="joinClub('${club}')">${club}</button>
  `).join("");

  // JOINED CLUBS
  joinedClubs.innerHTML =
    !player.education.joinedClubs || player.education.joinedClubs.length === 0
      ? "<p>You have not joined any clubs yet.</p>"
      : player.education.joinedClubs.map((c, index) => `
          <p class="clickableClub" data-index="${index}">
            ${c.name} — Loyalty: ${c.loyalty}%
          </p>
        `).join("");

  document.querySelectorAll(".clickableClub").forEach(el => {
    el.addEventListener("click", () => openClubPopup(el.dataset.index));
  });

  // TEACHERS
  teachersList.innerHTML =
    player.education.teachers.map(t => `
      <p>${t.subject}: ${t.name}</p>
    `).join("");

  // ------------------------------
  // RELATIONSHIPS LISTS
  // ------------------------------
  const familyList = document.getElementById("familyList");
  const siblingsList = document.getElementById("siblingsList");
  const friendsList = document.getElementById("friendsList");
  const romanticList = document.getElementById("romanticList");
  const petsList = document.getElementById("petsList");
  const deceasedList = document.getElementById("deceasedList");

  if (familyList) {
    familyList.innerHTML =
      player.relationships.family.length === 0
        ? "<p>No parents listed.</p>"
        : player.relationships.family.map((p, index) => `
            <p class="clickableFamily" data-index="${index}">
              ${p.emoji} ${p.relation}: ${p.name} — age ${p.age}, closeness ${p.closeness}%
            </p>
          `).join("");

    document.querySelectorAll(".clickableFamily").forEach(el => {
      el.addEventListener("click", () => openParentPopup(el.dataset.index));
    });
  }

  if (siblingsList) {
    siblingsList.innerHTML =
      player.relationships.siblings.length === 0
        ? "<p>No siblings.</p>"
        : player.relationships.siblings.map((s, index) => `
            <p class="clickableSibling" data-index="${index}">
              ${s.emoji} ${s.relation}: ${s.name} — age ${s.age}, closeness ${s.closeness}%
            </p>
          `).join("");

    document.querySelectorAll(".clickableSibling").forEach(el => {
      el.addEventListener("click", () => openSiblingPopup(el.dataset.index));
    });
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
        : player.relationships.romantic.map((r, index) => `
            <p>${r.emoji} ${r.name}</p>
          `).join("");
  }

  if (petsList) {
    petsList.innerHTML =
      player.relationships.pets.length === 0
        ? "<p>No pets.</p>"
        : player.relationships.pets.map((p, index) => `
            <p class="clickablePet" data-index="${index}">
              ${p.emoji} ${p.name} — age ${p.age}, closeness ${p.closeness}%
            </p>
          `).join("");

    document.querySelectorAll(".clickablePet").forEach(el => {
      el.addEventListener("click", () => openPetPopup(el.dataset.index));
    });
  }

  if (deceasedList) {
    deceasedList.innerHTML =
      player.relationships.deceased.length === 0
        ? "<p>No deceased family members.</p>"
        : player.relationships.deceased.map(d => `
            <p>${d.emoji} ${d.relation}: ${d.name} — died at ${d.age}</p>
          `).join("");
  }

  // ------------------------------
  // SUBTAB BUTTONS
  // ------------------------------
  document.querySelectorAll(".subtabBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".subtab").forEach(s => s.classList.remove("active"));
      const target = document.getElementById("edu-" + btn.dataset.subtab);
      if (target) target.classList.add("active");
    });
  });
}

// ------------------------------
// POPUP SYSTEM (PARENTS)
// ------------------------------
function openParentPopup(index) {
  const p = player.relationships.family[index];

  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>${p.emoji} ${p.relation}: ${p.name}</h2>
      <p>Age: ${p.age}</p>
      <p>Closeness: ${p.closeness}%</p>

      <button class="popupBtn" onclick="parentInteract(${index}, 'talk')">Talk To</button>
      <button class="popupBtn" onclick="parentInteract(${index}, 'hug')">Hug</button>
      <button class="popupBtn" onclick="parentInteract(${index}, 'spend')">Spend Time</button>
      <button class="popupBtn" onclick="parentInteract(${index}, 'advice')">Ask for Advice</button>

      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;

  popup.style.display = "flex";
}

function parentInteract(index, type) {
  const p = player.relationships.family[index];
  let result = "";
  let change = 0;

  if (type === "talk") {
    change = Math.floor(Math.random() * 6) + 2;
    result = `You had a conversation with ${p.name}.`;
  }

  if (type === "hug") {
    change = Math.floor(Math.random() * 8) + 3;
    result = `You hugged ${p.name}.`;
  }

  if (type === "spend") {
    change = Math.floor(Math.random() * 10) + 4;
    result = `You spent quality time with ${p.name}.`;
  }

  if (type === "advice") {
    change = Math.floor(Math.random() * 5) + 1;
    result = `${p.name} gave you advice.`;
  }

  p.closeness = clamp(p.closeness + change);

  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>${p.emoji} ${p.relation}: ${p.name}</h2>
      <p>${result}</p>
      <p>Closeness is now ${p.closeness}%</p>
      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;

  updateUI();
}

// ------------------------------
// POPUP SYSTEM (SIBLINGS)
// ------------------------------
function openSiblingPopup(index) {
  const s = player.relationships.siblings[index];

  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>${s.emoji} ${s.relation}: ${s.name}</h2>
      <p>Age: ${s.age}</p>
      <p>Closeness: ${s.closeness}%</p>

      <button class="popupBtn" onclick="siblingInteract(${index}, 'play')">Play</button>
      <button class="popupBtn" onclick="siblingInteract(${index}, 'joke')">Joke Around</button>
      <button class="popupBtn" onclick="siblingInteract(${index}, 'compliment')">Compliment</button>
      <button class="popupBtn" onclick="siblingInteract(${index}, 'insult')">Insult</button>
      <button class="popupBtn" onclick="siblingInteract(${index}, 'bond')">Bond</button>
      <button class="popupBtn" onclick="siblingInteract(${index}, 'fight')">Fight</button>

      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;

  popup.style.display = "flex";
}

function siblingInteract(index, type) {
  const s = player.relationships.siblings[index];
  let result = "";
  let change = 0;

  if (type === "play") {
    change = Math.floor(Math.random() * 10) + 3;
    result = `You played with ${s.name}.`;
  }

  if (type === "joke") {
    change = Math.floor(Math.random() * 8) + 2;
    result = `You joked around with ${s.name}.`;
  }

  if (type === "compliment") {
    change = Math.floor(Math.random() * 6) + 2;
    result = `You complimented ${s.name}.`;
  }

  if (type === "insult") {
    change = -(Math.floor(Math.random() * 10) + 5);
    result = `You insulted ${s.name}.`;
  }

  if (type === "bond") {
    change = Math.floor(Math.random() * 12) + 4;
    result = `You bonded with ${s.name}.`;
  }

  if (type === "fight") {
    change = -(Math.floor(Math.random() * 15) + 5);
    result = `You fought with ${s.name}.`;
  }

  s.closeness = clamp(s.closeness + change);

  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>${s.emoji} ${s.relation}: ${s.name}</h2>
      <p>${result}</p>
      <p>Closeness is now ${s.closeness}%</p>
      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;

  updateUI();
}

// ------------------------------
// POPUP SYSTEM (PETS)
// ------------------------------
function openPetPopup(index) {
  const p = player.relationships.pets[index];

  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>${p.emoji} ${p.name}</h2>
      <p>Age: ${p.age}</p>
      <p>Closeness: ${p.closeness}%</p>

      <button class="popupBtn" onclick="petInteract(${index}, 'play')">Play</button>
      <button class="popupBtn" onclick="petInteract(${index}, 'outside')">Take Outside</button>

      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;

  popup.style.display = "flex";
}

function petInteract(index, type) {
  const p = player.relationships.pets[index];
  let result = "";
  let change = 0;

  if (type === "play") {
    change = Math.floor(Math.random() * 10) + 3;
    result = `You played with ${p.name}.`;
  }

  if (type === "outside") {
    change = Math.floor(Math.random() * 8) + 2;
    result = `You took ${p.name} outside.`;
  }

  p.closeness = clamp(p.closeness + change);

  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>${p.emoji} ${p.name}</h2>
      <p>${result}</p>
      <p>Closeness is now ${p.closeness}%</p>
      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;

  updateUI();
}

// ------------------------------
// FRIEND POPUP (unchanged)
// ------------------------------
function interact(index, type) {
  const fr = player.relationships.friends[index];
  let result = "";
  let change = 0;

  if (type === "hangout") {
    change = Math.floor(Math.random() * 10) + 3;
    result = `You hung out with ${fr.name}.`;
  }

  if (type === "talk") {
    change = Math.floor(Math.random() * 6) + 2;
    result = `You talked with ${fr.name}.`;
  }

  if (type === "play") {
    change = Math.floor(Math.random() * 8) + 3;
    result = `You played with ${fr.name}.`;
  }

  if (type === "study") {
    change = Math.floor(Math.random() * 5) + 1;
    result = `You studied with ${fr.name}.`;
  }

  if (type === "party") {
    change = Math.floor(Math.random() * 12) + 4;
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

// ------------------------------
// DEATH SYSTEM
// ------------------------------
function checkDeaths() {
  // PLAYER DEATH
  if (player.age > 65) {
    const chance = (player.age - 65) * 0.02; // 2% per year past 65
    if (Math.random() < chance) {
      showGameOver();
      return;
    }
  }

  // PARENTS
  player.relationships.family = player.relationships.family.filter(p => {
    if (p.age > 65 && Math.random() < (p.age - 65) * 0.03) {
      showDeathPopup(p);
      moveToDeceased(p);
      return false;
    }
    return true;
  });

  // SIBLINGS
  player.relationships.siblings = player.relationships.siblings.filter(s => {
    if (s.age > 65 && Math.random() < (s.age - 65) * 0.02) {
      showDeathPopup(s);
      moveToDeceased(s);
      return false;
    }
    return true;
  });

  // PETS
  player.relationships.pets = player.relationships.pets.filter(p => {
    if (p.age > 12 && Math.random() < (p.age - 12) * 0.05) {
      showDeathPopup(p);
      moveToDeceased(p);
      return false;
    }
    return true;
  });
}

function moveToDeceased(person) {
  player.relationships.deceased.push({
    name: person.name,
    relation: person.relation,
    emoji: person.emoji,
    age: person.age
  });
}

function showDeathPopup(person) {
  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>${person.emoji} ${person.name}</h2>
      <p>${person.relation} has passed away at age ${person.age}.</p>
      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;
  popup.style.display = "flex";
}

function showGameOver() {
  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>💀 You Have Died</h2>
      <p>You passed away at age ${player.age}.</p>
      <p>Your life has come to an end.</p>
    </div>
  `;
  popup.style.display = "flex";

  // Freeze game
  document.getElementById("ageBtn").disabled = true;
}

// ------------------------------
// AGE UP
// ------------------------------
function applyChoice(effects, npcName = null) {
  for (let stat in effects) {

    // Add friend event
    if (stat === "addFriend" && npcName) {
      const gender = randomGender();
      player.relationships.friends.push({
        name: npcName,
        gender: gender,
        age: player.age,
        emoji: genderEmoji(gender, player.age),
        closeness: 50
      });
      continue;
    }

    // Normal stat changes
    if (player.hasOwnProperty(stat)) {
      player[stat] = clamp(player[stat] + effects[stat]);
    }
  }

  document.getElementById("choices").innerHTML = "";
  document.getElementById("eventText").textContent = "You made your choice.";
  updateUI();
}

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

  let npcName = null;
  if (event.text.includes("{name}")) {
    npcName = randomName();
  }

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

function ageUp() {
  player.age++;
  player.emoji = genderEmoji(player.gender, player.age);

  // Age family
  player.relationships.family.forEach(p => {
    p.age++;
    p.emoji = genderEmoji(p.gender, p.age);
  });

  // Age siblings
  player.relationships.siblings.forEach(s => {
    s.age++;
    s.emoji = genderEmoji(s.gender, s.age);
  });

  // Age friends
  player.relationships.friends.forEach(fr => {
    fr.age++;
    fr.emoji = genderEmoji(fr.gender, fr.age);
    fr.closeness = clamp(fr.closeness - Math.floor(Math.random() * 4));
  });

  // Age pets
  player.relationships.pets.forEach(p => {
    p.age++;
  });

  player.relationships.classmates.forEach(c => {
  c.age++;
  c.emoji = genderEmoji(c.gender, c.age);
});
  
    if (player.age === 3) {
  generatePreschoolClassmates();
}
  if (player.age === 6) {
  player.relationships.classmates = [];
}
  if (player.age === 6) {
  generateElementaryClassmates();
  generateTeachers();
  generateClubs();
}

  checkDeaths();
  runEvent();
  updateUI();
}

// ------------------------------
// CLOSE POPUP
// ------------------------------
// ------------------------------
// POPUP CLOSE
// ------------------------------
function closePopup() {
  document.getElementById("popup").style.display = "none";
}

// ------------------------------
// PRESCHOOL CLASSMATES
// ------------------------------
function generatePreschoolClassmates() {
  const count = Math.floor(Math.random() * 7) + 7; // 7–13 classmates

  player.relationships.classmates = [];

  for (let i = 0; i < count; i++) {
    const gender = randomGender();
    const age = Math.floor(Math.random() * 3) + 3; // ages 3–5

    player.relationships.classmates.push({
      name: randomName(),
      gender: gender,
      age: age,
      emoji: genderEmoji(gender, age),
      closeness: Math.floor(Math.random() * 40) + 20,
      type: "classmate"
    });
  }
}

// ------------------------------
// ELEMENTARY CLASSMATE GENERATOR
// ------------------------------
function generateElementaryClassmates() {
  const count = Math.floor(Math.random() * 6) + 10; // 10–15 classmates

  player.relationships.classmates = [];

  for (let i = 0; i < count; i++) {
    const gender = randomGender();
    const age = Math.floor(Math.random() * 3) + 6; // ages 6–8

    player.relationships.classmates.push({
      name: randomName(),
      gender: gender,
      age: age,
      emoji: genderEmoji(gender, age),
      closeness: Math.floor(Math.random() * 40) + 20,
      type: "classmate"
    });
  }
}

// ------------------------------
// TEACHER GENERATOR
// ------------------------------
function generateTeachers() {
  const teacherNames = ["Ms. Carter", "Mr. Lopez", "Mrs. Singh", "Mr. Brown", "Ms. Nguyen"];

  player.education.teachers = [
    { subject: "Math", name: teacherNames[Math.floor(Math.random() * teacherNames.length)] },
    { subject: "Reading", name: teacherNames[Math.floor(Math.random() * teacherNames.length)] },
    { subject: "Science", name: teacherNames[Math.floor(Math.random() * teacherNames.length)] },
    { subject: "Art", name: teacherNames[Math.floor(Math.random() * teacherNames.length)] }
  ];
}

// ------------------------------
// CLUB GENERATOR
// ------------------------------
function generateClubs() {
  const possibleClubs = ["Chess Club", "Art Club", "Study Club", "Band"];
  const count = Math.floor(Math.random() * 3) + 2; // 2–4 clubs

  player.education.clubs = []; // reset available clubs
  player.education.joinedClubs = []; // clubs the player actually joins

  for (let i = 0; i < count; i++) {
    const club = possibleClubs[Math.floor(Math.random() * possibleClubs.length)];
    if (!player.education.clubs.includes(club)) {
      player.education.clubs.push(club);
    }
  }
}

// ------------------------------
// PRESCHOOL POPUP
// ------------------------------
function openClassmatePopup(index) {
  const c = player.relationships.classmates[index];

  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>${c.emoji} ${c.name}</h2>
      <p>Age: ${c.age}</p>
      <p>Closeness: ${c.closeness}%</p>

      <button class="popupBtn" onclick="classmateInteract(${index})">Arrange Playdate</button>

      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;

  popup.style.display = "flex";
}

function classmateInteract(index) {
  const c = player.relationships.classmates[index];

  const change = Math.floor(Math.random() * 10) + 5;
  c.closeness = clamp(c.closeness + change);

  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>${c.emoji} ${c.name}</h2>
      <p>You arranged a playdate with ${c.name}.</p>
      <p>Closeness is now ${c.closeness}%</p>
      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;

  updateUI();
}

// ------------------------------
// ELEMENTARY POPUP
// ------------------------------
function openElementaryClassmatePopup(index) {
  const c = player.relationships.classmates[index];

  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>${c.emoji} ${c.name}</h2>
      <p>Age: ${c.age}</p>
      <p>Closeness: ${c.closeness}%</p>

      <button class="popupBtn" onclick="elementaryInteract(${index}, 'hangout')">Hang Out</button>
      <button class="popupBtn" onclick="elementaryInteract(${index}, 'recess')">Play at Recess</button>
      <button class="popupBtn" onclick="elementaryInteract(${index}, 'study')">Study Together</button>
      <button class="popupBtn" onclick="elementaryInteract(${index}, 'project')">Work on a Project</button>
      <button class="popupBtn" onclick="elementaryInteract(${index}, 'lunch')">Sit Together at Lunch</button>

      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;

  popup.style.display = "flex";
}

function elementaryInteract(index, type) {
  const c = player.relationships.classmates[index];
  let result = "";
  let change = 0;

  if (type === "hangout") {
    change = Math.floor(Math.random() * 10) + 5;
    result = `You hung out with ${c.name}.`;
  }

  if (type === "recess") {
    change = Math.floor(Math.random() * 12) + 4;
    result = `You played at recess with ${c.name}.`;
  }

  if (type === "study") {
    change = Math.floor(Math.random() * 8) + 3;
    result = `You studied together with ${c.name}.`;
  }

  c.closeness = clamp(c.closeness + change);

  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>${c.emoji} ${c.name}</h2>
      <p>${result}</p>
      <p>Closeness is now ${c.closeness}%</p>
      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;

  updateUI();
}

function joinClub(clubName) {
  // Add to joined clubs
  player.education.joinedClubs.push({
    name: clubName,
    loyalty: 50
  });

  // Remove from available clubs
  player.education.clubs = player.education.clubs.filter(c => c !== clubName);

  updateUI();
}

function openClubPopup(index) {
  const c = player.education.joinedClubs[index];

  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>${c.name}</h2>
      <p>Loyalty: ${c.loyalty}%</p>

      <button class="popupBtn" onclick="clubInteract(${index}, 'attend')">Attend Meeting</button>
      <button class="popupBtn" onclick="clubInteract(${index}, 'spirit')">Show Spirit</button>

      ${c.loyalty >= 70 ? `<button class="popupBtn" onclick="clubInteract(${index}, 'lead')">Become Club Head</button>` : ""}

      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;

  popup.style.display = "flex";
}

function quitClub(index) {
  const club = player.education.joinedClubs[index];

  // Put it back into available clubs
  player.education.clubs.push(club.name);

  // Remove from joined list
  player.education.joinedClubs.splice(index, 1);

  updateUI();
}

function clubInteract(index, type) {
  const c = player.education.joinedClubs[index];
  let result = "";
  let change = 0;

  if (type === "attend") {
    change = Math.floor(Math.random() * 8) + 3;
    result = `You attended a meeting for ${c.name}.`;
  }

  if (type === "spirit") {
    change = Math.floor(Math.random() * 6) + 2;
    result = `You showed spirit for ${c.name}.`;
  }

  if (type === "lead") {
    result = `You became the head of ${c.name}!`;
    change = 20;
  }

  c.loyalty = clamp(c.loyalty + change);

  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>${c.name}</h2>
      <p>${result}</p>
      <p>Loyalty is now ${c.loyalty}%</p>
      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;

  updateUI();
}

function study() {
  const subjects = ["math", "reading", "science", "art"];
  const subject = subjects[Math.floor(Math.random() * subjects.length)];

  const gain = Math.floor(Math.random() * 6) + 3;
  player.education.grades[subject] = clamp(player.education.grades[subject] + gain);

  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>📚 Studied</h2>
      <p>You studied ${subject}.</p>
      <p>Your ${subject} grade increased by ${gain}%!</p>
      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;
  popup.style.display = "flex";

  updateUI();
}
// ------------------------------
// TABS + AGE BUTTON
// ------------------------------
window.onload = () => {
  document.querySelectorAll(".tabBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });

  document.getElementById("ageBtn").addEventListener("click", ageUp);

  loadEvents().then(updateUI);
};
