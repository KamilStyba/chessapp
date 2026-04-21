import { OpeningOverview } from '../types';

export const sicilianOverview: OpeningOverview = {
  id: 'sicilian',
  title: 'Sicilian Defense',
  subtitle: '1.e4 c5 — the sharpest fighting defence against the King\'s pawn',
  intro:
    "The Sicilian is the most analysed opening in chess. Its essence is an asymmetrical response to 1.e4: Black rejects symmetry, declines an early central occupation, and instead fights for the centre along different diagonals. Strategically, after the thematic 2.Nf3 + 3.d4 cxd4 4.Nxd4 we reach the 'Open Sicilian' — White has a half-open d-file and central majority (d, e-pawns) while Black has a half-open c-file and a queenside majority (a, b, c, d-pawns in most structures). This pawn imbalance drives the entire middlegame: White wants to attack on the kingside (thematic pawn storms with g4-g5, h4-h5, f4-f5), Black wants to grind on the queenside (b5, a5-a4, Rb8, Nc4 outpost, ...b4 to kick the c3-knight). Every Sicilian main line — Najdorf, Dragon, Scheveningen, Sveshnikov, Classical, Taimanov, Kan, Accelerated Dragon, Kalashnikov — is a different way of splitting this eternal tension. The Anti-Sicilians (Alapin 2.c3, Rossolimo 3.Bb5, Moscow 3.Bb5+, Closed 2.Nc3, Grand Prix, Smith-Morra 2.d4 cxd4 3.c3) are White's ways of avoiding the theoretical debate. A complete understanding of the Sicilian is, frankly, a lifetime's work; Fischer, Kasparov, Carlsen, Karjakin, Caruana, Nakamura — every modern World Champion and top player has relied on it.",
  coreIdeas: [
    'Asymmetric central fight: White has e/d pawns, Black has c-pawn half-open file.',
    'Pawn-storm race: White kingside (g4/h4/f4), Black queenside (b5/a5/b4).',
    'Outposts: d5 for White knights, c4 and b4 for Black knights.',
    'The two Bishops: Black often aims for the bishop pair, White often sacrifices on d5 or f5.',
    'King safety dictates strategy: opposite-side castling produces pawn races; same-side castling produces slow manoeuvring.',
  ],
  lessons: [
    { id: 'najdorf', title: 'Najdorf Variation', blurb: '5...a6 — Fischer and Kasparov\'s favourite. English Attack, 6.Bg5, Fischer-Sozin, Poisoned Pawn.' },
    { id: 'dragon', title: 'Dragon Variation', blurb: '5...g6 — fianchetto on g7; razor-sharp Yugoslav Attack with opposite-side castling.' },
    { id: 'scheveningen', title: 'Scheveningen', blurb: '5...e6 and ...d6 — small centre, huge flexibility; Keres Attack, English Attack.' },
    { id: 'sveshnikov', title: 'Sveshnikov Variation', blurb: '4...Nf6 5.Nc3 e5 — modern main line; Carlsen used it to beat Caruana in 2018.' },
    { id: 'kalashnikov', title: 'Kalashnikov Variation', blurb: '4...e5 before ...Nf6 — younger cousin of the Sveshnikov with different move-order tricks.' },
    { id: 'classical', title: 'Classical Sicilian', blurb: '5...Nc6 — Richter-Rauzer complex.' },
    { id: 'taimanov-kan', title: 'Taimanov & Kan', blurb: '4...Nc6 or 4...a6 with ...e6; flexible queenside development.' },
    { id: 'accelerated-dragon', title: 'Accelerated Dragon', blurb: '2...Nc6 3...g6 — fianchetto early, avoid Yugoslav Attack via Maroczy Bind.' },
    { id: 'anti-sicilians', title: 'Anti-Sicilians', blurb: 'Alapin 2.c3, Rossolimo 3.Bb5, Moscow 3.Bb5+, Closed 2.Nc3, Grand Prix, Smith-Morra.' },
  ],
};
