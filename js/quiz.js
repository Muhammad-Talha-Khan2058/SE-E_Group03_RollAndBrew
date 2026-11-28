/**
 * Roll & Brew Board Game Café — "Find Your Perfect Game" Quiz
 *
 * Pure vanilla JavaScript (no jQuery, no external frameworks).
 * All quiz questions and board games are stored in arrays below and rendered
 * dynamically into the DOM.
 */

'use strict';

/* ============================================================================
   1. QUIZ QUESTIONS DATA
   Each question object defines its id, prompt text, helper hint, whether it
   is optional (enables the Skip button), its scoring weight, and clickable options.
   ============================================================================ */
const QUIZ_QUESTIONS = [
  {
    id: 'players',
    text: 'How many people are playing?',
    hint: 'Pick the size of your table today.',
    optional: false,
    weight: 30,
    options: [
      { value: '1-2', label: '1–2 Players', description: 'Solo session or cozy duo' },
      { value: '3-4', label: '3–4 Players', description: 'Classic café table group' },
      { value: '5-6', label: '5–6 Players', description: 'Lively medium-sized group' },
      { value: '7+', label: '7+ Players', description: 'Big party or crowd' }
    ]
  },
  {
    id: 'playMode',
    text: 'Do you want a team/group game or every player for themselves?',
    hint: 'Optional — skip if your group does not mind either way.',
    optional: true,
    weight: 12,
    options: [
      { value: 'team', label: 'Team / Cooperative', description: 'Work together toward a shared goal' },
      { value: 'solo', label: 'Every player for themselves', description: 'Friendly competition for one winner' }
    ]
  },
  {
    id: 'usesDice',
    text: 'Should it involve dice?',
    hint: 'Tell us if rolling dice is a must or something to avoid.',
    optional: false,
    weight: 30,
    options: [
      { value: 'yes', label: 'Yes, bring on the dice!', description: 'Luck, tension, and satisfying rolls' },
      { value: 'no', label: 'No dice preferred', description: 'Cards, tiles, or pure planning instead' }
    ]
  },
  {
    id: 'duration',
    text: 'How much time do you have?',
    hint: 'Optional — skip if you have an open afternoon.',
    optional: true,
    weight: 12,
    options: [
      { value: 'under-30', label: 'Under 30 min', description: 'Quick round with a coffee' },
      { value: '30-60', label: '30–60 min', description: 'Standard café session' },
      { value: '1-2-hours', label: '1–2 hours', description: 'Settle in for a full game' },
      { value: '2+-hours', label: '2+ hours', description: 'Deep tabletop marathon' }
    ]
  },
  {
    id: 'complexity',
    text: 'How complex should it be?',
    hint: 'Optional — skip if any rules weight is fine.',
    optional: true,
    weight: 12,
    options: [
      { value: 'easy', label: 'Easy to learn', description: 'Explain the rules in 2 minutes' },
      { value: 'medium', label: 'Medium', description: 'Balanced rules with rewarding choices' },
      { value: 'strategic', label: 'Strategic / Deep', description: 'Rich planning and long-term tactics' }
    ]
  },
  {
    id: 'mood',
    text: 'What mood are you in?',
    hint: 'Optional — skip if you are open to any vibe.',
    optional: true,
    weight: 12,
    options: [
      { value: 'relaxed', label: 'Relaxed', description: 'Easygoing pace and good conversation' },
      { value: 'competitive', label: 'Competitive', description: 'Outsmart and outscore the table' },
      { value: 'funny', label: 'Funny / Party', description: 'Big laughs and playful chaos' },
      { value: 'mystery', label: 'Mystery / Story', description: 'Clues, secrets, and narrative twists' }
    ]
  },
  {
    id: 'components',
    text: 'Do you want cards, a board, or both?',
    hint: 'Optional — skip if table setup does not matter.',
    optional: true,
    weight: 10,
    options: [
      { value: 'cards', label: 'Cards', description: 'Compact setup and quick turns' },
      { value: 'board', label: 'Board', description: 'Maps, tiles, or classic tabletop boards' },
      { value: 'both', label: 'Both cards & board', description: 'Full board game experience' }
    ]
  }
];

/* ============================================================================
   2. BOARD GAMES CATALOG DATA (16 games)
   Each game contains display metadata plus a `criteria` object whose values
   correspond directly to the option values in QUIZ_QUESTIONS.
   ============================================================================ */
const BOARD_GAMES = [
  {
    id: 'catan',
    name: 'Catan',
    description: 'Trade sheep, brick, and wheat while racing to build settlements and roads across a modular island.',
    playersLabel: '3–4 players',
    playTimeLabel: '60–120 min',
    difficultyLabel: 'Medium',
    tags: ['Dice', 'Trading', 'Competitive', 'Board & Cards'],
    criteria: {
      players: ['3-4'],
      playMode: ['solo'],
      usesDice: 'yes',
      duration: ['1-2-hours'],
      complexity: 'medium',
      mood: ['competitive'],
      components: 'both'
    }
  },
  {
    id: 'monopoly',
    name: 'Monopoly',
    description: 'Roll the dice, buy iconic properties, negotiate deals, and build an empire—just watch out for rent!',
    playersLabel: '3–6 players',
    playTimeLabel: '2+ hours',
    difficultyLabel: 'Medium',
    tags: ['Dice', 'Classic', 'Competitive', 'Board & Cards'],
    criteria: {
      players: ['3-4', '5-6'],
      playMode: ['solo'],
      usesDice: 'yes',
      duration: ['2+-hours'],
      complexity: 'medium',
      mood: ['competitive'],
      components: 'both'
    }
  },
  {
    id: 'uno',
    name: 'Uno',
    description: 'Fast-paced color and number matching packed with Draw Two and Reverse surprises for any group size.',
    playersLabel: '2–10 players',
    playTimeLabel: '15–30 min',
    difficultyLabel: 'Easy to learn',
    tags: ['No Dice', 'Cards', 'Funny / Party', 'Quick'],
    criteria: {
      players: ['1-2', '3-4', '5-6', '7+'],
      playMode: ['solo'],
      usesDice: 'no',
      duration: ['under-30'],
      complexity: 'easy',
      mood: ['funny', 'relaxed'],
      components: 'cards'
    }
  },
  {
    id: 'ticket-to-ride',
    name: 'Ticket to Ride',
    description: 'Collect colorful train cards to claim railway routes across the map before rivals block your path.',
    playersLabel: '2–5 players',
    playTimeLabel: '45–60 min',
    difficultyLabel: 'Easy to learn',
    tags: ['No Dice', 'Relaxed', 'Route Building', 'Board & Cards'],
    criteria: {
      players: ['1-2', '3-4', '5-6'],
      playMode: ['solo'],
      usesDice: 'no',
      duration: ['30-60'],
      complexity: 'easy',
      mood: ['relaxed', 'competitive'],
      components: 'both'
    }
  },
  {
    id: 'codenames',
    name: 'Codenames',
    description: 'Two teams compete as Spymasters give clever one-word clues to connect secret agent words on the table.',
    playersLabel: '4–8+ players',
    playTimeLabel: '15–30 min',
    difficultyLabel: 'Easy to learn',
    tags: ['No Dice', 'Team Game', 'Wordplay', 'Cards'],
    criteria: {
      players: ['3-4', '5-6', '7+'],
      playMode: ['team'],
      usesDice: 'no',
      duration: ['under-30'],
      complexity: 'easy',
      mood: ['funny', 'mystery'],
      components: 'cards'
    }
  },
  {
    id: 'pandemic',
    name: 'Pandemic',
    description: 'Join forces as a specialist team racing around the globe to treat outbreaks and discover four cures together.',
    playersLabel: '2–4 players',
    playTimeLabel: '45–60 min',
    difficultyLabel: 'Medium',
    tags: ['No Dice', 'Cooperative', 'Story / Tension', 'Board & Cards'],
    criteria: {
      players: ['1-2', '3-4'],
      playMode: ['team'],
      usesDice: 'no',
      duration: ['30-60'],
      complexity: 'medium',
      mood: ['mystery', 'competitive'],
      components: 'both'
    }
  },
  {
    id: 'carcassonne',
    name: 'Carcassonne',
    description: 'Take turns drawing and placing countryside tiles to build cities, roads, and monasteries bit by bit.',
    playersLabel: '2–5 players',
    playTimeLabel: '35–45 min',
    difficultyLabel: 'Easy to learn',
    tags: ['No Dice', 'Relaxed', 'Tile Placement', 'Board'],
    criteria: {
      players: ['1-2', '3-4', '5-6'],
      playMode: ['solo'],
      usesDice: 'no',
      duration: ['30-60'],
      complexity: 'easy',
      mood: ['relaxed'],
      components: 'board'
    }
  },
  {
    id: 'risk',
    name: 'Risk',
    description: 'Command armies, roll dramatic dice battles, and forge fragile alliances in a grand quest for world domination.',
    playersLabel: '2–6 players',
    playTimeLabel: '2+ hours',
    difficultyLabel: 'Strategic / Deep',
    tags: ['Dice', 'Strategic', 'Competitive', 'Board'],
    criteria: {
      players: ['1-2', '3-4', '5-6'],
      playMode: ['solo'],
      usesDice: 'yes',
      duration: ['2+-hours'],
      complexity: 'strategic',
      mood: ['competitive'],
      components: 'board'
    }
  },
  {
    id: 'clue',
    name: 'Clue (Cluedo)',
    description: 'Roll between mansion rooms, interrogate suspects, and deduce who committed the crime, where, and with what.',
    playersLabel: '3–6 players',
    playTimeLabel: '45 min',
    difficultyLabel: 'Easy to learn',
    tags: ['Dice', 'Mystery', 'Deduction', 'Board & Cards'],
    criteria: {
      players: ['3-4', '5-6'],
      playMode: ['solo'],
      usesDice: 'yes',
      duration: ['30-60'],
      complexity: 'easy',
      mood: ['mystery'],
      components: 'both'
    }
  },
  {
    id: 'dixit',
    name: 'Dixit',
    description: 'Share imaginative clues inspired by dreamlike illustrated cards while guessing which artwork belongs to the storyteller.',
    playersLabel: '3–8 players',
    playTimeLabel: '30–45 min',
    difficultyLabel: 'Easy to learn',
    tags: ['No Dice', 'Creative', 'Relaxed', 'Cards'],
    criteria: {
      players: ['3-4', '5-6', '7+'],
      playMode: ['solo'],
      usesDice: 'no',
      duration: ['30-60'],
      complexity: 'easy',
      mood: ['relaxed', 'funny'],
      components: 'cards'
    }
  },
  {
    id: 'exploding-kittens',
    name: 'Exploding Kittens',
    description: 'A quick, chaotic card game of kitty-powered Russian roulette packed with defuses, skips, and silly sabotage.',
    playersLabel: '2–5 players',
    playTimeLabel: '15 min',
    difficultyLabel: 'Easy to learn',
    tags: ['No Dice', 'Funny / Party', 'Quick', 'Cards'],
    criteria: {
      players: ['1-2', '3-4', '5-6'],
      playMode: ['solo'],
      usesDice: 'no',
      duration: ['under-30'],
      complexity: 'easy',
      mood: ['funny'],
      components: 'cards'
    }
  },
  {
    id: 'chess',
    name: 'Chess',
    description: 'The timeless two-player battle of pure foresight, sacrifices, and tactical traps with zero luck involved.',
    playersLabel: '2 players',
    playTimeLabel: '30–60 min',
    difficultyLabel: 'Strategic / Deep',
    tags: ['No Dice', '2 Players', 'Strategic', 'Board'],
    criteria: {
      players: ['1-2'],
      playMode: ['solo'],
      usesDice: 'no',
      duration: ['30-60'],
      complexity: 'strategic',
      mood: ['competitive'],
      components: 'board'
    }
  },
  {
    id: 'scrabble',
    name: 'Scrabble',
    description: 'Sip your latte and craft high-scoring crosswords across bonus squares in this cozy word-building classic.',
    playersLabel: '2–4 players',
    playTimeLabel: '60–90 min',
    difficultyLabel: 'Medium',
    tags: ['No Dice', 'Word Game', 'Relaxed', 'Board'],
    criteria: {
      players: ['1-2', '3-4'],
      playMode: ['solo'],
      usesDice: 'no',
      duration: ['1-2-hours'],
      complexity: 'medium',
      mood: ['relaxed', 'competitive'],
      components: 'board'
    }
  },
  {
    id: 'jenga',
    name: 'Jenga',
    description: 'Pull wooden blocks one by one and stack them higher until someone’s steady hand finally topples the tower.',
    playersLabel: '2–8+ players',
    playTimeLabel: '15–25 min',
    difficultyLabel: 'Easy to learn',
    tags: ['No Dice', 'Party', 'Dexterity', 'Quick'],
    criteria: {
      players: ['1-2', '3-4', '5-6', '7+'],
      playMode: ['solo'],
      usesDice: 'no',
      duration: ['under-30'],
      complexity: 'easy',
      mood: ['funny', 'relaxed'],
      components: 'board'
    }
  },
  {
    id: 'king-of-tokyo',
    name: 'King of Tokyo',
    description: 'Play as giant monsters rolling chunky custom dice to smash Tokyo, earn energy, and trigger wild power cards.',
    playersLabel: '2–6 players',
    playTimeLabel: '30 min',
    difficultyLabel: 'Easy to learn',
    tags: ['Dice', 'Monsters', 'Funny / Competitive', 'Board & Cards'],
    criteria: {
      players: ['1-2', '3-4', '5-6'],
      playMode: ['solo'],
      usesDice: 'yes',
      duration: ['under-30'],
      complexity: 'easy',
      mood: ['funny', 'competitive'],
      components: 'both'
    }
  },
  {
    id: 'betrayal',
    name: 'Betrayal at House on the Hill',
    description: 'Explore a haunted mansion together with dice checks until one player turns traitor in one of 50 spooky stories.',
    playersLabel: '3–6 players',
    playTimeLabel: '60–90 min',
    difficultyLabel: 'Medium',
    tags: ['Dice', 'Story / Horror', 'Team & Traitor', 'Board & Cards'],
    criteria: {
      players: ['3-4', '5-6'],
      playMode: ['team', 'solo'],
      usesDice: 'yes',
      duration: ['1-2-hours'],
      complexity: 'medium',
      mood: ['mystery'],
      components: 'both'
    }
  }
];

/* ============================================================================
   3. CONSTANTS & APPLICATION STATE
   ============================================================================ */
const STORAGE_KEY = 'rollAndBrewQuizState_v1';
const LOW_MATCH_THRESHOLD = 55; // Below 55% triggers the "No perfect match" banner

const quizState = {
  currentQuestionIndex: 0,
  answers: {}, // Map of questionId -> selected option value (or 'skip')
  lastScoredResults: null,
  lastIsLowConfidence: false
};

/* Cached DOM element references */
const dom = {
  startScreen: document.getElementById('start-screen'),
  questionScreen: document.getElementById('question-screen'),
  resultScreen: document.getElementById('result-screen'),
  lastResultBanner: document.getElementById('last-result-banner'),
  startQuizBtn: document.getElementById('start-quiz-btn'),
  progressLabel: document.getElementById('progress-label'),
  optionalBadge: document.getElementById('optional-badge'),
  progressBar: document.getElementById('quiz-progress-bar'),
  progressBarFill: document.getElementById('progress-bar-fill'),
  questionText: document.getElementById('question-text'),
  questionHint: document.getElementById('question-hint'),
  optionsContainer: document.getElementById('options-container'),
  backBtn: document.getElementById('back-btn'),
  skipBtn: document.getElementById('skip-btn'),
  nextBtn: document.getElementById('next-btn'),
  resultHeading: document.getElementById('result-heading'),
  resultNotice: document.getElementById('result-notice'),
  bestMatchContainer: document.getElementById('best-match-container'),
  runnerUpsContainer: document.getElementById('runner-ups-container'),
  retakeBtn: document.getElementById('retake-btn'),
  saveResultBtn: document.getElementById('save-result-btn'),
  saveFeedback: document.getElementById('save-feedback')
};

/* ============================================================================
   4. SCORING FUNCTION (SEPARATE & EXPLAINABLE FOR VIVA)
   ============================================================================ */
/**
 * Calculates compatibility scores and match percentages for all board games
 * based on the user's quiz answers.
 *
 * Scoring design:
 * - "players" (30 pts) and "usesDice" (30 pts) are the two heaviest weights.
 * - Optional criteria ("playMode", "duration", "complexity", "mood", "components")
 *   carry smaller weights (10–12 pts).
 * - Any skipped question ('skip' or missing) gives 0 points and is excluded from
 *   the maximum possible denominator so skipping optional questions does not
 *   artificially deflate a strong match.
 * - Games are sorted from highest percentage to lowest with deterministic
 *   tie-breakers (player match -> dice match -> alphabetical name).
 *
 * @param {Array<Object>} games - The catalog of board game objects.
 * @param {Object} userAnswers - Key-value map of questionId -> answer value.
 * @returns {{ rankedGames: Array<Object>, isLowConfidence: boolean, anyPlayerMatched: boolean }}
 */
function calculateGameScores(games, userAnswers) {
  // Build a weight lookup map directly from QUIZ_QUESTIONS so weights stay in sync.
  const weights = {};
  QUIZ_QUESTIONS.forEach(function (question) {
    weights[question.id] = question.weight;
  });

  // Compute the maximum points possible across only the questions the user answered.
  let maxPossiblePoints = 0;
  Object.keys(weights).forEach(function (questionId) {
    const answer = userAnswers[questionId];
    if (answer && answer !== 'skip') {
      maxPossiblePoints += weights[questionId];
    }
  });

  // Guard against division by zero if no answers were provided.
  if (maxPossiblePoints === 0) {
    maxPossiblePoints = 1;
  }

  let anyPlayerMatched = false;

  const scoredGames = games.map(function (game) {
    let earnedPoints = 0;
    let playerMatched = false;
    let diceMatched = false;
    const c = game.criteria;

    // 1. Heavy weight: Player count (array membership check)
    if (userAnswers.players && userAnswers.players !== 'skip') {
      if (Array.isArray(c.players) && c.players.includes(userAnswers.players)) {
        earnedPoints += weights.players;
        playerMatched = true;
        anyPlayerMatched = true;
      }
    } else {
      playerMatched = true; // Not filtered by player count if skipped
    }

    // 2. Heavy weight: Uses dice (yes / no exact match)
    if (userAnswers.usesDice && userAnswers.usesDice !== 'skip') {
      if (c.usesDice === userAnswers.usesDice) {
        earnedPoints += weights.usesDice;
        diceMatched = true;
      }
    } else {
      diceMatched = true;
    }

    // 3. Optional criterion: Play mode (team vs every player for themselves)
    if (userAnswers.playMode && userAnswers.playMode !== 'skip') {
      if (Array.isArray(c.playMode) && c.playMode.includes(userAnswers.playMode)) {
        earnedPoints += weights.playMode;
      }
    }

    // 4. Optional criterion: Duration
    if (userAnswers.duration && userAnswers.duration !== 'skip') {
      if (Array.isArray(c.duration) && c.duration.includes(userAnswers.duration)) {
        earnedPoints += weights.duration;
      }
    }

    // 5. Optional criterion: Complexity
    if (userAnswers.complexity && userAnswers.complexity !== 'skip') {
      if (c.complexity === userAnswers.complexity) {
        earnedPoints += weights.complexity;
      }
    }

    // 6. Optional criterion: Mood
    if (userAnswers.mood && userAnswers.mood !== 'skip') {
      if (Array.isArray(c.mood) && c.mood.includes(userAnswers.mood)) {
        earnedPoints += weights.mood;
      }
    }

    // 7. Optional criterion: Components (cards, board, or both)
    if (userAnswers.components && userAnswers.components !== 'skip') {
      if (c.components === userAnswers.components) {
        earnedPoints += weights.components;
      }
    }

    // Convert raw points into a 0-100 percentage.
    const matchPercentage = Math.round((earnedPoints / maxPossiblePoints) * 100);

    return {
      game: game,
      rawScore: earnedPoints,
      maxPossiblePoints: maxPossiblePoints,
      matchPercentage: matchPercentage,
      playerMatched: playerMatched,
      diceMatched: diceMatched
    };
  });

  // Sort highest match first; resolve ties cleanly and deterministically.
  scoredGames.sort(function (a, b) {
    if (b.matchPercentage !== a.matchPercentage) {
      return b.matchPercentage - a.matchPercentage;
    }
    if (b.rawScore !== a.rawScore) {
      return b.rawScore - a.rawScore;
    }
    if (a.playerMatched !== b.playerMatched) {
      return a.playerMatched ? -1 : 1;
    }
    if (a.diceMatched !== b.diceMatched) {
      return a.diceMatched ? -1 : 1;
    }
    return a.game.name.localeCompare(b.game.name);
  });

  const bestResult = scoredGames[0];
  const isLowConfidence =
    !anyPlayerMatched ||
    !bestResult ||
    !bestResult.playerMatched ||
    bestResult.matchPercentage < LOW_MATCH_THRESHOLD;

  return {
    rankedGames: scoredGames,
    isLowConfidence: isLowConfidence,
    anyPlayerMatched: anyPlayerMatched
  };
}

/* ============================================================================
   5. LOCALSTORAGE HELPERS (WITH CORRUPTION & MISSING DATA PROTECTION)
   ============================================================================ */
/**
 * Safely loads the saved quiz state from localStorage.
 * Returns null if missing, unreadable, or malformed so the app never crashes.
 *
 * @returns {Object|null}
 */
function loadSavedQuizState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);

    // Validate expected structure and ensure referenced games still exist.
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !parsed.answers ||
      typeof parsed.answers !== 'object' ||
      typeof parsed.bestGameId !== 'string'
    ) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    const matchingGame = BOARD_GAMES.find(function (g) {
      return g.id === parsed.bestGameId;
    });

    if (!matchingGame) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch (error) {
    // Corrupted JSON or blocked storage: clean up safely and return null.
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (cleanupError) {
      // Ignore storage errors in restricted environments.
    }
    return null;
  }
}

/**
 * Saves the user's answers and top recommendation into localStorage.
 *
 * @param {Object} answers - User's answers object.
 * @param {Array<Object>} rankedGames - Sorted scoring results.
 * @param {boolean} isLowConfidence - Whether the match fell below threshold.
 * @returns {boolean} True if saving succeeded, false otherwise.
 */
function saveQuizState(answers, rankedGames, isLowConfidence) {
  if (!Array.isArray(rankedGames) || rankedGames.length === 0) {
    return false;
  }

  const topEntry = rankedGames[0];
  const payload = {
    bestGameId: topEntry.game.id,
    bestGameName: topEntry.game.name,
    bestPercentage: topEntry.matchPercentage,
    isLowConfidence: Boolean(isLowConfidence),
    answers: Object.assign({}, answers),
    savedAt: new Date().toISOString()
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch (error) {
    return false;
  }
}

/* ============================================================================
   6. SCREEN NAVIGATION & RENDERING FUNCTIONS
   ============================================================================ */
/**
 * Switches the active visible section between 'start', 'question', and 'result'.
 *
 * @param {'start'|'question'|'result'} screenName
 */
function showScreen(screenName) {
  dom.startScreen.classList.toggle('d-none', screenName !== 'start');
  dom.questionScreen.classList.toggle('d-none', screenName !== 'question');
  dom.resultScreen.classList.toggle('d-none', screenName !== 'result');
}

/**
 * Escapes HTML special characters to safely insert dynamic text into templates.
 *
 * @param {string} value
 * @returns {string}
 */
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Displays the "Your last result: X" banner on the start screen whenever valid
 * saved data exists in localStorage, and wires the button to inspect it.
 */
function renderStartScreenSavedBanner() {
  const saved = loadSavedQuizState();

  if (!saved) {
    dom.lastResultBanner.classList.add('d-none');
    dom.lastResultBanner.innerHTML = '';
    return;
  }

  const matchedGame = BOARD_GAMES.find(function (g) {
    return g.id === saved.bestGameId;
  });

  if (!matchedGame) {
    dom.lastResultBanner.classList.add('d-none');
    return;
  }

  const safeName = escapeHtml(matchedGame.name);
  const safePercent = Number.isFinite(saved.bestPercentage) ? saved.bestPercentage : 0;
  const safeDesc = escapeHtml(matchedGame.description);

  dom.lastResultBanner.innerHTML = `
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
      <div>
        <p class="last-result-title mb-1">Your last result: ${safeName} (${safePercent}% match)</p>
        <p class="last-result-meta mb-1">${safeDesc}</p>
        <p class="small fw-semibold mb-0" style="color: var(--brown-medium);">
          ${escapeHtml(matchedGame.playersLabel)} &bull; ${escapeHtml(matchedGame.playTimeLabel)} &bull; ${escapeHtml(matchedGame.difficultyLabel)}
        </p>
      </div>
      <div class="flex-shrink-0">
        <button type="button" id="view-saved-result-btn" class="btn btn-cafe-outline btn-sm px-3 py-2">
          View Saved Result
        </button>
      </div>
    </div>
  `;

  dom.lastResultBanner.classList.remove('d-none');

  const viewSavedBtn = document.getElementById('view-saved-result-btn');
  if (viewSavedBtn) {
    viewSavedBtn.addEventListener('click', function () {
      restoreSavedResult();
    });
  }
}

/**
 * Restores saved answers from localStorage, re-runs scoring, and opens the
 * full result screen so a reload preserves the previous result cleanly.
 */
function restoreSavedResult() {
  const saved = loadSavedQuizState();
  if (!saved) {
    return;
  }

  quizState.answers = Object.assign({}, saved.answers);
  const evaluation = calculateGameScores(BOARD_GAMES, quizState.answers);
  quizState.lastScoredResults = evaluation.rankedGames;
  quizState.lastIsLowConfidence = evaluation.isLowConfidence;

  renderResults(evaluation.rankedGames, evaluation.isLowConfidence);
  showScreen('result');
}

/**
 * Renders the question at `quizState.currentQuestionIndex`, updates the progress
 * bar, builds clickable/keyboard-accessible option cards, and sets button states.
 */
function renderCurrentQuestion() {
  const index = quizState.currentQuestionIndex;
  const total = QUIZ_QUESTIONS.length;
  const question = QUIZ_QUESTIONS[index];
  const savedAnswer = quizState.answers[question.id];

  // Update progress label & accessible progress bar
  const stepNumber = index + 1;
  const progressPercent = Math.round((stepNumber / total) * 100);
  dom.progressLabel.textContent = 'Question ' + stepNumber + ' of ' + total;
  dom.progressBar.setAttribute('aria-valuenow', String(stepNumber));
  dom.progressBar.setAttribute('aria-valuemax', String(total));
  dom.progressBarFill.style.width = progressPercent + '%';

  // Update optional badge & Skip button visibility
  const isOptional = Boolean(question.optional);
  dom.optionalBadge.classList.toggle('d-none', !isOptional);
  dom.skipBtn.classList.toggle('d-none', !isOptional);

  // Set question heading & hint
  dom.questionText.textContent = question.text;
  dom.questionHint.textContent = question.hint || '';

  // Render option cards dynamically from QUIZ_QUESTIONS
  dom.optionsContainer.innerHTML = '';

  question.options.forEach(function (option) {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'option-card';
    button.setAttribute('role', 'radio');
    button.setAttribute('data-value', option.value);

    const isSelected = savedAnswer === option.value;
    if (isSelected) {
      button.classList.add('selected');
    }
    button.setAttribute('aria-checked', isSelected ? 'true' : 'false');

    button.innerHTML = `
      <span>
        <span class="option-label">${escapeHtml(option.label)}</span>
        <span class="option-desc">${escapeHtml(option.description)}</span>
      </span>
      <span class="option-indicator" aria-hidden="true">&#10003;</span>
    `;

    // Mouse / touch selection
    button.addEventListener('click', function () {
      selectOption(question.id, option.value);
    });

    // Explicit keyboard selection for Enter and Space, plus Arrow key navigation
    button.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectOption(question.id, option.value);
        return;
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const cards = Array.from(dom.optionsContainer.querySelectorAll('.option-card'));
        const currentIdx = cards.indexOf(button);
        if (currentIdx === -1 || cards.length === 0) {
          return;
        }
        const delta = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
        const nextIdx = (currentIdx + delta + cards.length) % cards.length;
        cards[nextIdx].focus();
      }
    });

    col.appendChild(button);
    dom.optionsContainer.appendChild(col);
  });

  // Back button goes back to Start screen on Q1, or previous question otherwise
  dom.backBtn.textContent = index === 0 ? 'Back to Start' : 'Back';

  // Next button reads "See Results" on the final question and stays disabled until chosen
  dom.nextBtn.textContent = index === total - 1 ? 'See Results' : 'Next';
  const hasRealSelection = Boolean(savedAnswer && savedAnswer !== 'skip');
  dom.nextBtn.disabled = !hasRealSelection;

  // Move focus to the question heading for smooth screen-reader & keyboard flow
  dom.questionText.focus();
}

/**
 * Records a chosen option for the current question, updates UI selection state,
 * and enables the Next button.
 *
 * @param {string} questionId
 * @param {string} optionValue
 */
function selectOption(questionId, optionValue) {
  quizState.answers[questionId] = optionValue;

  const optionButtons = dom.optionsContainer.querySelectorAll('.option-card');
  optionButtons.forEach(function (btn) {
    const isMatch = btn.getAttribute('data-value') === optionValue;
    btn.classList.toggle('selected', isMatch);
    btn.setAttribute('aria-checked', isMatch ? 'true' : 'false');
  });

  dom.nextBtn.disabled = false;
}

/**
 * Advances to the next question or finishes the quiz and computes results.
 */
function goToNextStep() {
  if (quizState.currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
    quizState.currentQuestionIndex += 1;
    renderCurrentQuestion();
  } else {
    finishQuiz();
  }
}

/**
 * Handles skipping an optional question: assigns 'skip' (0 points) and moves on.
 */
function handleSkipQuestion() {
  const currentQuestion = QUIZ_QUESTIONS[quizState.currentQuestionIndex];
  if (!currentQuestion || !currentQuestion.optional) {
    return;
  }

  quizState.answers[currentQuestion.id] = 'skip';
  goToNextStep();
}

/**
 * Handles going back to the previous question or back to the start screen.
 */
function handleBackStep() {
  if (quizState.currentQuestionIndex > 0) {
    quizState.currentQuestionIndex -= 1;
    renderCurrentQuestion();
  } else {
    renderStartScreenSavedBanner();
    showScreen('start');
  }
}

/**
 * Computes game rankings, saves the result to localStorage, and renders the
 * top 3 recommendations on the result screen.
 */
function finishQuiz() {
  const evaluation = calculateGameScores(BOARD_GAMES, quizState.answers);
  quizState.lastScoredResults = evaluation.rankedGames;
  quizState.lastIsLowConfidence = evaluation.isLowConfidence;

  // Automatically persist the completed quiz result and answers
  saveQuizState(quizState.answers, evaluation.rankedGames, evaluation.isLowConfidence);
  renderStartScreenSavedBanner();

  renderResults(evaluation.rankedGames, evaluation.isLowConfidence);
  showScreen('result');
  dom.resultHeading.focus();
}

/**
 * Renders the top game card and 2 runner-up cards into the result screen,
 * including low-match notices and tie indicators.
 *
 * @param {Array<Object>} rankedGames
 * @param {boolean} isLowConfidence
 */
function renderResults(rankedGames, isLowConfidence) {
  dom.saveFeedback.textContent = '';

  if (!Array.isArray(rankedGames) || rankedGames.length === 0) {
    dom.resultNotice.textContent = 'No perfect match, closest options:';
    dom.resultNotice.classList.remove('d-none');
    dom.bestMatchContainer.innerHTML = '';
    dom.runnerUpsContainer.innerHTML = '';
    return;
  }

  // Show friendly fallback message when player count ruled games out or score is very low
  if (isLowConfidence) {
    dom.resultNotice.textContent =
      'No perfect match, closest options: We could not find a 100% fit for every preference, so here are the closest games on our shelf.';
    dom.resultNotice.classList.remove('d-none');
  } else {
    dom.resultNotice.classList.add('d-none');
    dom.resultNotice.textContent = '';
  }

  const best = rankedGames[0];
  const runnerUps = rankedGames.slice(1, 3);

  // Check if #1 and #2 tied on percentage
  const hasTopTie = runnerUps.length > 0 && runnerUps[0].matchPercentage === best.matchPercentage;
  const tieLabel = hasTopTie ? ' &middot; Tied top score' : '';

  const bestTagsHtml = best.game.tags
    .map(function (tag) {
      return '<span class="game-tag">' + escapeHtml(tag) + '</span>';
    })
    .join('');

  dom.bestMatchContainer.innerHTML = `
    <article class="best-match-card p-4 p-md-5" aria-label="Best matching board game">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <span class="badge rounded-pill cafe-pill">Top Recommendation${tieLabel}</span>
        <span class="match-badge">${best.matchPercentage}% match</span>
      </div>

      <h3 class="h2 quiz-heading mb-2">${escapeHtml(best.game.name)}</h3>
      <p class="mb-4">${escapeHtml(best.game.description)}</p>

      <div class="row g-2 mb-3">
        <div class="col-12 col-sm-4">
          <div class="game-meta-box">
            <span class="game-meta-label">Players</span>
            <span class="game-meta-value">${escapeHtml(best.game.playersLabel)}</span>
          </div>
        </div>
        <div class="col-6 col-sm-4">
          <div class="game-meta-box">
            <span class="game-meta-label">Play Time</span>
            <span class="game-meta-value">${escapeHtml(best.game.playTimeLabel)}</span>
          </div>
        </div>
        <div class="col-6 col-sm-4">
          <div class="game-meta-box">
            <span class="game-meta-label">Difficulty</span>
            <span class="game-meta-value">${escapeHtml(best.game.difficultyLabel)}</span>
          </div>
        </div>
      </div>

      <div class="d-flex flex-wrap gap-2" aria-label="Game tags">
        ${bestTagsHtml}
      </div>
    </article>
  `;

  // Render 2 runner-up cards
  const runnerUpCardsHtml = runnerUps
    .map(function (entry, idx) {
      const rankNum = idx + 2;
      const isTiedWithPrev =
        (idx === 0 && entry.matchPercentage === best.matchPercentage) ||
        (idx === 1 && entry.matchPercentage === runnerUps[0].matchPercentage);
      const tiedBadge = isTiedWithPrev ? ' (Tied)' : '';
      const tagsHtml = entry.game.tags
        .slice(0, 3)
        .map(function (tag) {
          return '<span class="game-tag">' + escapeHtml(tag) + '</span>';
        })
        .join('');

      return `
        <div class="col-12 col-md-6">
          <article class="runner-up-card p-4 d-flex flex-column justify-content-between" aria-label="Runner-up recommendation ${rankNum}">
            <div>
              <div class="d-flex justify-content-between align-items-center gap-2 mb-2">
                <span class="small fw-semibold text-uppercase" style="color: var(--text-muted);">Runner-up #${rankNum}${tiedBadge}</span>
                <span class="match-badge-runner">${entry.matchPercentage}% match</span>
              </div>
              <h4 class="h5 quiz-heading mb-2">${escapeHtml(entry.game.name)}</h4>
              <p class="small mb-3" style="color: var(--text-muted);">${escapeHtml(entry.game.description)}</p>
            </div>
            <div>
              <p class="small fw-semibold mb-2" style="color: var(--brown-dark);">
                ${escapeHtml(entry.game.playersLabel)} &bull; ${escapeHtml(entry.game.playTimeLabel)} &bull; ${escapeHtml(entry.game.difficultyLabel)}
              </p>
              <div class="d-flex flex-wrap gap-1">
                ${tagsHtml}
              </div>
            </div>
          </article>
        </div>
      `;
    })
    .join('');

  dom.runnerUpsContainer.innerHTML = `
    <h3 class="h5 quiz-heading mb-3">Two Great Runner-Ups</h3>
    <div class="row g-3">
      ${runnerUpCardsHtml}
    </div>
  `;
}

/* ============================================================================
   7. INITIALIZATION & EVENT LISTENERS
   ============================================================================ */
/**
 * Starts a fresh quiz attempt from Question 1.
 */
function startNewQuiz() {
  quizState.currentQuestionIndex = 0;
  quizState.answers = {};
  dom.saveFeedback.textContent = '';
  renderCurrentQuestion();
  showScreen('question');
}

/**
 * Explicit save action for the "Save this result" button.
 */
function handleSaveResultClick() {
  if (!quizState.lastScoredResults) {
    return;
  }

  const savedOk = saveQuizState(
    quizState.answers,
    quizState.lastScoredResults,
    quizState.lastIsLowConfidence
  );

  if (savedOk) {
    renderStartScreenSavedBanner();
    dom.saveFeedback.textContent =
      'Result saved! Reloading this page will remember your match.';
  } else {
    dom.saveFeedback.textContent =
      'Could not access browser storage in this window, but your result is ready above.';
  }
}

/**
 * Bootstraps the quiz on page load: attaches event listeners and restores any
 * saved previous result from localStorage.
 */
function initQuizPage() {
  dom.startQuizBtn.addEventListener('click', startNewQuiz);
  dom.backBtn.addEventListener('click', handleBackStep);
  dom.skipBtn.addEventListener('click', handleSkipQuestion);
  dom.nextBtn.addEventListener('click', goToNextStep);
  dom.retakeBtn.addEventListener('click', startNewQuiz);
  dom.saveResultBtn.addEventListener('click', handleSaveResultClick);

  // Show "Your last result: X" on the start screen if saved data exists
  renderStartScreenSavedBanner();

  // If a valid saved result exists on reload, also display the previous result
  // right away while keeping the start banner accessible, or show start screen.
  // Checking saved state: display the start screen with the "Your last result: X"
  // card and if the URL or state needs direct view, user can click "View Saved Result".
  const saved = loadSavedQuizState();
  if (saved) {
    quizState.answers = Object.assign({}, saved.answers);
    const evaluation = calculateGameScores(BOARD_GAMES, quizState.answers);
    quizState.lastScoredResults = evaluation.rankedGames;
    quizState.lastIsLowConfidence = evaluation.isLowConfidence;
  }
}

document.addEventListener('DOMContentLoaded', initQuizPage);
