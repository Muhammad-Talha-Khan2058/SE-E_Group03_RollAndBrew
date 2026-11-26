/* ==========================================================================
   Roll & Brew — Board Game Trivia Quiz
   Vanilla JavaScript logic: question bank, timer, scoring, review & localStorage
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. Configuration & Question Bank (15 Realistic Board Game Questions)
   -------------------------------------------------------------------------- */
const QUIZ_LENGTH = 10;
const SECONDS_PER_QUESTION = 20;
const STORAGE_KEYS = {
  PLAYER_NAME: "rollAndBrew_playerName",
  BEST_SCORE: "rollAndBrew_bestScore",
  LEADERBOARD: "rollAndBrew_leaderboard"
};

const QUESTION_BANK = [
  {
    id: 1,
    game: "Catan",
    question: "In Catan, which five resources do players collect and trade to build settlements?",
    options: [
      "Brick, Lumber, Ore, Grain, and Wool",
      "Gold, Stone, Wood, Fish, and Silk",
      "Clay, Iron, Wheat, Coal, and Cotton",
      "Timber, Marble, Silver, Corn, and Flax"
    ],
    correctIndex: 0,
    explanation: "Catan uses Brick, Lumber, Ore, Grain, and Wool—while the desert hex produces nothing."
  },
  {
    id: 2,
    game: "Monopoly",
    question: "In classic Monopoly, how much money do you collect each time you pass GO?",
    options: ["$100", "$200", "$250", "$500"],
    correctIndex: 1,
    explanation: "Passing GO awards $200 from the bank."
  },
  {
    id: 3,
    game: "Chess",
    question: "In Chess, which piece is the only one allowed to jump over other pieces?",
    options: ["Bishop", "Rook", "Knight", "Queen"],
    correctIndex: 2,
    explanation: "Knights move in an L-shape and are the only pieces able to leap over others."
  },
  {
    id: 4,
    game: "Scrabble",
    question: "In standard English Scrabble, which two letter tiles are each worth 10 points?",
    options: ["Q and Z", "J and X", "K and Z", "Q and X"],
    correctIndex: 0,
    explanation: "Q and Z are the highest-scoring tiles at 10 points each (J and X are worth 8)."
  },
  {
    id: 5,
    game: "Uno",
    question: "In a standard game of Uno, how many cards are dealt to each player at the start?",
    options: ["5 cards", "7 cards", "9 cards", "10 cards"],
    correctIndex: 1,
    explanation: "Official Uno rules deal 7 cards face down to every player."
  },
  {
    id: 6,
    game: "Ticket to Ride",
    question: "In the original Ticket to Ride, what are players building across North America?",
    options: ["Highway bridges", "Train routes", "Shipping lanes", "Airports"],
    correctIndex: 1,
    explanation: "Players collect colored train cards to claim railway routes connecting cities."
  },
  {
    id: 7,
    game: "Clue",
    question: "In the mystery game Clue (Cluedo), who is the mansion host whose murder players solve?",
    options: ["Mr. Boddy", "Colonel Mustard", "Professor Plum", "Mr. Green"],
    correctIndex: 0,
    explanation: "Players deduce who killed Mr. Boddy, with which weapon, and in which room."
  },
  {
    id: 8,
    game: "Risk",
    question: "How many continents appear on the classic Risk world map?",
    options: ["5", "6", "7", "8"],
    correctIndex: 1,
    explanation: "Risk divides the map into 6 continents: North America, South America, Europe, Africa, Asia, and Australia."
  },
  {
    id: 9,
    game: "Pandemic",
    question: "What style of gameplay is Pandemic most famous for popularizing?",
    options: [
      "Cooperative team strategy",
      "Word-building party play",
      "Solo tile-laying puzzles",
      "Secret-role bluffing"
    ],
    correctIndex: 0,
    explanation: "In Pandemic, all players work together as one team to cure four diseases before outbreaks overwhelm the globe."
  },
  {
    id: 10,
    game: "Azul",
    question: "In Azul, what components do players draft to decorate their personal palace wall?",
    options: [
      "Colorful ceramic-style tiles",
      "Wooden train cars",
      "Hexagonal terrain cards",
      "Plastic army miniatures"
    ],
    correctIndex: 0,
    explanation: "Players draft patterned tiles from factory displays to build mosaic rows and columns."
  },
  {
    id: 11,
    game: "Codenames",
    question: "In Codenames, what is the main job of each team's Spymaster?",
    options: [
      "Give one-word clues linking grid words",
      "Roll dice to move team pawns",
      "Trade resource cards silently",
      "Draw secret sketches on a timer"
    ],
    correctIndex: 0,
    explanation: "The Spymaster gives a single word and a number so teammates can guess their secret agents."
  },
  {
    id: 12,
    game: "Battleship",
    question: "In classic Battleship, how many spaces (holes) does the Aircraft Carrier occupy?",
    options: ["3 spaces", "4 spaces", "5 spaces", "6 spaces"],
    correctIndex: 2,
    explanation: "The Aircraft Carrier is the longest ship in the fleet at 5 spaces."
  },
  {
    id: 13,
    game: "Carcassonne",
    question: "What famous nickname for wooden board game people tokens originated with Carcassonne?",
    options: ["Meeples", "Pawns", "Knights", "Tokens"],
    correctIndex: 0,
    explanation: "The term 'meeple' (my + people) was coined during a game of Carcassonne in 2000."
  },
  {
    id: 14,
    game: "Backgammon",
    question: "How many triangular points are printed on a standard Backgammon board?",
    options: ["16", "20", "24", "32"],
    correctIndex: 2,
    explanation: "A Backgammon board has 24 narrow triangles split into four quadrants of 6 points each."
  },
  {
    id: 15,
    game: "Trivial Pursuit",
    question: "In classic Trivial Pursuit, how many colored wedges must you collect to fill your wheel?",
    options: ["4 wedges", "6 wedges", "8 wedges", "10 wedges"],
    correctIndex: 1,
    explanation: "Each player aims to collect 6 category wedges before heading to the center hub."
  }
];

/* --------------------------------------------------------------------------
   2. Application State & DOM References
   -------------------------------------------------------------------------- */
const state = {
  playerName: "",
  questions: [],
  currentIndex: 0,
  score: 0,
  timeLeft: SECONDS_PER_QUESTION,
  timerId: null,
  autoAdvanceId: null,
  hasAnswered: false,
  reviewHistory: []
};

const dom = {
  startScreen: document.getElementById("start-screen"),
  questionScreen: document.getElementById("question-screen"),
  resultScreen: document.getElementById("result-screen"),

  startForm: document.getElementById("start-form"),
  playerNameInput: document.getElementById("player-name"),
  nameError: document.getElementById("name-error"),
  savedPlayerBanner: document.getElementById("saved-player-banner"),
  savedPlayerText: document.getElementById("saved-player-text"),

  progressText: document.getElementById("question-progress-text"),
  progressBarWrap: document.getElementById("quiz-progress-bar-wrap"),
  progressBar: document.getElementById("quiz-progress-bar"),
  liveScoreText: document.getElementById("live-score-text"),
  timerBadge: document.getElementById("timer-badge"),
  timerSrStatus: document.getElementById("timer-sr-status"),
  questionGameTag: document.getElementById("question-game-tag"),
  questionText: document.getElementById("question-text"),
  answerOptions: document.getElementById("answer-options"),
  feedbackBox: document.getElementById("feedback-box"),
  feedbackTitle: document.getElementById("feedback-title"),
  feedbackDetail: document.getElementById("feedback-detail"),
  nextBtn: document.getElementById("next-btn"),

  resultHeading: document.getElementById("result-heading"),
  resultPlayerName: document.getElementById("result-player-name"),
  resultTitleBadge: document.getElementById("result-title-badge"),
  resultTitleDesc: document.getElementById("result-title-desc"),
  resultScore: document.getElementById("result-score"),
  resultPercentage: document.getElementById("result-percentage"),
  bestScoreNote: document.getElementById("best-score-note"),
  playAgainBtn: document.getElementById("play-again-btn"),
  changePlayerBtn: document.getElementById("change-player-btn"),
  reviewList: document.getElementById("review-list"),

  leaderboardEmpty: document.getElementById("leaderboard-empty"),
  leaderboardTableWrap: document.getElementById("leaderboard-table-wrap"),
  leaderboardBody: document.getElementById("leaderboard-body"),
  leaderboardBestChip: document.getElementById("leaderboard-best-chip")
};

/* --------------------------------------------------------------------------
   3. Initialization & Event Listeners
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", initQuizApp);

/**
 * Sets up initial saved data, renders the leaderboard, and attaches event handlers.
 */
function initQuizApp() {
  loadSavedPlayerInfo();
  renderLeaderboard();

  dom.startForm.addEventListener("submit", handleStartSubmit);
  dom.playerNameInput.addEventListener("input", clearNameError);
  dom.nextBtn.addEventListener("click", goToNextQuestion);
  dom.playAgainBtn.addEventListener("click", startNewQuizRound);
  dom.changePlayerBtn.addEventListener("click", returnToStartScreen);
}

/* --------------------------------------------------------------------------
   4. Safe localStorage Helpers (Handles missing or corrupted data)
   -------------------------------------------------------------------------- */

/**
 * Safely reads a string value from localStorage. Returns fallback on error.
 */
function safeGetStorage(key, fallback = "") {
  try {
    const value = window.localStorage.getItem(key);
    return value !== null ? value : fallback;
  } catch (err) {
    return fallback;
  }
}

/**
 * Safely writes a string value to localStorage without crashing if storage is blocked.
 */
function safeSetStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (err) {
    // Ignore storage quota or private-mode access errors gracefully
  }
}

/**
 * Reads and validates the saved leaderboard array from localStorage.
 * If the JSON is corrupted or invalid, returns an empty array.
 */
function getLeaderboard() {
  const raw = safeGetStorage(STORAGE_KEYS.LEADERBOARD, "[]");
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    // Keep only valid entries with proper name, score, and date fields
    return parsed
      .filter(
        (entry) =>
          entry &&
          typeof entry.name === "string" &&
          entry.name.trim().length > 0 &&
          typeof entry.score === "number" &&
          Number.isFinite(entry.score) &&
          entry.score >= 0 &&
          entry.score <= QUIZ_LENGTH &&
          typeof entry.date === "string"
      )
      .slice(0, 5);
  } catch (err) {
    return [];
  }
}

/**
 * Safely reads the saved numeric best score from localStorage.
 */
function getSavedBestScore() {
  const raw = safeGetStorage(STORAGE_KEYS.BEST_SCORE, "");
  const parsed = Number(raw);
  if (raw !== "" && Number.isInteger(parsed) && parsed >= 0 && parsed <= QUIZ_LENGTH) {
    return parsed;
  }
  return null;
}

/**
 * Loads the player's last used name and best score into the start screen and leaderboard header.
 */
function loadSavedPlayerInfo() {
  const savedName = safeGetStorage(STORAGE_KEYS.PLAYER_NAME, "").trim();
  const savedBest = getSavedBestScore();

  if (savedName.length >= 2) {
    dom.playerNameInput.value = savedName;
  }

  if (savedName && savedBest !== null) {
    dom.savedPlayerText.textContent = `Welcome back, ${savedName}! Saved Best Score: ${savedBest} / ${QUIZ_LENGTH}`;
    dom.savedPlayerBanner.classList.remove("d-none");

    dom.leaderboardBestChip.textContent = `Best: ${savedName} (${savedBest}/${QUIZ_LENGTH})`;
    dom.leaderboardBestChip.classList.remove("d-none");
  } else {
    dom.savedPlayerBanner.classList.add("d-none");
    dom.leaderboardBestChip.classList.add("d-none");
  }
}

/**
 * Saves the player's name, updates best score if beaten, and inserts into top 5 leaderboard.
 */
function saveResultToStorage(name, score) {
  safeSetStorage(STORAGE_KEYS.PLAYER_NAME, name);

  const previousBest = getSavedBestScore();
  const isNewBest = previousBest === null || score > previousBest;
  if (isNewBest) {
    safeSetStorage(STORAGE_KEYS.BEST_SCORE, String(score));
  }

  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const entries = getLeaderboard();
  entries.push({
    name: name,
    score: score,
    date: today,
    timestamp: Date.now()
  });

  // Sort highest score first; for ties, show the most recent attempt first
  entries.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return (b.timestamp || 0) - (a.timestamp || 0);
  });

  const topFive = entries.slice(0, 5);
  safeSetStorage(STORAGE_KEYS.LEADERBOARD, JSON.stringify(topFive));

  return { previousBest, isNewBest };
}

/* --------------------------------------------------------------------------
   5. Start Screen Validation & Screen Switching
   -------------------------------------------------------------------------- */

/**
 * Validates the player name (required, at least 2 non-space characters) and starts the quiz.
 */
function handleStartSubmit(event) {
  event.preventDefault();
  const cleanedName = dom.playerNameInput.value.trim();

  if (cleanedName.length < 2) {
    showNameError("Please enter your name (at least 2 characters) to begin.");
    dom.playerNameInput.focus();
    return;
  }

  clearNameError();
  state.playerName = cleanedName;
  safeSetStorage(STORAGE_KEYS.PLAYER_NAME, cleanedName);
  startNewQuizRound();
}

/**
 * Displays an accessible inline validation error under the name input.
 */
function showNameError(message) {
  dom.nameError.textContent = message;
  dom.nameError.classList.remove("d-none");
  dom.playerNameInput.setAttribute("aria-invalid", "true");
}

/**
 * Clears the inline validation error when the user starts typing.
 */
function clearNameError() {
  dom.nameError.textContent = "";
  dom.nameError.classList.add("d-none");
  dom.playerNameInput.removeAttribute("aria-invalid");
}

/**
 * Shows only the requested screen section ('start' | 'question' | 'result').
 */
function showScreen(screenName) {
  dom.startScreen.classList.toggle("d-none", screenName !== "start");
  dom.questionScreen.classList.toggle("d-none", screenName !== "question");
  dom.resultScreen.classList.toggle("d-none", screenName !== "result");
}

/**
 * Returns to the start screen so a new player can enter their name.
 */
function returnToStartScreen() {
  stopTimers();
  loadSavedPlayerInfo();
  showScreen("start");
  dom.playerNameInput.focus();
}

/* --------------------------------------------------------------------------
   6. Question Shuffling & Quiz Flow
   -------------------------------------------------------------------------- */

/**
 * Returns a shuffled copy of an array using the Fisher-Yates algorithm.
 */
function shuffleArray(items) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

/**
 * Starts a fresh 10-question round with shuffled questions and reset score.
 */
function startNewQuizRound() {
  stopTimers();
  state.questions = shuffleArray(QUESTION_BANK).slice(0, QUIZ_LENGTH);
  state.currentIndex = 0;
  state.score = 0;
  state.reviewHistory = [];

  showScreen("question");
  renderCurrentQuestion();
}

/**
 * Renders the current question, progress bar, 4 answer buttons, and starts the 20s timer.
 */
function renderCurrentQuestion() {
  stopTimers();
  state.hasAnswered = false;

  const currentQuestion = state.questions[state.currentIndex];
  const questionNumber = state.currentIndex + 1;
  const progressPercent = Math.round((questionNumber / QUIZ_LENGTH) * 100);

  // Update progress text, progress bar, and live score
  dom.progressText.textContent = `Question ${questionNumber} of ${QUIZ_LENGTH}`;
  dom.progressBar.style.width = `${progressPercent}%`;
  dom.progressBarWrap.setAttribute("aria-valuenow", String(questionNumber));
  dom.liveScoreText.textContent = `Score: ${state.score}`;

  // Populate question text and game tag
  dom.questionGameTag.textContent = currentQuestion.game;
  dom.questionText.textContent = currentQuestion.question;

  // Reset feedback and Next button
  dom.feedbackBox.className = "feedback-box p-3 mb-4 d-none";
  dom.feedbackTitle.textContent = "";
  dom.feedbackDetail.textContent = "";
  dom.nextBtn.classList.add("d-none");
  dom.nextBtn.textContent = questionNumber === QUIZ_LENGTH ? "See Results" : "Next";

  // Build 4 accessible answer buttons
  dom.answerOptions.innerHTML = "";
  const letters = ["A", "B", "C", "D"];

  currentQuestion.options.forEach((optionText, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-btn";
    button.dataset.index = String(index);
    button.setAttribute("aria-label", `Option ${letters[index]}: ${optionText}`);

    const letterSpan = document.createElement("span");
    letterSpan.className = "answer-letter";
    letterSpan.setAttribute("aria-hidden", "true");
    letterSpan.textContent = letters[index];

    const textSpan = document.createElement("span");
    textSpan.textContent = optionText;

    button.appendChild(letterSpan);
    button.appendChild(textSpan);

    // Click and explicit keyboard support (Enter, Space, and Arrow keys)
    button.addEventListener("click", () => handleAnswerSelection(index));
    button.addEventListener("keydown", (event) => handleOptionKeydown(event, index));

    dom.answerOptions.appendChild(button);
  });

  startQuestionTimer();
  dom.questionText.focus();
}

/**
 * Supports keyboard navigation across the 4 answer buttons (Enter/Space/ArrowUp/ArrowDown).
 */
function handleOptionKeydown(event, index) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    handleAnswerSelection(index);
    return;
  }

  const buttons = dom.answerOptions.querySelectorAll(".answer-btn");
  if (event.key === "ArrowDown" || event.key === "ArrowRight") {
    event.preventDefault();
    const nextIdx = (index + 1) % buttons.length;
    buttons[nextIdx].focus();
  } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
    event.preventDefault();
    const prevIdx = (index - 1 + buttons.length) % buttons.length;
    buttons[prevIdx].focus();
  }
}

/* --------------------------------------------------------------------------
   7. Countdown Timer & Answer Handling
   -------------------------------------------------------------------------- */

/**
 * Clears active countdown and auto-advance timers.
 */
function stopTimers() {
  if (state.timerId !== null) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
  if (state.autoAdvanceId !== null) {
    clearTimeout(state.autoAdvanceId);
    state.autoAdvanceId = null;
  }
}

/**
 * Starts the 20-second countdown for the active question.
 */
function startQuestionTimer() {
  state.timeLeft = SECONDS_PER_QUESTION;
  dom.timerSrStatus.textContent = "";
  updateTimerUI();

  state.timerId = setInterval(() => {
    state.timeLeft -= 1;
    updateTimerUI();

    if (state.timeLeft === 5) {
      dom.timerSrStatus.textContent = "5 seconds remaining.";
    }

    if (state.timeLeft <= 0) {
      handleTimeOut();
    }
  }, 1000);
}

/**
 * Updates the visual timer badge and warning highlight when 5 seconds or fewer remain.
 */
function updateTimerUI() {
  dom.timerBadge.textContent = `${state.timeLeft}s`;
  dom.timerBadge.setAttribute("aria-label", `Time remaining: ${state.timeLeft} seconds`);
  dom.timerBadge.classList.toggle("timer-warning", state.timeLeft <= 5);
}

/**
 * Evaluates a user's selected option, updates score, shows green/red feedback, and unlocks Next.
 */
function handleAnswerSelection(selectedIndex) {
  if (state.hasAnswered) {
    return;
  }

  state.hasAnswered = true;
  stopTimers();

  const currentQuestion = state.questions[state.currentIndex];
  const isCorrect = selectedIndex === currentQuestion.correctIndex;

  if (isCorrect) {
    state.score += 1;
    dom.liveScoreText.textContent = `Score: ${state.score}`;
  }

  // Record attempt for the end-of-quiz answer review
  state.reviewHistory.push({
    question: currentQuestion.question,
    game: currentQuestion.game,
    selectedText: currentQuestion.options[selectedIndex],
    correctText: currentQuestion.options[currentQuestion.correctIndex],
    isCorrect: isCorrect,
    timedOut: false
  });

  // Highlight selected and correct buttons, and disable all options
  const buttons = dom.answerOptions.querySelectorAll(".answer-btn");
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === currentQuestion.correctIndex) {
      btn.classList.add("answer-correct");
    } else if (idx === selectedIndex && !isCorrect) {
      btn.classList.add("answer-wrong");
    }
  });

  // Show instant feedback message
  dom.feedbackBox.classList.remove("d-none", "feedback-correct", "feedback-wrong");
  if (isCorrect) {
    dom.feedbackBox.classList.add("feedback-correct");
    dom.feedbackTitle.textContent = "Correct!";
  } else {
    dom.feedbackBox.classList.add("feedback-wrong");
    dom.feedbackTitle.textContent = `Incorrect — the correct answer is "${currentQuestion.options[currentQuestion.correctIndex]}".`;
  }
  dom.feedbackDetail.textContent = currentQuestion.explanation;

  dom.nextBtn.classList.remove("d-none");
  dom.nextBtn.focus();
}

/**
 * Marks the question wrong when the 20-second timer runs out, then moves on automatically.
 */
function handleTimeOut() {
  if (state.hasAnswered) {
    return;
  }

  state.hasAnswered = true;
  stopTimers();

  const currentQuestion = state.questions[state.currentIndex];
  const correctText = currentQuestion.options[currentQuestion.correctIndex];

  state.reviewHistory.push({
    question: currentQuestion.question,
    game: currentQuestion.game,
    selectedText: "No answer (Time ran out)",
    correctText: correctText,
    isCorrect: false,
    timedOut: true
  });

  const buttons = dom.answerOptions.querySelectorAll(".answer-btn");
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === currentQuestion.correctIndex) {
      btn.classList.add("answer-correct");
    }
  });

  dom.timerSrStatus.textContent = "Time ran out. Question marked wrong. Moving on.";
  dom.feedbackBox.classList.remove("d-none", "feedback-correct", "feedback-wrong");
  dom.feedbackBox.classList.add("feedback-wrong");
  dom.feedbackTitle.textContent = `Time's up! Marked wrong — correct answer: "${correctText}".`;
  dom.feedbackDetail.textContent = "Moving to the next step automatically...";
  dom.nextBtn.classList.remove("d-none");

  // Brief pause so the player sees the correct answer before advancing automatically
  state.autoAdvanceId = setTimeout(goToNextQuestion, 1400);
}

/**
 * Advances to the next question, or finishes the quiz if all 10 questions are complete.
 */
function goToNextQuestion() {
  stopTimers();
  state.currentIndex += 1;

  if (state.currentIndex < state.questions.length) {
    renderCurrentQuestion();
  } else {
    finishQuiz();
  }
}

/* --------------------------------------------------------------------------
   8. Result Screen, Score Titles & Leaderboard Rendering
   -------------------------------------------------------------------------- */

/**
 * Maps a score (0–10) to a fun board-game player title and description.
 */
function getScoreTitle(score) {
  if (score >= 9) {
    return {
      title: "Catan Champion",
      desc: "Master strategist! You trade, build, and outwit the whole café."
    };
  }
  if (score >= 7) {
    return {
      title: "Chess Tactician",
      desc: "Sharp mind! You think three turns ahead on every tabletop."
    };
  }
  if (score >= 5) {
    return {
      title: "Ticket to Ride Explorer",
      desc: "Solid player! Always ready for a fun game night with friends."
    };
  }
  if (score >= 3) {
    return {
      title: "Casual Player",
      desc: "Here for the cozy vibes, warm coffee, and friendly rolls!"
    };
  }
  return {
    title: "Uno Wildcard",
    desc: "Unpredictable and proud—grab a fresh brew and shuffle up again!"
  };
}

/**
 * Finalizes the quiz: saves scores to localStorage, renders results, review, and leaderboard.
 */
function finishQuiz() {
  const percentage = Math.round((state.score / QUIZ_LENGTH) * 100);
  const rankInfo = getScoreTitle(state.score);
  const { previousBest, isNewBest } = saveResultToStorage(state.playerName, state.score);

  dom.resultPlayerName.textContent = state.playerName;
  dom.resultTitleBadge.textContent = rankInfo.title;
  dom.resultTitleDesc.textContent = rankInfo.desc;
  dom.resultScore.textContent = `${state.score} / ${QUIZ_LENGTH}`;
  dom.resultPercentage.textContent = `${percentage}%`;

  if (isNewBest) {
    dom.bestScoreNote.textContent = `New Personal Best! (${state.score} / ${QUIZ_LENGTH})`;
  } else {
    dom.bestScoreNote.textContent = `Your Personal Best: ${previousBest} / ${QUIZ_LENGTH}`;
  }

  renderAnswerReview();
  renderLeaderboard();
  loadSavedPlayerInfo();

  showScreen("result");
  dom.resultHeading.focus();
}

/**
 * Builds the 10-question review list safely using DOM nodes (prevents HTML injection).
 */
function renderAnswerReview() {
  dom.reviewList.innerHTML = "";

  state.reviewHistory.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = `review-item ${item.isCorrect ? "review-correct" : "review-wrong"}`;

    const topRow = document.createElement("div");
    topRow.className = "d-flex justify-content-between align-items-start gap-2 mb-2";

    const questionTitle = document.createElement("div");
    questionTitle.className = "fw-bold";
    questionTitle.textContent = `${index + 1}. ${item.question}`;

    const statusBadge = document.createElement("span");
    statusBadge.className = `review-status-badge flex-shrink-0 ${
      item.isCorrect ? "status-correct" : "status-wrong"
    }`;
    statusBadge.textContent = item.isCorrect ? "Correct" : item.timedOut ? "Timed Out" : "Wrong";

    topRow.appendChild(questionTitle);
    topRow.appendChild(statusBadge);

    const yourAnswer = document.createElement("p");
    yourAnswer.className = "mb-1 small";
    yourAnswer.textContent = `Your answer: ${item.selectedText}`;

    const correctAnswer = document.createElement("p");
    correctAnswer.className = "mb-0 small fw-semibold";
    correctAnswer.textContent = `Correct answer: ${item.correctText}`;

    li.appendChild(topRow);
    li.appendChild(yourAnswer);
    li.appendChild(correctAnswer);
    dom.reviewList.appendChild(li);
  });
}

/**
 * Renders the Top 5 leaderboard table from localStorage, or shows "No scores yet" if empty.
 */
function renderLeaderboard() {
  const entries = getLeaderboard();

  if (entries.length === 0) {
    dom.leaderboardEmpty.classList.remove("d-none");
    dom.leaderboardTableWrap.classList.add("d-none");
    dom.leaderboardBody.innerHTML = "";
    return;
  }

  dom.leaderboardEmpty.classList.add("d-none");
  dom.leaderboardTableWrap.classList.remove("d-none");
  dom.leaderboardBody.innerHTML = "";

  entries.forEach((entry, index) => {
    const row = document.createElement("tr");

    const rankCell = document.createElement("td");
    rankCell.className = "fw-bold";
    rankCell.textContent = `#${index + 1}`;

    const nameCell = document.createElement("td");
    nameCell.className = "fw-semibold";
    nameCell.textContent = entry.name;

    const scoreCell = document.createElement("td");
    const pct = Math.round((entry.score / QUIZ_LENGTH) * 100);
    scoreCell.textContent = `${entry.score} / ${QUIZ_LENGTH} (${pct}%)`;

    const dateCell = document.createElement("td");
    dateCell.className = "cafe-muted";
    dateCell.textContent = entry.date;

    row.appendChild(rankCell);
    row.appendChild(nameCell);
    row.appendChild(scoreCell);
    row.appendChild(dateCell);

    dom.leaderboardBody.appendChild(row);
  });
}
