import { lazy, Suspense, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ResearchFigure from "./components/ResearchFigure";
import { useGSAP } from "@gsap/react";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowCounterClockwise,
  EnvelopeSimple,
  Cpu,
  Code,
  Tree,
  GithubLogo,
  LinkedinLogo,
  Pause,
  Phone,
  Play,
} from "@phosphor-icons/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ChipAssembly = lazy(() => import("./components/ChipAssembly"));

const ASSET_BASE = import.meta.env.BASE_URL;
const LINKEDIN = "https://www.linkedin.com/in/siddharth-gunti-66ba212b8/";
const GITHUB = "https://github.com/guntisid2007";
const EMAIL = "sgunti@purdue.edu";
const PERSONAL_EMAIL = "sid.gunti@gmail.com";

const projects = [
  {
    signal: "Embedded systems",
    icon: Cpu,
    title: "Raspberry Pi embedded systems",
    description:
      "Integrated temperature and motion sensors with GPIO-controlled hardware, then wrote scripts that respond to changing physical inputs.",
    tools: "Python · Raspberry Pi · GPIO",
  },
  {
    signal: "Software",
    icon: Code,
    title: "Java Swing idle game",
    description:
      "Built an object-oriented desktop game with upgrade systems, timers, progression mechanics, and large-number calculations.",
    tools: "Java · Swing · OOP",
  },
  {
    signal: "Community leadership",
    icon: Tree,
    title: "Eagle Scout service project",
    description:
      "Directed a volunteer team to refurbish thirteen community benches and construct a public information kiosk for a township park.",
    tools: "Planning · Fabrication · Leadership",
  },
];

const experience = [
  {
    period: "AUG 2026 - PRESENT",
    role: "Digital Media & Web Intern",
    organization: "The Station Food Market · West Lafayette, IN",
    summary:
      "Manages web content and produces short-form media for products, events, and promotions in collaboration with photography and social teams.",
  },
  {
    period: "SUMMER 2025",
    role: "Engineering Research Intern",
    organization: "Research Support India · Hosur, India",
    summary:
      "Analyzed alkaline-electrolyzer operating data supplied by site engineers, visualized performance trends, and documented findings for engineering review.",
  },
  {
    period: "NOV 2025 - MAR 2026",
    role: "Student Tutor Specialist",
    organization: "DSAT Hackers · Remote",
    summary:
      "Delivered individualized SAT instruction, diagnosed recurring errors, and developed targeted practice for accuracy, pacing, and strategy.",
  },
  {
    period: "SEP 2022 - MAR 2026",
    role: "Team Captain, Build Lead & Treasurer",
    organization: "VEX Robotics · Team 3327C",
    summary:
      "Led mechanical design, construction, testing, and competition strategy while iterating drivetrain, structure, and pneumatic mechanisms.",
  },
];

function Barcode({ count = 34, seed = 7, className = "" }) {
  let value = seed;
  const bars = Array.from({ length: count }, (_, index) => {
    value = (value * 9301 + 49297) % 233280;
    return {
      width: 1 + (value % 4),
      opacity: 0.35 + ((value % 65) / 100),
      key: `${seed}-${index}`,
    };
  });

  return (
    <span className={`barcode ${className}`} aria-hidden="true">
      {bars.map((bar) => (
        <i key={bar.key} style={{ width: `${bar.width}px`, opacity: bar.opacity }} />
      ))}
    </span>
  );
}

function ChipFallback({ status = "3D unavailable" }) {
  return (
    <div className="chip-fallback">
      <Cpu size={140} weight="duotone" aria-hidden="true" />
      <p>Microchip assembly<br /><span>{status}</span></p>
    </div>
  );
}

function FieldStage() {
  const [paused, setPaused] = useState(false);
  const [exploded, setExploded] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="field-stage" role="group" aria-label="Interactive conceptual microchip assembly">
      <div className="model-caption">
        <span>MICROCHIP / CONCEPT MODEL</span>
        <p>Drag or swipe to rotate.</p>
      </div>
      <Suspense fallback={<ChipFallback status="Loading 3D model" />}>
        <ChipAssembly paused={paused} exploded={exploded} resetKey={resetKey} onInteract={() => setPaused(true)} fallback={<ChipFallback />} />
      </Suspense>
      <div className="field-controls">
        <button
          className="field-control"
          type="button"
          onClick={() => { setPaused(true); setResetKey((value) => value + 1); }}
        >
          <ArrowCounterClockwise size={15} />
          Reset view
        </button>
        <button
          className="field-control"
          type="button"
          aria-label="Exploded view"
          aria-pressed={exploded}
          onClick={() => setExploded((value) => !value)}
        >
          <Cpu size={17} />
          {exploded ? "Assemble" : "Explode"}
        </button>
        <button
          className="field-control"
          type="button"
          aria-label="Pause animation"
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? <Play size={15} weight="fill" /> : <Pause size={15} weight="fill" />}
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}

function EvidenceLink({ href, children, external = false, className = "" }) {
  return (
    <a
      className={`evidence-link ${className}`}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      <span>{children}</span>
      {external ? <ArrowUpRight size={17} weight="bold" /> : <ArrowDown size={17} weight="bold" />}
    </a>
  );
}

function App() {
  const scope = useRef(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        gsap.set("[data-intro], [data-reveal]", { clearProps: "all" });
        return;
      }

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo("[data-intro='rail']", { y: -18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.48 })
        .fromTo("[data-intro='title']", { y: 28 }, { y: 0, duration: 0.58 }, "-=0.2")
        .fromTo("[data-intro='copy']", { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.52 }, "-=0.42")
        .fromTo("[data-intro='field']", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.84 }, "-=0.52");

      gsap.utils.toArray("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 24, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.55,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          },
        );
      });

    },
    { scope },
  );

  return (
    <div className="site" ref={scope}>
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="status-rail" data-intro="rail">
        <a className="identity" href="#top" aria-label="Sid Gunti, home">
          <Barcode count={12} seed={11} />
          <span>SID GUNTI</span>
        </a>
        <div className="status-readout" aria-label="Portfolio status">
          <span>FIELD</span><strong>COMPUTER ENGINEERING</strong>
          <span>BASE</span><strong>WEST LAFAYETTE, IN</strong>
        </div>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#research">Research</a>
          <a href={`${ASSET_BASE}resume.html`}>Résumé</a>
          <a href="#contact">Contact</a>
        </nav>
        <details className="mobile-nav">
          <summary>Menu</summary>
          <div>
            <a href="#work">Work</a>
            <a href="#research">Research</a>
            <a href={`${ASSET_BASE}resume.html`}>Résumé</a>
            <a href="#contact">Contact</a>
          </div>
        </details>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-copy">
            <h1 data-intro="title">Engineering across <span>hardware,</span> data, and code.</h1>
            <div className="hero-support" data-intro="copy">
              <p>
                I’m Sid, a Purdue engineering student exploring embedded systems, robotics, and the software that connects them.
              </p>
              <div className="hero-actions">
                <EvidenceLink href="#work">Inspect the work</EvidenceLink>
                <EvidenceLink href={`${ASSET_BASE}resume.html`}>Read résumé</EvidenceLink>
              </div>
            </div>
          </div>
          <div className="hero-field" data-intro="field">
            <FieldStage />
          </div>
          <div className="hero-ledger" data-intro="copy">
            <span>STATUS / FIRST-YEAR ENGINEERING</span>
            <span>INTENT / COMPUTER ENGINEERING</span>
            <span>FOCUS / EMBEDDED SYSTEMS + ROBOTICS</span>
            <span>OPEN / SUMMER 2027</span>
          </div>
        </section>

        <section className="project-section paper-section" id="work">
          <div className="section-title" data-reveal>
            <h2>Selected work</h2>
            <p>Three ways the same practice shows up: instrument the system, iterate the mechanism, communicate the result.</p>
          </div>

          <div className="project-index">
            {projects.map((project) => (
              <article className="project-row" key={project.title} data-reveal>
                <div className="project-signal">
                  <project.icon size={36} weight="duotone" aria-hidden="true" />
                  <span>{project.signal}</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <span className="project-tools">{project.tools}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="research-section" id="research" aria-labelledby="research-title">
          <div className="research-intro" data-reveal>
            <h2 id="research-title">Analyzing an <span>alkaline electrolyzer.</span></h2>
            <p className="research-deck">Research Support India · Hosur, India · Summer 2025</p>
          </div>

          <div className="research-layout">
            <dl className="research-story" data-reveal>
              <div>
                <dt>The question</dt>
                <dd>How do voltage, current, and power change during hydrogen production?</dd>
              </div>
              <div>
                <dt>My contribution</dt>
                <dd>I analyzed 721 seconds of operating data supplied by the site’s engineers, using Pandas, Matplotlib, and scikit-learn to visualize measurements and fit linear trends.</dd>
              </div>
              <div>
                <dt>What I found</dt>
                <dd>Voltage, current, and power increased gradually during the run. I documented those trends and the study’s limitations in a research paper.</dd>
              </div>
            </dl>

            <ResearchFigure />
          </div>

          <div className="research-footer" data-reveal>
            <EvidenceLink href={`${ASSET_BASE}RSI-Research-Paper.pdf`} external>
              Read the research paper
            </EvidenceLink>
            <p><strong>Study limits.</strong> A short observation window and no recorded cell temperature mean these trends cannot establish long-term durability or explain changes in efficiency.</p>
          </div>
        </section>

        <section className="experience-section paper-section" id="experience">
          <div className="section-title" data-reveal>
            <h2>Experience</h2>
            <p>Technical work, team leadership, instruction, and public-facing communication.</p>
          </div>
          <div className="experience-log">
            {experience.map((item) => (
              <article key={item.role} data-reveal>
                <span>{item.period}</span>
                <div>
                  <h3>{item.role}</h3>
                  <p className="organization">{item.organization}</p>
                </div>
                <p>{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="profile-section" id="about">
          <div className="profile-image" data-reveal>
            <img src={`${ASSET_BASE}sid-gunti.jpg`} alt="Siddharth Gunti" loading="lazy" />
            <div><span>SID / 2026</span><span>PURDUE UNIVERSITY</span></div>
          </div>
          <div className="profile-copy" data-reveal>
            <div className="university-affiliation">
              <a href="https://www.purdue.edu/" target="_blank" rel="noreferrer" aria-label="Purdue University (opens in a new tab)">
                <img src={`${ASSET_BASE}purdue-logo.svg`} alt="Purdue University" width="200" height="36" loading="lazy" />
              </a>
              <span>Engineering student</span>
            </div>
            <h2>Curious enough to measure.<br /><span>Practical enough to build.</span></h2>
            <p>
              Sid’s path into engineering started with robotics, research, and the satisfaction of making a real mechanism work. At Purdue, he is going deeper into embedded systems, computer hardware, and the code that connects them.
            </p>
            <div className="toolbox">
              <div><span>LANGUAGES</span><p>Java · Python · C++ · HTML/CSS</p></div>
              <div><span>DATA</span><p>Pandas · Matplotlib · Excel</p></div>
              <div><span>HONORS</span><p>Eagle Scout · State-Level VEX Design Award · AP Scholar with Distinction</p></div>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div data-reveal>
            <span className="contact-intro">Have a project in mind?</span>
            <h2>Let’s build something.</h2>
            <p>I’m looking for Summer 2027 Computer Engineering opportunities. If you’re building something interesting, I’d love to hear about it.</p>
          </div>
          <div className="contact-links" data-reveal>
            <a href={`mailto:${EMAIL}`}><EnvelopeSimple size={20} />{EMAIL}</a>
            <a href={`mailto:${PERSONAL_EMAIL}`}><EnvelopeSimple size={20} />{PERSONAL_EMAIL}</a>
            <a href="tel:+14847169530"><Phone size={20} />+1 (484)-716-9530</a>
            <a href={LINKEDIN} target="_blank" rel="noreferrer"><LinkedinLogo size={20} weight="fill" />LinkedIn<ArrowUpRight className="contact-arrow" size={16} /></a>
            <a href={GITHUB} target="_blank" rel="noreferrer"><GithubLogo size={20} weight="fill" />GitHub<ArrowUpRight className="contact-arrow" size={16} /></a>
          </div>
        </section>
      </main>

      <footer>
        <span>© 2026 SIDDHARTH SHARMA GUNTI</span>
        <span className="site-credit">a site by <a href="https://tarushv.com" target="_blank" rel="noreferrer">tarushv</a></span>
        <a href="#top">RETURN TO TOP ↑</a>
      </footer>
    </div>
  );
}

export default App;
