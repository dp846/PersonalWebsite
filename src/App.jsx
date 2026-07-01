import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Divider from './components/Divider/Divider';
import Projects from './components/Projects/Projects';
import Footer from './components/Footer/Footer';
import './styles/global.css';

export default function App() {
  return (
    <ThemeProvider>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Divider size="tall" />
        <Projects />
        <Divider size="full" variant="ocean" />
      </main>
      <Footer />
    </ThemeProvider>
  );
}
