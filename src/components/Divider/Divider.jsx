import { useRef, useEffect } from 'react';
import styles from './Divider.module.css';

export default function Divider({ size = 'normal', variant }) {
  const outerRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const outer = outerRef.current;
    const bg = bgRef.current;
    if (!outer || !bg) return;

    const update = () => {
      const rect = outer.getBoundingClientRect();
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const offset = (progress - 0.5) * rect.height * 0.5;
      bg.style.transform = `translateY(${offset.toFixed(1)}px)`;
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  const cls = [styles.divider, styles[size], variant ? styles[variant] : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={outerRef} className={cls} aria-hidden="true">
      <div ref={bgRef} className={styles.bg} />
    </div>
  );
}
