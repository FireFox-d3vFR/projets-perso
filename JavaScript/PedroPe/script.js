const audio = document.getElementById("audio");
const controlsBtn = document.getElementById("controlsBtn");
const pedroImage = document.getElementById("pedroImage");
const spinner = document.querySelector(".spinner");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");

let rotationAngle = 0;
pauseIcon.style.display = "none";

function updateRotationAngle() {
  if (pedroImage) {
    const style = window.getComputedStyle(pedroImage);
    const transform = style.getPropertyValue("transform");
    const matrix = transform.match(/^matrix\((.+)\)$/);
    if (matrix) {
      const matrixValues = matrix[1].split(",").map(parseFloat);
      rotationAngle = Math.round(
        Math.atan2(matrixValues[1], matrixValues[0]) * (180 / Math.PI)
      );
    }
  } else {
    console.error("L'élément pedroImage n'a pas été trouvé dans le DOM.");
  }
}

controlsBtn.addEventListener("click", function () {
  if (audio.paused) {
    audio.play();
    playIcon.style.display = "none";
    pauseIcon.style.display = "inline-block";
    spinner.classList.add("animate");
    updateRotationAngle();
    if (pedroImage) {
      pedroImage.classList.add("animate");
      pedroImage.style.transform = `rotate(${rotationAngle}deg)`; // Appliquer l'angle de rotation actuel
    }
  } else {
    audio.pause();
    pauseIcon.style.display = "none";
    playIcon.style.display = "inline-block";
    spinner.classList.remove("animate");
    if (pedroImage) {
      pedroImage.classList.remove("animate");
    }
  }
});

audio.addEventListener("timeupdate", function () {
  const progressBar = document.getElementById("progressBar");
  const progressDot = document.getElementById("progressDot");
  const currentTimeDisplay = document.getElementById("currentTime");
  const totalTimeDisplay = document.getElementById("totalTime");

  const percent = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = percent + "%";
  progressDot.style.left = percent + "%";

  currentTimeDisplay.textContent = formatTime(audio.currentTime);
  totalTimeDisplay.textContent = formatTime(audio.duration);
});

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
}

audio.addEventListener("ended", function () {
  pauseIcon.style.display = "none";
  playIcon.style.display = "inline-block";
  pedroImage.classList.remove("animate");
  spinner.classList.remove("animate");
});
