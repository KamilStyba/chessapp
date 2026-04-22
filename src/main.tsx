import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import { Home } from './routes/Home';
import { Opening } from './routes/Opening';
import { Lesson } from './routes/Lesson';
import { Quiz } from './routes/Quiz';
import { Explore } from './routes/Explore';
import { MasterGameView } from './routes/MasterGame';
import { PuzzlesIndex, PuzzleRunner } from './routes/Puzzles';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="/opening/:openingId" element={<Opening />} />
          <Route path="/lesson/:openingId/:lessonId" element={<Lesson />} />
          <Route path="/lesson/:openingId/:lessonId/:variationId" element={<Lesson />} />
          <Route path="/lesson/:openingId/:lessonId/:variationId/:subVariationId" element={<Lesson />} />
          <Route path="/quiz/:openingId/:lessonId" element={<Quiz />} />
          <Route path="/quiz/:openingId/:lessonId/:variationId" element={<Quiz />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/game/:gameId" element={<MasterGameView />} />
          <Route path="/puzzles" element={<PuzzlesIndex />} />
          <Route path="/puzzle/:puzzleId" element={<PuzzleRunner />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>,
);
