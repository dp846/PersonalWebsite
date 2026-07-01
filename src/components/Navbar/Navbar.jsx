import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setIsOpen(false);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <a href="#home" className={styles.brand} onClick={close}>
          danparsley.co.uk
        </a>

        <button
          className={`${styles.hamburger} ${isOpen ? styles.open : ''}`}
          onClick={() => setIsOpen(o => !o)}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`${styles.navLinks} ${isOpen ? styles.navOpen : ''}`}>
          <li><a href="#home" className={styles.navLink} onClick={close}>Home</a></li>
          <li><a href="#about" className={styles.navLink} onClick={close}>About</a></li>
          <li><a href="#projects" className={styles.navLink} onClick={close}>Projects</a></li>
        </ul>

        <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle theme">
          <i className="fa-solid fa-palette" />
        </button>
      </div>
    </nav>
  );
}
