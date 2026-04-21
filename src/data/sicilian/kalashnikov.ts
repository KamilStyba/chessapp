import { Lesson } from '../types';

export const sicKalashnikov: Lesson = {
  id: 'kalashnikov',
  parent: 'sicilian',
  title: 'Kalashnikov Variation',
  intro:
    "The Kalashnikov (1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 e5) is the little brother of the Sveshnikov — Black plays ...e5 immediately, before ...Nf6 and ...Nc3 have been inserted. The resulting position has the same structural trademarks: weak d5-square, pawn on e5 restricting the d4-knight, and a central imbalance that dictates every plan for the rest of the game. What makes the Kalashnikov distinct from the Sveshnikov is that Black retains flexibility about the king's knight — it can develop to f6 later, stay on g8 briefly, or even head for e7 in some lines. White's main try is 5.Nb5 d6 6.N1c3 a6 7.Na3 b5 or the more critical 6.c4 (the Maroczy-Kalashnikov, fighting for d5 with the pawn). Its great strength is that Black avoids a lot of theory associated with the Sveshnikov's 6.Ndb5 lines, yet keeps the same dynamic structural bargain. The Kalashnikov has been championed by Kosten, Sveshnikov himself, and more recently by Radjabov and MVL as a practical surprise weapon. It scores well at club and tournament level precisely because White players often prepare anti-Sveshnikov theory without much time on the Kalashnikov's specific move-orders.",
  themes: [
    '...e5 before ...Nf6 — restrict the d4-knight, accept weak d5',
    'Nb5 retreat dance: Nb5-d6-Nb5-a3 manoeuvring',
    '...b5 and ...a6 queenside expansion',
    'Exchange on d5 (...Bxd5 after f3/Bg5 setups)',
    'The c4 Maroczy-like bind in 6.c4 — same structure as Sveshnikov 6.c4',
  ],
  pawnStructures: [
    {
      name: 'Sveshnikov/Kalashnikov structure',
      description: "Pawns: White has e4, Black has d6 + e5 (or d5 later). The d5-square is the critical battleground; whoever controls it controls the game.",
    },
    {
      name: 'Maroczy bind after 6.c4',
      description: 'White grabs more space with c2-c4 supporting the d5-square; Black aims for ...Be6, ...Nf6, ...Be7 and ...Rc8 + ...Qa5 pressure.',
    },
  ],
  typicalPlans: {
    white: [
      'Main line: 5.Nb5 d6 6.N1c3 a6 7.Na3 — accepting the knight on the rim for a positional edge with d5-outpost.',
      'Maroczy-Kalashnikov: 6.c4 — fight for d5 with pawns as well as pieces.',
      'Install a knight on d5 and trade the good d5-knight or pressure e5.',
      'Opposite-side castling setups with Be3, Qd2, O-O-O, g4 — similar to anti-Sveshnikov.',
    ],
    black: [
      '...a6 and ...b5 queenside expansion; Rb8, Bb7, Qa5 pressure.',
      '...Be7, ...Nf6, ...O-O: solid development with kingside safety.',
      '...f5 break after kingside castling — challenging the e4-pawn and the d5-knight.',
      "Exchange the d5-knight at the right moment — often with ...Nce7 and ...Nxd5.",
    ],
  },
  mainLine: {
    id: 'main',
    name: 'Kalashnikov — 5.Nb5 d6 6.N1c3 a6 7.Na3',
    eco: 'B32',
    summary: 'Main line: White retreats the knight to a3 and accepts slightly awkward piece placement for the d5-outpost.',
    line: [
      { san: 'e4', comment: '' },
      { san: 'c5', comment: '' },
      { san: 'Nf3', comment: '' },
      { san: 'Nc6', comment: '' },
      { san: 'd4', comment: '' },
      { san: 'cxd4', comment: '' },
      { san: 'Nxd4', comment: '' },
      { san: 'e5', comment: "The Kalashnikov — the immediate strike, even before ...Nf6. The pawn challenges the d4-knight and claims space.", keyIdea: 'Immediate ...e5 — strike before development.' },
      { san: 'Nb5', comment: "The critical reply — heading for d6 or rerouting via a3/c3.", alternatives: [ { san: 'Nf3', why: "Passive — the knight returns home; Black gets an easy game." }, { san: 'Nf5', why: "The knight on the rim — Black plays ...d5! with instant equality." } ] },
      { san: 'd6', comment: "Kicking the b5-knight, preparing ...a6.", keyIdea: 'Force the knight dance.' },
      { san: 'N1c3', comment: "Both knights coordinate; Na3 is coming next." },
      { san: 'a6', comment: "Gaining space and asking the knight on b5." },
      { san: 'Na3', comment: "Accepting the awkward square for the long-term positional edge.", alternatives: [ { san: 'Nd6+', why: "A tempting tactical shot but leads nowhere: ...Bxd6 just wins the knight." } ] },
      { san: 'b5', comment: "Claiming queenside space and preparing ...Bb7 + ...Nf6." },
      { san: 'Nd5', comment: "The thematic knight leap to the key square." },
      { san: 'Nge7', comment: "Planning to trade the d5-knight with ...Nxd5." },
      { san: 'c4', comment: "Buttressing the d5-knight." },
      { san: 'Nxd5', comment: "Trading the outpost — Black relieves pressure." },
      { san: 'cxd5', comment: "White now has a queenside pawn majority and a 'hanging' d5-pawn." },
      { san: 'Nb8', comment: "Retreating to redeploy via ...Nd7; the c-file is claimed." },
      { san: 'Nc2', comment: "The a3-knight finally finds useful squares via c2 or b4." },
    ],
  },
  variations: [
    {
      id: 'maroczy-kalashnikov',
      name: '6.c4 — Maroczy-Kalashnikov',
      eco: 'B32',
      summary: 'White plays c4 to clamp down on d5 with pawns.',
      line: [
        { san: 'e4', comment: '' }, { san: 'c5', comment: '' }, { san: 'Nf3', comment: '' }, { san: 'Nc6', comment: '' }, { san: 'd4', comment: '' }, { san: 'cxd4', comment: '' }, { san: 'Nxd4', comment: '' }, { san: 'e5', comment: '' }, { san: 'Nb5', comment: '' }, { san: 'd6', comment: '' },
        { san: 'c4', comment: "Maroczy Bind — fight for d5 with pawns.", keyIdea: 'c4 reinforces d5 — positional clamp.' },
        { san: 'Be7', comment: "Flexible development, keeping options open." },
        { san: 'N1c3', comment: "" },
        { san: 'a6', comment: "" },
        { san: 'Na3', comment: "" },
        { san: 'f5', comment: "A sharp break — challenging the e4-pawn and undermining the d5-clamp.", keyIdea: '...f5 — the main counter to c4/e4.' },
        { san: 'exf5', comment: "" },
        { san: 'Bxf5', comment: "Active bishop; Black accepts a slightly weakened kingside for piece play." },
      ],
    },
  ],
  commonTraps: [
    {
      name: 'Nd6+?? is never winning',
      line: ['e4', 'c5', 'Nf3', 'Nc6', 'd4', 'cxd4', 'Nxd4', 'e5', 'Nb5', 'd6', 'Nd6+'],
      comment: "A beginner trap: after 5.Nb5 d6 the natural-looking 6.Nd6+?? seems to win material but after 6...Bxd6 the knight is simply lost — the e4-pawn is undefended and Black's bishop returns to its home with an extra piece. Always verify tactical motifs: is the target defended, and can Black just recapture? Here Black's bishop was never trapped.",
    },
  ],
};
