import styles from '../styles/Resume.module.css'

const competencies = [
  'Software Testing', 'Test Automation', 'Manual Testing',
  'Mobile Application Testing', 'Website Testing', 'Test Planning',
  'Quality Assurance', 'Smoke, Functional, Regression, System, Integration, Compatibility Testing',
  'Bug Tracking', 'SDLC', 'Selenium', 'Playwright', 'Jest', 'Postman',
  'Charles Proxy', 'Jira', 'Confluence', 'Microsoft DevOps', 'Java',
  'Swift', 'Kotlin', 'C#', 'Python', 'JavaScript', 'HTML', 'PHP',
  'React', 'Full-Stack Development', 'Agile Methodologies', 'Scrum Ceremonies',
]

const accomplishments = [
  'Revamped iOS & Android UI tests with Swift & Kotlin, boosting quality, functionality & usability. Reduced repos & maintenance areas by implementing native tests while increasing test automation coverage by over 50%.',
  'Managed nearly 100 critical path end-to-end tests, collaborating with teams to promptly identify issues and ensure smooth test execution, consistently achieving top performance metrics year-over-year among peers at Intuit.',
  'Overhauled the website using React, resulting in a modern and scalable platform for internal tooling, enhancing user experience and streamlining processes at Intuit.',
  'Stabilized backend code and implemented verified API, resulting in an increase in efficiency by over 10% for front-end developers and a more seamless process for feature completion at Deloitte.',
  'Implemented automated heartbeat testing using Postman collections to ensure backend API functionality, resulting in improved development efficiency and client satisfaction with reduced downtime.',
]

const experience = [
  {
    title: 'Sr. Software Test Engineer',
    company: 'Intuit Mailchimp',
    location: 'Atlanta, GA',
    dates: 'March 2022 – September 2024',
    bullets: [
      'Modernized iOS and Android UI tests by migrating from Appium to native frameworks written in Swift and Kotlin, resulting in improved quality, functionality, and usability.',
      'Optimized CI/CD pipelines in Bitrise.io, slashed build times from 60 minutes to 40 minutes and enhancing the reliability of test runs.',
      'Developed and managed an internal tooling website hosted on AWS (EKS) and Google Cloud (GKE), leveraging cloud-native technologies to ensure scalability, reliability, and efficient deployment.',
      'Designed and implemented a full-stack web application for engineers, featuring tools aimed at alleviating common frustrations and enabling high-quality development.',
      'Participated in an on-call rotation to monitor test results and address inquiries or issues raised by fellow engineers.',
      'Facilitated Scrum ceremonies to foster collaboration, communication, and adherence to Agile practices, ensuring the team consistently delivered planned work on time.',
      'Gained experience with observability tools like Elasticsearch and Splunk, improving system monitoring, troubleshooting, and performance optimization.',
    ],
  },
  {
    title: 'Software Test Engineer',
    company: 'Deloitte Digital',
    location: 'Seattle, WA',
    dates: 'September 2013 – March 2022',
    bullets: [
      'Designed, developed, maintained, and executed functional, regression, integration, and end-to-end tests.',
      'Collaborated and communicated effectively with teams of developers and QA engineers to test mobile applications at both the functional and system levels using manual testing methodologies.',
      'Tested and debugged mobile applications using tools such as Xcode and Android Studio.',
      'Utilized Charles Proxy to test network requests and responses and improved automated test scripts.',
      'Tested APIs with Postman and integrated them with Jenkins to execute automated test scripts.',
      'Performed white box testing and bug fixing in Xcode using Swift.',
      'Created C# scripts for automation with Selenium.',
      'Served as Scrum Master for several Scrum ceremonies.',
    ],
  },
]

const education = [
  {
    degree: 'Associates of Applied Science in Computer Science',
    school: 'Renton Technical College',
    location: 'Renton, WA',
  },
  {
    degree: 'Associates of Arts — General Studies',
    school: 'Green River Community College',
    location: 'Auburn, WA',
  },
  {
    degree: 'iOS Application Development Certification',
    school: 'University of Washington',
    location: 'Seattle, WA',
  },
  {
    degree: 'Software Testing Studies Certification',
    school: 'Bellevue Community College',
    location: 'Bellevue, WA',
  },
]

export default function Resume() {
  return (
    <div className="page">
      <div className="container">
        <div className={styles.actions}>
          <a href="/resume.pdf" download className={styles.downloadBtn}>
            Download PDF
          </a>
        </div>

        <div className={styles.resume}>
          {/* Header */}
          <header className={styles.header}>
            <h1 className={styles.name}>Scott Kriss</h1>
            <p className={styles.contact}>
              Bonney Lake, WA
              &nbsp;◆&nbsp;
              <a href="https://www.linkedin.com/in/scottakriss/" target="_blank" rel="noopener noreferrer">
                linkedin.com/in/scottakriss
              </a>
            </p>
            <h2 className={styles.roleTitle}>Senior Software Test Engineer</h2>
            <p className={styles.summary}>
              Experienced Senior Software Test Engineer and Automated Tester with a strong background
              in designing, developing, and executing comprehensive test plans across functional,
              regression, integration, and end-to-end testing. Adept at leading cross-functional teams
              to identify and address issues promptly, ensuring smooth test execution. Proven record of
              consistently achieving top performance metrics among peers. Skilled in Agile methodologies
              and facilitating Scrum ceremonies to ensure effective collaboration and communication.
              Expertise in manual and mobile testing, Selenium, and observability tools like Elasticsearch
              and Splunk. Passionate about optimizing CI/CD pipelines and overhauling UI tests for
              improved quality and functionality.
            </p>
          </header>

          {/* Core Competencies */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Core Competencies</h3>
            <div className={styles.tags}>
              {competencies.map((c) => (
                <span key={c} className={styles.tag}>{c}</span>
              ))}
            </div>
          </section>

          {/* Accomplishments */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Accomplishments</h3>
            <ul className={styles.bullets}>
              {accomplishments.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </section>

          {/* Experience */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Professional Experience</h3>
            {experience.map((job) => (
              <div key={job.company} className={styles.job}>
                <div className={styles.jobHeader}>
                  <div>
                    <span className={styles.jobTitle}>{job.title}</span>
                    <span className={styles.jobSep}> | </span>
                    <span className={styles.jobCompany}>{job.company}</span>
                    <span className={styles.jobSep}> | </span>
                    <span className={styles.jobLocation}>{job.location}</span>
                  </div>
                  <span className={styles.jobDates}>{job.dates}</span>
                </div>
                <ul className={styles.bullets}>
                  {job.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Education */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Education</h3>
            <div className={styles.eduGrid}>
              {education.map((e) => (
                <div key={e.degree} className={styles.eduItem}>
                  <span className={styles.eduDegree}>{e.degree}</span>
                  <span className={styles.eduSchool}>{e.school} — {e.location}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
