import { useRef, useEffect } from 'react';
import styles from './Divider.module.css';

export default function Divider({ size = 'normal', variant }) {
  const ref = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const offset = (progress - 0.5) * rect.height * 0.5;
      el.style.backgroundPositionY = `calc(50% + ${offset.toFixed(1)}px)`;
      rafRef.current = null;
    };

    const onScroll = () => {
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const cls = [styles.divider, styles[size], variant ? styles[variant] : null].filter(Boolean).join(' ');
  return <div ref={ref} className={cls} aria-hidden="true" />;
}
