import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Code,
  Cpu,
  DownloadSimple,
  EnvelopeSimple,
  LinkedinLogo,
  MapPin,
} from "@phosphor-icons/react";

const LINKEDIN = "https://www.linkedin.com/in/siddharth-gunti-66ba212b8/";
const ASSET_BASE = import.meta.env.BASE_URL;

const projects = [
  {
    number: "01",
    title: "Alkaline electrolyzer analysis",
    description:
      "Mapped voltage, current, power, pressure, and hydrogen flow across 50+ trials and 5+ systems, turning raw test runs into engineering decisions.",
    tags: ["Python", "Pandas", "Matplotlib"],
    visual: "analysis",
  },
  {
    number: "02",
    title: "Raspberry Pi embedded systems",
    description:
      "Connected temperature and motion sensors to GPIO-controlled hardware, writing event-driven scripts that respond to the physical world.",
    tags: ["Python", "GPIO", "Sensors"],
    visual: "embedded",
  },
  {
    number: "03",
    title: "Object-oriented idle game",
    description:
      "Built a desktop game around upgrade systems, timers, progression mechanics, and large-number calculations in Java Swing.",
    tags: ["Java", "Swing", "OOP"],
    visual: "game",
  },
];

const experience = [
  {
    year: "2026 — now",
    role: "Digital Media & Web Intern",
    org: "The Station Food Market",
    body: "Maintaining accessible web content and producing short-form media with the photography and social teams for Purdue’s local market community.",
  },
  {
    year: "2025 — 2026",
    role: "Team Captain, Build Lead & Treasurer",
    org: "VEX Robotics · Team 3327C",
    body: "Led mechanical design, drivetrain iteration, pneumatic integration, competition strategy, and team operations for four seasons.",
  },
  {
    year: "Summer 2025",
    role: "Engineering Research Intern",
    org: "Research Support India",
    body: "Collected and analyzed electrolyzer performance data, contributing visual evidence and findings to a 20-page technical paper.",
  },
  {
    year: "2025 — 2026",
    role: "Student Support Associate",
    org: "DSAT Hackers",
    body: "Coached 20+ students through diagnostic-led practice, helping learners improve 100–150 points on average.",
  },
];

function MagneticLink({ href, children, className = "", download = false }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 160, damping: 18, mass: 0.25 });
  const springY = useSpring(y, { stiffness: 160, damping: 18, mass: 0.25 });

  const move = (event) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((event.clientX - rect.left - rect.width / 2) * 0.12);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.12);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      download={download}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={move}
      onMouseLeave={reset}
      whileTap={{ scale: 0.98, y: -1 }}
    >
      {children}
    </motion.a>
  );
}

function CircuitPortrait() {
  return (
    <div className="portrait-stage" aria-label="Portrait of Siddharth Gunti with circuit diagram details">
      <div className="schematic-lines" aria-hidden="true">
        <span className="trace trace-a" />
        <span className="trace trace-b" />
        <span className="trace trace-c" />
        <span className="pin pin-a" />
        <span className="pin pin-b" />
        <span className="pin pin-c" />
      </div>
      <div className="portrait-frame">
        <img src={`${ASSET_BASE}sid-gunti.jpg`} alt="Siddharth Gunti" />
      </div>
      <div className="portrait-caption">
        <span>SG / 01</span>
        <span>Purdue · ECE</span>
      </div>
      <div className="status-chip">
        <span className="status-dot" />
        Open to Summer 2027
      </div>
    </div>
  );
}

function ProjectVisual({ type }) {
  if (type === "analysis") {
    return (
      <div className="visual visual-analysis" aria-hidden="true">
        <div className="visual-label"><span>RUN 042</span><span>H₂ FLOW</span></div>
        <svg viewBox="0 0 520 220" preserveAspectRatio="none">
          <path className="grid-line" d="M0 45H520M0 90H520M0 135H520M0 180H520" />
          <path className="grid-line" d="M80 0V220M160 0V220M240 0V220M320 0V220M400 0V220M480 0V220" />
          <path className="chart-line" d="M0 182 C45 176 60 154 98 160 S154 129 190 135 S244 86 283 105 S344 48 380 64 S450 23 520 34" />
          <circle cx="380" cy="64" r="6" />
        </svg>
        <div className="analysis-metrics"><b>12.8</b><span>mL/min</span></div>
      </div>
    );
  }
  if (type === "embedded") {
    return (
      <div className="visual visual-embedded" aria-hidden="true">
        <div className="chip">
          <span className="chip-core">GPIO</span>
          {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
        </div>
        <div className="sensor sensor-one"><span>T</span><b>23.6°</b></div>
        <div className="sensor sensor-two"><span>M</span><b>ACTIVE</b></div>
        <span className="pulse-ring" />
      </div>
    );
  }
  return (
    <div className="visual visual-game" aria-hidden="true">
      <div className="game-window">
        <div className="window-bar"><i/><i/><i/><span>progression.java</span></div>
        <div className="game-body">
          <span className="game-kicker">ENERGY BANK</span>
          <b>1.84e<sup>12</sup></b>
          <div className="game-progress"><span /></div>
          <div className="upgrade-row"><span>Core multiplier</span><em>x4.6</em></div>
        </div>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.setAttribute("data-visible", "true");
      }),
      { threshold: 0.13 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Sid Gunti home">SID/GUNTI</a>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#about">About</a>
        </nav>
        <a className="header-contact" href="mailto:guntisid2007@gmail.com">
          Contact <ArrowUpRight size={16} weight="bold" />
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow reveal-up" style={{ "--delay": "80ms" }}>
              <span>Computer Engineering</span>
              <span>West Lafayette, IN</span>
            </div>
            <h1 className="reveal-up" style={{ "--delay": "150ms" }}>
              I build where<br />
              <span>hardware meets code.</span>
            </h1>
            <p className="hero-lede reveal-up" style={{ "--delay": "220ms" }}>
              I’m Sid, a Purdue engineer exploring embedded systems, robotics, and low-level design through hands-on research and working prototypes.
            </p>
            <div className="hero-actions reveal-up" style={{ "--delay": "290ms" }}>
              <MagneticLink href="#work" className="button button-primary">
                Explore my work <ArrowDown size={18} weight="bold" />
              </MagneticLink>
              <MagneticLink href={`${ASSET_BASE}Siddharth_Gunti_Resume.html`} className="button button-quiet" download>
                Résumé <DownloadSimple size={18} weight="bold" />
              </MagneticLink>
            </div>
          </div>
          <div className="hero-art reveal-up" style={{ "--delay": "260ms" }}>
            <CircuitPortrait />
          </div>
          <div className="hero-index" aria-hidden="true">01<span>/05</span></div>
        </section>

        <section className="signal-strip" aria-label="Technical focus areas">
          <div className="signal-track">
            <span>EMBEDDED SYSTEMS</span><i />
            <span>ROBOTICS</span><i />
            <span>HARDWARE PROTOTYPING</span><i />
            <span>DATA ANALYSIS</span><i />
            <span>EMBEDDED SYSTEMS</span><i />
            <span>ROBOTICS</span><i />
          </div>
        </section>

        <section className="projects section-wrap" id="work">
          <div className="section-heading" data-reveal>
            <p className="section-code">02 / SELECTED BUILDS</p>
            <div>
              <h2>Ideas, tested<br />in the real world.</h2>
              <p>Projects that move between sensors, datasets, mechanical systems, and software.</p>
            </div>
          </div>
          <div className="project-list">
            {projects.map((project, index) => (
              <article className={`project-row project-${index + 1}`} key={project.title} data-reveal style={{ "--index": index }}>
                <div className="project-meta">
                  <span>{project.number}</span>
                  <div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <ul aria-label="Technologies">
                      {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                    </ul>
                  </div>
                </div>
                <ProjectVisual type={project.visual} />
              </article>
            ))}
          </div>
        </section>

        <section className="impact-section">
          <div className="impact-intro section-wrap" data-reveal>
            <p className="section-code">03 / BY THE NUMBERS</p>
            <p className="impact-statement">I like work that leaves a trace: a cleaner dataset, a stronger mechanism, a better score, a restored public space.</p>
          </div>
          <div className="metrics section-wrap" data-reveal>
            <div><strong>50+</strong><span>electrolyzer trials analyzed</span></div>
            <div><strong>13</strong><span>community benches restored</span></div>
            <div><strong>20+</strong><span>students individually supported</span></div>
            <div><strong>4</strong><span>seasons in VEX Robotics</span></div>
          </div>
        </section>

        <section className="experience section-wrap" id="experience">
          <div className="experience-grid">
            <div className="experience-title" data-reveal>
              <p className="section-code">04 / EXPERIENCE</p>
              <h2>Learning by<br />taking ownership.</h2>
              <div className="mini-note"><Cpu size={20} weight="duotone" /><span>Currently building toward low-level systems and hardware–software integration.</span></div>
            </div>
            <div className="timeline">
              {experience.map((item, index) => (
                <article key={item.role} data-reveal style={{ "--index": index }}>
                  <p className="timeline-year">{item.year}</p>
                  <div>
                    <h3>{item.role}</h3>
                    <p className="timeline-org">{item.org}</p>
                    <p>{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="about-grid section-wrap">
            <div className="about-copy" data-reveal>
              <p className="section-code">05 / ABOUT</p>
              <h2>Curious by default.<br />Practical by design.</h2>
              <p>I’m a first-year engineering student at Purdue University intending to pursue Computer Engineering. My interest in ECE began with research and robotics in high school; now I’m going deeper into system design, embedded hardware, and the code that makes physical systems useful.</p>
              <p>Outside the lab, I’ve led a robotics team, earned Eagle Scout, taught SAT strategy, and helped shape a local market’s digital presence.</p>
            </div>
            <div className="skills-panel" data-reveal>
              <div className="skill-header"><Code size={24} weight="duotone" /><span>Toolbox</span></div>
              <div className="skill-groups">
                <div><span>Languages</span><p>Java · Python · C++ · HTML/CSS</p></div>
                <div><span>Data</span><p>Pandas · Matplotlib · Excel</p></div>
                <div><span>Workflow</span><p>Git · GitHub · Engineering design</p></div>
              </div>
              <div className="award-line"><span>Selected honors</span><p>Eagle Scout · State-Level VEX Design Award · AP Scholar with Distinction</p></div>
            </div>
          </div>
        </section>

        <section className="contact-section">
          <div className="contact-orbit" aria-hidden="true"><span>LET’S BUILD</span></div>
          <div className="contact-content section-wrap" data-reveal>
            <div>
              <p className="section-code">SUMMER 2027</p>
              <h2>Let’s make something<br />that has to work.</h2>
            </div>
            <div className="contact-copy">
              <p>I’m looking for Computer Engineering internship opportunities where I can learn from experienced builders and contribute to real systems.</p>
              <MagneticLink href="mailto:guntisid2007@gmail.com" className="button button-light">
                Start a conversation <EnvelopeSimple size={19} weight="bold" />
              </MagneticLink>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-name">Siddharth Sharma Gunti</div>
        <div className="footer-location"><MapPin size={16} weight="fill" /> West Lafayette, Indiana</div>
        <div className="footer-links">
          <a href={LINKEDIN} target="_blank" rel="noreferrer"><LinkedinLogo size={18} weight="fill" />LinkedIn</a>
          <a href="mailto:guntisid2007@gmail.com"><EnvelopeSimple size={18} />Email</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
