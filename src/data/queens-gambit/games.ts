import { MasterGame } from '../types';

export const qgGames: MasterGame[] = [
  {
    id: 'orthodox-model-tartakower',
    opening: 'queens-gambit',
    lessonId: 'declined-orthodox',
    white: 'Model Game',
    black: 'Model Game',
    event: 'Tartakower QGD — Teaching Model',
    year: 2024,
    result: '1/2-1/2',
    intro:
      "A model Tartakower QGD: Black develops the 'problem bishop' via ...b6/...Bb7, White plays for minor-piece trades and a small structural edge. The line shown is the modern main theoretical path from Kasparov-Kramnik era World Championship practice.",
    pgn: '1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3 h6 7. Bh4 b6 8. cxd5 Nxd5 9. Bxe7 Qxe7 10. Nxd5 exd5 11. Rc1 Be6 12. Qa4 c5 13. Qa3 Rc8 14. Be2 a6 15. dxc5 bxc5 16. O-O Qb7',
    annotations: {
      11: "11.Rc1 — classical move; the rook eyes the half-open c-file and supports possible cxd5 trades.",
      15: '15.dxc5! — resolving central tension while Black has not yet completed development. Typical of the Tartakower: exchange in the centre when Black cannot easily recapture with piece activity.',
      16: "Position is balanced; Black has equal chances with active piece configuration. Model demonstrates the strategic equilibrium of the Tartakower.",
    },
  },
  {
    id: 'exchange-minority-model',
    opening: 'queens-gambit',
    lessonId: 'declined-exchange',
    white: 'Model Game',
    black: 'Model Game',
    event: 'Exchange QGD — Minority Attack Demonstration',
    year: 2024,
    result: '1-0',
    intro:
      "Demonstration of the classical Carlsbad minority attack. White slowly prepares b4-b5, Black cannot prevent the structural damage, and the resulting weak c6-pawn becomes the cause of defeat.",
    pgn: '1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. cxd5 exd5 5. Bg5 Be7 6. e3 c6 7. Qc2 Nbd7 8. Bd3 O-O 9. Nf3 Re8 10. O-O Nf8 11. Rab1 a5 12. a3 Ng6 13. b4 axb4 14. axb4 Ne4 15. Bxe7 Rxe7 16. b5 Qa5 17. bxc6 bxc6 18. Na4',
    annotations: {
      11: '11.Rab1 — launching the minority attack. The rook supports b4 and later b5 thrusts.',
      13: '13.b4! — the thematic pawn roller. White commits to the attack.',
      17: '17.bxc6! bxc6 — and c6 is now a weak, backwards pawn fixed on an open file.',
      18: '18.Na4! — heading to c5 outpost; the weak c6 and b-file give White a lasting strategic edge.',
    },
  },
  {
    id: 'slav-main-model',
    opening: 'queens-gambit',
    lessonId: 'slav',
    white: 'Model Game',
    black: 'Model Game',
    event: 'Slav Main Line — Teaching Model',
    year: 2024,
    result: '1/2-1/2',
    intro:
      'Classical Slav with ...dxc4 and the Smyslov/Bronstein-Reynolds setup. Black activates the c8-bishop before ...e6 and equalises via precise piece play and the ...Bb4 pin.',
    pgn: '1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 dxc4 5. a4 Bf5 6. e3 e6 7. Bxc4 Bb4 8. O-O Nbd7 9. Qe2 Bg6 10. e4 O-O 11. Bd3 Bh5 12. e5 Nd5 13. Nxd5 cxd5 14. Qe3 Rc8',
    annotations: {
      5: '5...Bf5 — the essential Slav move: activate the c8-bishop before ...e6 blocks it. This is the structural reason to play the Slav over the QGD.',
      10: "10...O-O — Black is fully developed; now strategic battle begins.",
      13: 'After the trades Black has achieved complete equality with an active bishop pair and open c-file.',
    },
  },
  {
    id: 'qga-central-expansion-model',
    opening: 'queens-gambit',
    lessonId: 'accepted',
    white: 'Model Game',
    black: 'Model Game',
    event: 'QGA Central Expansion — Teaching Model',
    year: 2024,
    result: '1/2-1/2',
    intro:
      "Model QGA with the main-line 3.Nf3 Nf6 4.e3 e6 setup. White recaptures c4 with the bishop and later plays the key central break, demonstrating why Black must time ...cxd4 precisely. The game shows the typical IQP-or-not decision that defines every QGA middlegame.",
    pgn: '1. d4 d5 2. c4 dxc4 3. Nf3 Nf6 4. e3 e6 5. Bxc4 c5 6. O-O a6 7. a4 Nc6 8. Nc3 Be7 9. Qe2 cxd4 10. Rd1 O-O 11. exd4 Nb4 12. Ne5 Bd7 13. Bg5 Bc6 14. Nxc6 Nxc6 15. d5 exd5 16. Nxd5 Nxd5 17. Rxd5 Qxd5 18. Bxe7',
    annotations: {
      7: "7.a4 — preventing ...b5 expansion. Without this, Black plays ...b5 with great queenside space.",
      9: "9.Qe2! — clearing d1 for the rook and defending the bishop if ...b5 comes.",
      15: '15.d5! — the thematic IQP break; White is willing to trade the centre for piece activity.',
      18: "18.Bxe7 — the dust settles: queens traded, material equal, a sterile position representing the main-line QGA assessment: slight White edge, full Black equality after accurate defence.",
    },
  },
  {
    id: 'semi-slav-meran-model',
    opening: 'queens-gambit',
    lessonId: 'semi-slav',
    white: 'Model Game',
    black: 'Model Game',
    event: 'Semi-Slav Meran — Teaching Model',
    year: 2024,
    result: '1-0',
    intro:
      "Textbook Meran: Black expands with ...dxc4 + ...b5 and reaches the critical tabiya with ...c5 and ...Bb7. White responds with the main-line e4-d5 thrust, leading to a king-hunt after ...Qc7 drops a crucial tempo. Shows how dangerous the Meran can be for Black when timing fails.",
    pgn: '1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 e6 5. e3 Nbd7 6. Bd3 dxc4 7. Bxc4 b5 8. Bd3 Bb7 9. O-O a6 10. e4 c5 11. d5 Qc7 12. dxe6 fxe6 13. Bc2 c4 14. Nd4 Nc5 15. b4 cxb3 16. axb3 Bd6 17. f4',
    annotations: {
      10: "10.e4 — the signature Meran move. White stakes out the centre and prepares d4-d5.",
      11: "11.d5! — the thematic central breakthrough, opening lines against Black's uncastled king.",
      13: "13.Bc2! — unloading the bishop from the c-file and preparing Qd3 with an attack on h7.",
      17: '17.f4! — preparing f5 and a pawn storm; Black is in serious trouble because the king is still on e8.',
    },
  },
];
