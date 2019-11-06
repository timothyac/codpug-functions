const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

// Generate random username
function randomUsername(length) {
  let username;
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < length; i++) {
    username += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return username;
}

// Generate random elo
function makeElo() {
  return Math.floor(Math.random() * 1000 + 1);
}

// Check to see if a user & enemy are compatible
function eloMatch(userElo, enemyElo) {
  let posElo = userElo + 100;
  let negElo = userElo - 100;

  // Check to see if a user is within a 100 +/- enemy elo
  if (enemyElo <= posElo && enemyElo >= negElo) {
    console.log(userElo, enemyElo);
    return true;
  } else {
    console.log("match failed");
    return false;
  }
}

// Create match for a user
function createMatch(user, activePlayers) {
  // Loop over all active players
  for (let i = 0; i < activePlayers.length; i++) {
    // Define new enemy
    let enemy = activePlayers[i];

    // Make sure the 'enemy' isn't the user and their elo matches
    if (enemy.username !== user.username && eloMatch(user.elo, enemy.elo)) {
      return `Matched ${user.username} [${user.elo}] with ${enemy.username} [${enemy.elo}]`;
    }
  }
}

exports.helloWorld = functions.https.onRequest((req, res) => {
  // Array to store active players
  const activePlayers = [];

  // Generate random players for testing purposes
  for (let i = 0; i < 10; i++) {
    let user = {
      username: randomUsername(6),
      elo: makeElo()
    };
    activePlayers.push(user);
  }

  let match = createMatch(req.body.player, activePlayers);
  res.send(match);
});
