import styles from './About.module.css';

export default function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <h2 className={styles.title}>About</h2>
        <div className={styles.grid}>
          <div className={styles.imageCol}>
            <img
              src={`${import.meta.env.BASE_URL}img/my-portrait.jpg`}
              alt="Dan Parsley"
              className={styles.portrait}
            />
            <div className={styles.socialLinks}>
              <a
                href="https://github.com/dp846"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <i className="fa-brands fa-github" />
              </a>
              <a
                href="https://www.linkedin.com/in/dan-parsley/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <i className="fa-brands fa-linkedin" />
              </a>
            </div>
          </div>

          <p className={styles.bio}>
            I'm a software engineer at the post-quantum cryptography start-up{' '}
            <a href="https://pqshield.com/" className={styles.link}>
              PQShield
            </a>{' '}
            with a first-class degree (82%) in Computer Science from the{' '}
            <a href="https://www.bath.ac.uk/" className={styles.link}>
              University of Bath
            </a>. I have keen interests in security, cryptography, and AI. In my free
            time I love to travel and produce music. Keep scrolling to find out
            more about what I've been working on - at university, at work, and
            in my spare time.
          </p>
        </div>
      </div>
    </section>
  );
}
