import { Lesson } from '../types';

export const sicAcceleratedDragon: Lesson = {
  id: 'accelerated-dragon',
  parent: 'sicilian',
  title: 'Accelerated Dragon',
  intro:
    "The Accelerated Dragon (1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6) is Black's attempt to play the Dragon fianchetto without allowing the Yugoslav Attack. By delaying ...d6, Black keeps the option of ...d5 in one move, and avoids many of the sharpest White setups. The price: White can play the Maroczy Bind (5.c4) — a massive central pawn structure with pawns on c4 and e4 that cramps Black severely. For decades the Maroczy was considered nearly winning for White; modern theory has rehabilitated Black's chances thanks to thematic ...b6, ...Bb7, ...Nd7 setups and the ...f5 break. The Accelerated Dragon is a favourite of top grandmasters who want the Dragon's bishop but cannot abide the Yugoslav Attack's pawn storms.",
  themes: [
    'Avoid Yugoslav Attack by delaying ...d6',
    'Maroczy Bind structures — c4+e4 vs. small Black centre',
    '...d5 break in one move — key equalizer',
    '...b6/...Bb7/...Nd7 restructuring against the bind',
    'Endgame orientation — Accelerated Dragon often becomes a positional grind',
  ],
  pawnStructures: [
    {
      name: 'Maroczy Bind',
      description: "White pawns on c4 and e4, Black pawns on d6 (or d7), e7, g6, etc. White's bind denies Black the thematic ...d5 break; Black's plan revolves around trades and the eventual ...b5 or ...f5 break.",
    },
  ],
  typicalPlans: {
    white: [
      'Maroczy Bind: c4, Nc3, Be2, O-O, Be3, Rc1, Qd2.',
      'Trade minor pieces to emphasise space advantage.',
      'Nd5 or Nb5 leaps when pins/tactics allow.',
    ],
    black: [
      "...d6, ...Bg7, ...Nf6, ...O-O, ...Bd7 — full development.",
      "...Nxd4, ...Bc6, ...Nd7, ...Bxg2 hacks when White overextends.",
      '...f5 break to challenge e4.',
      '...a5 prophylaxis vs. b2-b4 expansion.',
    ],
  },
  mainLine: {
    id: 'main',
    name: 'Maroczy Bind',
    eco: 'B38',
    summary: '1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6 5.c4 — the Maroczy Bind.',
    line: [
      { san: 'e4', comment: '' }, { san: 'c5', comment: '' }, { san: 'Nf3', comment: '' }, { san: 'Nc6', comment: '' }, { san: 'd4', comment: '' }, { san: 'cxd4', comment: '' }, { san: 'Nxd4', comment: '' },
      { san: 'g6', comment: 'The Accelerated Dragon — fianchetto before ...d6.', keyIdea: 'Early fianchetto avoids Yugoslav.' },
      { san: 'c4', comment: "The Maroczy Bind — White claims maximum central space.", keyIdea: 'Maroczy Bind: c4+e4 pawn duo.' },
      { san: 'Nf6', comment: '' },
      { san: 'Nc3', comment: '' },
      { san: 'd6', comment: 'Supporting e5 and preparing ...Bd7.' },
      { san: 'Be2', comment: '' },
      { san: 'Bg7', comment: '' },
      { san: 'Be3', comment: '' },
      { san: 'O-O', comment: '' },
      { san: 'O-O', comment: '' },
      { san: 'Bd7', comment: "Preparing ...Nxd4 and ...Bc6 manoeuvre." },
      { san: 'Rc1', comment: '' },
      { san: 'Nxd4', comment: '' },
      { san: 'Bxd4', comment: '' },
      { san: 'Bc6', comment: "Key Accelerated Dragon manoeuvre — Black's bishop eyes the long diagonal and supports ...b5." },
    ],
  },
  variations: [
    {
      id: 'non-maroczy',
      name: 'Non-Maroczy (5.Nc3)',
      eco: 'B34',
      summary: 'White develops without the c4 bind.',
      line: [
        { san: 'e4', comment: '' }, { san: 'c5', comment: '' }, { san: 'Nf3', comment: '' }, { san: 'Nc6', comment: '' }, { san: 'd4', comment: '' }, { san: 'cxd4', comment: '' }, { san: 'Nxd4', comment: '' }, { san: 'g6', comment: '' },
        { san: 'Nc3', comment: '' }, { san: 'Bg7', comment: '' },
        { san: 'Be3', comment: '' }, { san: 'Nf6', comment: '' },
        { san: 'Bc4', comment: "Transposing to a Yugoslav-like Attack — but Black has not played ...d6, which gives extra flexibility." },
        { san: 'O-O', comment: '' }, { san: 'Bb3', comment: '' }, { san: 'a5', comment: 'Pet idea — gaining space on the queenside.' },
      ],
    },
  ],
};
