import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import "./SwarmBuildIntro.css";

type Task = { block: string; action: string };
type AgentConfig = { name: string; color: string; tasks: Task[] };

/**
 * The swarm. Each agent builds its tasks in order, and `block` names a
 * `data-build-id` on the page. A block no task names goes to the agent with
 * the fewest tasks, and a task whose block is missing is dropped.
 */
const AGENTS: AgentConfig[] = [
  { name: "react", color: "#ff4d4d", tasks: [{ block: "hero", action: "renders the hero" }, { block: "contact", action: "mounts the CTA" }] },
  { name: "vite", color: "#ff9f1c", tasks: [{ block: "profile", action: "bundles the profile bar" }, { block: "skills", action: "bundles the skills" }] },
  { name: "css", color: "#ffe14d", tasks: [{ block: "stats", action: "styles the stats row" }, { block: "project-eagle-scout", action: "styles the cards" }] },
  { name: "python", color: "#a3e635", tasks: [{ block: "project-electrolyzer", action: "plots the electrolyzer data" }] },
  { name: "pandas", color: "#2dd4bf", tasks: [{ block: "experience-rsi", action: "crunches 50+ trials" }] },
  { name: "c++", color: "#22d3ee", tasks: [{ block: "project-wireshark", action: "builds the drone link" }] },
  { name: "git", color: "#4d8dff", tasks: [{ block: "experience-kova", action: "ships the KOVA fixes" }, { block: "about", action: "commits the about section" }] },
  { name: "swiftui", color: "#a78bfa", tasks: [{ block: "project-sidekick", action: "wires up Sidekick" }] },
  { name: "matplotlib", color: "#ff5fb8", tasks: [{ block: "experience-station", action: "charts 29K views" }] },
  { name: "claude-code", color: "#ffffff", tasks: [{ block: "experience-vex", action: "reviews the VEX build" }, { block: "project-idle-game", action: "refactors the idle game" }] },
];

/** Milliseconds. Agents leave in page order, `stagger` apart, after `hold`. */
const TIMING = {
  hold: 600,
  stagger: 240,
  glide: [700, 1100],
  work: [400, 900],
  build: 350,
  converge: 800,
  fade: 350,
} as const;

const PLAYED_KEY = "swarm-build-intro:played";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const NARROW = "(max-width: 767px)";
// The unrotated arrow points up and slightly left; headings are screen angles in degrees.
const ARROW_HEADING = -110;

type Mode = "autoplay" | "built" | "replay-only";

function initialMode(): Mode {
  if (window.matchMedia(REDUCED_MOTION).matches || window.matchMedia(NARROW).matches) return "replay-only";
  try {
    return sessionStorage.getItem(PLAYED_KEY) ? "built" : "autoplay";
  } catch {
    return "autoplay";
  }
}

function markPlayed() {
  try {
    sessionStorage.setItem(PLAYED_KEY, "1");
  } catch {
    // Storage can be blocked; the intro then plays on each load.
  }
}

export default function SwarmBuildIntro() {
  const [mode] = useState(initialMode);
  const [playing, setPlaying] = useState(mode === "autoplay");
  const [built, setBuilt] = useState(0);
  const [total, setTotal] = useState(0);
  const overlay = useRef<HTMLDivElement>(null);
  const monogram = useRef<HTMLDivElement>(null);
  const agents = useRef<HTMLDivElement[]>([]);

  // A layout effect, so blocks turn unbuilt before the first paint instead of flashing whole.
  useLayoutEffect(() => {
    if (!playing) return;
    markPlayed();
    const blocks = [...document.querySelectorAll<HTMLElement>("[data-build-id]")];
    setTotal(blocks.length);
    setBuilt(0);
    const stop = runSwarm({
      blocks,
      agents: agents.current,
      overlay: overlay.current!,
      monogram: monogram.current!,
      onBuilt: setBuilt,
      onDone: () => setPlaying(false),
    });
    const reduced = window.matchMedia(REDUCED_MOTION);
    const onMotionChange = () => reduced.matches && setPlaying(false);
    reduced.addEventListener("change", onMotionChange);
    return () => {
      reduced.removeEventListener("change", onMotionChange);
      stop();
    };
  }, [playing]);

  const replay = () => {
    window.scrollTo({ top: 0 });
    setPlaying(true);
  };

  const replayOnly = !playing && mode === "replay-only";

  return createPortal(
    <>
      {playing ? (
        <div className="swarm-overlay" ref={overlay} aria-hidden="true">
          <div className="swarm-monogram" ref={monogram}><span>SG</span></div>
          {AGENTS.map((agent, index) => (
            <div
              className="swarm-agent"
              key={agent.name}
              ref={(element) => { if (element) agents.current[index] = element; }}
              style={{ "--agent": agent.color } as CSSProperties}
            >
              <span className="swarm-pulse" />
              <svg className="swarm-arrow" viewBox="0 0 13 19" width="13" height="19">
                <path d="M0.5 0.5V16.2L4.4 12.6L7.1 18.5L9.8 17.3L7.2 11.6H12.4Z" />
              </svg>
              <span className="swarm-label"><b>{agent.name}</b><span /></span>
            </div>
          ))}
        </div>
      ) : null}
      {/* The button keeps its place in every state, so Skip turning into Replay keeps focus. */}
      <div className={`swarm-status${replayOnly ? " is-minimal" : ""}`}>
        {replayOnly ? null : <span>{AGENTS.length} agents · {playing ? `${total} layers` : "built"}</span>}
        {playing ? <span className="swarm-status-count">building — {built}/{total}</span> : null}
        {playing ? (
          <span className="swarm-status-bar"><span style={{ transform: `scaleX(${total ? built / total : 0})` }} /></span>
        ) : null}
        <button
          type="button"
          aria-label={playing ? "Skip build animation" : "Replay build animation"}
          onClick={playing ? () => setPlaying(false) : replay}
        >
          {playing ? "Skip" : "Replay"}
        </button>
      </div>
    </>,
    document.body,
  );
}

type Point = { x: number; y: number };

type Job = { block: HTMLElement; action: string; order: number };

type Runner = {
  element: HTMLElement;
  arrow: SVGElement;
  action: HTMLElement;
  jobs: Job[];
  job?: Job;
  state: "hold" | "wait" | "glide" | "work" | "idle" | "home";
  /** Document coordinates; viewport coordinates while holding at center. */
  position: Point;
  from: Point;
  to: Point;
  /** `to` stays put on screen rather than on the page, for the trip home. */
  toViewport: boolean;
  start: number;
  until: number;
  angle: number;
  heading: number;
  seed: number;
};

type SwarmOptions = {
  blocks: HTMLElement[];
  agents: HTMLElement[];
  overlay: HTMLElement;
  monogram: HTMLElement;
  onBuilt: (count: number) => void;
  onDone: () => void;
};

const between = ([low, high]: readonly [number, number]) => low + Math.random() * (high - low);
const easeInOutCubic = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);
const headingOf = (from: Point, to: Point) => (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;

/** Hands out every block to an agent, keyed by page order. */
function assignJobs(blocks: HTMLElement[]) {
  const byId = new Map(blocks.map((block, order) => [block.dataset.buildId, { block, order }]));
  const taken = new Set<HTMLElement>();
  const jobs = AGENTS.map((agent) =>
    agent.tasks.flatMap(({ block: id, action }) => {
      const found = byId.get(id);
      if (!found || taken.has(found.block)) return [];
      taken.add(found.block);
      return [{ ...found, action }];
    }),
  );
  blocks.forEach((block, order) => {
    if (taken.has(block)) return;
    const lightest = jobs.reduce((best, list) => (list.length < best.length ? list : best));
    lightest.push({ block, order, action: `builds ${block.dataset.buildId}` });
  });
  return jobs.map((list) => list.sort((a, b) => a.order - b.order));
}

/** A spot in the upper part of the block, in document coordinates. */
function pointIn(block: HTMLElement): Point {
  const rect = block.getBoundingClientRect();
  const x = rect.left + rect.width * (0.22 + Math.random() * 0.4);
  return {
    x: Math.min(Math.max(x, 12), window.innerWidth - 24),
    y: rect.top + window.scrollY + Math.min(rect.height * 0.45, 56 + Math.random() * 72),
  };
}

/** Plays one build and returns a stop function that leaves the page whole at once. */
function runSwarm({ blocks, agents, overlay, monogram, onBuilt, onDone }: SwarmOptions) {
  const root = document.documentElement;
  root.style.setProperty("--swarm-build", `${TIMING.build}ms`);
  for (const block of blocks) block.dataset.buildState = "pending";

  const center = () => ({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const runners: Runner[] = assignJobs(blocks).map((jobs, index) => {
    const heading = (index / AGENTS.length) * 360 - 90;
    const radians = (heading * Math.PI) / 180;
    // An oval around the monogram, wide enough that the name labels clear each other.
    const position = { x: center().x + Math.cos(radians) * 150, y: center().y + Math.sin(radians) * 104 };
    const element = agents[index];
    return {
      element,
      arrow: element.querySelector("svg")!,
      action: element.querySelector(".swarm-label > span")!,
      jobs,
      state: "hold",
      position,
      from: position,
      to: position,
      toViewport: false,
      start: 0,
      until: 0,
      angle: heading,
      heading,
      seed: index * 1.7,
    };
  });

  const settling: { block: HTMLElement; at: number }[] = [];
  let builtCount = 0;
  let homeAt = 0;
  let frame = 0;
  let last = performance.now();
  const startedAt = last;

  const glide = (runner: Runner, t: number, to: Point, toViewport: boolean, duration: number) => {
    runner.from = runner.position;
    runner.to = to;
    runner.toViewport = toViewport;
    runner.start = t;
    runner.until = t + duration;
    const target = toViewport ? { x: to.x, y: to.y + window.scrollY } : to;
    runner.heading = headingOf(runner.position, target);
  };

  const nextJob = (runner: Runner) => {
    runner.job = runner.jobs.shift();
    runner.state = runner.job ? "wait" : "idle";
    runner.action.textContent = runner.job ? "" : "done";
  };

  const step = (runner: Runner, t: number) => {
    switch (runner.state) {
      case "hold":
        if (t < TIMING.hold) return;
        // Leaving the center: switch from screen to page coordinates.
        runner.position = { x: runner.position.x, y: runner.position.y + window.scrollY };
        nextJob(runner);
        return;
      case "wait":
        if (t < TIMING.hold + runner.job!.order * TIMING.stagger) return;
        runner.action.textContent = runner.job!.action;
        glide(runner, t, pointIn(runner.job!.block), false, between(TIMING.glide));
        runner.state = "glide";
        return;
      case "glide":
        if (t < runner.until) return;
        runner.state = "work";
        runner.until = t + between(TIMING.work);
        runner.element.classList.add("is-working");
        return;
      case "work":
        if (t < runner.until) return;
        runner.element.classList.remove("is-working");
        runner.job!.block.dataset.buildState = "built";
        settling.push({ block: runner.job!.block, at: t + TIMING.build });
        onBuilt(++builtCount);
        nextJob(runner);
    }
  };

  const draw = (runner: Runner, t: number, dt: number) => {
    let { x, y } = runner.position;
    if (runner.state === "hold") {
      y += window.scrollY;
    } else if (runner.state === "glide" || runner.state === "home") {
      const p = easeInOutCubic(Math.min(1, (t - runner.start) / (runner.until - runner.start)));
      const to = runner.toViewport ? { x: runner.to.x, y: runner.to.y + window.scrollY } : runner.to;
      x = runner.from.x + (to.x - runner.from.x) * p;
      y = runner.from.y + (to.y - runner.from.y) * p;
      runner.position = { x, y };
    } else if (runner.state === "work") {
      x += Math.sin(t / 37 + runner.seed) * 1.4;
      y += Math.cos(t / 43 + runner.seed) * 1.4;
    }
    const turn = ((((runner.heading - runner.angle) % 360) + 540) % 360) - 180;
    runner.angle += turn * (1 - Math.exp(-dt / 80));
    const screenX = x - window.scrollX;
    runner.element.style.transform = `translate3d(${screenX}px, ${y - window.scrollY}px, 0)`;
    runner.arrow.style.transform = `rotate(${runner.angle - ARROW_HEADING}deg)`;
    runner.element.classList.toggle("is-flipped", screenX > window.innerWidth - 240);
  };

  const tick = (now: number) => {
    const t = now - startedAt;
    const dt = now - last;
    last = now;
    for (const runner of runners) step(runner, t);
    while (settling.length && settling[0].at <= t) delete settling.shift()!.block.dataset.buildState;

    if (t >= TIMING.hold + 200) monogram.classList.add("is-gone");
    if (!homeAt && runners.every((runner) => runner.state === "idle")) {
      homeAt = t;
      runners.forEach((runner, index) => {
        const radians = (index / runners.length) * Math.PI * 2;
        const to = { x: center().x + Math.cos(radians) * 22, y: center().y + Math.sin(radians) * 22 };
        glide(runner, t, to, true, TIMING.converge);
        runner.state = "home";
      });
    }
    if (homeAt && t >= homeAt + TIMING.converge) overlay.classList.add("is-leaving");
    if (homeAt && t >= homeAt + TIMING.converge + TIMING.fade && !settling.length) {
      onDone();
      return;
    }

    for (const runner of runners) draw(runner, t, dt);
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    // Settle in one step: with transitions off, removing the state can't animate.
    for (const block of blocks) block.dataset.buildState = "settled";
    void root.offsetHeight;
    for (const block of blocks) delete block.dataset.buildState;
    root.style.removeProperty("--swarm-build");
  };
}
