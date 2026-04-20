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
];
