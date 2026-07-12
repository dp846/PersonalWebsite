import styles from './Divider.module.css';

export default function Divider({ size = 'normal', variant }) {
  const cls = [styles.divider, styles[size], variant ? styles[variant] : null]
    .filter(Boolean)
    .join(' ');

  return <div className={cls} aria-hidden="true" />;
}
