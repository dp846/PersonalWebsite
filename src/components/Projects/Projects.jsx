import { motion } from 'framer-motion';
import { featuredProjects, compactProjects } from '../../data/projects';
import FeaturedCard from './FeaturedCard';
import CompactCard from './CompactCard';
import styles from './Projects.module.css';

export default function Projects() {
  return (
    <section id="projects" className={styles.projects}>
      <div className={styles.container}>
        <h2 className={styles.title}>Projects</h2>
        <p className={styles.subtitle}>
          A selection of projects - professional, academic, and personal.
          Hover the image cards for details.
        </p>

        <div className={styles.featuredGrid}>
          {featuredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <FeaturedCard project={project} />
            </motion.div>
          ))}
        </div>

        <div className={styles.compactGrid}>
          {compactProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: (i % 2) * 0.08, duration: 0.45 }}
            >
              <CompactCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
