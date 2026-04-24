import { Lesson } from '../types';

export const qgdCambridgeSprings: Lesson = {
  id: 'declined-cambridge',
  parent: 'queens-gambit',
  title: 'QGD — Cambridge Springs',
  intro:
    "Named after the 1904 tournament in Cambridge Springs, Pennsylvania, where it was sprung on several unsuspecting grandmasters, this system is the most dynamic QGD try for Black. The key move ...Qa5 ties the Bg5 and the Nc3 to each other — the bishop is indirectly defended by the queen on d1 only along lines that become tactical if White moves a piece, and the knight on c3 is pinned to the queen by ...Bb4 ideas. The thematic Cambridge Springs trap catches White with Bxf6 Bxh4, and if White misplays the sequence, the c3-knight can be lost or the exchange can be won. The opening rewards precise memorisation of early moves and deep understanding of pin geometry. Its modern incarnation has been used by Ivanchuk, Moiseenko and Howell as a surprise weapon against 1.d4.",
  themes: [
    'Queen on a5 generates multiple pins against c3 and g5',
    'Capture tactics: ...Ne4, ...Bb4, ...dxc4 in combination',
    '...Ne4 and ...Nxg5 trades to relieve Black\'s pressure',
    'Bishop trade on f6 gives Black the bishop pair in some lines',
    'White neutralises with Nd2 and quiet play to side-step the pins',
  ],
  pawnStructures: [
    {
      name: 'Classical QGD with ...c6 and ...Nbd7',
      description: 'Slav-like triangle with queen active on a5. d5 is solid; Black\'s counterplay depends on tactical resources.',
    },
  ],
  typicalPlans: {
    white: [
      'Neutralise the queen with Nd2 (unpinning c3) and Bxf6/Bh4 decisions.',
      'Play cxd5 exd5 at the right moment to turn the position into a Carlsbad-ish structure where Black\'s queen is misplaced.',
      'Avoid early c4xd5 until the minor pieces are consolidated.',
    ],
    black: [
      'Spring ...Ne4 or ...dxc4 at the right moment to generate multiple threats.',
      'Remember that if White ever plays Bxf6 and Black recaptures with ...Nxf6 and then wins tempo on g5 with ...Bxh4 in certain orders, the tactics favour Black.',
      'Castle long in some lines after ...Bb4; typically short, though.',
    ],
  },
  mainLine: {
    id: 'main',
    name: 'Cambridge Springs — Main Line',
    eco: 'D52',
    summary: '1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Nbd7 5.e3 c6 6.Nf3 Qa5 7.Nd2 Bb4 8.Qc2 — the classical neutralisation.',
    line: [
      { san: 'd4', comment: '' }, { san: 'd5', comment: '' }, { san: 'c4', comment: '' }, { san: 'e6', comment: '' }, { san: 'Nc3', comment: '' }, { san: 'Nf6', comment: '' },
      { san: 'Bg5', comment: 'The classical pin.' },
      { san: 'Nbd7', comment: "Black keeps the c8-bishop's diagonal clear and prepares the Cambridge move ...Qa5. An important finesse: with ...Nbd7 played, the f6-knight is defended, so Bxf6 trades only one minor piece.", keyIdea: 'Prepare ...Qa5 and keep c8-bishop mobile.' },
      { san: 'e3', comment: 'Modest, solid development.' },
      { san: 'c6', comment: 'Slav-shaped triangle; d5 is doubly defended and ...Qa5 is ready.' },
      { san: 'Nf3', comment: 'Develops naturally but commits the f3-knight — a point Black will exploit with ...Ne4 tricks.' },
      { san: 'Qa5', comment: "The Cambridge Springs. The queen indirectly attacks g5 (via a knight jump to e4) and pins c3 against ...Bb4. If White plays 8.Bxf6? Nxf6! 9.? White has no good move — the c3-knight is pinned and cxd5 Nxd5 wins material. Hence Nd2.", keyIdea: 'Multiple pins; ...Ne4 and ...dxc4 threats loom.' },
      { san: 'Nd2', comment: 'The main neutraliser. White unpins c3 by moving the f3-knight to d2, freeing c3, and preparing to deal with ...Ne4. The position is balanced — Black has exited the opening with comfortable development, White maintains a small edge thanks to more space.' },
      { san: 'Bb4', comment: 'Standard follow-up; pins the c3-knight directly. The queen-plus-bishop battery against c3 is unique to the Cambridge.' },
      { san: 'Qc2', comment: 'Keeps the c3-knight safe and prepares a3. Other moves like 9.Rc1 are possible but 9.Qc2 is the sharpest: it supports c3 and eyes h7 for the Bd3+Qc2 battery.' },
      { san: 'O-O', comment: 'Black castles kingside; there is no time to dream about ...O-O-O because the queenside is open terrain.' },
      { san: 'Be2', comment: 'A quiet developing move that prepares O-O. The flexible 10.a3 is also common, asking the bishop.' },
      { san: 'e5', comment: '10...e5! — the typical central break. Black exploits White\'s slow development. If 11.dxe5 Ne4! 12.Ncxe4 dxe4 Black has active play.', keyIdea: 'Counter in the centre with ...e5.', alternatives: [ { san: 'dxc4', why: '...dxc4 is also fine: 11.Nxc4 Qc7 12.O-O b5 — Black has finished development and claims equality.' } ] },
      { san: 'O-O', comment: 'White declines the challenge. After 11.dxe5 Ne4 the knight dances into e4 with threats against g5 and c3.' },
      { san: 'Bxc3', comment: 'Timely. The dark-squared bishop departs having served: the c3-knight is damaged and ...e4 can follow.' },
      { san: 'bxc3', comment: 'White is forced to accept doubled c-pawns.' },
      { san: 'e4', comment: '12...e4! locks the centre and buries the Nd2 knight. Black has reached a classic "bishop vs. knight" imbalance with the doubled c-pawns as a target.' },
      { san: 'f3', comment: 'White undermines. The sharp 13.f3 is the critical test; after ...exf3 14.Nxf3 Black\'s pieces can coordinate.' },
      { san: 'exf3', comment: '' },
      { san: 'Nxf3', comment: 'The resulting middlegame is roughly balanced: White has the bishop pair and the centre, Black has pressure on c3 and c4 and can exploit White\'s structural concession. Cambridge Springs has delivered Black a real game.' },
    ],
  },
  variations: [
    {
      id: 'cambridge-trap',
      name: 'The Cambridge Springs Trap',
      summary: 'A famous trick that catches unprepared White players.',
      line: [
        { san: 'd4', comment: '' }, { san: 'd5', comment: '' }, { san: 'c4', comment: '' }, { san: 'e6', comment: '' }, { san: 'Nc3', comment: '' }, { san: 'Nf6', comment: '' },
        { san: 'Bg5', comment: '' }, { san: 'Nbd7', comment: '' }, { san: 'cxd5', comment: 'A routine-looking move that falls into the trap.' },
        { san: 'exd5', comment: '' },
        { san: 'Nxd5', comment: "The point! Black plays ...Nxd5 threatening ...Nxg5 and ...Bb4+ nabbing the knight. The defender gets into trouble because if 10.Bxd8 Bb4+ 11.Qd2 Bxd2+ 12.Kxd2 Kxd8 and Black has the bishop pair with a clearly better endgame. This is the original Cambridge Springs point discovered over a century ago.", keyIdea: 'Always check CxD5, exd5, Nxd5! pattern.' },
      ],
    },
    {
      id: 'capablanca-retreat',
      name: 'Capablanca Retreat — 10.Bh4',
      eco: 'D52',
      summary: "White keeps the bishop and lets the queen swap come later.",
      line: [
        { san: 'd4', comment: '' }, { san: 'd5', comment: '' }, { san: 'c4', comment: '' }, { san: 'e6', comment: '' }, { san: 'Nc3', comment: '' }, { san: 'Nf6', comment: '' },
        { san: 'Bg5', comment: '' }, { san: 'Nbd7', comment: '' }, { san: 'e3', comment: '' }, { san: 'c6', comment: '' }, { san: 'Nf3', comment: '' }, { san: 'Qa5', comment: '' }, { san: 'Nd2', comment: '' }, { san: 'Bb4', comment: '' },
        { san: 'Qc2', comment: '' }, { san: 'dxc4', comment: '9...dxc4 — the Capablanca approach. Black rejects ...O-O in favour of cashing in on the pin immediately.', keyIdea: 'Transform the pin into material pressure.' },
        { san: 'Bxf6', comment: '10.Bxf6! — the critical move. White eliminates the pin-setter before recapturing the pawn.' },
        { san: 'Nxf6', comment: '' },
        { san: 'Nxc4', comment: '11.Nxc4 Qc7 is the main line: the queen sidesteps and the position is approximately balanced, with White\'s marginal edge from pawn structure offset by Black\'s bishop pair.' },
        { san: 'Qc7', comment: 'Clearing the a5 square and eyeing h2 along the b8-h2 diagonal.' },
        { san: 'g3', comment: 'Prophylaxis against ...Qf4 and preparing Bg2 to take on the long diagonal.' },
        { san: 'O-O', comment: '' },
        { san: 'Bg2', comment: '' },
        { san: 'Bd7', comment: 'Black completes development; the game is balanced.' },
      ],
    },
  ],
  commonTraps: [
    {
      name: 'The central ...Nxg5 tactic',
      line: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Nbd7', 'e3', 'c6', 'Nf3', 'Qa5', 'cxd5', 'Nxd5'],
      comment: "7.cxd5?? is a well-known blunder — 7...Nxd5! hits both the Bg5 (undefended now) and the Nc3 (pinned to the queen on d1). White cannot save both pieces; the position collapses immediately. Remember: after ...Qa5 + ...Nbd7, cxd5 is premature because of ...Nxd5.",
    },
  ],
};
