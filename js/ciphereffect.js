var loadingText = document.querySelector('.loading-text');
var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
var originalText = loadingText.innerText;
var scrambleInterval;
var revealInterval;
var revealedCount = 0;

function scramble() {
  var scrambledText = '';
  for (var i = 0; i < originalText.length; i++) {
    if (i < revealedCount || originalText[i] === ' ') {
      scrambledText += originalText[i];
    } else {
      scrambledText += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  loadingText.innerText = scrambledText;
}

function reveal() {
  revealedCount++;
  if (revealedCount >= originalText.length) {
    clearInterval(revealInterval);
  }
}

scrambleInterval = setInterval(scramble, 25);
revealInterval = setInterval(reveal, 350);

// New function to stop scrambling and revealing and hide the text
function stopAndHide() {
  clearInterval(scrambleInterval);
  clearInterval(revealInterval);
  loadingText.style.display = 'none'; // Hide the text
}
