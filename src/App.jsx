import { lazy, Suspense, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowDown,
  ArrowUpRight,
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

const HydrogenField = lazy(() => import("./components/HydrogenField"));

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
      "Collected and analyzed alkaline-electrolyzer operating data, visualized performance trends, and documented findings for engineering review.",
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

function SignalFallback({ status = "STATIC FIELD" }) {
  return (
    <div className="signal-fallback" aria-hidden="true">
      <Barcode count={74} seed={31} />
      <svg viewBox="0 0 800 360" preserveAspectRatio="none">
        <path d="M0 218 C95 218 108 85 205 88 S310 278 411 238 S540 45 635 104 S714 272 800 184" />
      </svg>
      <div className="signal-fallback-label">
        <span>H₂ / FIELD MODEL</span>
        <span>{status}</span>
      </div>
    </div>
  );
}

function FieldStage() {
  const [paused, setPaused] = useState(false);

  return (
    <div className="field-stage">
      <Suspense fallback={<SignalFallback status="LOADING MODEL" />}>
        <HydrogenField paused={paused} fallback={<SignalFallback status="WEBGL UNAVAILABLE" />} />
      </Suspense>
      <button
        className="field-control"
        type="button"
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? <Play size={15} weight="fill" /> : <Pause size={15} weight="fill" />}
        {paused ? "Resume field" : "Pause field"}
      </button>
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

function ResearchChart() {
  return (
    <div className="research-chart" aria-label="Reported voltage, current, and power trend lines over the 721-second monitoring window">
      <div className="chart-head">
        <span>REPORTED TREND LINES</span>
        <span>0 - 721 S</span>
      </div>
      <svg viewBox="0 0 760 420" role="img" aria-labelledby="chart-title chart-desc">
        <title id="chart-title">Electrolyzer operating trend lines</title>
        <desc id="chart-desc">Three normalized rising lines represent the voltage, current, and power linear trends reported in Sid Gunti’s research paper.</desc>
        <g className="chart-grid">
          <path d="M48 60H730M48 150H730M48 240H730M48 330H730" />
          <path d="M48 30V366M218 30V366M389 30V366M559 30V366M730 30V366" />
        </g>
        <g className="chart-series">
          <path data-chart-line d="M48 286 L730 214" />
          <path data-chart-line d="M48 316 L730 228" />
          <path data-chart-line d="M48 338 L730 101" />
        </g>
        <g className="chart-labels">
          <text x="54" y="278">VOLTAGE / 0.0008x + 2.46</text>
          <text x="54" y="308">CURRENT / 0.0009x + 0.40</text>
          <text x="54" y="348">POWER / 0.0029x + 0.93</text>
          <text x="48" y="394">START</text>
          <text x="688" y="394">STOP</text>
        </g>
      </svg>
      <div className="chart-foot">
        <span>NORMALIZED FOR COMPARISON</span>
        <span>Voltage / Current / Power</span>
      </div>
    </div>
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

      gsap.utils.toArray("[data-chart-line]").forEach((line) => {
        const length = line.getTotalLength();
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: { trigger: ".research-chart", start: "top 72%", once: true },
        });
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

        <section className="research-section" id="research">
          <div className="research-intro" data-reveal>
            <div>
              <h2>One system.<br /><span>721 seconds</span> of evidence.</h2>
              <p className="research-deck">
                At Research Support India, Sid studied an alkaline electrolyzer in operation, tracking how its electrical characteristics moved alongside hydrogen production.
              </p>
            </div>
            <EvidenceLink href={`${ASSET_BASE}RSI-Research-Paper.pdf`} external>
              Read the research paper
            </EvidenceLink>
          </div>

          <div className="research-layout">
            <div className="research-sticky" data-reveal>
              <ResearchChart />
            </div>
            <div className="research-ledger">
              <article data-reveal>
                <span className="ledger-key">METHOD</span>
                <strong>1 sample / second</strong>
                <p>Voltage, current, power, flowmeter pressure, and hydrogen flow rate were recorded during a roughly twelve-minute operating window.</p>
              </article>
              <article data-reveal>
                <span className="ledger-key">TOOLCHAIN</span>
                <strong>Python → evidence</strong>
                <p>Pandas, Matplotlib, and scikit-learn supported cleaning, visualization, and linear trend analysis.</p>
              </article>
              <article data-reveal>
                <span className="ledger-key">OBSERVATION</span>
                <strong>Stable, gradual trends</strong>
                <p>The paper reports controlled operation with gradual increases in electrical characteristics over the monitored interval.</p>
              </article>
              <article className="limitation" data-reveal>
                <span className="ledger-key">LIMITS</span>
                <strong>What the run cannot prove</strong>
                <p>Cell temperature was not recorded, the window was short, and a single field run cannot establish long-term durability or causal efficiency.</p>
              </article>
            </div>
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
        <a href="#top">RETURN TO TOP ↑</a>
      </footer>
    </div>
  );
}

export default App;
