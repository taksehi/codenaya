import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Code2,
  Rocket,
  Zap,
  Terminal,
  Cpu,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Small helpers                                                        */
/* ------------------------------------------------------------------ */

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 px-1"
    >
      {children}
    </Link>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-indigo-500/40 hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1 cursor-default">
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />
      <div className="relative">
        <div className="inline-flex p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-4 group-hover:bg-indigo-500/20 transition-colors duration-300">
          <Icon className="size-5 text-indigo-400" />
        </div>
        <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard mock — mirrors the real ProjectsView layout               */
/* ------------------------------------------------------------------ */

function DashboardMock() {
  return (
    <div className="relative mx-auto max-w-5xl px-4">
      {/* Glow beneath */}
      <div className="absolute -inset-x-20 top-10 h-[500px] bg-gradient-to-t from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Browser chrome */}
      <div className="relative rounded-2xl overflow-hidden border border-white/[0.12] bg-[#09090B] shadow-[0_0_80px_-12px_rgba(99,102,241,0.45)]">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/[0.08]">
          <div className="flex gap-1.5">
            <div className="size-3 rounded-full bg-red-500/60" />
            <div className="size-3 rounded-full bg-yellow-500/60" />
            <div className="size-3 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-md px-3 py-1 w-56">
              <div className="size-3 rounded-full bg-white/10" />
              <span className="text-xs text-zinc-500 font-mono truncate">codenaya.dev/projects</span>
            </div>
          </div>
        </div>

        {/* App shell — identical structure to actual ProjectsView */}
        <div
          className="relative flex flex-col items-center justify-center p-10 overflow-hidden pointer-events-none select-none"
          style={{ minHeight: 440 }}
        >
          {/* Glowing orbs — same as ProjectsView */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-40 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at top, rgba(99,102,241,0.4), transparent 70%)" }}
          />
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] opacity-40 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at top, rgba(236,72,153,0.3), transparent 70%)" }}
          />

          <div className="relative w-full max-w-sm mx-auto flex flex-col gap-6 items-center z-10">

            {/* Logo — same as ProjectsView */}
            <div className="flex items-center gap-3 w-full">
              <div className="p-2.5 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl ring-1 ring-white/5">
                <Image src="/logo.svg" alt="CodeNaya" width={30} height={30} className="drop-shadow-lg" />
              </div>
              <span
                className="text-3xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500"
                style={{ fontFamily: "var(--font-poppins, Poppins), system-ui, sans-serif" }}
              >
                CodeNaya
              </span>
            </div>

            {/* Action cards grid — same as ProjectsView */}
            <div className="grid grid-cols-2 gap-3 w-full">
              {/* New Project */}
              <div className="flex flex-col p-4 bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl gap-6">
                <div className="flex justify-between w-full items-center">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Sparkles className="size-4" />
                  </div>
                  <div className="bg-[#27272A] border border-white/10 px-1.5 py-0.5 rounded text-zinc-400 font-mono text-[10px]">⌘J</div>
                </div>
                <span className="text-sm font-semibold tracking-tight text-white">New Project</span>
              </div>

              {/* Import */}
              <div className="flex flex-col p-4 bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl gap-6">
                <div className="flex justify-between w-full items-center">
                  <div className="p-2 rounded-lg bg-white/5 text-zinc-300">
                    <Code2 className="size-4" />
                  </div>
                  <div className="bg-[#27272A] border border-white/10 px-1.5 py-0.5 rounded text-zinc-400 font-mono text-[10px]">⌘I</div>
                </div>
                <span className="text-sm font-semibold tracking-tight text-white">Import</span>
              </div>
            </div>

            {/* Projects list panel — same as ProjectsView */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-4 w-full">

              {/* Last updated (ContinueCard) */}
              <div className="flex flex-col gap-2 mb-4">
                <span className="text-[10px] text-zinc-500 font-semibold tracking-wide uppercase ml-1">Last updated</span>
                <div className="p-3.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code2 className="size-3.5 text-zinc-400" />
                      <span className="text-sm font-semibold text-zinc-200">vibrant-fox</span>
                    </div>
                    <Rocket className="size-4 text-zinc-500" />
                  </div>
                  <span className="text-[11px] text-zinc-500">about 2 hours ago</span>
                </div>
              </div>

              {/* Recent project items */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between px-1 mb-1">
                  <span className="text-[10px] text-zinc-500 font-semibold tracking-wide uppercase">Recent Projects</span>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                    View all
                    <span className="bg-[#09090B] border border-white/10 px-1.5 py-0.5 rounded font-mono text-[9px] text-zinc-400">⌘K</span>
                  </div>
                </div>
                {[
                  { name: "clever-blue-dolphin", time: "1 day ago" },
                  { name: "rapid-purple-lion",   time: "3 days ago" },
                  { name: "sunny-jade-fox",      time: "5 days ago" },
                ].map(({ name, time }) => (
                  <div key={name} className="flex items-center justify-between px-2 py-1.5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Code2 className="size-3.5 text-zinc-500 shrink-0" />
                      <span className="text-xs text-zinc-400 font-medium truncate">{name}</span>
                    </div>
                    <span className="text-[10px] text-zinc-600 shrink-0 ml-2">{time}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  const features = [
    { icon: Sparkles,  title: "AI-Powered Editing",  description: "Describe what you want — the AI writes, refactors, and debugs your code in real time." },
    { icon: Zap,       title: "Zero Setup",           description: "No installs, no local environments. Open the browser and start coding immediately." },
    { icon: Rocket,    title: "Instant Preview",      description: "See your changes live in a split-second preview. Full HMR inside the browser." },
    { icon: Code2,     title: "Full File System",     description: "Create, rename, move, and delete files with a real in-browser file explorer." },
    { icon: Cpu,       title: "Multi-Model AI",       description: "Switch between GPT-4, Claude, and Gemini. Pick the best model for every task." },
    { icon: Terminal,  title: "Integrated Terminal",  description: "Run commands, install packages, and watch logs — all inside the same workspace." },
  ];

  return (
    <main
      className="min-h-dvh bg-[#07070a] text-white overflow-x-hidden"
      style={{ fontFamily: "var(--font-dm-sans, DM Sans), system-ui, sans-serif" }}
    >
      {/* ── Background atmosphere ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] opacity-30"
          style={{ background: "radial-gradient(ellipse at top, rgba(99,102,241,0.6) 0%, rgba(139,92,246,0.3) 40%, transparent 70%)" }} />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] opacity-20"
          style={{ background: "radial-gradient(ellipse at center, rgba(236,72,153,0.5) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] opacity-10"
          style={{ background: "radial-gradient(ellipse at bottom right, rgba(20,184,166,0.6) 0%, transparent 70%)" }} />
      </div>

      {/* ── Navbar ── */}
      <header className="relative z-50 flex items-center justify-between px-6 md:px-10 py-4 border-b border-white/[0.06] bg-black/20 backdrop-blur-xl">
        <Link href="/home" className="flex items-center gap-3 group" aria-label="CodeNaya home">
          <div className="p-2 bg-white/5 rounded-xl border border-white/10 shadow-xl ring-1 ring-white/5 group-hover:border-indigo-500/40 transition-colors duration-300">
            <Image src="/logo.svg" alt="CodeNaya" width={22} height={22} className="drop-shadow-lg" />
          </div>
          <span className="text-base font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-poppins, Poppins), system-ui, sans-serif" }}>
            CodeNaya
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 bg-white/5 border border-white/[0.08] rounded-full px-4 py-1.5" aria-label="Primary">
          <NavLink href="/home">Home</NavLink>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">
            Sign In
          </Link>
          <Link href="/" id="nav-cta"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-full transition-all duration-200 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:-translate-y-0.5">
            Open Account
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-8 md:pt-28 md:pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/25 rounded-full mb-6 text-xs font-medium text-indigo-300">
          <Sparkles className="size-3.5" aria-hidden="true" />
          AI-Powered Browser IDE
        </div>

        <h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight max-w-3xl mx-auto mb-6"
          style={{ fontFamily: "var(--font-poppins, Poppins), system-ui, sans-serif" }}
        >
          Build Code{" "}
          <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Faster
          </em>{" "}
          with AI
        </h1>

        <p className="text-base md:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed mb-8">
          Write, edit, and preview projects instantly — no installs, no complexity.
          Just open the browser and let AI do the heavy lifting.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
          <Link href="/" id="hero-cta-primary"
            className="inline-flex items-center gap-2.5 px-7 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full transition-all duration-200 shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:shadow-[0_0_50px_rgba(99,102,241,0.7)] hover:-translate-y-0.5 text-sm">
            <Sparkles className="size-4" aria-hidden="true" />
            14 days free trial
          </Link>
          <Link href="#features" id="hero-cta-secondary"
            className="inline-flex items-center gap-2 px-7 py-3 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-full border border-white/10 hover:border-white/20 transition-all duration-200">
            See Features
          </Link>
        </div>
        <p className="text-xs text-zinc-600">Trusted by 2,400+ developers worldwide</p>
      </section>

      {/* ── Dashboard preview ── */}
      <section className="relative z-10 pb-20 md:pb-28" aria-label="Product preview">
        <DashboardMock />
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative z-10 px-6 pb-24 md:pb-32 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Everything you need</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white"
            style={{ fontFamily: "var(--font-poppins, Poppins), system-ui, sans-serif" }}>
            Your entire workflow,{" "}
            <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              in one tab
            </em>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section id="pricing" className="relative z-10 px-6 pb-28 max-w-3xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-white/[0.10] bg-white/[0.02] backdrop-blur-xl p-10 md:p-14 text-center">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute inset-0 opacity-20"
              style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.6) 0%, transparent 70%)" }} />
          </div>
          <div className="relative">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Free to start</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-poppins, Poppins), system-ui, sans-serif" }}>
              Ready to ship faster?
            </h2>
            <p className="text-zinc-400 text-sm mb-8 max-w-md mx-auto leading-relaxed">
              Join thousands of developers who build production-grade apps in minutes — not hours — with CodeNaya.
            </p>
            <Link href="/" id="cta-banner-btn"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full transition-all duration-200 shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:shadow-[0_0_50px_rgba(99,102,241,0.7)] hover:-translate-y-0.5 text-sm">
              <Rocket className="size-4" aria-hidden="true" />
              Open your workspace
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="" width={18} height={18} className="opacity-60" aria-hidden="true" />
          <span className="text-xs text-zinc-600 font-medium">
            CodeNaya © {new Date().getFullYear()}
          </span>
        </div>
        <nav aria-label="Footer" className="flex items-center gap-6">
          {["Privacy", "Terms", "GitHub"].map((item) => (
            <Link key={item} href="#" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
              {item}
            </Link>
          ))}
        </nav>
      </footer>
    </main>
  );
}
