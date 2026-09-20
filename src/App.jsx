import { useEffect } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  AirplaneTilt,
  Code,
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
  Tree,
  Waveform,
} from "@phosphor-icons/react";
import MobileNavigation from "./components/MobileNavigation";
import ResearchFigure from "./components/ResearchFigure";

const ASSET_BASE = import.meta.env.BASE_URL;
const LINKEDIN = "https://www.linkedin.com/in/siddharth-gunti-66ba212b8/";
const GITHUB = "https://github.com/guntisid2007";
const EMAIL = "sgunti@purdue.edu";

const navigation = [
  { href: "#work", label: "Work" },
  { href: "#research", label: "Research" },
  { href: "#experience", label: "Experience" },
  { href: "#about", label: "About" },
  { href: `${ASSET_BASE}resume.html`, label: "Resume" },
  { href: "#contact", label: "Contact" },
];

const projects = [
  {
    type: "Autonomy and communications",
    icon: AirplaneTilt,
    title: "Modular fiber-tethered drone platform",
    description:
      "Co-develop a fiber-tethered drone for reliable command and data without radio links, with communications architecture for inspection, underground, and disaster-response use.",
    detail: "Developing toward NASA's 2027 Gateways to Blue Skies Competition",
    tools: ["Fiber tether", "Communications", "Systems design"],
    featured: true,
  },
  {
    type: "Voice AI",
    icon: Waveform,
    title: "Sidekick",
    description:
      "Co-develop a voice AI assistant integrating Parakeet speech recognition with Gemma, including conversational context and wake-word activation.",
    detail: "Developer, Purdue University / 2026-present",
    tools: ["Parakeet", "Gemma", "Voice activation"],
  },
  {
    type: "Community engineering",
    icon: Tree,
    title: "Eagle Scout service project",
    description:
      "Led 20+ volunteers to refurbish 13 community benches and construct a public information kiosk for a township park.",
    detail: "Managed volunteer logistics and a $500+ project budget",
    tools: ["Planning", "Construction", "Leadership"],
  },
  {
    type: "Software",
    icon: Code,
    title: "Java Swing idle game",
    description:
      "Built an object-oriented desktop game with upgrade systems, timers, progression mechanics, and large-number calculations.",
    detail: "Designed and implemented as an independent application",
    tools: ["Java", "Swing", "OOP"],
  },
];

const experience = [
  {
    period: "SEP 2026 - PRESENT",
    role: "Software Engineering Intern",
    organization: "RideKova",
    location: "Purdue University",
    summary:
      "Ship software patches, resolve bugs, manage production changes in Git/GitHub, and test fixes on a three-person development team.",
    logo: `${ASSET_BASE}assets/logos/kova.png`,
    logoAlt: "KOVA",
  },
  {
    period: "AUG 2026 - PRESENT",
    role: "Digital Media & Web Intern",
    organization: "The Station Food Market",
    location: "West Lafayette, Indiana",
    summary:
      "Maintain website content and produce short-form media; one campaign reached 29K views, about 20 times typical performance.",
    logo: `${ASSET_BASE}assets/logos/station-food-market.png`,
    logoAlt: "The Station Food Market",
  },
  {
    period: "SUMMER 2025",
    role: "Engineering Research Intern",
    organization: "Research Support India",
    location: "Hosur, India",
    summary:
      "Analyzed 50+ electrolyzer trials in Python/Pandas and produced Matplotlib visualizations for a 20-page technical report reviewed by engineers.",
    monogram: "RSI",
  },
  {
    period: "SEP 2022 - MAR 2026",
    role: "Captain, Build Lead & Treasurer",
    organization: "VEX Robotics, Team 3327C",
    location: "Competition robotics",
    summary:
      "Led a six-person team through robot design, construction, testing, and strategy while redesigning drivetrain, structure, and pneumatic systems.",
    monogram: "VEX",
  },
];

function EvidenceLink({ href, children, external = false, primary = false }) {
  const Icon = external ? ArrowUpRight : href.startsWith("#") ? ArrowDown : ArrowRight;
  return (
    <a
      className={`evidence-link${primary ? " evidence-link-primary" : ""}`}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      <span>{children}</span>
      <Icon size={17} weight="bold" aria-hidden="true" />
    </a>
  );
}

function OrganizationMark({ item }) {
  return (
    <div className={`organization-mark${item.logo ? " has-logo" : ""}`}>
      {item.logo ? (
        <img src={item.logo} alt={item.logoAlt} loading="lazy" />
      ) : (
        <span aria-hidden="true">{item.monogram}</span>
      )}
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = document.querySelectorAll("[data-reveal]");

    if (reducedMotion) {
      elements.forEach((element) => element.setAttribute("data-visible", "true"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-visible", "true");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="site">
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="site-header">
        <a className="identity" href="#top" aria-label="Sid Gunti, home">
          <span className="identity-mark" aria-hidden="true">SG</span>
          <span>SID GUNTI</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map(({ href, label }) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <MobileNavigation links={navigation} />
      </header>

      <main id="main" tabIndex={-1}>
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="hero-kicker hero-intro">Purdue University / Computer Engineering</p>
            <h1 className="hero-intro">Hardware meets software.</h1>
            <p className="hero-deck hero-intro">
              Embedded systems, robotics, data, and code. Built with evidence, tested in the real world.
            </p>
            <div className="hero-actions hero-intro">
              <EvidenceLink href="#work" primary>View selected work</EvidenceLink>
              <EvidenceLink href={`${ASSET_BASE}resume.html`}>View resume</EvidenceLink>
            </div>
          </div>

          <div className="hero-portrait hero-intro">
            <img
              src={`${ASSET_BASE}sid-gunti.jpg`}
              alt="Siddharth Gunti"
              width="720"
              height="900"
              fetchPriority="high"
            />
            <div className="portrait-meta">
              <span>Sid Gunti</span>
              <span>Open to Summer 2027</span>
            </div>
            <div className="hero-socials" aria-label="Professional profiles">
              <a href={GITHUB} target="_blank" rel="noreferrer"><GithubLogo size={19} weight="fill" />GitHub</a>
              <a href={LINKEDIN} target="_blank" rel="noreferrer"><LinkedinLogo size={19} weight="fill" />LinkedIn</a>
              <a href="#contact"><EnvelopeSimple size={19} />Contact</a>
            </div>
          </div>
        </section>

        <section className="proof-strip" aria-label="Portfolio focus">
          <span>Purdue engineering</span>
          <span>Embedded systems</span>
          <span>Robotics</span>
          <span>Software</span>
        </section>

        <section className="work-section section-shell" id="work" tabIndex={-1} aria-labelledby="work-title">
          <div className="section-heading" data-reveal>
            <h2 id="work-title">Work that leaves evidence.</h2>
            <p>Physical systems, software, and public work shaped by testing, iteration, and ownership.</p>
          </div>

          <div className="project-grid">
            {projects.map((project, index) => {
              const ProjectIcon = project.icon;
              return (
                <article
                  className={`project-card${project.featured ? " project-card-featured" : ""}`}
                  key={project.title}
                  data-reveal
                  style={{ "--reveal-delay": `${index * 70}ms` }}
                >
                  <div className="project-topline">
                    <span>{project.type}</span>
                    <ProjectIcon size={30} weight="duotone" aria-hidden="true" />
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <strong>{project.detail}</strong>
                  <ul aria-label="Project focus">
                    {project.tools.map((tool) => <li key={tool}>{tool}</li>)}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        <section className="research-section section-shell" id="research" tabIndex={-1} aria-labelledby="research-title">
          <div className="research-copy" data-reveal>
            <p className="section-label">Engineering research</p>
            <h2 id="research-title">Making electrolyzer performance legible.</h2>
            <p className="research-deck">Research Support India, Hosur, India / Summer 2025</p>
            <dl className="research-story">
              <div>
                <dt>Question</dt>
                <dd>How do voltage, current, and power change during hydrogen production?</dd>
              </div>
              <div>
                <dt>Contribution</dt>
                <dd>Analyzed 721 seconds of operating data with Pandas, Matplotlib, and scikit-learn, then documented the trends and study limits.</dd>
              </div>
              <div>
                <dt>Result</dt>
                <dd>Voltage increased from roughly 2.5 V to 3.0 V during the recorded run.</dd>
              </div>
            </dl>
            <EvidenceLink href={`${ASSET_BASE}RSI-Research-Paper.pdf`} external primary>Read the paper</EvidenceLink>
          </div>
          <div data-reveal style={{ "--reveal-delay": "90ms" }}>
            <ResearchFigure />
            <p className="research-limit">
              The short observation window and missing cell-temperature data limit conclusions about long-term durability or efficiency.
            </p>
          </div>
        </section>

        <section className="experience-section section-shell" id="experience" tabIndex={-1} aria-labelledby="experience-title">
          <div className="section-heading compact" data-reveal>
            <h2 id="experience-title">Experience</h2>
            <p>Engineering, software, communication, and team ownership.</p>
          </div>
          <div className="experience-list">
            {experience.map((item, index) => (
              <article key={`${item.organization}-${item.role}`} data-reveal style={{ "--reveal-delay": `${index * 55}ms` }}>
                <OrganizationMark item={item} />
                <div className="experience-role">
                  <p>{item.period}</p>
                  <h3>{item.role}</h3>
                  <span>{item.organization}</span>
                </div>
                <div className="experience-summary">
                  <span>{item.location}</span>
                  <p>{item.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section section-shell" id="about" tabIndex={-1} aria-labelledby="about-title">
          <div className="about-statement" data-reveal>
            <p className="section-label">About</p>
            <h2 id="about-title">Curious enough to measure. Practical enough to build.</h2>
          </div>
          <div className="about-body" data-reveal style={{ "--reveal-delay": "80ms" }}>
            <p>
              I’m a Purdue engineering student pursuing Computer Engineering. Robotics and research taught me to enjoy the full loop: understand the system, build the first version, find the failure, and improve it.
            </p>
            <div className="toolbox">
              <div><span>Languages</span><p>Java, Python, C++, HTML/CSS</p></div>
              <div><span>Hardware</span><p>Robotics, embedded systems, pneumatics, engineering design</p></div>
              <div><span>Data and tools</span><p>Git, GitHub, Pandas, Matplotlib, Excel</p></div>
              <div><span>Honors</span><p>Eagle Scout, State-Level VEX Design Award, AP Scholar with Distinction</p></div>
            </div>
          </div>
        </section>

        <section className="contact-section section-shell" id="contact" tabIndex={-1} aria-labelledby="contact-title">
          <div data-reveal>
            <p className="section-label">Summer 2027</p>
            <h2 id="contact-title">Let’s build something that has to work.</h2>
            <p>I’m interested in Computer Engineering opportunities where I can learn from experienced builders and contribute to real systems.</p>
          </div>
          <div className="contact-actions" data-reveal style={{ "--reveal-delay": "80ms" }}>
            <a className="contact-primary" href={`mailto:${EMAIL}`}><EnvelopeSimple size={20} />Contact me</a>
            <a href={LINKEDIN} target="_blank" rel="noreferrer"><LinkedinLogo size={20} weight="fill" />LinkedIn<ArrowUpRight size={16} /></a>
            <a href={GITHUB} target="_blank" rel="noreferrer"><GithubLogo size={20} weight="fill" />GitHub<ArrowUpRight size={16} /></a>
          </div>
        </section>
      </main>

      <footer>
        <span>© 2026 SIDDHARTH SHARMA GUNTI</span>
        <a href={`${ASSET_BASE}resume.html`}>RESUME</a>
        <a href="#top">RETURN TO TOP ↑</a>
      </footer>
    </div>
  );
}
