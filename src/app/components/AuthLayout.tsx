import Image from "next/image";
import type { ReactNode } from "react";
import logo from "../../../public/images/Logo.png";

/* Circuit traces drawn behind the hero — a light pulse runs along each one */
const CIRCUIT_TRACES = [
  { d: "M0 90 L120 90 L150 60 L280 60", dur: "3.4s", delay: "0s" },
  {
    d: "M0 180 L90 180 L120 210 L240 210 L270 180 L360 180",
    dur: "4.2s",
    delay: "-1.2s",
  },
  { d: "M0 300 L160 300 L190 330 L300 330", dur: "3.8s", delay: "-2s" },
  { d: "M60 460 L60 380 L100 340 L220 340", dur: "4.6s", delay: "-0.6s" },
  { d: "M0 560 L140 560 L170 530 L320 530", dur: "3.2s", delay: "-2.4s" },
  { d: "M40 680 L40 600 L80 560 L200 560", dur: "5s", delay: "-1.6s" },
];

/* Junction points where traces meet — they breathe out of phase */
const CIRCUIT_NODES = [
  { cx: 150, cy: 60 },
  { cx: 120, cy: 210 },
  { cx: 270, cy: 180 },
  { cx: 190, cy: 330 },
  { cx: 100, cy: 340 },
  { cx: 170, cy: 530 },
  { cx: 80, cy: 560 },
];

type AuthLayoutProps = {
  /** Pill in the hero's top-right corner — renders after the pulsing dot */
  badge: ReactNode;
  /** Small-caps line above the headline — renders after the glowing bar */
  eyebrow: ReactNode;
  headline: ReactNode;
  description: ReactNode;
  /** Right panel — the page owns everything inside it */
  children: ReactNode;
};

export default function AuthLayout({
  badge,
  eyebrow,
  headline,
  description,
  children,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* ── Left hero panel ─────────────────────────────────── */}
      <aside
        className="relative flex w-2/5 shrink-0 flex-col justify-between overflow-hidden px-9 pb-20 pt-9 text-white"
        style={{
          background:
            "linear-gradient(165deg, #05221A 0%, #063A29 55%, #041B14 100%)",
        }}
      >
        {/* Faint blueprint grid */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgba(146,238,190,0.06) 1px, rgba(0,0,0,0) 1px), linear-gradient(90deg, rgba(146,238,190,0.06) 1px, rgba(0,0,0,0) 1px)",
            backgroundSize: "34px 34px",
          }}
        />

        {/* Circuit board — dim traces with a light pulse running along each */}
        <svg
          viewBox="0 0 360 760"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full overflow-hidden"
          aria-hidden="true"
        >
          {CIRCUIT_TRACES.map((t) => (
            <path
              key={`base-${t.d}`}
              d={t.d}
              fill="none"
              stroke="rgba(146,238,190,0.16)"
              strokeWidth="1.5"
            />
          ))}
          {CIRCUIT_TRACES.map((t) => (
            <path
              key={`pulse-${t.d}`}
              d={t.d}
              fill="none"
              stroke="var(--color-green-300)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="26 500"
              style={{
                filter: "drop-shadow(0 0 4px rgba(77,221,150,0.9))",
                animation: `nexus-trace ${t.dur} linear ${t.delay} infinite`,
              }}
            />
          ))}
          {CIRCUIT_NODES.map((n, i) => (
            <circle
              key={`${n.cx}-${n.cy}`}
              cx={n.cx}
              cy={n.cy}
              r="3.5"
              fill="var(--color-green-300)"
              style={{
                filter: "drop-shadow(0 0 5px rgba(77,221,150,0.8))",
                animation: `nexus-node 2.4s ease-in-out ${i * 0.3}s infinite`,
              }}
            />
          ))}
        </svg>

        {/* Glow blob — upper-right */}
        <div
          className="absolute -right-20 -top-20 h-75 w-75 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(18,198,110,0.3), rgba(0,0,0,0) 68%)",
            animation: "nexus-pulse 7s ease-in-out infinite",
          }}
        />

        {/* Top bar: brand + status badge */}
        <div className="relative z-2 flex items-start justify-between">
          <div className="h-13 w-35 rounded-lg overflow-hidden">
            <Image
              src={logo}
              alt="Nexus"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex items-center gap-2 rounded-full border border-green-200/30 bg-green-200/10 px-5 py-1.5 text-body-3 leading-loose backdrop-blur-sm">
            <span
              className="h-1.5 w-1.5 rounded-full bg-green-300 shadow-[0_0_0_3px_rgba(18,198,110,0.35)]"
              style={{ animation: "nexus-pulse 2s ease-in-out infinite" }}
            />
            {badge}
          </div>
        </div>

        {/* Middle: eyebrow / headline */}
        <div className="relative z-2">
          <div className="mb-4 flex items-center gap-2.5 text-b3 uppercase tracking-[0.16em] text-green-300">
            <span className="h-0.5 w-6 bg-green-300 shadow-[0_0_8px_rgba(77,221,150,0.8)]" />
            {eyebrow}
          </div>
          <h1 className="mb-4 text-h3 text-white">{headline}</h1>
          <p className="text-b2 text-white/80">{description}</p>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-2 flex items-center gap-3 text-[11.5px] leading-loose tracking-[0.08em] text-white/65">
          <span className="h-px w-7 bg-green-200/60" />
          Enterprise Management Platform · v1.0
        </div>
      </aside>

      {/* ── Right form panel — layout only claims the width split ── */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
