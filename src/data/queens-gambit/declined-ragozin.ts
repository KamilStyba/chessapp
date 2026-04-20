import { Lesson } from '../types';

export const qgdRagozin: Lesson = {
  id: 'declined-ragozin',
  parent: 'queens-gambit',
  title: 'QGD — Ragozin Defence',
  intro:
    "The Ragozin (1.d4 d5 2.c4 e6 3.Nf3 Nf6 4.Nc3 Bb4) is a hybrid: a QGD where the dark-squared bishop is developed to b4 in Nimzo-Indian fashion. Black keeps ...dxc4 in reserve, pressures e4, and aims for an active piece setup. In the modern main line White plays 5.cxd5 exd5 6.Bg5 h6 7.Bxf6 (or Bh4), doubling Black's pawns in some sub-variations and fighting for the e4 square. The Ragozin has been championed by Kramnik, Aronian and Ding; it is technical, forcing and demands exact preparation from White. Compared to the Nimzo-Indian, the Ragozin has the advantage of retaining a central pawn on d5, which gives Black a sturdier foothold in the centre even after doubled c-pawns.",
  themes: [
    'Nimzo-Indian style pin on c3',
    'Struggle for e4',
    'Doubled c-pawns after ...Bxc3+, bxc3 — usually a positional concession for White but with the bishop pair as compensation',
    'Thematic ...Bf5 bishop activity',
    'The ...dxc4 option creates QGA/IQP-like structures with an extra Nimzo-style bishop',
  ],
  pawnStructures: [
    {
      name: 'Doubled c3-pawns',
      description: 'After ...Bxc3+ bxc3, White has doubled c-pawns but the bishop pair and potential dynamic central play.',
    },
    {
      name: 'Carlsbad with ...Bb4',
      description: 'After cxd5 exd5, a Carlsbad with an active dark-squared bishop on b4 — an atypical piece placement improving Black\'s activity compared to normal QGD.',
    },
  ],
  typicalPlans: {
    white: [
      'Play cxd5 exd5 and Bg5 to fight for e4 and strengthen the central pawn structure.',
      'Meet ...Bxc3+ bxc3 with a plan based on Rb1, e3-e4, and the bishop pair on open lines.',
      'Use Qa4+ tricks to break the pin in some lines.',
    ],
    black: [
      'Provoke cxd5 exd5 and develop ...Bf5 and ...c6, similar to Carlsbad but with the bishop on b4.',
      'Consider ...dxc4 to transpose to Vienna-like positions with piece activity.',
      'Keep ...c5 in mind after ...Bxc3+ bxc3 as a way to punish the doubled c-pawns.',
    ],
  },
  mainLine: {
    id: 'main',
    name: 'Ragozin — Main Line 5.cxd5 exd5 6.Bg5',
    eco: 'D38',
    summary: 'The central tabiya of the Ragozin.',
    line: [
      { san: 'd4', comment: '' }, { san: 'd5', comment: '' }, { san: 'c4', comment: '' }, { san: 'e6', comment: '' },
      { san: 'Nf3', comment: 'Move order to avoid Nimzo-Indian; after 3.Nc3 Bb4 would be Nimzo.' },
      { san: 'Nf6', comment: '' },
      { san: 'Nc3', comment: '' },
      { san: 'Bb4', comment: "The Ragozin. Black pins the knight and fights for e4 in Nimzo style. Compared to 4...Be7 (Orthodox), the bishop is more active and can make ...Bxc3+ a real tool.", keyIdea: 'Nimzo-style pin while keeping d5.' },
      { san: 'cxd5', comment: 'The main line — resolves central tension and sets up Bg5.', alternatives: [ { san: 'Qa4+', why: 'Pin-breaker — forces ...Nc6 and keeps the c-file elastic.' }, { san: 'Bg5', why: 'Direct; Black has ...h6 and ...dxc4 or ...c5 ideas.' } ] },
      { san: 'exd5', comment: 'Forced structurally.' },
      { san: 'Bg5', comment: 'Fights for e4 and pins the f6-knight.' },
      { san: 'h6', comment: 'Asks the bishop.' },
      { san: 'Bxf6', comment: 'Critical — Black gets the bishop pair but doubled pawns after ...Qxf6 (no, we capture with the queen here, and then move play continues).' },
      { san: 'Qxf6', comment: "Black accepts the bishop-pair + mild structural concession. The pawn on d5 is solid, and ...c6 plus ...Bf5 coming. Black stands well dynamically, but must play actively to justify the doubled pawns (wait, there are no doubled pawns yet) — precisely, the issue is that the f6-queen is awkward and must relocate." },
      { san: 'Qb3', comment: 'Attacks b7 and asks how Black will complete development.' },
      { san: 'c5', comment: "Only move — Black must hit d4 and preserve the structure." },
      { san: 'dxc5', comment: '' },
      { san: 'Bxc5', comment: "Black recaptures with the bishop — tempo on the queen; the opening problem is solved." },
    ],
  },
  variations: [],
};
