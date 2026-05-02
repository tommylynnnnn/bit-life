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

// ... (rest of code is unchanged up until applyChoice)

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
      if (stat === "money") {
        player.money = Math.max(0, player.money + effects[stat]);
      } else {
        player[stat] = clamp(player[stat] + effects[stat]);
      }
    }
  }

  document.getElementById("choices").innerHTML = "";
  document.getElementById("eventText").textContent = "You made your choice.";
  updateUI();
}

// ... (rest of code is unchanged up until applyClubEffects)

function applyClubEffects(index, effects, clubName) {
  const club = player.education.joinedClubs[index];

  for (let key in effects) {
    if (key === "loyalty") {
      club.loyalty = clamp(club.loyalty + effects[key]);
    } else if (player.hasOwnProperty(key)) {
      if (key === "money") {
        player.money = Math.max(0, player.money + effects[key]);
      } else {
        player[key] = clamp(player[key] + effects[key]);
      }
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

// ... (rest of the code is unchanged)
