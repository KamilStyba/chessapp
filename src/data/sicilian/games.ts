import { MasterGame } from '../types';

export const sicGames: MasterGame[] = [
  {
    id: 'fischer-spassky-1972-g6',
    opening: 'sicilian',
    lessonId: 'najdorf',
    white: 'Bobby Fischer',
    black: 'Boris Spassky',
    event: 'World Championship, Reykjavik',
    year: 1972,
    result: '1-0',
    intro:
      "Game 6 of the 1972 World Championship. Fischer famously opened with 1.c4 and outplayed Spassky in a Queen's Gambit Declined. We include it here for the Sicilian section because Spassky was a Sicilian devotee, and Fischer's treatment of the pieces and the exchange sacrifice 27.Rxf6! set new standards for accuracy in positional chess — the same precision Fischer brought to his Najdorf theory.",
    pgn: '1. c4 e6 2. Nf3 d5 3. d4 Nf6 4. Nc3 Be7 5. Bg5 O-O 6. e3 h6 7. Bh4 b6 8. cxd5 Nxd5 9. Bxe7 Qxe7 10. Nxd5 exd5 11. Rc1 Be6 12. Qa4 c5 13. Qa3 Rc8 14. Bb5 a6 15. dxc5 bxc5 16. O-O Ra7 17. Be2 Nd7 18. Nd4 Qf8 19. Nxe6 fxe6 20. e4 d4 21. f4 Qe7 22. e5 Rb8 23. Bc4 Kh8 24. Qh3 Nf8 25. b3 a5 26. f5 exf5 27. Rxf5 Nh7 28. Rcf1 Qd8 29. Qg3 Re7 30. h4 Rbb7 31. e6 Rbc7 32. Qe5 Qe8 33. a4 Qd8',
    annotations: {
      27: '27.Rxf5! — positionally powerful. The rook attacks f5 and threatens doubling on the f-file.',
      31: '31.e6! — breakthrough. The pawn on e6 dominates and paralyses Black\'s rooks.',
      33: 'Fischer\'s position is crushing; every white piece is optimally placed.',
    },
  },
  {
    id: 'najdorf-english-model',
    opening: 'sicilian',
    lessonId: 'najdorf',
    white: 'Model Game',
    black: 'Model Game',
    event: 'Najdorf English Attack — Teaching Model',
    year: 2024,
    result: '1-0',
    intro:
      "Demonstration of the English Attack in the Najdorf: White plays Be3, f3, Qd2, O-O-O and the signature g4-g5 pawn storm. Black's modern response ...h5 freezes White's expansion; the structural battle becomes about the d5-square.",
    pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 7. Nb3 Be6 8. f3 h5 9. Nd5 Bxd5 10. exd5 Nbd7 11. Qd2 g6 12. O-O-O Bg7 13. Kb1 O-O 14. Na5 Qc7 15. Nc4 Rfc8 16. b3 Nf8 17. Nb2',
    annotations: {
      8: '8...h5! — the modern preventive move. Black stops White\'s kingside pawn storm at the source.',
      10: '10.exd5 — White gets a strong pawn chain; Black must now manoeuvre behind ...Nbd7-f8-e6.',
      17: "17.Nb2 — rerouting to the kingside; a long strategic game where White has the central space advantage but Black has a solid, flexible structure.",
    },
  },
  {
    id: 'dragon-yugoslav-model',
    opening: 'sicilian',
    lessonId: 'dragon',
    white: 'Model Game',
    black: 'Model Game',
    event: 'Dragon Yugoslav Attack — Teaching Model',
    year: 2024,
    result: '0-1',
    intro:
      'The most famous attacking setup in chess: Yugoslav Attack with 9.Bc4. Opposite-side castling, pawn storms, and the signature ...Rxc3 exchange sacrifice in full glory.',
    pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be3 Bg7 7. f3 O-O 8. Qd2 Nc6 9. Bc4 Bd7 10. O-O-O Rc8 11. Bb3 Ne5 12. h4 Nc4 13. Bxc4 Rxc4 14. h5 Nxh5 15. g4 Nf6 16. Bh6 Nxe4 17. Qe3 Rxc3 18. bxc3 Nf6',
    annotations: {
      12: "12...Nc4 — thematic knight leap to c4, trading pieces and clearing for ...b5.",
      14: '14.h5 Nxh5 — Black snatches the h-pawn to slow the storm; the open h-file becomes a race for time.',
      17: '17...Rxc3!! — the Dragon exchange sacrifice. Black gives up the rook to destroy the queenside pawn shield and open the c-file against the white king.',
      18: 'Material is approximately equal; Black has huge attacking chances down the c-file against a weakened white king. This is the essence of the Dragon Yugoslav Attack.',
    },
  },
  {
    id: 'sveshnikov-model',
    opening: 'sicilian',
    lessonId: 'sveshnikov',
    white: 'Model Game',
    black: 'Model Game',
    event: 'Sveshnikov — Carlsen-style Teaching Model',
    year: 2024,
    result: '1/2-1/2',
    intro:
      "Demonstration of the Sveshnikov structural concession that Carlsen used to win the 2018 World Championship. Black accepts weak d5 and doubled pawns for piece activity and the ...f5 break.",
    pgn: '1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 e5 6. Ndb5 d6 7. Bg5 a6 8. Na3 b5 9. Bxf6 gxf6 10. Nd5 f5 11. Bd3 Be6 12. Qh5 Rg8 13. c3 Rg5 14. Qe2 Bxd5 15. exd5 Ne7',
    annotations: {
      9: '9.Bxf6 gxf6 — the structural bargain: doubled pawns for the bishop pair and open g-file.',
      11: '11...Be6 — developing while eyeing the d5-knight and supporting ...Nxd5.',
      15: "Black has a fortress-like structure. The ...f5 break has generated counterplay; positions like this are defended by Black's bishops and careful manoeuvring.",
    },
  },
];
