import { Outlet } from 'react-router-dom';
import { NavBar } from './components/NavBar';

export default function App() {
  return (
    <div className="app">
      <NavBar />
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <small>
          Chess Openings Trainer — Queen&apos;s Gambit &amp; Sicilian Defense. GM-level commentary for thorough study.
        </small>
      </footer>
    </div>
  );
}
