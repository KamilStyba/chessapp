import { Lesson } from '../types';

export const qgChigorinAlbin: Lesson = {
  id: 'chigorin-albin',
  parent: 'queens-gambit',
  title: 'Chigorin & Albin Sidelines',
  intro:
    "Two aggressive, less-played responses to the Queen's Gambit. The Chigorin (2...Nc6) ignores classical development principles, plants a knight on c6 where it blocks the c-pawn, and trusts piece play and pawn sacrifices to generate counterplay — a favourite of Morozevich. The Albin Counter-Gambit (2...e5!?) is a true gambit: Black sacrifices the e-pawn for rapid development and dangerous attacking ideas, especially the famous Lasker Trap (3.dxe5 d4 4.e3? Bb4+ 5.Bd2 dxe3! winning material through a back-rank underpromotion). Neither is quite 'correct' at grandmaster level — with precise play White gets a slight edge in both — but they are excellent practical weapons in faster time controls and against unprepared opposition.",
  themes: [
    'Chigorin: pieces before pawns, bishop pair, open lines',
    'Albin: gambit pawn on d4, ...Bc5 (or ...Bb4+), ideas like ...Nge7-g6 and ...Nxf4 sacrifices',
    'Lasker Trap — the most famous underpromotion trap in opening theory',
    'Sacrifice of material for development',
    'Long-term imbalances: bishop pair vs. structure',
  ],
  pawnStructures: [
    {
      name: 'Albin wedge on d4',
      description: 'Black\'s pawn on d4 cramps White and supports a c3-knight jump; White must dislodge it with g3/Bg2/Nbd2.',
    },
    {
      name: 'Chigorin imbalances',
      description: "Often ends with Black having doubled c-pawns but the bishop pair and open lines — dynamic equality.",
    },
  ],
  typicalPlans: {
    white: [
      'Against Chigorin: cxd5 and e4 to exploit structure.',
      'Against Albin: g3, Bg2, Nbd2, Nb3 and slow consolidation.',
      'Avoid the Lasker Trap! Never play 4.e3 against the Albin.',
    ],
    black: [
      'In the Chigorin: rapid development with ...Bg4, ...e6, ...Bb4.',
      'In the Albin: ...Nc6, ...Bc5, ...Nge7, ...Bf5 or ...Bg4, with long-term piece activity.',
    ],
  },
  mainLine: {
    id: 'main',
    name: 'Chigorin Defence',
    eco: 'D07',
    summary: '1.d4 d5 2.c4 Nc6 — Chigorin\'s choice.',
    line: [
      { san: 'd4', comment: '' }, { san: 'd5', comment: '' }, { san: 'c4', comment: '' },
      { san: 'Nc6', comment: "The Chigorin. Black develops a piece before moving a pawn, violating classical principles but gaining time.", keyIdea: 'Piece development over pawn structure.' },
      { san: 'Nc3', comment: 'The main line. 3.Nf3 transposes. 3.cxd5 Qxd5 is the most direct reply, leading to an early queen exchange.' },
      { san: 'dxc4', comment: 'Black accepts the pawn and develops further. 3...Nf6 is another option.' },
      { san: 'Nf3', comment: '' },
      { san: 'Nf6', comment: '' },
      { san: 'e4', comment: 'Ambitious — White grabs the centre.' },
      { san: 'Bg4', comment: "Pinning the knight and threatening ...Bxf3 followed by ...e5." },
      { san: 'Bxc4', comment: '' },
      { san: 'e6', comment: "Preparing ...Bb4 and ...O-O. Black's pieces are active; the structural imbalance is manageable." },
    ],
  },
  variations: [
    {
      id: 'albin',
      name: 'Albin Counter-Gambit',
      eco: 'D08',
      summary: '2...e5 — a true pawn sacrifice with tactical venom.',
      line: [
        { san: 'd4', comment: '' }, { san: 'd5', comment: '' }, { san: 'c4', comment: '' },
        { san: 'e5', comment: "The Albin Counter-Gambit — Black sacrifices the e-pawn for initiative.", keyIdea: 'Counter-gambit for activity.' },
        { san: 'dxe5', comment: '' },
        { san: 'd4', comment: "The key move — a wedge pawn that cramps White." },
        { san: 'Nf3', comment: 'Correct. 4.e3? allows the Lasker Trap.' },
        { san: 'Nc6', comment: '' }, { san: 'g3', comment: 'The modern main line — fianchetto to neutralise the pressure.' },
        { san: 'Bg4', comment: 'Developing and pinning f3.' },
        { san: 'Bg2', comment: '' },
        { san: 'Qd7', comment: 'Preparing ...O-O-O and ...Nh6-g4 ideas.' },
      ],
    },
    {
      id: 'lasker-trap',
      name: 'Lasker Trap (Albin)',
      summary: 'The most famous underpromotion trap in opening theory.',
      line: [
        { san: 'd4', comment: '' }, { san: 'd5', comment: '' }, { san: 'c4', comment: '' }, { san: 'e5', comment: '' }, { san: 'dxe5', comment: '' }, { san: 'd4', comment: '' },
        { san: 'e3', comment: 'The blunder!' },
        { san: 'Bb4+', comment: '' },
        { san: 'Bd2', comment: '' },
        { san: 'dxe3', comment: 'Discovered attack from the b4-bishop onto the d2-bishop, and if fxe3 then ...Qxd1 is no good; the stunning point: if 10.Bxb4 then ...exf2+ 11.Ke2 fxg1=N+! (underpromotion — if 11...fxg1=Q, 12.Qxd8+ Kxd8 13.Rxg1 is fine for White, but with the knight underpromotion, the queen escapes with check and Black gains a decisive advantage). One of the most elegant traps in chess.', keyIdea: "Underpromotion to knight — the trap's point." },
      ],
    },
  ],
};
