import { Link } from 'react-router-dom'
import styles from '../styles/Home.module.css'

const cards = [
  {
    to: '/resume',
    icon: '📄',
    title: 'Resume',
    description:
      'Senior Software Test Engineer with 10+ years at Intuit and Deloitte. Specializing in test automation, mobile testing, and full-stack development.',
  },
  {
    to: '/cloudship',
    icon: '🌧',
    title: 'Cloudship',
    description:
      'Hyperlocal iOS weather app with multi-source forecasts, precipitation alerts, Live Activities, and AI-powered summaries.',
  },
  {
    to: '/weather',
    icon: '🌡',
    title: 'Weather Station',
    description:
      'Live data from my personal Tempest weather station in Bonney Lake, WA — temperature, wind, rain, UV, and more.',
  },
]

export default function Home() {
  return (
    <div className={`${styles.page} page`}>
      <div className="container">
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <p className={styles.greeting}>Hi, I&apos;m</p>
            <h1 className={styles.name}>Scott Kriss</h1>
            <p className={styles.title}>
              Senior Software Test Engineer &amp; iOS Developer
            </p>
            <p className={styles.bio}>
              Based in Bonney Lake, WA. I build robust test automation
              frameworks, optimize CI/CD pipelines, and develop iOS apps.
              Previously at{' '}
              <span className={styles.highlight}>Intuit Mailchimp</span> and{' '}
              <span className={styles.highlight}>Deloitte Digital</span>.
            </p>
            <div className={styles.heroActions}>
              <Link to="/resume" className={styles.btnPrimary}>
                View Resume
              </Link>
              <a
                href="https://www.linkedin.com/in/scottakriss/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnSecondary}
              >
                LinkedIn
              </a>
            </div>
          </div>
        </section>

        <section className={styles.cards}>
          <h2 className={styles.sectionTitle}>Projects &amp; Pages</h2>
          <div className={styles.grid}>
            {cards.map(({ to, icon, title, description }) => (
              <Link to={to} key={to} className={styles.card}>
                <span className={styles.cardIcon}>{icon}</span>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardDesc}>{description}</p>
                <span className={styles.cardArrow}>→</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
