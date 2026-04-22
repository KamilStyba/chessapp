import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import { Home } from './routes/Home';
import { PrefsProvider } from './prefs';
import './styles.css';

const Opening = lazy(() => import('./routes/Opening').then((m) => ({ default: m.Opening })));
const Lesson = lazy(() => import('./routes/Lesson').then((m) => ({ default: m.Lesson })));
const Quiz = lazy(() => import('./routes/Quiz').then((m) => ({ default: m.Quiz })));
const Explore = lazy(() => import('./routes/Explore').then((m) => ({ default: m.Explore })));
const MasterGameView = lazy(() =>
  import('./routes/MasterGame').then((m) => ({ default: m.MasterGameView })),
);
const PuzzlesIndex = lazy(() =>
  import('./routes/Puzzles').then((m) => ({ default: m.PuzzlesIndex })),
);
const PuzzleRunner = lazy(() =>
  import('./routes/Puzzles').then((m) => ({ default: m.PuzzleRunner })),
);
const Drills = lazy(() => import('./routes/Drills').then((m) => ({ default: m.Drills })));
const PlayIndex = lazy(() => import('./routes/Play').then((m) => ({ default: m.PlayIndex })));
const PlayRunner = lazy(() => import('./routes/Play').then((m) => ({ default: m.PlayRunner })));
const Settings = lazy(() => import('./routes/Settings').then((m) => ({ default: m.Settings })));

function Loading() {
  return <div className="route-loading">Loading…</div>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrefsProvider>
      <HashRouter>
        <Routes>
          <Route element={<App />}>
            <Route path="/" element={<Home />} />
            <Route
              path="/opening/:openingId"
              element={<Suspense fallback={<Loading />}><Opening /></Suspense>}
            />
            <Route
              path="/lesson/:openingId/:lessonId"
              element={<Suspense fallback={<Loading />}><Lesson /></Suspense>}
            />
            <Route
              path="/lesson/:openingId/:lessonId/:variationId"
              element={<Suspense fallback={<Loading />}><Lesson /></Suspense>}
            />
            <Route
              path="/lesson/:openingId/:lessonId/:variationId/:subVariationId"
              element={<Suspense fallback={<Loading />}><Lesson /></Suspense>}
            />
            <Route
              path="/quiz/:openingId/:lessonId"
              element={<Suspense fallback={<Loading />}><Quiz /></Suspense>}
            />
            <Route
              path="/quiz/:openingId/:lessonId/:variationId"
              element={<Suspense fallback={<Loading />}><Quiz /></Suspense>}
            />
            <Route
              path="/explore"
              element={<Suspense fallback={<Loading />}><Explore /></Suspense>}
            />
            <Route
              path="/game/:gameId"
              element={<Suspense fallback={<Loading />}><MasterGameView /></Suspense>}
            />
            <Route
              path="/puzzles"
              element={<Suspense fallback={<Loading />}><PuzzlesIndex /></Suspense>}
            />
            <Route
              path="/puzzle/:puzzleId"
              element={<Suspense fallback={<Loading />}><PuzzleRunner /></Suspense>}
            />
            <Route
              path="/drills"
              element={<Suspense fallback={<Loading />}><Drills /></Suspense>}
            />
            <Route
              path="/play"
              element={<Suspense fallback={<Loading />}><PlayIndex /></Suspense>}
            />
            <Route
              path="/play/:openingId/:lessonId"
              element={<Suspense fallback={<Loading />}><PlayRunner /></Suspense>}
            />
            <Route
              path="/play/:openingId/:lessonId/:variationId"
              element={<Suspense fallback={<Loading />}><PlayRunner /></Suspense>}
            />
            <Route
              path="/settings"
              element={<Suspense fallback={<Loading />}><Settings /></Suspense>}
            />
          </Route>
        </Routes>
      </HashRouter>
    </PrefsProvider>
  </React.StrictMode>,
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // offline support not critical
    });
  });
}
