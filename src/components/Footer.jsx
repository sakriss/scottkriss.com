import styles from '../styles/Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.name}>Scott Kriss</span>
        <div className={styles.links}>
          <a
            href="https://www.linkedin.com/in/scottakriss/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/scottkriss"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a href="mailto:scottkriss@gmail.com">Email</a>
        </div>
      </div>
    </footer>
  )
}
