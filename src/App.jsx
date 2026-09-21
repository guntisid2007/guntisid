import { useEffect, useState } from "react";
import {
  AirplaneTilt,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ChartLineUp,
  Code,
  EnvelopeSimple,
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  Tree,
  Waveform,
} from "@phosphor-icons/react";
import { Analytics } from "@vercel/analytics/react";
import MobileNavigation from "./components/MobileNavigation";

const ASSET_BASE = import.meta.env.BASE_URL;
const LINKEDIN = "https://www.linkedin.com/in/siddharth-gunti-66ba212b8/";
const GITHUB = "https://github.com/guntisid2007";
const INSTAGRAM = "https://www.instagram.com/guntisid/";
const EMAIL = "sgunti@purdue.edu";

const navigation = [
  { href: "#experience", label: "Experience" },
  { href: "#work", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#about", label: "About" },
  { href: `${ASSET_BASE}resume.html`, label: "Resume", featured: true },
  { href: "#contact", label: "Contact" },
];

const experience = [
  {
    period: "SEP 2026 - PRESENT",
    role: "Software Engineering Intern",
    organization: "RideKova",
    location: "Purdue University",
    bullets: [
      "Ship software patches and resolve product bugs to strengthen reliability and user experience.",
      "Manage production changes in Git and GitHub on a three-person development team.",
      "Test features and deploy fixes in a fast-moving early-stage startup environment.",
    ],
    tools: ["Git", "GitHub", "Product testing"],
    logo: `${ASSET_BASE}assets/logos/kova.png`,
    logoAlt: "KOVA logo",
    logoClass: "is-kova",
  },
  {
    period: "AUG 2026 - PRESENT",
    role: "Digital Media & Web Intern",
    organization: "The Station Food Market",
    location: "West Lafayette, Indiana",
    bullets: [
      "Maintain website content across products, events, and promotions.",
      "Produced short-form content reaching 29K views, about 20 times typical performance.",
    ],
    tools: ["Web content", "Short-form media", "Analytics"],
    logo: `${ASSET_BASE}assets/logos/station-food-market.png`,
    logoAlt: "The Station Food Market logo",
    logoClass: "is-station",
  },
  {
    period: "SUMMER 2025",
    role: "Engineering Research Intern",
    organization: "Research Support India",
    location: "Hosur, India",
    bullets: [
      "Analyzed 50+ electrolyzer trials in Python and Pandas to identify performance trends.",
      "Produced Matplotlib visualizations and a 20-page technical report reviewed by engineers.",
    ],
    tools: ["Python", "Pandas", "Matplotlib"],
    monogram: "RSI",
  },
  {
    period: "SEP 2022 - MAR 2026",
    role: "Captain, Build Lead & Treasurer",
    organization: "VEX Robotics, Team 3327C",
    location: "Royersford, Pennsylvania",
    bullets: [
      "Led a six-person team through robot design, construction, testing, and competition strategy.",
      "Redesigned drivetrain and structural systems after diagnosing mechanical failures.",
    ],
    tools: ["Mechanical design", "Pneumatics", "Team leadership"],
    logo: `${ASSET_BASE}assets/logos/vex-robotics.png`,
    logoAlt: "VEX Robotics logo",
    logoClass: "is-vex",
  },
];

const projects = [
  {
    type: "Autonomy and communications",
    role: "Researcher / Co-developer",
    icon: AirplaneTilt,
    title: "Modular fiber-tethered drone platform",
    description:
      "Developing reliable command and data without radio links for inspection, underground, and disaster-response missions.",
    tools: ["Fiber tether", "Communications", "Systems design"],
    note: "Developing toward NASA's 2027 Gateways to Blue Skies Competition",
  },
  {
    type: "Voice AI",
    role: "Developer",
    icon: Waveform,
    title: "Sidekick",
    description:
      "Voice assistant combining Parakeet speech recognition, Gemma, conversational context, and wake-word activation.",
    tools: ["Parakeet", "Gemma", "Voice activation"],
  },
  {
    type: "Engineering research",
    role: "Researcher",
    icon: ChartLineUp,
    title: "Electrolyzer performance analysis",
    description:
      "Analyzed 721 seconds of voltage, current, and power data, including a voltage increase from roughly 2.5 V to 3.0 V. The short window and missing cell-temperature data limit long-term conclusions.",
    tools: ["Python", "Pandas", "Matplotlib"],
    note: "Research Support India / Hosur, India",
    link: `${ASSET_BASE}RSI-Research-Paper.pdf`,
    linkLabel: "Read paper",
  },
  {
    type: "Community engineering",
    role: "Project lead",
    icon: Tree,
    title: "Eagle Scout service project",
    description:
      "Led 20+ volunteers to refurbish 13 benches and build a public information kiosk on a $500+ budget.",
    tools: ["Planning", "Construction", "Leadership"],
  },
  {
    type: "Software",
    role: "Developer",
    icon: Code,
    title: "Java Swing idle game",
    description:
      "Built an object-oriented desktop game with upgrades, timers, progression mechanics, and large-number calculations.",
    tools: ["Java", "Swing", "OOP"],
  },
];

const skillGroups = [
  { label: "Languages", value: "Java, Python, C++, HTML/CSS" },
  { label: "Hardware", value: "Robotics, embedded systems, pneumatics, engineering design" },
  { label: "Data and libraries", value: "Pandas, Matplotlib, scikit-learn" },
  { label: "Developer tools", value: "Git, GitHub, Microsoft Excel" },
  { label: "AI tools", value: "OpenAI Codex, Claude, ChatGPT, Gemini" },
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
  const classes = ["organization-mark", item.logo ? "has-logo" : "", item.logoClass || ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {item.logo ? (
        <img src={item.logo} alt={item.logoAlt} loading="lazy" />
      ) : (
        <span aria-hidden="true">{item.monogram}</span>
      )}
    </div>
  );
}

function SocialLinks({ className = "" }) {
  return (
    <div className={className} aria-label="Professional and social profiles">
      <a href={GITHUB} target="_blank" rel="noreferrer" aria-label="GitHub, opens in a new tab"><GithubLogo size={20} weight="fill" />GitHub</a>
      <a href={LINKEDIN} target="_blank" rel="noreferrer" aria-label="LinkedIn, opens in a new tab"><LinkedinLogo size={20} weight="fill" />LinkedIn</a>
      <a href={INSTAGRAM} target="_blank" rel="noreferrer" aria-label="Instagram, opens in a new tab"><InstagramLogo size={20} />Instagram</a>
      <a href={`mailto:${EMAIL}`}><EnvelopeSimple size={20} />Email</a>
    </div>
  );
}

export default function App() {
  const [activeHref, setActiveHref] = useState("");

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealElements = document.querySelectorAll("[data-reveal]");

    if (reducedMotion) {
      revealElements.forEach((element) => element.setAttribute("data-visible", "true"));
    }

    const revealObserver = reducedMotion
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.setAttribute("data-visible", "true");
              revealObserver.unobserve(entry.target);
            });
          },
          { threshold: 0.12 },
        );

    revealElements.forEach((element) => revealObserver?.observe(element));

    const trackedSections = navigation
      .filter(({ href }) => href.startsWith("#"))
      .map(({ href }) => document.getElementById(href.slice(1)))
      .filter(Boolean);

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveHref(`#${visible.target.id}`);
      },
      { rootMargin: "-20% 0px -65%", threshold: [0, 0.25, 0.6] },
    );

    trackedSections.forEach((section) => sectionObserver.observe(section));

    return () => {
      revealObserver?.disconnect();
      sectionObserver.disconnect();
    };
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
          {navigation.map(({ href, label, featured }) => (
            <a
              className={`${featured ? "nav-resume " : ""}${activeHref === href ? "is-current" : ""}`.trim()}
              key={href}
              href={href}
              aria-current={activeHref === href ? "location" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <a className="mobile-resume" href={`${ASSET_BASE}resume.html`}>Resume</a>
        <MobileNavigation links={navigation} activeHref={activeHref} />
      </header>

      <main id="main" tabIndex={-1}>
        <section className="hero" id="top">
          <div className="hero-copy">
            <p className="hero-kicker hero-intro">Purdue University / Computer Engineering</p>
            <h1 className="hero-intro">Sid Gunti builds systems.</h1>
            <p className="hero-deck hero-intro">
              Embedded systems, robotics, data, and production software, built through testing and iteration.
            </p>
            <div className="hero-actions hero-intro">
              <EvidenceLink href="#experience" primary>View experience</EvidenceLink>
              <EvidenceLink href={`${ASSET_BASE}resume.html`}>Open resume</EvidenceLink>
            </div>
          </div>
        </section>

        <section className="profile-bar" aria-label="Profile links and availability">
          <p>Open to Summer 2027 Computer Engineering opportunities</p>
          <SocialLinks className="profile-links" />
        </section>

        <section className="experience-section section-shell" id="experience" tabIndex={-1} aria-labelledby="experience-title">
          <div className="section-heading" data-reveal>
            <h2 id="experience-title">Experience</h2>
            <p>Engineering work with measurable results, production responsibility, and team ownership.</p>
          </div>
          <div className="experience-grid">
            {experience.map((item, index) => (
              <article key={`${item.organization}-${item.role}`} data-reveal style={{ "--reveal-delay": `${index * 55}ms` }}>
                <OrganizationMark item={item} />
                <div className="experience-card-body">
                  <div className="experience-meta">
                    <p>{item.period}</p>
                    <span>{item.location}</span>
                  </div>
                  <h3>{item.role}</h3>
                  <h4>{item.organization}</h4>
                  <ul className="experience-bullets">
                    {item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                  <ul className="tag-list" aria-label={`${item.organization} tools and focus`}>
                    {item.tools.map((tool) => <li key={tool}>{tool}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="work-section section-shell" id="work" tabIndex={-1} aria-labelledby="work-title">
          <div className="section-heading compact" data-reveal>
            <h2 id="work-title">Projects</h2>
            <p>Selected systems, software, research, and service work.</p>
          </div>

          <div className="project-grid">
            {projects.map((project, index) => {
              const ProjectIcon = project.icon;
              return (
                <article key={project.title} data-reveal style={{ "--reveal-delay": `${index * 45}ms` }}>
                  <div className="project-topline">
                    <span>{project.type}</span>
                    <ProjectIcon size={25} weight="duotone" aria-hidden="true" />
                  </div>
                  <p className="project-role">{project.role}</p>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  {project.note ? <strong>{project.note}</strong> : null}
                  <ul className="tag-list" aria-label={`${project.title} technologies`}>
                    {project.tools.map((tool) => <li key={tool}>{tool}</li>)}
                  </ul>
                  {project.link ? (
                    <a className="project-link" href={project.link} target="_blank" rel="noreferrer" aria-label={`${project.linkLabel}, opens in a new tab`}>
                      {project.linkLabel}<ArrowUpRight size={15} />
                    </a>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>

        <section className="skills-section section-shell" id="skills" tabIndex={-1} aria-labelledby="skills-title">
          <div className="section-heading compact" data-reveal>
            <h2 id="skills-title">Skills and tools</h2>
            <p>Languages, technical libraries, and the tools I use to build and analyze.</p>
          </div>
          <div className="skills-grid">
            {skillGroups.map((group, index) => (
              <div key={group.label} data-reveal style={{ "--reveal-delay": `${index * 45}ms` }}>
                <h3>{group.label}</h3>
                <p>{group.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-section section-shell" id="about" tabIndex={-1} aria-labelledby="about-title">
          <div className="about-statement" data-reveal>
            <h2 id="about-title">Curious enough to measure. Practical enough to build.</h2>
            <p>
              I’m a Purdue Computer Engineering student who enjoys the full loop: understand the system, build the first version, find the failure, and improve it.
            </p>
          </div>
          <dl className="education-facts" data-reveal style={{ "--reveal-delay": "70ms" }}>
            <div><dt>Education</dt><dd>B.S. Computer Engineering, Purdue University</dd></div>
            <div><dt>Academic standing</dt><dd>Sophomore, entered Purdue with 49 credits</dd></div>
            <div><dt>Coursework</dt><dd>Physics, Multivariable Calculus, Introduction to Engineering</dd></div>
            <div><dt>Honors</dt><dd>Eagle Scout, State-Level VEX Design Award, AP Scholar with Distinction</dd></div>
          </dl>
        </section>

        <section className="contact-section section-shell" id="contact" tabIndex={-1} aria-labelledby="contact-title">
          <div data-reveal>
            <p className="section-label">Summer 2027</p>
            <h2 id="contact-title">Build something that has to work.</h2>
            <p>I’m interested in Computer Engineering opportunities where I can learn from experienced builders and contribute to real systems.</p>
          </div>
          <div data-reveal style={{ "--reveal-delay": "70ms" }}>
            <a className="contact-primary" href={`mailto:${EMAIL}`}><EnvelopeSimple size={20} />Contact me</a>
            <SocialLinks className="contact-links" />
          </div>
        </section>
      </main>

      <footer>
        <span>© 2026 SIDDHARTH SHARMA GUNTI</span>
        <a href={`${ASSET_BASE}resume.html`}>RESUME</a>
        <a href="#top">RETURN TO TOP ↑</a>
      </footer>
      <Analytics />
    </div>
  );
}
