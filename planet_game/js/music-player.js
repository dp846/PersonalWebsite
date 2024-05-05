// Create an audio element
var audio = new Audio('sfx/planet_game.mp3');
audio.loop = true;

// Function to play music
function playMusic() {
  audio.play();
}

// Function to stop music
function stopMusic() {
  audio.pause();
}

// Event listener for the music button
document.getElementById('music-button').addEventListener('click', function() {
  // If music is currently paused, play it; otherwise, pause it
  if (audio.paused) {
    playMusic();
    document.getElementById('music-button').innerText = 'Pause Music';
  } else {
    stopMusic();
    document.getElementById('music-button').innerText = 'Play Music';
  }
});
