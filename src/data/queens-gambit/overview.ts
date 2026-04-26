import { OpeningOverview } from '../types';

export const queensGambitOverview: OpeningOverview = {
  id: 'queens-gambit',
  title: "Queen's Gambit",
  subtitle: '1.d4 d5 2.c4 — the most classical fight for the center',
  intro:
    "The Queen's Gambit is not a true gambit in the modern, purely material sense: after 2.c4 Black cannot profitably hold the c4-pawn, because White generates fast central play with e2-e4 or Nc3/e3 and reclaims it on natural terms. Its real purpose is strategic: White challenges Black's d5-pawn so that either (a) Black captures (dxc4), surrendering the centre and allowing White to erect an e4-d4 duo, or (b) Black defends with ...e6, ...c6, or ...Nc6, accepting cramped development in exchange for a durable pawn on d5. Every Queen's Gambit structure — Carlsbad, Isolated Queen's Pawn (IQP), hanging pawns on c5/d5, Karlsbad-with-reversed-colours, the Stonewall Dutch triangle — is really a debate over the d4/d5/c4/c5 squares and the resulting minor-piece landscape. Understanding the Queen's Gambit means understanding long strategic chess: the minority attack, the e3-e4 break, rook lifts on the third rank, good knights on d4 and e5, and bishops rerouted from f1 to d3-b1-c2 or fianchettoed on g2. Nearly every World Champion from Steinitz to Carlsen has used it as the backbone of a top-level 1.d4 repertoire.",
  coreIdeas: [
    'Fight for d5: either tempt Black to release the centre with ...dxc4, or force structural concessions.',
    'Use the c4-pawn as a lever to trade off d5 (Exchange Variation → minority attack) or to open the c-file after ...dxc4.',
    'Minor pieces follow archetypes: Nc3/Nf3, Bg5 or Bf4 pinning/pressing e7, bishop to d3 eyeing h7.',
    'Decide structure first, tactics second — IQP vs. Carlsbad vs. hanging pawns defines every middlegame plan.',
    'Prophylaxis is constant: watch for ...c5, ...e5, and ...b5 freeing breaks from Black.',
  ],
  lessons: [
    { id: 'accepted', title: "Queen's Gambit Accepted (QGA)", blurb: '2...dxc4. Central expansion with e4, fast development, pressure on Black\'s queenside.' },
    { id: 'declined-orthodox', title: 'QGD — Orthodox Defence', blurb: '2...e6 3.Nc3 Nf6 4.Bg5 Be7. The heart of classical chess: Lasker, Tartakower, Capablanca systems.' },
    { id: 'declined-exchange', title: 'QGD — Exchange Variation', blurb: 'White trades c4xd5 early to fix Black\'s structure and launch the minority attack with b4-b5.' },
    { id: 'declined-cambridge', title: 'QGD — Cambridge Springs', blurb: '...Qa5 — an active try pinning c3 and eyeing Bg5; demands precise piece coordination from White.' },
    { id: 'declined-ragozin', title: 'QGD — Ragozin', blurb: '4...Bb4 — a hybrid of QGD and Nimzo-Indian; fights for e4 and doubles c-pawns.' },
    { id: 'declined-vienna', title: 'QGD — Vienna Variation', blurb: '4...dxc4 5.e4 Bb4 — computer-era theoretical battleground; Kramnik & Caruana weapon.' },
    { id: 'slav', title: 'Slav Defence', blurb: '2...c6 — Black keeps the light-squared bishop free on c8 before playing ...e6.' },
    { id: 'semi-slav', title: 'Semi-Slav', blurb: '...e6 and ...c6 — solid triangle; Meran, Anti-Meran, Moscow, Anti-Moscow, Botvinnik.' },
    { id: 'tarrasch', title: 'Tarrasch Defence', blurb: '3...c5 — Black accepts an IQP for fast development and open lines.' },
    { id: 'chigorin-albin', title: 'Chigorin & Albin', blurb: 'Sharp, enterprising sidelines: 2...Nc6 and 2...e5 (Albin Counter-Gambit).' },
    { id: 'marshall', title: 'Marshall Defence (2...Nf6)', blurb: 'A tactical curiosity — leads to the famous "exchange of forks" Nxc7+ / Nxa8 sequence.' },
  ],
};
