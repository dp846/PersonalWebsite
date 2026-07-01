import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ParticleCanvas from './ParticleCanvas';
import LavaLamp from './LavaLamp';
import styles from './Hero.module.css';

const TITLE = "Hey, I'm Dan.";

export default function Hero() {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="home" className={styles.hero}>
      <ParticleCanvas />
      <LavaLamp />

      <div className={styles.content}>
        <h1 className={styles.title} aria-label={TITLE}>
          {TITLE.split('').map((char, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.045,
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
            >
              {char === ' ' ? ' ' : char}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.7 }}
        >
          Software Engineer - Cryptography - AI
        </motion.p>
      </div>

      <motion.div
        className={styles.scrollIndicator}
        animate={{ opacity: atTop ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <span>Scroll</span>
        <div className={styles.arrow} />
      </motion.div>
    </section>
  );
}
