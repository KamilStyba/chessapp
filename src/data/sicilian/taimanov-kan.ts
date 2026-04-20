import { Lesson } from '../types';

export const sicTaimanovKan: Lesson = {
  id: 'taimanov-kan',
  parent: 'sicilian',
  title: 'Taimanov & Kan Variations',
  intro:
    "The Taimanov (4...Nc6 after 1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4) and Kan (4...a6 after 1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4) are the flexible 'wait and see' Sicilians. Both avoid early ...d6 commitment, keep maximum move-order flexibility, and make the position revolve around the ...e6/...a6/...Qc7 pawn-and-queen structure. The Taimanov specifically develops ...Nc6 immediately and is named after the Russian grandmaster Mark Taimanov; the Kan plays ...a6 first to keep the knight on b8 (so it can go to d7 or c6 as needed). Both are extremely popular at grandmaster level for their resilience; Fabiano Caruana has used the Taimanov and Vishy Anand has employed the Kan in matches. The main challenge is the English Attack (5.Nc3 Qc7 6.Be3) and the Maroczy Bind setup (6.Nxc6 bxc6 7.Bd3) for the Taimanov.",
  themes: [
    '...e6 and ...a6 flexibility — no early ...d6 commitment',
    '...Qc7 queen placement pressuring e5 and c2',
    'Bishop pair questions: trade on c6 weakens Black\'s structure but gives White a bishop pair',
    'Maroczy Bind structures with c4-e4 pawn duo',
    'Hedgehog setups with ...b6, ...Bb7, ...d6 and ...Be7',
  ],
  pawnStructures: [
    {
      name: 'Hedgehog (Sicilian-type)',
      description: "Black pawns on a6, b6, d6, e6, g7, h7 — ultra-flexible, absorbing White's space and preparing ...b5 or ...d5 at the right moment.",
    },
    {
      name: 'Maroczy Bind (after Nxc6 bxc6 c4)',
      description: "White pawns on c4 and e4 bind the position — Black must play accurately to generate counterplay with ...d5 break.",
    },
  ],
  typicalPlans: {
    white: [
      'English Attack setup: Be3, Qd2, O-O-O, g4.',
      'Maroczy Bind after Nxc6 bxc6, with c4 and e4.',
      'Quiet Classical with Be2, O-O.',
    ],
    black: [
      'Hedgehog setup: ...a6, ...b6, ...d6, ...Be7, ...Bb7.',
      '...Qc7, ...Nc6, ...Bb4 pinning the knight.',
      '...Nf6, ...d5 break when favourable.',
    ],
  },
  mainLine: {
    id: 'main',
    name: 'Taimanov — English Attack',
    eco: 'B48',
    summary: '1.e4 c5 2.Nf3 e6 3.d4 cxd4 4.Nxd4 Nc6 5.Nc3 Qc7 6.Be3 — the main line.',
    line: [
      { san: 'e4', comment: '' }, { san: 'c5', comment: '' }, { san: 'Nf3', comment: '' }, { san: 'e6', comment: '' }, { san: 'd4', comment: '' }, { san: 'cxd4', comment: '' }, { san: 'Nxd4', comment: '' },
      { san: 'Nc6', comment: "The Taimanov.", keyIdea: 'Flexible development.' },
      { san: 'Nc3', comment: '' },
      { san: 'Qc7', comment: 'Queen to its Sicilian square — pressuring e5 and c2.' },
      { san: 'Be3', comment: 'English Attack setup.' },
      { san: 'a6', comment: 'Preparing ...b5 and preventing Nb5.' },
      { san: 'Qd2', comment: '' },
      { san: 'Nf6', comment: '' },
      { san: 'O-O-O', comment: "Opposite-side castling approach." },
      { san: 'Bb4', comment: 'Pinning the knight — a key Taimanov idea.', keyIdea: '...Bb4 pins c3 before ...Nxd4.' },
      { san: 'f3', comment: '' },
      { san: 'Ne5', comment: 'Centralising and eyeing c4.' },
    ],
  },
  variations: [
    {
      id: 'kan',
      name: 'Kan Variation',
      eco: 'B41',
      summary: '4...a6 — flexible, often transposing to Hedgehog.',
      line: [
        { san: 'e4', comment: '' }, { san: 'c5', comment: '' }, { san: 'Nf3', comment: '' }, { san: 'e6', comment: '' }, { san: 'd4', comment: '' }, { san: 'cxd4', comment: '' }, { san: 'Nxd4', comment: '' },
        { san: 'a6', comment: "The Kan.", keyIdea: 'Prophylactic ...a6 — no committal central play.' },
        { san: 'Bd3', comment: 'Modern main line — Maroczy-style bishop placement.' },
        { san: 'Bc5', comment: 'Hitting d4 and Bd3 diagonally.' },
        { san: 'Nb3', comment: 'Retreating the knight.' },
        { san: 'Be7', comment: 'Preparing ...Nf6, ...d6, ...Nbd7.' },
        { san: 'Qg4', comment: "Aggressive — threatening Qxg7 if Black castles too early." },
      ],
    },
    {
      id: 'maroczy-taimanov',
      name: 'Maroczy Bind (Taimanov)',
      eco: 'B40',
      summary: 'White plays Nxc6 and c4 for the bind.',
      line: [
        { san: 'e4', comment: '' }, { san: 'c5', comment: '' }, { san: 'Nf3', comment: '' }, { san: 'e6', comment: '' }, { san: 'd4', comment: '' }, { san: 'cxd4', comment: '' }, { san: 'Nxd4', comment: '' }, { san: 'Nc6', comment: '' },
        { san: 'Nxc6', comment: 'Maroczy setup — trading on c6.' },
        { san: 'bxc6', comment: 'Accepting doubled c-pawns.' },
        { san: 'Bd3', comment: '' },
        { san: 'd5', comment: '' },
        { san: 'O-O', comment: '' },
        { san: 'Nf6', comment: '' },
        { san: 'Qe2', comment: '' },
        { san: 'Be7', comment: '' },
      ],
    },
  ],
};
