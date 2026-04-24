import { Outlet } from 'react-router-dom';
import { NavBar, BottomTabs } from './components/NavBar';
import { AchievementToastHost } from './components/AchievementToast';

export default function App() {
  return (
    <div className="app">
      <NavBar />
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <small>
          Gambit — Queen&apos;s Gambit &amp; Sicilian Defense, annotated at grandmaster level.
        </small>
      </footer>
      <BottomTabs />
      <AchievementToastHost />
    </div>
  );
}
