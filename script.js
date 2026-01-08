document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("globalAudio");
  const tracks = Array.from(document.querySelectorAll(".track"));

  let currentIndex = -1;
  let isLooping = false;

  /* PLAYER BAR ELEMENTS */
  const playerBar = document.getElementById("playerBar");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const loopBtn = document.getElementById("loopBtn");
  const progressBar = document.getElementById("progressBar");
  const trackTitle = document.getElementById("playerTrackTitle");
  const trackNumber = document.getElementById("playerTrackNumber");
  const playerArt = document.getElementById("playerArt");

  /* =========================
     LOAD TRACK
  ========================= */
  function loadTrack(index) {
    const track = tracks[index];
    if (!track) return;

    const album = track.querySelector(".album-art");
    const img = album.querySelector("img");

    audio.src = album.dataset.audio;
    audio.load();

    playerArt.src = img.src;
    trackTitle.textContent =
      track.querySelector(".track-title").textContent;
    trackNumber.textContent =
      track.querySelector(".track-number").textContent;

    currentIndex = index;
    playerBar.classList.remove("hidden");

    resetPlayButtons();
  }

  /* =========================
     PLAY / PAUSE
  ========================= */
  function togglePlay() {
    if (audio.paused) {
      audio.play();
      playPauseBtn.textContent = "❚❚";
      setActivePlayButton();
    } else {
      audio.pause();
      playPauseBtn.textContent = "▶";
      resetPlayButtons();
    }
  }

  /* =========================
     NEXT / PREV
  ========================= */
  function nextTrack() {
    let next = currentIndex + 1;
    if (next >= tracks.length) next = 0;
    loadTrack(next);
    audio.play();
    playPauseBtn.textContent = "❚❚";
    setActivePlayButton();
  }

  function prevTrack() {
    let prev = currentIndex - 1;
    if (prev < 0) prev = tracks.length - 1;
    loadTrack(prev);
    audio.play();
    playPauseBtn.textContent = "❚❚";
    setActivePlayButton();
  }

  /* =========================
     LOOP
  ========================= */
  loopBtn.addEventListener("click", () => {
    isLooping = !isLooping;
    audio.loop = isLooping;
    loopBtn.style.opacity = isLooping ? "1" : "0.5";
  });

  /* =========================
     PROGRESS BAR
  ========================= */
  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    progressBar.value =
      (audio.currentTime / audio.duration) * 100;
  });

  progressBar.addEventListener("input", () => {
    if (!audio.duration) return;
    audio.currentTime =
      (progressBar.value / 100) * audio.duration;
  });

  /* =========================
     AUTO NEXT
  ========================= */
  audio.addEventListener("ended", () => {
    if (!isLooping) nextTrack();
  });

  /* =========================
     PLAYER BAR BUTTONS
  ========================= */
  playPauseBtn.addEventListener("click", togglePlay);
  nextBtn.addEventListener("click", nextTrack);
  prevBtn.addEventListener("click", prevTrack);

  /* =========================
     ALBUM ART PLAY BUTTONS
  ========================= */
  tracks.forEach((track, index) => {
    const playBtn = track.querySelector(".play-btn");

    playBtn.addEventListener("click", () => {
      if (currentIndex !== index) {
        loadTrack(index);
        audio.play(); // user-gesture safe
        playPauseBtn.textContent = "❚❚";
        setActivePlayButton();
      } else {
        togglePlay();
      }
    });
  });

  /* =========================
     FREE DOWNLOAD BUTTONS
     (FIXED & SAFE)
  ========================= */
  document.querySelectorAll(".free-download").forEach(btn => {
    const progress = btn.querySelector(".progress");

    btn.addEventListener("click", () => {
      if (btn.classList.contains("disabled")) return;

      const track = btn.closest(".track");
      const album = track.querySelector(".album-art");
      const fileUrl = album.dataset.audio;

      btn.classList.add("disabled");
      progress.style.width = "100%";

      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = fileUrl.split("/").pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => {
        progress.style.width = "0%";
        btn.classList.remove("disabled");
      }, 3000);
    });
  });

  /* =========================
     UI HELPERS
  ========================= */
  function resetPlayButtons() {
    document.querySelectorAll(".play-btn").forEach(btn => {
      btn.textContent = "▶";
    });
  }

  function setActivePlayButton() {
    resetPlayButtons();
    if (currentIndex >= 0) {
      tracks[currentIndex]
        .querySelector(".play-btn").textContent = "❚❚";
    }
  }
});
