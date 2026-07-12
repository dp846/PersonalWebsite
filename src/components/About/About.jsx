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

          <div className={styles.bioCol}>
            <p className={styles.bio}>
              I'm a software engineer at{' '}
              <a href="https://pqshield.com/" className={styles.link}>
                PQShield
              </a>
              , a University of Oxford spinout specialising in post-quantum
              cryptography. I hold a first-class degree (82%) in Computer Science
              from the{' '}
              <a href="https://www.bath.ac.uk/" className={styles.link}>
                University of Bath
              </a>
              .
            </p>
            <p className={styles.bio}>
              I work across PQShield's core software products, including their
              post-quantum cryptographic library and OpenSSL provider. Outside of
              work I'll usually have a side project on the go - currently I'm
              working on creating my strategy card game called{' '}
              <a href="https://playdropgame.com/" className={styles.link}>
                DROP!
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
