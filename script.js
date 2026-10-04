// Get all needed DOM elements
const form = document.getElementById("checkin-form");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const progressBar = document.getElementById("progressBar");
const attendeeCount = document.getElementById("attendeeCount");
const attendeeList = document.getElementById("attendeeList");
const teamIds = ["water", "zero", "power"];
const storageKey = "intelSummitAttendees";

// Track attendance
const maxCount = 50;
const teamGoal = 10;
let attendees = JSON.parse(localStorage.getItem(storageKey) || "[]");

function countTeamAttendees(team) {
  let teamCount = 0;

  for (let i = 0; i < attendees.length; i++) {
    const attendeeTeam =
      typeof attendees[i] === "string" ? attendees[i] : attendees[i].team;

    if (attendeeTeam === team) {
      teamCount++;
    }
  }

  return teamCount;
}

function updateAttendanceDisplay() {
  attendeeCount.textContent = attendees.length;

  const percentage = Math.min(
    Math.round((attendees.length / maxCount) * 100),
    100,
  );
  progressBar.style.width = `${percentage}%`;

  for (let i = 0; i < teamIds.length; i++) {
    const team = teamIds[i];
    let teamCount = 0;

    for (let j = 0; j < attendees.length; j++) {
      const attendeeTeam =
        typeof attendees[j] === "string" ? attendees[j] : attendees[j].team;

      if (attendeeTeam === team) {
        teamCount++;
      }
    }

    document.getElementById(`${team}Count`).textContent = teamCount;
  }

  attendeeList.textContent = "";

  for (let i = 0; i < attendees.length; i++) {
    const attendee = attendees[i];
    const attendeeName =
      typeof attendee === "string" ? "Name unavailable" : attendee.name;
    const attendeeTeam =
      typeof attendee === "string" ? attendee : attendee.team;
    let teamName = "Unknown team";

    for (let j = 0; j < teamSelect.options.length; j++) {
      if (teamSelect.options[j].value === attendeeTeam) {
        teamName = teamSelect.options[j].text;
      }
    }

    const listItem = document.createElement("li");
    listItem.textContent = `${attendeeName} — ${teamName}`;
    attendeeList.appendChild(listItem);
  }
}

updateAttendanceDisplay();

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  //Get form values
  const attendeeName = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  // Save the attendee so the name and team are restored after a page reload
  const previousTeamCount = countTeamAttendees(team);
  const updatedAttendees = attendees.concat({ name: attendeeName, team: team });
  localStorage.setItem(storageKey, JSON.stringify(updatedAttendees));
  attendees = updatedAttendees;
  updateAttendanceDisplay();

  const teamCelebration = document.getElementById("teamCelebration");

  teamCelebration.textContent = "";
  teamCelebration.classList.remove("celebration-visible");

  if (previousTeamCount + 1 === teamGoal) {
    teamCelebration.textContent = `🎉 ${teamName} reached its goal of ${teamGoal} check-ins! 🎉`;
    teamCelebration.classList.add("celebration-visible");
  }

  // Show greeting message
  const greeting = document.getElementById("greeting");
  const message = `🎉 Welcome, ${attendeeName} from ${teamName}!`;
  greeting.textContent = message;
  greeting.classList.add("success-message");
  greeting.style.display = "block";

  form.reset();
});
