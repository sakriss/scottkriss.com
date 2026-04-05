import styles from '../styles/Cloudship.module.css'

const features = [
  {
    icon: '📍',
    title: 'Hyperlocal Forecasts',
    description:
      'Pinpoint weather data for your exact location — not the nearest city.',
  },
  {
    icon: '🌧',
    title: 'Precipitation Alerts',
    description:
      'Background monitoring with push notifications when rain is approaching.',
  },
  {
    icon: '🏝',
    title: 'Live Activities',
    description:
      'Real-time precipitation updates on the Dynamic Island and Lock Screen.',
  },
  {
    icon: '🔲',
    title: 'Widgets',
    description:
      'Home Screen and Lock Screen widgets via the CloudshipWidget extension.',
  },
  {
    icon: '🤖',
    title: 'AI Summaries',
    description:
      'Gemini-powered natural language weather summaries for your location.',
  },
  {
    icon: '⚖️',
    title: 'Consensus Mode',
    description:
      'Averages data across multiple sources to give you the most accurate forecast.',
  },
]

const sources = [
  'AccuWeather',
  'OpenMeteo',
  'Pirate Weather',
  'Tomorrow.io',
  'NOAA / National Weather Service',
  'Apple Weather',
]

const forecastTypes = [
  { label: 'Currently', desc: 'Real-time conditions' },
  { label: 'Minutely', desc: 'Minute-by-minute precipitation' },
  { label: 'Hourly', desc: '48-hour hourly breakdown' },
  { label: 'Daily', desc: '7-day forecast' },
  { label: 'Radar', desc: 'Integrated radar view' },
  { label: 'Alerts', desc: 'Severe weather alerts' },
]

export default function Cloudship() {
  return (
    <div className="page">
      <div className="container">
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroIcon}>🌧</div>
          <h1 className={styles.heroTitle}>Cloudship</h1>
          <p className={styles.heroTagline}>
            Hyperlocal weather notifications for iOS
          </p>
          <p className={styles.heroDesc}>
            Cloudship is an iOS weather app built around one idea: knowing exactly
            what the weather is doing <em>right where you are</em>. It combines
            multiple weather data sources, AI-powered summaries, and real-time
            precipitation alerts to keep you informed without the noise.
          </p>
          <div className={styles.heroActions}>
            
            <span className={styles.appStoreBadge}>App Store — Coming Soon</span>
          </div>
        </section>

        {/* Features */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Features</h2>
          <div className={styles.featureGrid}>
            {features.map(({ icon, title, description }) => (
              <div key={title} className={styles.featureCard}>
                <span className={styles.featureIcon}>{icon}</span>
                <h3 className={styles.featureTitle}>{title}</h3>
                <p className={styles.featureDesc}>{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Forecast Types */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Forecast Views</h2>
          <div className={styles.forecastGrid}>
            {forecastTypes.map(({ label, desc }) => (
              <div key={label} className={styles.forecastItem}>
                <span className={styles.forecastLabel}>{label}</span>
                <span className={styles.forecastDesc}>{desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Data Sources */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Data Sources</h2>
          <p className={styles.sourcesIntro}>
            Cloudship pulls from six independent weather providers. Consensus Mode
            averages them for greater accuracy.
          </p>
          <div className={styles.sourcesList}>
            {sources.map((s) => (
              <div key={s} className={styles.sourceItem}>
                <span className={styles.sourceDot} />
                {s}
              </div>
            ))}
          </div>
        </section>

        {/* Tech */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Built With</h2>
          <div className={styles.techRow}>
            {['Swift', 'UIKit', 'WidgetKit', 'ActivityKit', 'Gemini API', 'CocoaPods'].map((t) => (
              <span key={t} className={styles.techTag}>{t}</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
