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
import HardwareFlow from "./components/HardwareFlow";

const ASSET_BASE = import.meta.env.BASE_URL;
const LINKEDIN = "https://www.linkedin.com/in/siddharth-gunti-66ba212b8/";
const GITHUB = "https://github.com/guntisid2007";
const INSTAGRAM = "https://www.instagram.com/guntisid/";
const RIDEKOVA = "https://www.ridekova.com/";
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
    website: RIDEKOVA,
    location: "Purdue University",
    bullets: [
      "Ship software fixes and product improvements for a campus ridesharing platform as part of a three-person development team.",
      "Diagnose bugs, implement patches, and manage production changes using Git and GitHub.",
      "Test new functionality across the application and collaborate with developers on feature development and reliability improvements.",
    ],
    tools: ["Git", "GitHub", "Debugging", "Software Testing"],
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
      "Manage and update web content for products, promotions, events, and customer-facing information.",
      "Produced short-form content reaching 29K views, approximately 20× the account's typical performance.",
      "Use engagement data to evaluate content performance and improve digital outreach.",
    ],
    tools: ["Web Content", "Analytics", "Digital Media"],
    logo: `${ASSET_BASE}assets/logos/station-food-market.png`,
    logoAlt: "The Station Food Market logo",
    logoClass: "is-station",
  },
  {
    period: "SUMMER 2025",
    role: "Engineering Research Intern",
    organization: "Research Support India",
    website: "https://www.rsindia.net/",
    location: "Hosur, India",
    bullets: [
      "Analyzed data from 50+ electrolyzer trials using Python and Pandas to identify voltage, current, power, and performance trends.",
      "Built Matplotlib visualizations to communicate experimental behavior and support engineering analysis.",
      "Documented findings, system behavior, and experimental limitations in a 20-page technical research report reviewed by engineers.",
    ],
    tools: ["Python", "Pandas", "Matplotlib", "Data Analysis"],
    logo: `${ASSET_BASE}assets/logos/research-support-india.png`,
    logoAlt: "Research Support India logo",
  },
  {
    period: "SEP 2022 - MAR 2026",
    role: "Captain, Build Lead & Treasurer",
    organization: "VEX Robotics, Team 3327C",
    location: "Royersford, Pennsylvania",
    bullets: [
      "Led a six-person competition team through robot design, fabrication, testing, troubleshooting, and match strategy.",
      "Diagnosed mechanical failures and redesigned drivetrain and structural systems to improve robot reliability.",
      "Helped lead the team to a state-level Design Award and qualification for the Pennsylvania State Championship.",
    ],
    tools: ["Robotics", "Mechanical Design", "Pneumatics", "Leadership"],
    logo: `${ASSET_BASE}assets/logos/vex-robotics.png`,
    logoAlt: "VEX Robotics logo",
    logoClass: "is-vex",
  },
];

const projects = [
  {
    type: "Autonomous Systems & Communications",
    role: "Researcher / Co-Developer",
    icon: AirplaneTilt,
    title: "Modular Fiber-Tethered Drone Platform",
    description:
      "Developing a reusable drone communication architecture that replaces radio-frequency command and data links with fiber optics for reliable operation in environments where wireless communication is unavailable, unreliable, or undesirable.",
    detail: "The system is being designed around applications such as infrastructure inspection, tunnels, industrial environments, and disaster-response operations.",
    tools: ["Fiber Optics", "Communications", "Embedded Systems", "Systems Design"],
    note: "Developing toward NASA's 2027 Gateways to Blue Skies Competition.",
    status: "In Development",
    link: `${ASSET_BASE}Fiber-Tethered-Drone-Project-Brief.pdf`,
    linkLabel: "View Project Brief",
    linkAriaLabel: "View Fiber-Tethered Drone Project Brief, opens in a new tab",
  },
  {
    type: "Voice AI",
    role: "Developer",
    icon: Waveform,
    title: "Sidekick",
    description:
      "Developed a local voice-assistant prototype combining speech recognition, language-model inference, conversational context, and wake-word activation into a unified interaction pipeline.",
    detail: "Integrated Parakeet for speech recognition and Gemma for language processing while experimenting with latency, activation behavior, and conversational flow.",
    tools: ["SwiftUI", "Ollama", "Local AI"],
  },
  {
    type: "Engineering Research",
    role: "Researcher",
    icon: ChartLineUp,
    title: "Electrolyzer Performance Analysis",
    description:
      "Analyzed experimental electrolyzer voltage, current, and power data using Python to characterize short-term system behavior and identify performance trends.",
    detail: "The dataset captured 721 seconds of operation, including a voltage increase from approximately 2.5 V to 3.0 V. Long-term conclusions are limited by the short test duration and unavailable cell-temperature measurements.",
    tools: ["Python", "Pandas", "Matplotlib", "Experimental Data"],
    note: "Research Support India / Hosur, India",
    link: `${ASSET_BASE}RSI-Research-Paper.pdf`,
    linkLabel: "Read Technical Report",
  },
  {
    type: "Community Engineering",
    role: "Project Lead",
    icon: Tree,
    title: "Eagle Scout Service Project",
    description:
      "Planned and led a community infrastructure project involving 20+ volunteers, the refurbishment of 13 park benches, and construction of a public information kiosk.",
    detail: "Managed materials, scheduling, volunteer coordination, construction, and a project budget exceeding $500.",
    tools: ["Project Management", "Construction", "Leadership"],
  },
  {
    type: "Software",
    role: "Developer",
    icon: Code,
    title: "Java Swing Idle Game",
    description:
      "Built an object-oriented desktop game in Java featuring upgrade systems, timers, progression mechanics, persistent state logic, and large-number calculations.",
    detail: "Designed the application around reusable classes and event-driven Swing components.",
    tools: ["Java", "Swing", "Object-Oriented Programming"],
  },
];

const skillGroups = [
  { label: "Languages", value: "Java, Python, C++, HTML/CSS" },
  { label: "Hardware & Engineering", value: "Robotics, Embedded Systems, Fiber-Optic Communications, Pneumatics, Engineering Design" },
  { label: "Data & Libraries", value: "Pandas, Matplotlib, scikit-learn" },
  { label: "Developer Tools", value: "Git, GitHub, Linux, Microsoft Excel" },
  { label: "AI Development Tools", value: "Codex, Claude, ChatGPT, Gemini, LLM APIs, Speech Recognition, Rapid Prototyping" },
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
  const Element = item.website ? "a" : "div";

  return (
    <Element className={classes} href={item.website} target={item.website ? "_blank" : undefined} rel={item.website ? "noreferrer" : undefined} aria-label={item.website ? `${item.organization} website, opens in a new tab` : undefined}>
      {item.logo ? (
        <img src={item.logo} alt={item.logoAlt} loading="lazy" />
      ) : (
        <span aria-hidden="true">{item.monogram}</span>
      )}
    </Element>
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
          <HardwareFlow />
          <div className="hero-copy">
            <p className="hero-kicker hero-intro">Purdue University</p>
            <h1 className="hero-intro">Siddharth Gunti.</h1>
            <p className="hero-deck hero-intro">Computer Engineering @ Purdue</p>
            <p className="hero-secondary hero-intro">Software Engineering @ <a className="company-link" href={RIDEKOVA} target="_blank" rel="noreferrer">RideKova</a></p>
            <div className="hero-actions hero-intro">
              <EvidenceLink href="#experience" primary>View experience</EvidenceLink>
              <EvidenceLink href={`${ASSET_BASE}resume.html`}>Open resume</EvidenceLink>
            </div>
          </div>
        </section>

        <section className="profile-bar" aria-label="Profile links and availability">
          <p>Open to Summer 2027 Computer Engineering, Embedded Systems, and Software Engineering opportunities.</p>
          <SocialLinks className="profile-links" />
        </section>

        <section className="experience-section section-shell" id="experience" tabIndex={-1} aria-labelledby="experience-title">
          <div className="section-heading" data-reveal>
            <h2 id="experience-title">Experience</h2>
            <p>Hands-on engineering, software development, research, and technical leadership with measurable results.</p>
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
                  <h4>{item.website ? <a className="company-link" href={item.website} target="_blank" rel="noreferrer">{item.organization}</a> : item.organization}</h4>
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
            <p>Selected hardware, software, research, and engineering projects focused on building and validating real systems.</p>
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
                  <p className="project-role">{project.role}{project.status ? <span className="project-status">{project.status}</span> : null}</p>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  {project.detail ? <p>{project.detail}</p> : null}
                  {project.note ? <strong>{project.note}</strong> : null}
                  <ul className="tag-list" aria-label={`${project.title} technologies`}>
                    {project.tools.map((tool) => <li key={tool}>{tool}</li>)}
                  </ul>
                  {project.link ? (
                    <a className={`project-link${project.status ? " project-link--brief" : ""}`} href={project.link} target="_blank" rel="noreferrer" aria-label={project.linkAriaLabel || `${project.linkLabel}, opens in a new tab`}>
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
            <p>Languages, engineering tools, libraries, and technical areas used across software, hardware, and research projects.</p>
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
            <p>I'm a Purdue engineering student pursuing Computer Engineering with interests spanning embedded systems, robotics, software, and hardware-software integration.</p>
            <p>I enjoy working through the full engineering cycle: understand the system, build a prototype, test it, identify what failed, and improve the next version.</p>
          </div>
          <dl className="education-facts" data-reveal style={{ "--reveal-delay": "70ms" }}>
            <div><dt>Education</dt><dd>B.S. Computer Engineering, Purdue University</dd></div>
            <div><dt>Academic Focus</dt><dd>Embedded Systems, Computer Hardware, Robotics, and Software</dd></div>
            <div><dt>Relevant Coursework</dt><dd>Multivariable Calculus, Physics, Introduction to Engineering</dd></div>
            <div><dt>Honors</dt><dd>Eagle Scout, State-Level VEX Design Award, AP Scholar with Distinction</dd></div>
          </dl>
        </section>

        <section className="contact-section section-shell" id="contact" tabIndex={-1} aria-labelledby="contact-title">
          <div data-reveal>
            <p className="section-label">Summer 2027</p>
            <h2 id="contact-title">Build something that has to work.</h2>
            <p>I'm seeking Summer 2027 engineering opportunities where I can contribute to real hardware and software systems, learn from experienced engineers, and take ownership of meaningful technical work.</p>
          </div>
          <div data-reveal style={{ "--reveal-delay": "70ms" }}>
            <a className="contact-primary" href={`mailto:${EMAIL}`}><EnvelopeSimple size={20} />Contact Me</a>
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
