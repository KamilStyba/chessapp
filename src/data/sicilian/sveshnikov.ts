import { Lesson } from '../types';

export const sicSveshnikov: Lesson = {
  id: 'sveshnikov',
  parent: 'sicilian',
  title: 'Sveshnikov Variation',
  intro:
    "The Sveshnikov (1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 e5) turned chess inside out: Black willingly weakens d5, creates a backward d6-pawn, and accepts a gaping hole for a central knight outpost — all in exchange for piece activity, bishop pair prospects, and long-term dynamism. Once considered unsound, it was rehabilitated by Soviet masters Evgeny Sveshnikov and Gennady Timoshchenko in the 1970s-80s and became one of the main Sicilian lines. Carlsen rode the Sveshnikov to victory in his 2018 World Championship match against Caruana, playing the opening twelve times across classical and rapid games. Its modern reputation is extremely high: engines confirm that Black's activity genuinely compensates the structural concession.",
  themes: [
    "Structural concession on d5 for piece activity",
    "Bishop pair as long-term asset",
    'The ...Nxd5! trade on move 11 as the key theoretical battleground',
    'Piece vs. pawn imbalance: White has d5-outpost, Black has two bishops',
    'Main line: 7.Nd5, 8.bxa5, and sharp forcing sequences',
  ],
  pawnStructures: [
    {
      name: 'Sveshnikov imbalance',
      description: 'White pawns on a2,b2,c3,e4(d5 after trades),f2,g2,h2 (or variant). Black has doubled f-pawns after exchanges in some lines, and a backward d6-pawn. But the bishops on f8 and c8 have huge activity.',
    },
  ],
  typicalPlans: {
    white: [
      'Install a piece on d5 (usually a knight).',
      'Play c3 to support d5 and limit Black\'s ...d5 break.',
      'Trade dark-squared bishops (Bxa5) to weaken Black\'s king.',
      'Rook lift via Rd1-d3-h3 on the kingside in opposite-castling positions.',
    ],
    black: [
      '...Be7 and ...O-O with rapid development.',
      '...Nb8-d7-f6-Nxd5 manoeuvre.',
      '...f5 break at the right moment — a key dynamic resource.',
      'Use the bishop pair: ...Bg5, ...Be7, ...Bxg5 trades to open the f-file.',
    ],
  },
  mainLine: {
    id: 'main',
    name: 'Sveshnikov — Main Line',
    eco: 'B33',
    summary: '1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 e5 6.Ndb5 d6 7.Bg5 a6 8.Na3 b5 9.Bxf6 gxf6 — the critical position.',
    line: [
      { san: 'e4', comment: '' }, { san: 'c5', comment: '' }, { san: 'Nf3', comment: '' }, { san: 'Nc6', comment: '' }, { san: 'd4', comment: '' }, { san: 'cxd4', comment: '' }, { san: 'Nxd4', comment: '' }, { san: 'Nf6', comment: '' }, { san: 'Nc3', comment: '' },
      { san: 'e5', comment: "The Sveshnikov. Concession: weak d5 and backward d6. Benefit: piece activity and counterplay.", keyIdea: 'Structural concession for activity — defining Sveshnikov idea.' },
      { san: 'Ndb5', comment: 'The critical move — the knight heads to d6 (via ...a6 Na3) or stays on b5 pressuring d6.' },
      { san: 'd6', comment: 'Preventing Nd6+. The pawn on d6 is backward but supports e5.' },
      { san: 'Bg5', comment: 'Pinning f6 and aiming at the dark squares around Black\'s king.' },
      { san: 'a6', comment: 'Kicking the knight.' },
      { san: 'Na3', comment: "Only square — awkward for White but temporarily necessary." },
      { san: 'b5', comment: 'Gaining queenside space and preparing ...Bb7 and ...Nd4.' },
      { san: 'Bxf6', comment: 'Trading bishop for knight — doubling Black\'s f-pawns but giving up the dark-squared bishop.', alternatives: [ { san: 'Nd5', why: 'Alternative main line — installs a knight on d5 immediately.' } ] },
      { san: 'gxf6', comment: 'Accepting doubled f-pawns for the bishop pair and open g-file.' },
      { san: 'Nd5', comment: 'Installing the knight on d5 — the key strategic threat.', keyIdea: 'Nd5 — fundamental outpost.' },
      { san: 'f5', comment: "A critical break — Black uses the doubled pawns as a battering ram!", keyIdea: '...f5 break is Black\'s counterplay.' },
      { san: 'Bd3', comment: '' },
      { san: 'Be6', comment: '' },
      { san: 'Qh5', comment: 'Thematic attacking queen placement.' },
    ],
  },
  variations: [
    {
      id: 'chelyabinsk',
      name: 'Chelyabinsk Variation',
      eco: 'B33',
      summary: 'Named after Sveshnikov\'s hometown; 9.Nd5 main line.',
      line: [
        { san: 'e4', comment: '' }, { san: 'c5', comment: '' }, { san: 'Nf3', comment: '' }, { san: 'Nc6', comment: '' }, { san: 'd4', comment: '' }, { san: 'cxd4', comment: '' }, { san: 'Nxd4', comment: '' }, { san: 'Nf6', comment: '' }, { san: 'Nc3', comment: '' }, { san: 'e5', comment: '' }, { san: 'Ndb5', comment: '' }, { san: 'd6', comment: '' }, { san: 'Bg5', comment: '' }, { san: 'a6', comment: '' }, { san: 'Na3', comment: '' }, { san: 'b5', comment: '' },
        { san: 'Nd5', comment: "Immediate knight to d5, keeping the Bg5 on the board." },
        { san: 'Be7', comment: '' },
        { san: 'Bxf6', comment: '' },
        { san: 'Bxf6', comment: "Recapturing with the bishop — keeps pawn structure intact." },
        { san: 'c3', comment: "Supporting d5 and preventing ...Nd4 annoyances." },
      ],
    },
  ],
};
