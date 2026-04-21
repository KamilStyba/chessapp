import { Lesson, MasterGame, OpeningOverview } from './types';

import { queensGambitOverview } from './queens-gambit/overview';
import { qgAccepted } from './queens-gambit/accepted';
import { qgdOrthodox } from './queens-gambit/declined-orthodox';
import { qgdExchange } from './queens-gambit/declined-exchange';
import { qgdCambridgeSprings } from './queens-gambit/declined-cambridge';
import { qgdRagozin } from './queens-gambit/declined-ragozin';
import { qgdVienna } from './queens-gambit/declined-vienna';
import { qgSlav } from './queens-gambit/slav';
import { qgSemiSlav } from './queens-gambit/semi-slav';
import { qgTarrasch } from './queens-gambit/tarrasch';
import { qgChigorinAlbin } from './queens-gambit/chigorin-albin';
import { qgGames } from './queens-gambit/games';

import { sicilianOverview } from './sicilian/overview';
import { sicNajdorf } from './sicilian/najdorf';
import { sicDragon } from './sicilian/dragon';
import { sicScheveningen } from './sicilian/scheveningen';
import { sicSveshnikov } from './sicilian/sveshnikov';
import { sicKalashnikov } from './sicilian/kalashnikov';
import { sicClassical } from './sicilian/classical';
import { sicTaimanovKan } from './sicilian/taimanov-kan';
import { sicAcceleratedDragon } from './sicilian/accelerated-dragon';
import { sicAntiSicilians } from './sicilian/anti-sicilians';
import { sicGames } from './sicilian/games';

interface OpeningBundle {
  id: 'queens-gambit' | 'sicilian';
  title: string;
  subtitle: string;
  overview: OpeningOverview;
  lessons: Lesson[];
  games: MasterGame[];
}

const qgLessons: Lesson[] = [
  qgAccepted,
  qgdOrthodox,
  qgdExchange,
  qgdCambridgeSprings,
  qgdRagozin,
  qgdVienna,
  qgSlav,
  qgSemiSlav,
  qgTarrasch,
  qgChigorinAlbin,
];

const sicLessons: Lesson[] = [
  sicNajdorf,
  sicDragon,
  sicScheveningen,
  sicSveshnikov,
  sicKalashnikov,
  sicClassical,
  sicTaimanovKan,
  sicAcceleratedDragon,
  sicAntiSicilians,
];

export const openings: OpeningBundle[] = [
  {
    id: 'queens-gambit',
    title: queensGambitOverview.title,
    subtitle: queensGambitOverview.subtitle,
    overview: queensGambitOverview,
    lessons: qgLessons,
    games: qgGames,
  },
  {
    id: 'sicilian',
    title: sicilianOverview.title,
    subtitle: sicilianOverview.subtitle,
    overview: sicilianOverview,
    lessons: sicLessons,
    games: sicGames,
  },
];

export function findOpening(id: string): OpeningBundle | undefined {
  return openings.find((o) => o.id === id);
}

export function findLesson(openingId: string, lessonId: string): Lesson | undefined {
  return findOpening(openingId)?.lessons.find((l) => l.id === lessonId);
}

export function findGame(id: string): MasterGame | undefined {
  for (const op of openings) {
    const g = op.games.find((g) => g.id === id);
    if (g) return g;
  }
  return undefined;
}
