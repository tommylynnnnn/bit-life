const jobOpenings = [
  {
    name: "🍔 Fast Food Worker",
    minAge: 16,
    smarts: 20,
    happiness: 0,
    salary: 20000
  },
  {
    name: "🛒 Retail Employee",
    minAge: 16,
    smarts: 25,
    happiness: 0,
    salary: 24000
  },
  {
    name: "💻 Junior Developer",
    minAge: 18,
    smarts: 70,
    happiness: 0,
    salary: 60000
  },
  {
    name: "🏥 Doctor",
    minAge: 26,
    smarts: 90,
    happiness: 10,
    salary: 120000
  },
  {
    name: "🎨 Artist",
    minAge: 18,
    smarts: 40,
    happiness: 20,
    salary: 35000
  }
];

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

  activities: {
  exercise: ["🚶 Go for a walk", "🤸 Do jumping jacks", "🏋️ Stretch"],
  fun: ["🎮 Play a game", "📺 Watch a show", "✏️ Draw something"],
  misc: ["🧹 Clean your room", "🗃️ Organize your desk", "🧘 Meditate", "✈️ Go on a vacation"]
},

  education: {
    grades: {
      math: 50,
      reading: 50,
      science: 50,
      art: 50
    },
    clubs: ["Chess Club", "Art Club", "Band", "Study Club"],
    joinedClubs: [],   // ⭐⭐ REQUIRED ⭐⭐
    teachers: []
  }
};


// ------------------------------
// RANDOM STARTING STATS
// ------------------------------
function generateStartingStats() {
  player.happiness = Math.floor(Math.random() * 31) + 35;
  player.smarts = Math.floor(Math.random() * 31) + 35;
  player.health = Math.floor(Math.random() * 31) + 35;
  player.looks = Math.floor(Math.random() * 31) + 35;
}

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

let currentJob = null;

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

let eventQueue = [];
let showingEvent = false;

let yearEvents = [
  {
    text: "🎉 A new school year begins! You feel a fresh start.",
    choices: [
      { text: "Work harder this year", effects: { smarts: 5, happiness: 2 } },
      { text: "Take it easy", effects: { happiness: 5 } },
      { text: "Try to become popular", effects: { looks: 3, happiness: 3 } }
    ]
  },
  {
    text: "📢 A school announcement: clubs are recruiting heavily this year.",
    choices: [
      { text: "Join more clubs", effects: { smarts: 3 } },
      { text: "Ignore clubs", effects: { happiness: -2 } }
    ]
  },
  {
    text: "💬 You feel like your life might change this year.",
    choices: [
      { text: "Set personal goals", effects: { smarts: 2, happiness: 2 } },
      { text: "Go with the flow", effects: { happiness: 3 } }
    ]
  }
];

const clubEvents = {
  "Art Club": [
    {
      text: "Your art club is hosting an Art Fair. Do you participate?",
      choices: [
        { text: "Showcase your best artwork", effects: { loyalty: 10, happiness: 5, looks: 3 } },
        { text: "Help organize the event", effects: { loyalty: 8, smarts: 3 } },
        { text: "Skip it", effects: { loyalty: -5 } }
      ]
    },
    {
      text: "The club is doing a group painting session.",
      choices: [
        { text: "Lead the session", effects: { loyalty: 12, smarts: 2 } },
        { text: "Paint quietly", effects: { loyalty: 6, happiness: 4 } },
        { text: "Mess around", effects: { loyalty: -6, happiness: 3 } }
      ]
    }
  ],

  "Chess Club": [
    {
      text: "There’s a school chess tournament coming up.",
      choices: [
        { text: "Train intensely", effects: { loyalty: 10, smarts: 5, happiness: -3 } },
        { text: "Play casually", effects: { loyalty: 6, smarts: 2 } },
        { text: "Skip practice", effects: { loyalty: -5 } }
      ]
    },
    {
      text: "You’re matched against the club’s best player.",
      choices: [
        { text: "Play aggressively", effects: { loyalty: 8, smarts: 3 } },
        { text: "Play defensively", effects: { loyalty: 6, smarts: 2 } },
        { text: "Panic and blunder", effects: { loyalty: -6, happiness: -2 } }
      ]
    },
    {
      text: "A rival school challenges your club.",
      choices: [
        { text: "Accept the challenge", effects: { loyalty: 12, smarts: 4 } },
        { text: "Let others handle it", effects: { loyalty: 3 } }
      ]
    }
  ],

  "Band": [
    {
      text: "Your band is preparing for a school performance.",
      choices: [
        { text: "Practice hard", effects: { loyalty: 10, happiness: 4 } },
        { text: "Just go with the flow", effects: { loyalty: 5 } },
        { text: "Skip rehearsal", effects: { loyalty: -6 } }
      ]
    },
    {
      text: "You have a solo during a performance.",
      choices: [
        { text: "Play confidently", effects: { loyalty: 12, happiness: 6 } },
        { text: "Play nervously", effects: { loyalty: 5 } },
        { text: "Mess up badly", effects: { loyalty: -8, happiness: -4 } }
      ]
    },
    {
      text: "The band is arguing about song choice.",
      choices: [
        { text: "Help settle the argument", effects: { loyalty: 9, smarts: 2 } },
        { text: "Stay out of it", effects: { loyalty: 3 } },
        { text: "Make things worse", effects: { loyalty: -7 } }
      ]
    }
  ],

  "Study Club": [
    {
      text: "A big exam is coming up.",
      choices: [
        { text: "Lead a study session", effects: { loyalty: 10, smarts: 5 } },
        { text: "Study quietly", effects: { loyalty: 6, smarts: 3 } },
        { text: "Slack off", effects: { loyalty: -6 } }
      ]
    },
    {
      text: "Someone asks you for help understanding a topic.",
      choices: [
        { text: "Help them patiently", effects: { loyalty: 9, happiness: 3 } },
        { text: "Give quick answers", effects: { loyalty: 4 } },
        { text: "Ignore them", effects: { loyalty: -5 } }
      ]
    },
    {
      text: "The group is struggling with a difficult assignment.",
      choices: [
        { text: "Work together to solve it", effects: { loyalty: 10, smarts: 4 } },
        { text: "Do your own part only", effects: { loyalty: 5 } },
        { text: "Let others do the work", effects: { loyalty: -7 } }
      ]
    }
  ]
};

const jobEvents = {
  "🍔 Fast Food Worker": [
    {
      text: "A rush hits the restaurant. Everything is chaos.",
      choices: [
        { text: "Work faster", effects: { money: 20, happiness: -2 } },
        { text: "Stay calm and steady", effects: { money: 10 } },
        { text: "Hide in the back for a bit", effects: { happiness: 5, money: -10 } }
      ]
    },
    {
      text: "A customer complains about their order.",
      choices: [
        { text: "Fix it politely", effects: { happiness: 3, money: 10 } },
        { text: "Ignore them", effects: { happiness: -5 } }
      ]
    }
  ],

  "🛒 Retail Employee": [
    {
      text: "The store is understaffed today.",
      choices: [
        { text: "Help extra customers", effects: { money: 15, happiness: 2 } },
        { text: "Do only your section", effects: { happiness: -2 } }
      ]
    }
  ],

  "💻 Junior Developer": [
    {
      text: "A bug breaks the entire system.",
      choices: [
        { text: "Fix it quickly", effects: { smarts: 2, money: 40 } },
        { text: "Ask for help", effects: { happiness: 2 } }
      ]
    }
  ],

  "🏥 Doctor": [
    {
      text: "A difficult patient arrives.",
      choices: [
        { text: "Stay professional", effects: { happiness: 2, money: 80 } },
        { text: "Take extra time with them", effects: { happiness: 5 } }
      ]
    }
  ],

  "🎨 Artist": [
    {
      text: "You’re offered a small commission.",
      choices: [
        { text: "Accept it", effects: { money: 50, happiness: 3 } },
        { text: "Decline and rest", effects: { happiness: 5 } }
      ]
    }
  ]
};

// Load base events + DLC later
async function loadEvents() {
  const base = await fetch("data/events.json").then(r => r.json());
  events = [...base];
}

// Clamp stats between 0–100
function clamp(val) {
  return Math.max(0, Math.min(100, val));
}

function runYearEvents() {
  const event = yearEvents[Math.floor(Math.random() * yearEvents.length)];
  eventQueue.push(event);

  if (!showingEvent) {
    showNextEvent();
  }
}

function showNextEvent() {
  if (eventQueue.length === 0) {
    showingEvent = false;
    return;
  }

  showingEvent = true;

  const event = eventQueue.shift();
  const popup = document.getElementById("popup");

  popup.innerHTML = `
    <div class="popupCard">
      <h2>📅 New Year Event</h2>
      <p>${event.text}</p>
      <div id="yearChoices"></div>
    </div>
  `;

  const choiceBox = document.getElementById("yearChoices");

  event.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "popupBtn";
    btn.textContent = choice.text;

    btn.onclick = () => {
      applyChoice(choice.effects);

      popup.innerHTML = `
        <div class="popupCard">
          <h2>📅 Event Complete</h2>
          <p>You chose: ${choice.text}</p>
          <button class="popupBtn popupClose" onclick="closeAndContinue()">Close</button>
        </div>
      `;
    };

    choiceBox.appendChild(btn);
  });

  popup.style.display = "flex";
}

function closeAndContinue() {
  closePopup();
  showNextEvent();
}

function processYearlyIncome() {
  if (currentJob) {
    player.money += currentJob.salary;
  }

  // optional: trigger job event like clubs
  if (currentJob && Math.random() < 0.6) {
    openJobEvent();
  }
}

// ------------------------------
// START GAME + FAMILY GENERATOR
// ------------------------------
function startGame() {
  generateStartingStats();

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
  const first = femaleFirst[Math.floor(Math.random() * femaleFirst.length)];

  player.relationships.family.push({
    name: first + " " + player.lastName,
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
renderJobs(); // ← REQUIRED

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

  classmatesList.innerHTML =
    player.relationships.classmates.length === 0
      ? "<p>No classmates yet.</p>"
      : player.relationships.classmates.map((c, index) => `
          <p class="clickableHighSchoolClassmate" data-index="${index}">
            ${c.emoji} ${c.name} — age ${c.age}, closeness ${c.closeness}%
          </p>
        `).join("");

  document.querySelectorAll(".clickableHighSchoolClassmate").forEach(el => {
    el.addEventListener("click", () => openHighSchoolClassmatePopup(el.dataset.index));
  });

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
  player.education.joinedClubs.length === 0
    ? "<p>You have not joined any clubs yet.</p>"
    : player.education.joinedClubs.map((c, index) => `
        <p class="clickableClub" data-index="${index}">
          ${c.name} — Loyalty: ${c.loyalty}% — Rank: ${c.rank}
          <button class="popupBtn smallQuitBtn" onclick="quitClub(${index})">Quit</button>
        </p>
      `).join("");

document.querySelectorAll(".clickableClub").forEach((el, i) => {
  el.addEventListener("click", () => openClubPopup(i));
});

 teachersList.innerHTML =
  player.education.teachers.map((t, index) => `
    <p class="clickableTeacher" data-index="${index}">
      📘 ${t.subject}: ${t.name} — Respect: ${t.respect}%
    </p>
  `).join("");

document.querySelectorAll(".clickableTeacher").forEach(el => {
  el.addEventListener("click", () => openTeacherPopup(el.dataset.index));
});
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
          <p class="clickableRomantic" data-index="${index}">
            ${r.emoji} ${r.name} — ❤️ ${r.closeness}%
          </p>
        `).join("");

  document.querySelectorAll(".clickableRomantic").forEach(el => {
    el.addEventListener("click", () =>
      openRomanticPopup(el.dataset.index)
    );
  });
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
// ACTIVITIES TAB (AGE 6+)
// ------------------------------
const activitiesTab = document.getElementById("activitiesTab");

if (activitiesTab) {
  if (player.age < 6) {
    activitiesTab.innerHTML = "<p>You are too young for activities.</p>";
  } else {
    activitiesTab.innerHTML = `
      <div id="exerciseSection">
        <h3>Exercise</h3>
        ${player.activities.exercise.map((a, i) => `
          <button class="popupBtn" onclick="doActivity('exercise', ${i})">${a}</button>
        `).join("")}
      </div>

      <div id="funSection">
        <h3>Fun</h3>
        ${player.activities.fun.map((a, i) => `
          <button class="popupBtn" onclick="doActivity('fun', ${i})">${a}</button>
        `).join("")}
      </div>

      <div id="miscSection">
        <h3>Misc</h3>
        ${player.activities.misc.map((a, i) => `
          <button class="popupBtn" onclick="doActivity('misc', ${i})">${a}</button>
        `).join("")}
      </div>
    `;
  }
}

  // ASSETS SUBTAB SWITCHING
document.addEventListener("click", e => {
  if (!e.target.classList.contains("subtabBtn")) return;

  const target = e.target.dataset.subtab;

  // Remove active from all subtabs
  document.querySelectorAll("#assets .subtab").forEach(s => s.classList.remove("active"));

  // Remove active from all buttons
  document.querySelectorAll("#assets .subtabBtn").forEach(b => b.classList.remove("active"));

  // Activate clicked button + matching subtab
  e.target.classList.add("active");
  document.getElementById("assets-" + target).classList.add("active");
});


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

function renderJobs() {
  const jobsList = document.getElementById("jobsList");
  if (!jobsList) return;

  // If player already has a job
  if (currentJob) {
    jobsList.innerHTML = `
      <p>${currentJob.name}</p>
      <p>Salary: $${currentJob.salary}</p>
      <button class="popupBtn" onclick="quitJob()">Quit Job</button>
    `;
    return;
  }

  // Show all available jobs
  jobsList.innerHTML = jobOpenings.map((job, index) => `
    <button class="popupBtn" onclick="openJobPopup(${index})">
      ${job.name}
    </button>
  `).join("");
}

function openJobPopup(index) {
  const job = jobOpenings[index];
  const popup = document.getElementById("popup");

  popup.innerHTML = `
    <div class="popupCard">
      <h2>${job.name}</h2>
      <p>💰 Salary: $${job.salary}</p>
      <p>🧠 Required Smarts: ${job.smarts}</p>
      <p>🎂 Minimum Age: ${job.minAge}</p>

      ${
        player.age >= job.minAge && player.smarts >= job.smarts
          ? `<button class="popupBtn" onclick="applyJob(${index})">Apply</button>`
          : `<p style="color:red;">You do not meet the requirements.</p>`
      }

      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;

  popup.style.display = "flex";
}

function applyJob(index) {
  const job = jobOpenings[index];

  if (player.age < job.minAge || player.smarts < job.smarts) {
    alert("You don't qualify.");
    return;
  }

  currentJob = job;

  closePopup();
  renderJobs();
  updateUI();
}

function openQuitJobPopup() {
  const popup = document.getElementById("popup");

  popup.innerHTML = `
    <div class="popupCard">
      <h2>Quit Job?</h2>
      <button class="popupBtn" onclick="quitJob()">Yes</button>
      <button class="popupBtn" onclick="closePopup()">No</button>
    </div>
  `;

  popup.style.display = "flex";
}

function quitJob() {
  currentJob = null;
  renderJobs();
}

function openJobEvent() {
  if (!currentJob) return;

  const events = jobEvents[currentJob.name];
  if (!events) return;

  const event = events[Math.floor(Math.random() * events.length)];
  const popup = document.getElementById("popup");

  popup.innerHTML = `
    <div class="popupCard">
      <h2>💼 Work Event</h2>
      <p>${event.text}</p>
      <div id="jobChoices"></div>
    </div>
  `;

  const choiceBox = document.getElementById("jobChoices");

  event.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "popupBtn";
    btn.textContent = choice.text;

    btn.onclick = () => {
      applyJobEffects(choice.effects);

      popup.innerHTML = `
        <div class="popupCard">
          <h2>Work Complete</h2>
          <p>You chose: ${choice.text}</p>
          <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
        </div>
      `;
    };

    choiceBox.appendChild(btn);
  });

  popup.style.display = "flex";
}

function applyJobEffects(effects) {
  if (effects.money) player.money += effects.money;
  if (effects.happiness) player.happiness = clamp(player.happiness + effects.happiness);
  if (effects.smarts) player.smarts = clamp(player.smarts + effects.smarts);

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

function openClubPopup(index) {
  const club = player.education.joinedClubs[index];

  const popup = document.getElementById("popupOverlay");
  const card = document.getElementById("popupCard");

  card.innerHTML = `
    <h2>${club.name}</h2>
    <p>Your Rank: <strong>${club.rank}</strong></p>
    <p>Loyalty: ${club.loyalty}%</p>

    <button class="popupBtn" onclick="attendMeeting(${index})">Attend Meeting</button>
    <button class="popupBtn" onclick="showSpirit(${index})">Show Spirit</button>

    ${
      club.rank === "Member"
        ? `<button class="popupBtn" onclick="becomeClubLeader(${index})">Become Club Leader</button>`
        : ``
    }

    <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
  `;

  popup.style.display = "flex";
}

function openTeacherPopup(index) {
  const t = player.education.teachers[index];

  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>📘 ${t.subject}: ${t.name}</h2>
      <p>Respect: ${t.respect}%</p>
      <p>Mood: ${t.mood}%</p>

      <button class="popupBtn" onclick="teacherInteract(${index}, 'talk')">Talk After Class</button>
      <button class="popupBtn" onclick="teacherInteract(${index}, 'ask')">Ask About Homework</button>
      <button class="popupBtn" onclick="teacherInteract(${index}, 'help')">Ask for Extra Help</button>
      <button class="popupBtn" onclick="teacherInteract(${index}, 'compliment')">Compliment Teacher</button>
      <button class="popupBtn" onclick="teacherInteract(${index}, 'ignore')">Do Nothing</button>

      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;

  popup.style.display = "flex";
}

function doActivity(type, index) {
  const activity = player.activities[type][index];

  // ⭐ AGE RESTRICTION FOR VACATION
  if (activity.includes("vacation")) {
    if (player.age < 18) {
      const popup = document.getElementById("popup");
      popup.innerHTML = `
        <div class="popupCard">
          <h2>✈️ Vacation Locked</h2>
          <p>You need to be 18 years old or older to go on vacation.</p>
          <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
        </div>
      `;
      popup.style.display = "flex";
      return;
    }

    openVacationPopup();
    return;
  }

  // Basic activity effect
  player.happiness = clamp(player.happiness + 3);

  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>Activity</h2>
      <p>You did: ${activity}</p>
      <p>You feel a little happier.</p>
      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;
  popup.style.display = "flex";

  updateUI();
}

function openJobPopup(index) {
  const job = jobOpenings[index];
  const popup = document.getElementById("popup");

  popup.innerHTML = `
    <div class="popupCard">
      <h2>${job.name}</h2>
      <p>💰 Salary: $${job.salary}</p>
      <p>🧠 Required Smarts: ${job.smarts}</p>
      <p>🎂 Minimum Age: ${job.minAge}</p>

      ${
        player.age >= job.minAge && player.smarts >= job.smarts
          ? `<button class="popupBtn" onclick="applyJob(${index})">Apply</button>`
          : `<p style="color:red;">You do not meet the requirements.</p>`
      }

      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;

  popup.style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
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
    npcName = randomName(gender);
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

function runClubEvent(index) {
  const club = player.education.joinedClubs[index];
  const events = clubEvents[club.name];

  if (!events || events.length === 0) return;

  const event = events[Math.floor(Math.random() * events.length)];

  const popup = document.getElementById("popup");

  popup.innerHTML = `
    <div class="popupCard">
      <h2>${club.name}</h2>
      <p>${event.text}</p>
      <div id="clubChoices"></div>
    </div>
  `;

  const choiceBox = document.getElementById("clubChoices");

  event.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "popupBtn";
    btn.textContent = choice.text;

    btn.onclick = () => applyClubEffects(index, choice.effects, club.name);

    choiceBox.appendChild(btn);
  });

  popup.style.display = "flex";
}

function applyClubEffects(index, effects, clubName) {
  const club = player.education.joinedClubs[index];

  for (let key in effects) {
    if (key === "loyalty") {
      club.loyalty = clamp(club.loyalty + effects[key]);
    } else if (player.hasOwnProperty(key)) {
      player[key] = clamp(player[key] + effects[key]);
    }
  }

  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>${clubName}</h2>
      <p>You made your choice.</p>
      <p>Loyalty is now ${club.loyalty}%</p>
      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;

  updateUI();
}

function ageUp() {
  player.age++;

  processYearlyIncome();
  
  player.emoji = genderEmoji(player.gender, player.age);

  yearEventUsed = false;

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

  if (player.age === 3) generatePreschoolClassmates();

  if (player.age === 6) {
    player.relationships.classmates = [];
    generateElementaryClassmates();
    generateTeachers();
    generateClubs();
  }

  checkDeaths();
  runEvent();

  yearlyStatChanges();
  
  updateUI();
}

// ------------------------------
// YEARLY STAT CHANGES
// ------------------------------
function yearlyStatChanges() {
  // Happiness naturally shifts
  player.happiness += Math.floor(Math.random() * 7) - 3; // -3 to +3

  // Health slowly declines or improves
  player.health += Math.floor(Math.random() * 5) - 2; // -2 to +2

  // Smarts slightly improves with age (or drifts)
  player.smarts += Math.floor(Math.random() * 4) - 1; // -1 to +2

  // Looks slowly declines with age (subtle realism)
  player.looks += Math.floor(Math.random() * 3) - 2; // -2 to +0

  // Clamp everything
  player.happiness = clamp(player.happiness);
  player.health = clamp(player.health);
  player.smarts = clamp(player.smarts);
  player.looks = clamp(player.looks);
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
      name: randomName(gender),
      gender: gender,
      age: age,
      emoji: genderEmoji(gender, age),
      closeness: Math.floor(Math.random() * 16) + 15, // 15–30
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
      name: randomName(gender),
      gender: gender,
      age: age,
      emoji: genderEmoji(gender, age),
      closeness: Math.floor(Math.random() * 16) + 15, // 15–30
      type: "classmate"
    });
  }
}

// ------------------------------
// TEACHER GENERATOR
// ------------------------------
function generateTeachers() {
  const teacherNames = ["Ms. Carter", "Mr. Lopez", "Mrs. Singh", "Mr. Brown", "Ms. Nguyen"];

  const subjects = ["Math", "Reading", "Science", "Art"];

  player.education.teachers = subjects.map(subject => {
    return {
      subject: subject,
      name: teacherNames[Math.floor(Math.random() * teacherNames.length)],
      respect: 50,
      mood: 50
    };
  });
}

// ------------------------------
// CLUB GENERATOR
// ------------------------------
function generateClubs() {
  // All clubs are always available
  player.education.clubs = ["Chess Club", "Art Club", "Band", "Study Club"];
  player.education.joinedClubs = []; // clubs the player actually joins
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

${player.relationships.classmates[index].closeness >= 50
  ? `<button class="popupBtn" onclick="becomeFriendFromClassmate(${index})">Become Friends</button>`
  : ""
}

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

function tryBecomeFriend(index) {
  const c = player.relationships.classmates[index];

  if (c.closeness < 50) return; // not enough bond

  // prevent duplicates
  const alreadyFriend = player.relationships.friends.some(f => f.name === c.name);
  if (alreadyFriend) return;

  player.relationships.friends.push({
    name: c.name,
    gender: c.gender,
    age: c.age,
    emoji: c.emoji,
    closeness: c.closeness
  });
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
      ${player.relationships.classmates[index].closeness >= 50
  ? `<button class="popupBtn" onclick="becomeFriendFromClassmate(${index})">Become Friends</button>`
  : ""
}
    </div>
  `;

  popup.style.display = "flex";
}

function openHighSchoolClassmatePopup(index) {
  const c = player.relationships.classmates[index];

  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>${c.emoji} ${c.name}</h2>
      <p>Age: ${c.age}</p>
      <p>Closeness: ${c.closeness}%</p>

      <button class="popupBtn" onclick="highSchoolInteract(${index}, 'talk')">Talk</button>
      <button class="popupBtn" onclick="highSchoolInteract(${index}, 'hangout')">Hang Out</button>
      <button class="popupBtn" onclick="highSchoolInteract(${index}, 'study')">Study Together</button>
      <button class="popupBtn" onclick="highSchoolInteract(${index}, 'drama')">Get Involved in Drama</button>
      <button class="popupBtn" onclick="highSchoolInteract(${index}, 'ignore')">Ignore</button>

      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>

      ${c.closeness >= 50
        ? `<button class="popupBtn" onclick="becomeFriendFromClassmate(${index})">Become Friends</button>`
        : ""
      }

      ${c.closeness >= 85
        ? `<button class="popupBtn" onclick="becomeRomantic(${index})">Become Romantic</button>`
        : ""
      }
    </div>
  `;

  popup.style.display = "flex";
}

// ------------------------------
// ROMANCE SYSTEM
// ------------------------------
function becomeRomantic(index) {
  const c = player.relationships.classmates[index];

  const alreadyRomantic = player.relationships.romantic.some(r => r.name === c.name);
  if (alreadyRomantic) return;

  player.relationships.romantic.push({
    name: c.name,
    gender: c.gender,
    age: c.age,
    emoji: c.emoji,
    closeness: c.closeness,
    trust: 50,
    attraction: 70,
    type: "romantic"
  });

  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>${c.emoji} ${c.name}</h2>
      <p>💘 You started a romantic relationship!</p>
      <p>They have been added to your Romantic tab.</p>
      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;

  updateUI();
}

function openRomanticPopup(index) {
  const r = player.relationships.romantic[index];

  const popup = document.getElementById("popup");

  popup.innerHTML = `
    <div class="popupCard">
      <h2>${r.emoji} ${r.name}</h2>
      <p>Age: ${r.age}</p>
      <p>Closeness: ${r.closeness}%</p>
      <p>Trust: ${r.trust}%</p>
      <p>Attraction: ${r.attraction}%</p>

      <button class="popupBtn" onclick="romanticInteract(${index}, 'talk')">Talk</button>
      <button class="popupBtn" onclick="romanticInteract(${index}, 'date')">Go on a Date</button>
      <button class="popupBtn" onclick="romanticInteract(${index}, 'kiss')">Kiss</button>

      ${
        r.closeness >= 100
          ? `<button class="popupBtn" onclick="romanticInteract(${index}, 'intimate')">Be Intimate 😈</button>`
          : ""
      }

      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;

  popup.style.display = "flex";
}

function romanticInteract(index, type) {
  const r = player.relationships.romantic[index];

  let change = 0;
  let trustChange = 0;
  let attractionChange = 0;
  let result = "";

  if (type === "talk") {
    change = Math.floor(Math.random() * 6) + 2;
    trustChange = 2;
    result = `You had a deep conversation with ${r.name}.`;
  }

  if (type === "date") {
    change = Math.floor(Math.random() * 12) + 5;
    trustChange = 3;
    attractionChange = 3;
    result = `You went on a date with ${r.name}.`;
  }

  if (type === "kiss") {
    change = Math.floor(Math.random() * 15) + 8;
    trustChange = 4;
    attractionChange = 5;
    result = `You kissed ${r.name}.`;
  }

  if (type === "intimate") {
    if (r.closeness < 100) return;

    change = 10;
    trustChange = -2;
    attractionChange = 6;
    result = `You became very close with ${r.name}.`;
  }

  r.closeness = clamp(r.closeness + change);
  r.trust = clamp(r.trust + trustChange);
  r.attraction = clamp(r.attraction + attractionChange);

  const popup = document.getElementById("popup");

  popup.innerHTML = `
    <div class="popupCard">
      <h2>${r.emoji} ${r.name}</h2>
      <p>${result}</p>
      <p>Closeness: ${r.closeness}%</p>
      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;

  updateUI();
}

function becomeFriendFromClassmate(index) {
  const c = player.relationships.classmates[index];

  const alreadyFriend = player.relationships.friends.some(f => f.name === c.name);
  if (!alreadyFriend) {
    player.relationships.friends.push({
      name: c.name,
      gender: c.gender,
      age: c.age,
      emoji: c.emoji,
      closeness: c.closeness
    });
  }


  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>${c.emoji} ${c.name}</h2>
      <p>You are now friends!</p>
      <p>They have been added to your Friends list.</p>
      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;

  updateUI();
}

function openVacationPopup() {
  const popup = document.getElementById("popup");

  popup.innerHTML = `
    <div class="popupCard">
      <h2>✈️ Vacation Time!</h2>
      <p>Where would you like to go?</p>

      <button class="popupBtn" onclick="vacationChoice('beach')">🏖️ Beach</button>
      <button class="popupBtn" onclick="vacationChoice('mountains')">⛰️ Mountains</button>
      <button class="popupBtn" onclick="vacationChoice('city')">🏙️ City</button>
      <button class="popupBtn" onclick="vacationChoice('stayhome')">🏠 Stay Home</button>

      <button class="popupBtn popupClose" onclick="closePopup()">Cancel</button>
    </div>
  `;

  popup.style.display = "flex";
}

function vacationChoice(type) {
  let result = "";
  let happinessGain = 0;

  if (type === "beach") {
    result = "You relaxed at the beach and swam in the ocean.";
    happinessGain = 15;
  }

  if (type === "mountains") {
    result = "You went hiking and enjoyed the fresh air.";
    happinessGain = 12;
  }

  if (type === "city") {
    result = "You explored a busy city full of lights and food.";
    happinessGain = 10;
  }

  if (type === "stayhome") {
    result = "You stayed home and rested all week.";
    happinessGain = 8;
  }

  player.happiness = clamp(player.happiness + happinessGain);

  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>✈️ Vacation Result</h2>
      <p>${result}</p>
      <p>You gained +${happinessGain}% happiness!</p>
      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;

  updateUI();
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

function highSchoolInteract(index, type) {
  const c = player.relationships.classmates[index];

  let change = 0;
  let result = "";

  if (type === "talk") {
    change = Math.floor(Math.random() * 8) + 2;
    result = `You had a conversation with ${c.name}.`;
  }

  if (type === "hangout") {
    change = Math.floor(Math.random() * 12) + 4;
    result = `You hung out with ${c.name} after school.`;
  }

  if (type === "study") {
    change = Math.floor(Math.random() * 10) + 3;
    player.smarts = clamp(player.smarts + 2);
    result = `You studied together with ${c.name}.`;
  }

  if (type === "drama") {
    change = Math.floor(Math.random() * 6) - 4; // risky choice
    result = `You got involved in school drama with ${c.name}.`;
  }

  if (type === "ignore") {
    change = -Math.floor(Math.random() * 6);
    result = `You ignored ${c.name}.`;
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
  player.education.joinedClubs.push({
    name: clubName,
    loyalty: 50,
    rank: "Member"   // ⭐ default rank
  });

  player.education.clubs = player.education.clubs.filter(c => c !== clubName);

  updateUI();
}

function becomeClubLeader(index) {
  const club = player.education.joinedClubs[index];

  club.rank = "Leader";

  updateUI();
  openClubPopup(index); // 🔥 THIS is what refreshes the button
}

function openClubPopup(index) {
  const c = player.education.joinedClubs[index];

  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>${c.name}</h2>
      <p>Loyalty: ${c.loyalty}%</p>

      <button class="popupBtn" onclick="runClubEvent(${index})">Attend Meeting</button>
      <button class="popupBtn" onclick="clubInteract(${index}, 'spirit')">Show Spirit</button>

      ${c.rank === "Member" && c.loyalty >= 70 
  ? `<button class="popupBtn" onclick="becomeClubLeader(${index})">Become Club Leader</button>` 
  : ""}

      <button class="popupBtn popupClose" onclick="closePopup()">Close</button>
    </div>
  `;

  popup.style.display = "flex";
}

function quitClub(index) {
  const club = player.education.joinedClubs[index];

  // Return club to available list
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

function teacherInteract(index, type) {
  const t = player.education.teachers[index];

  let change = 0;
  let result = "";

  if (type === "talk") {
    change = Math.floor(Math.random() * 6) + 2;
    result = `You had a casual conversation with ${t.name}.`;
  }

  if (type === "ask") {
    change = Math.floor(Math.random() * 8) + 3;
    player.smarts = clamp(player.smarts + 2);
    result = `You asked ${t.name} about homework. You feel slightly smarter.`;
  }

  if (type === "help") {
    change = Math.floor(Math.random() * 10) + 5;
    player.smarts = clamp(player.smarts + 3);
    result = `${t.name} helped you understand the topic better.`;
  }

  if (type === "compliment") {
    change = Math.floor(Math.random() * 12) + 4;
    result = `You complimented ${t.name}. They seem happier.`;
  }

  if (type === "ignore") {
    change = -Math.floor(Math.random() * 6) - 2;
    result = `You ignored ${t.name}.`;
  }

  t.respect = clamp(t.respect + change);

  const popup = document.getElementById("popup");
  popup.innerHTML = `
    <div class="popupCard">
      <h2>📘 ${t.subject}: ${t.name}</h2>
      <p>${result}</p>
      <p>Respect is now ${t.respect}%</p>

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
