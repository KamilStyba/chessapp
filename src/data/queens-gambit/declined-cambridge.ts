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
    summary: '1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Nbd7 5.e3 c6 6.Nf3 Qa5 7.Nd2 — the critical tabiya.',
    line: [
      { san: 'd4', comment: '' }, { san: 'd5', comment: '' }, { san: 'c4', comment: '' }, { san: 'e6', comment: '' }, { san: 'Nc3', comment: '' }, { san: 'Nf6', comment: '' },
      { san: 'Bg5', comment: '' },
      { san: 'Nbd7', comment: "Black keeps the c8-bishop's diagonal clear and prepares the Cambridge move ...Qa5. An important finesse: with ...Nbd7 played, the f6-knight is defended, so Bxf6 trades only one minor piece.", keyIdea: 'Prepare ...Qa5 and keep c8-bishop mobile.' },
      { san: 'e3', comment: '' },
      { san: 'c6', comment: '' },
      { san: 'Nf3', comment: '' },
      { san: 'Qa5', comment: "The Cambridge Springs. The queen pins the c3-knight against the d1-queen on the a5-e1 diagonal's tactical ramifications, and eyes the g5-bishop indirectly — if Black ever plays ...Ne4, the bishop on g5 is attacked and the knight on c3 is pinned; lines like ...dxc4 become possible.", keyIdea: 'Multiple pins; ...Ne4 and ...dxc4 threats loom.' },
      { san: 'Nd2', comment: 'The main neutraliser. White unpins c3 by moving the f3-knight to d2, freeing c3, and preparing to deal with ...Ne4. The position is balanced — Black has exited the opening with comfortable development, White maintains a small edge thanks to more space.' },
      { san: 'Bb4', comment: 'Standard follow-up; pins the c3-knight directly.' },
      { san: 'Qc2', comment: 'Keeps the c3-knight safe and prepares a3.' },
    ],
  },
  variations: [
    {
      id: 'cambridge-trap',
      name: 'Cambridge Springs Trap',
      summary: 'A famous trick that catches unprepared White players.',
      line: [
        { san: 'd4', comment: '' }, { san: 'd5', comment: '' }, { san: 'c4', comment: '' }, { san: 'e6', comment: '' }, { san: 'Nc3', comment: '' }, { san: 'Nf6', comment: '' },
        { san: 'Bg5', comment: '' }, { san: 'Nbd7', comment: '' }, { san: 'cxd5', comment: 'A routine-looking move that falls into the trap.' },
        { san: 'exd5', comment: '' },
        { san: 'Nxd5', comment: "The point! Black plays ...Nxd5 threatening ...Nxg5 and ...Bb4+ nabbing the knight. The defender gets into trouble because if 10.Bxd8 Bb4+ 11.Qd2 Bxd2+ 12.Kxd2 Kxd8 and Black has the bishop pair with a clearly better endgame. This is the original Cambridge Springs point discovered over a century ago.", keyIdea: 'Always check CxD5, exd5, Nxd5! pattern.' },
      ],
    },
  ],
};
