import styles from './CompactCard.module.css';

export default function CompactCard({ project }) {
  const inner = (
    <div className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.title}>
          {project.title}
          {project.link && <span className={styles.linkIcon}>↗</span>}
        </h3>
        <p className={styles.description}>{project.description}</p>
        <div className={styles.tags}>
          {project.tags.map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );

  return project.link ? (
    <a
      href={project.link}
      target="_blank"
      rel="noreferrer"
      className={styles.wrapper}
    >
      {inner}
    </a>
  ) : (
    <div className={styles.wrapper}>{inner}</div>
  );
}
