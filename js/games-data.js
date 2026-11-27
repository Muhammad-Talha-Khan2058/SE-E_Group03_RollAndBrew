/* ==========================================================================
   Roll & Brew — Board & Card Games Catalog Data
   Vanilla JavaScript dataset of 12 curated tabletop games.
   ========================================================================== */

(function (global) {
  "use strict";

  const GAMES_DATA = [
    {
      id: 1,
      title: "Catan",
      type: "board",
      minPlayers: 3,
      maxPlayers: 4,
      duration: "60–90 min",
      difficulty: "Medium",
      status: "Available",
      description:
        "Trade brick, lumber, wool, grain, and ore as you race to settle the resource-rich island of Catan.",
      rules:
        "Setup forms a modular hexagonal island with numbered terrain tiles. On your turn, roll two dice to generate resources for settlements adjacent to matching numbers (rolling a 7 moves the Robber and forces players with more than 7 cards to discard half). Trade resources with opponents or maritime ports, then spend cards to build roads, settlements (1 VP), cities (2 VP), or Development Cards. The first player to reach 10 Victory Points on their turn wins."
    },
    {
      id: 2,
      title: "Ticket to Ride",
      type: "board",
      minPlayers: 2,
      maxPlayers: 5,
      duration: "45–60 min",
      difficulty: "Easy",
      status: "Available",
      description:
        "Collect train cards and claim iconic cross-country railway routes to connect cities before your rivals block the track.",
      rules:
        "Each player starts with 45 plastic trains, 4 train cards, and secret Destination Tickets. On your turn, choose one action: draw 2 train cards from the face-up display or deck, claim a railway route by discarding matching colored train cards and placing trains, or draw new Destination Tickets (keeping at least one). Points are earned for route lengths, completed tickets (unfulfilled tickets deduct points), and the Longest Continuous Path bonus."
    },
    {
      id: 3,
      title: "Azul",
      type: "board",
      minPlayers: 2,
      maxPlayers: 4,
      duration: "30–45 min",
      difficulty: "Easy",
      status: "Available",
      description:
        "Draft vibrant ceramic tiles to craft a harmonious mosaic palace wall while minimizing wasted materials.",
      rules:
        "On your turn, take all tiles of one color from a Factory display (pushing remaining tiles to the center) or take all tiles of one color from the center pool. Place drafted tiles onto one row of your left-hand pattern lines; any overflow falls to the floor line for negative points. At round end, completed pattern rows move one tile to your 5x5 wall mosaic and score based on adjacent connected tiles. The game ends once a player completes a horizontal row of 5 tiles."
    },
    {
      id: 4,
      title: "Codenames",
      type: "card",
      minPlayers: 4,
      maxPlayers: 8,
      duration: "15–20 min",
      difficulty: "Easy",
      status: "Available",
      description:
        "Give clever one-word clues so your team identifies secret agents on a 5x5 word grid without hitting the Assassin.",
      rules:
        "Players split into Red and Blue teams, each choosing one Spymaster who sees the secret key card for a 5x5 grid of 25 word cards. Spymasters alternate giving a single-word clue plus a number (for example, 'Brew: 2') indicating how many words on the board connect to it. Field operatives discuss and touch cards one by one to reveal agents; uncovering an opposing agent or innocent bystander ends the turn, while touching the Assassin loses immediately. First team to find all their agents wins."
    },
    {
      id: 5,
      title: "UNO",
      type: "card",
      minPlayers: 2,
      maxPlayers: 10,
      duration: "20–30 min",
      difficulty: "Easy",
      status: "Available",
      description:
        "Fast-paced classic color-and-number shedding game packed with Skips, Reverses, and Wild Draw Fours.",
      rules:
        "Deal 7 cards to each player and flip one card to begin the discard pile. On your turn, play a card matching the top discard's color, number, or symbol—or play a Wild card—or draw one card from the deck. Action cards like Skip, Reverse, Draw Two, and Wild Draw Four disrupt opponents. When down to 1 card, you must shout 'UNO!' before the next player acts or draw 2 penalty cards. The first player to empty their hand wins."
    },
    {
      id: 6,
      title: "Exploding Kittens",
      type: "card",
      minPlayers: 2,
      maxPlayers: 5,
      duration: "15 min",
      difficulty: "Easy",
      status: "Checked Out",
      description:
        "A chaotic, Russian-roulette-inspired card game where strategy, Nope cards, and laser pointers keep you alive.",
      rules:
        "Each player starts with 7 cards plus 1 Defuse card, and Exploding Kittens are shuffled into the draw deck. On your turn, play as many action cards as you like—such as Skip, Attack, Shuffle, Favor, See the Future, or Nope—then end your turn by drawing a card. Drawing an Exploding Kitten eliminates you unless you play a Defuse card and secretly reinsert the kitten anywhere in the deck. Last surviving player wins."
    },
    {
      id: 7,
      title: "Sushi Go!",
      type: "card",
      minPlayers: 2,
      maxPlayers: 5,
      duration: "15 min",
      difficulty: "Easy",
      status: "Available",
      description:
        "Pick and pass adorable sushi dishes across three snappy rounds to assemble the highest-scoring meal.",
      rules:
        "Played across three rounds. Deal a hand of cards to every player; simultaneously pick 1 card to place face down in front of you, reveal all chosen cards, and pass remaining hands to the left until all cards are drafted. Score combinations such as Tempura pairs, Sashimi trios, Dumpling sets, Nigiri boosted by Wasabi, and Maki Roll majorities. Pudding cards stay until the end of Round 3 for bonus or penalty points. Highest cumulative score wins."
    },
    {
      id: 8,
      title: "Coup",
      type: "card",
      minPlayers: 2,
      maxPlayers: 6,
      duration: "15 min",
      difficulty: "Medium",
      status: "Available",
      description:
        "Bluff, bribe, and deduce hidden roles in a cutthroat futuristic court where any claim goes unchallenged—until someone calls your bluff.",
      rules:
        "Every player begins with 2 coins and 2 face-down character cards representing their Influence. On your turn, take a basic action (Income, Foreign Aid, or a Coup for 7 coins—mandatory at 10+ coins) or claim any character's power (Duke, Assassin, Captain, Ambassador, Contessa), whether or not you actually hold that card. Opponents may challenge any character claim or block specific actions; losing a challenge or getting Couped costs one face-down card. Last player with Influence wins."
    },
    {
      id: 9,
      title: "Pandemic",
      type: "board",
      minPlayers: 2,
      maxPlayers: 4,
      duration: "45 min",
      difficulty: "Medium",
      status: "Available",
      description:
        "Team up as elite disease-fighting specialists racing around the globe to cure four outbreaks before time runs out.",
      rules:
        "A fully cooperative board game where all players win or lose together. On your turn, spend up to 4 actions to travel between cities, treat disease cubes, build research stations, share city cards, or discover one of four cures. Next, draw 2 Player Cards (resolving Epidemic cards that intensify infections) and flip Infection Cards to place new cubes. Win by curing all four diseases before the player deck empties, cube supplies run out, or 8 outbreaks occur."
    },
    {
      id: 10,
      title: "Carcassonne",
      type: "board",
      minPlayers: 2,
      maxPlayers: 5,
      duration: "35–45 min",
      difficulty: "Easy",
      status: "Available",
      description:
        "Build a shared medieval French countryside tile by tile while placing meeples to claim cities, roads, monasteries, and farms.",
      rules:
        "On each turn, draw one landscape tile and place it adjacent to existing tiles so roads, city walls, and fields match seamlessly. You may then place one meeple from your supply onto a feature on the tile you just laid (as a knight, highwayman, monk, or farmer). Completed cities, roads, and monasteries score immediately and return your meeple; incomplete features and farms score when the final tile is placed. Highest total score wins."
    },
    {
      id: 11,
      title: "Dominion",
      type: "card",
      minPlayers: 2,
      maxPlayers: 4,
      duration: "30 min",
      difficulty: "Medium",
      status: "Reserved",
      description:
        "The pioneering deck-building card game where you transform a humble starting hand into a finely tuned royal engine.",
      rules:
        "Every player starts with an identical 10-card deck of 7 Coppers and 3 Estates, drawing 5 cards per hand. Each turn follows three steps: Action (play 1 Action card from hand), Buy (spend Treasure cards to buy 1 card from the central Kingdom supply into your discard pile), and Clean-Up (discard played and remaining cards and draw 5 fresh cards, reshuffling when needed). When the Province pile or any three supply piles empty, highest total Victory Points wins."
    },
    {
      id: 12,
      title: "Terraforming Mars",
      type: "board",
      minPlayers: 1,
      maxPlayers: 5,
      duration: "90–120 min",
      difficulty: "Hard",
      status: "Checked Out",
      description:
        "Lead a rival spacefaring corporation through deep-engine card combos to make the Red Planet habitable.",
      rules:
        "Played across generations until Mars reaches +8°C temperature, 14% oxygen, and 9 ocean tiles. Each generation, players buy drafted project cards and take 1–2 actions per turn—playing cards, funding Awards, claiming Milestones, or converting plants and heat—while raising their Terraform Rating and resource production. After each generation, produce megacredits and resources. Once all three global parameters are complete, score Terraform Rating, board tiles, Awards, Milestones, and cards."
    }
  ];

  if (typeof global !== "undefined") {
    global.GAMES_DATA = GAMES_DATA;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = GAMES_DATA;
  }
})(typeof window !== "undefined" ? window : globalThis);
