import styles from './FeaturedCard.module.css';

export default function FeaturedCard({ project }) {
  const inner = (
    <div className={styles.card}>
      <div
        className={styles.image}
        style={{ backgroundImage: `url(${project.image})` }}
        role="img"
        aria-label={project.title}
      />
      <div className={styles.overlay}>
        <div className={styles.info}>
          <h3 className={styles.title}>{project.title}</h3>
          <div className={styles.tags}>
            {project.tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
          <p className={styles.description}>{project.description}</p>
          {project.link && (
            <span className={styles.linkLabel}>View project &rarr;</span>
          )}
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
