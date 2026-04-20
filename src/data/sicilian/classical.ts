import { Lesson } from '../types';

export const sicClassical: Lesson = {
  id: 'classical',
  parent: 'sicilian',
  title: 'Classical Sicilian (Richter-Rauzer)',
  intro:
    "The Classical Sicilian (1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 Nc6) develops both knights naturally and keeps options open. The main White reply is the Richter-Rauzer (6.Bg5), combining a pin on f6 with pressure on e7 and preparing Qd2 and O-O-O for an English-Attack-style setup. The Classical was a favourite of Lasker, Botvinnik, Smyslov, and later Polugaevsky; it remains perfectly sound but has been somewhat overshadowed by the Najdorf's prophylactic ...a6 move and the Sveshnikov's dynamism. Black's main plans are ...e6 with ...a6 and ...Qc7, or the older ...e5 transposing to Boleslavsky-type structures.",
  themes: [
    'Pin on f6 with Bg5 — central pressure',
    'Opposite-side castling pawn storms',
    'Trade of Bg5 for ...Nxd5 or ...Bxh6 tactical moments',
    '...Qa5 queen activity — indirect defence of f6',
    '...a6 move-order option transposing to Najdorf',
  ],
  pawnStructures: [
    {
      name: 'Small centre with Nc6',
      description: 'Black pawns on d6, e6, f7, g7; knight on c6 supports ...b5 and targets d4/e5 squares.',
    },
    {
      name: 'Boleslavsky structure after ...e5',
      description: 'If Black plays ...e5, the d5-square is permanently weak. This transposition rarely suits the Classical player.',
    },
  ],
  typicalPlans: {
    white: [
      '6.Bg5, 7.Qd2, 8.O-O-O, 9.f3, g4 — opposite-side castling race.',
      'Bxf6 gxf6 (or exf6) — structural concession vs. piece activity trade.',
      'Nxc6 bxc6 — pressure on the c-file and against Black\'s centre.',
    ],
    black: [
      '...e6, ...a6, ...Qc7, ...Be7, ...Bd7, ...Rc8 — full development.',
      '...h6 provocation — force a bishop trade.',
      '...Nxd4 exchange — trade pieces and head to endgame.',
      '...a6 move order tricks leading into Najdorf.',
    ],
  },
  mainLine: {
    id: 'main',
    name: 'Richter-Rauzer — Main Line',
    eco: 'B66',
    summary: '1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 Nc6 6.Bg5 e6 7.Qd2 a6 8.O-O-O Bd7 9.f3 — the classical tabiya.',
    line: [
      { san: 'e4', comment: '' }, { san: 'c5', comment: '' }, { san: 'Nf3', comment: '' }, { san: 'd6', comment: '' }, { san: 'd4', comment: '' }, { san: 'cxd4', comment: '' }, { san: 'Nxd4', comment: '' }, { san: 'Nf6', comment: '' }, { san: 'Nc3', comment: '' },
      { san: 'Nc6', comment: 'Classical development — both knights.', keyIdea: 'Classical piece development.' },
      { san: 'Bg5', comment: "Richter-Rauzer — combining pin and attack.", keyIdea: 'Pin on f6; prepare O-O-O.' },
      { san: 'e6', comment: 'Main reply — supporting d5 and preparing ...Be7.' },
      { san: 'Qd2', comment: 'Preparing O-O-O.' },
      { san: 'a6', comment: 'Prophylactic — prevents Nb5 and prepares ...b5.' },
      { san: 'O-O-O', comment: 'Opposite-side castling — the game enters the pawn-storm phase.' },
      { san: 'Bd7', comment: 'Preparing ...Rc8 and potentially ...Bxc3 if Bg5 retreats.' },
      { san: 'f3', comment: "Supporting e4 and g4 plans." },
      { san: 'h6', comment: 'Asking the bishop.' },
      { san: 'Be3', comment: 'Retreating — keeping the bishop active and avoiding Bh4-Bxf6 trade on demand.' },
      { san: 'Ne5', comment: 'Modern centralisation.' },
      { san: 'Kb1', comment: 'Prophylactic king move.' },
      { san: 'Rc8', comment: 'Preparing ...b5 and ...Nc4.' },
    ],
  },
  variations: [
    {
      id: 'boleslavsky',
      name: 'Boleslavsky Variation',
      eco: 'B58',
      summary: '5...e5 in Classical move order — the Boleslavsky structural concession.',
      line: [
        { san: 'e4', comment: '' }, { san: 'c5', comment: '' }, { san: 'Nf3', comment: '' }, { san: 'd6', comment: '' }, { san: 'd4', comment: '' }, { san: 'cxd4', comment: '' }, { san: 'Nxd4', comment: '' }, { san: 'Nf6', comment: '' }, { san: 'Nc3', comment: '' }, { san: 'Nc6', comment: '' },
        { san: 'Be2', comment: 'Quiet Classical — avoiding Rauzer.' },
        { san: 'e5', comment: 'Boleslavsky — Black accepts the weak d5.', keyIdea: 'Weaken d5 for piece activity.' },
        { san: 'Nb3', comment: 'Retreating — d5 would be too committal.' },
        { san: 'Be7', comment: '' },
        { san: 'O-O', comment: '' },
        { san: 'O-O', comment: '' },
      ],
    },
  ],
};
