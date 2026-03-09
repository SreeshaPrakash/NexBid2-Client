import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItem { label: string; href: string }
interface Feature { icon: string; title: string; desc: string }
interface Step { num: string; title: string; desc: string; tag: string }
interface Testimonial { name: string; role: string; avatar: string; quote: string; rating: number }
interface FaqItem { q: string; a: string }

// ─── Data ─────────────────────────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

const FEATURES: Feature[] = [
  { icon: "⚡", title: "Instant Bid Matching", desc: "Smart algorithms match your project with the most relevant freelancers within seconds, not days." },
  { icon: "🔒", title: "Escrow Protection", desc: "Funds are secured in escrow until milestones are met. Full protection for both parties, always." },
  { icon: "📊", title: "Real-time Analytics", desc: "Track bids, project progress, and spending in a live dashboard designed for clarity." },
  { icon: "🎯", title: "Verified Talent", desc: "Every freelancer is skill-verified and background-checked before they can place a single bid." },
  { icon: "💬", title: "Integrated Workspace", desc: "Chat, files, contracts, and payments — all in one place. Zero tab-switching, zero friction." },
  { icon: "🔄", title: "Milestone Billing", desc: "Break projects into milestones. Pay only when work is delivered and approved." },
];

const STEPS: Step[] = [
  { num: "01", title: "Post Your Project", desc: "Describe what you need. Set your budget, timeline, and required skills. Takes under 3 minutes.", tag: "For Clients" },
  { num: "02", title: "Receive Smart Bids", desc: "Verified freelancers compete for your project. Review proposals, portfolios, and ratings side by side.", tag: "For Clients" },
  { num: "03", title: "Hire & Collaborate", desc: "Choose your freelancer, sign a smart contract, and work together in the integrated workspace.", tag: "Both" },
  { num: "04", title: "Deliver & Get Paid", desc: "Freelancers submit milestones. Clients approve. Payments release automatically — fast and secure.", tag: "For Freelancers" },
];

const TESTIMONIALS: Testimonial[] = [
  { name: "Arjun Mehta", role: "CTO at LayerStack", avatar: "AM", quote: "We hired 3 engineers through NexBid in a week. The bid quality is miles above other platforms — people actually read the brief.", rating: 5 },
  { name: "Sofia Reyes", role: "Freelance UI/UX Designer", avatar: "SR", quote: "I went from zero clients to fully booked in 6 weeks. The bidding system surfaces good-fit projects instead of just everything.", rating: 5 },
  { name: "Marcus Webb", role: "Founder, Brandcraft Co.", avatar: "MW", quote: "The escrow system finally gave me confidence to hire remotely. No more chasing payments or dealing with disappearing contractors.", rating: 5 },
  { name: "Priya Nair", role: "Full-stack Developer", avatar: "PN", quote: "Other platforms bury you. NexBid's matching actually considers your niche. I get relevant bids, not spray-and-pray job alerts.", rating: 5 },
];

const FAQS: FaqItem[] = [
  { q: "How does NexBid's escrow system work?", a: "When a client hires a freelancer, funds for the agreed milestone are locked in our secure escrow. The freelancer submits work, the client reviews and approves, and payment releases instantly. If there's a dispute, our resolution team steps in." },
  { q: "Is NexBid free to use?", a: "Posting projects and browsing talent is free for clients. NexBid takes a small service fee (8%) only on successful transactions. Freelancers get their first 3 bids free, then choose a plan that fits their workflow." },
  { q: "How are freelancers verified?", a: "Every freelancer completes a skill assessment, identity verification, and portfolio review before being approved. We also run background checks for enterprise clients on request." },
  { q: "Can I work with freelancers globally?", a: "Yes. NexBid supports 150+ countries and handles multi-currency payments, tax forms, and compliance automatically. Hire from anywhere, pay in any major currency." },
  { q: "What if I'm not satisfied with the work?", a: "Our milestone-based system means you only pay for approved work. If a dispute arises, our mediation team reviews all communications and deliverables to reach a fair resolution — typically within 48 hours." },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 2rem",
        height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "all 0.3s ease",
        background: scrolled ? "rgba(8,8,12,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      {/* Logo */}
      <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: "linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 800, color: "#000",
          fontFamily: "'DM Sans', sans-serif",
        }}>N</div>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 17, color: "#fff", letterSpacing: "-0.3px" }}>
          NexBid
        </span>
      </a>

      {/* Desktop Nav */}
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }} className="desktop-nav">
        {NAV_ITEMS.map(item => (
          <a key={item.label} href={item.href} style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 450,
            color: "rgba(255,255,255,0.6)", textDecoration: "none",
            transition: "color 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
          >{item.label}</a>
        ))}
      </div>

      {/* CTA Buttons */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }} className="desktop-nav">
        <a href="/login" style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
          color: "rgba(255,255,255,0.7)", textDecoration: "none", padding: "7px 16px",
          borderRadius: 8, transition: "color 0.2s",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
        >Sign in</a>
        <a href="/signup" style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
          color: "#000", textDecoration: "none",
          padding: "7px 18px", borderRadius: 8,
          background: "linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%)",
          transition: "opacity 0.2s",
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >Get started free</a>
      </div>

      {/* Mobile menu toggle */}
      <button
        className="mobile-nav"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer", display: "none" }}
      >{menuOpen ? "✕" : "☰"}</button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-nav" style={{
          position: "fixed", top: 64, left: 0, right: 0,
          background: "rgba(8,8,12,0.97)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "1.5rem 2rem", display: "flex", flexDirection: "column", gap: "1.2rem",
        }}>
          {NAV_ITEMS.map(item => (
            <a key={item.label} href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: 16 }}
            >{item.label}</a>
          ))}
          <a href="/signup" style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15,
            color: "#000", textDecoration: "none", padding: "10px 18px",
            borderRadius: 8, background: "linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%)",
            textAlign: "center", marginTop: 8,
          }}>Get started free</a>
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);

  useEffect(() => {
    const animate = (setter: (v: number) => void, target: number, duration = 1800) => {
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        setter(Math.floor(current));
        if (current >= target) clearInterval(timer);
      }, 16);
    };
    const t = setTimeout(() => {
      animate(setCount1, 48000);
      animate(setCount2, 12000);
      animate(setCount3, 98);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <section style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "120px 2rem 80px",
      position: "relative", overflow: "hidden",
      textAlign: "center",
    }}>
      {/* Background */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(59,130,246,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(110,231,183,0.10) 0%, transparent 60%)",
      }} />
      {/* Grid */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto" }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 14px", borderRadius: 100,
          border: "1px solid rgba(110,231,183,0.3)",
          background: "rgba(110,231,183,0.07)",
          marginBottom: "1.8rem",
          animation: "fadeInDown 0.6s ease both",
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#6EE7B7", display: "inline-block", boxShadow: "0 0 8px #6EE7B7" }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#6EE7B7", fontWeight: 500, letterSpacing: "0.02em" }}>
            Now in open beta — join 48,000+ users
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(2.6rem, 6vw, 5rem)",
          fontWeight: 800, lineHeight: 1.08,
          letterSpacing: "-0.04em",
          color: "#fff",
          margin: "0 0 1.4rem",
          animation: "fadeInUp 0.7s 0.1s ease both",
        }}>
          Where great work<br />
          <span style={{
            background: "linear-gradient(90deg, #6EE7B7 0%, #3B82F6 60%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>finds its price.</span>
        </h1>

        {/* Subhead */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1rem, 2vw, 1.2rem)",
          color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 2.6rem",
          animation: "fadeInUp 0.7s 0.2s ease both",
        }}>
          NexBid is a competitive freelance bidding platform where clients post projects and verified talent competes — driving quality up and costs down.
        </p>

        {/* CTAs */}
        <div style={{
          display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap",
          animation: "fadeInUp 0.7s 0.3s ease both",
        }}>
          <a href="/signup" style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15,
            color: "#000", textDecoration: "none",
            padding: "13px 28px", borderRadius: 10,
            background: "linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%)",
            display: "inline-flex", alignItems: "center", gap: 8,
            transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: "0 4px 24px rgba(59,130,246,0.35)",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(59,130,246,0.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(59,130,246,0.35)"; }}
          >Post a project free →</a>
          <a href="/signup?role=freelancer" style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15,
            color: "rgba(255,255,255,0.8)", textDecoration: "none",
            padding: "13px 28px", borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)",
            transition: "border-color 0.2s, background 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
          >Start bidding as freelancer</a>
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", gap: "clamp(1.5rem,4vw,4rem)", justifyContent: "center",
          marginTop: "4rem", flexWrap: "wrap",
          animation: "fadeInUp 0.7s 0.45s ease both",
        }}>
          {[
            { val: `${count1.toLocaleString()}+`, label: "Registered users" },
            { val: `${count2.toLocaleString()}+`, label: "Projects completed" },
            { val: `${count3}%`, label: "Client satisfaction" },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>{stat.val}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" style={{ padding: "100px 2rem", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#6EE7B7", letterSpacing: "0.12em", textTransform: "uppercase" }}>Why NexBid</span>
        <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", margin: "12px 0 0" }}>
          Built for serious work.
        </h2>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "1px",
        background: "rgba(255,255,255,0.06)",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.06)",
      }}>
        {FEATURES.map((f, i) => (
          <div key={f.title}
            style={{
              padding: "2rem 1.8rem",
              background: "#08080C",
              transition: "background 0.25s",
              cursor: "default",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(59,130,246,0.06)")}
            onMouseLeave={e => (e.currentTarget.style.background = "#08080C")}
          >
            <div style={{ fontSize: 26, marginBottom: "1rem" }}>{f.icon}</div>
            <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 700, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.02em" }}>{f.title}</h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" style={{ padding: "100px 2rem", background: "rgba(255,255,255,0.015)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#6EE7B7", letterSpacing: "0.12em", textTransform: "uppercase" }}>Process</span>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", margin: "12px 0 0" }}>
            From idea to delivery.
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {STEPS.map((step, i) => (
            <div key={step.num} style={{
              display: "flex", gap: "2rem", alignItems: "flex-start",
              padding: "2rem 0",
              borderBottom: i < STEPS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}>
              {/* Number */}
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13, fontWeight: 700,
                color: "rgba(255,255,255,0.15)",
                minWidth: 40, paddingTop: 3,
                letterSpacing: "0.05em",
              }}>{step.num}</div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
                  <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>{step.title}</h3>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
                    padding: "3px 10px", borderRadius: 100,
                    background: step.tag === "For Clients" ? "rgba(59,130,246,0.15)" : step.tag === "For Freelancers" ? "rgba(110,231,183,0.12)" : "rgba(255,255,255,0.08)",
                    color: step.tag === "For Clients" ? "#93C5FD" : step.tag === "For Freelancers" ? "#6EE7B7" : "rgba(255,255,255,0.5)",
                    letterSpacing: "0.04em",
                  }}>{step.tag}</span>
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
              </div>

              {/* Connector dot */}
              <div style={{
                width: 10, height: 10, borderRadius: "50%", marginTop: 6,
                background: i === 0 ? "linear-gradient(135deg, #6EE7B7, #3B82F6)" : "rgba(255,255,255,0.1)",
                flexShrink: 0,
              }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section id="testimonials" style={{ padding: "100px 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#6EE7B7", letterSpacing: "0.12em", textTransform: "uppercase" }}>Testimonials</span>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", margin: "12px 0 0" }}>
            Trusted by builders.
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1rem",
        }}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} style={{
              padding: "1.8rem",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.025)",
              transition: "border-color 0.25s, transform 0.25s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(110,231,183,0.2)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {/* Stars */}
              <div style={{ marginBottom: "1rem", color: "#FBBF24", fontSize: 13, letterSpacing: 1 }}>{"★".repeat(t.rating)}</div>
              {/* Quote */}
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, margin: "0 0 1.4rem", fontStyle: "italic" }}>"{t.quote}"</p>
              {/* Author */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "linear-gradient(135deg, #6EE7B7, #3B82F6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 800, color: "#000",
                  flexShrink: 0,
                }}>{t.avatar}</div>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff" }}>{t.name}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" style={{ padding: "100px 2rem", background: "rgba(255,255,255,0.015)" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "#6EE7B7", letterSpacing: "0.12em", textTransform: "uppercase" }}>FAQ</span>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", margin: "12px 0 0" }}>
            Common questions.
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "rgba(255,255,255,0.05)", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ background: "#08080C" }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%", padding: "1.3rem 1.5rem",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: "none", border: "none", cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: "#fff" }}>{faq.q}</span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 20, color: "rgba(255,255,255,0.3)",
                  transition: "transform 0.25s",
                  transform: open === i ? "rotate(45deg)" : "rotate(0deg)",
                  flexShrink: 0, marginLeft: 12,
                }}>+</span>
              </button>
              {open === i && (
                <div style={{ padding: "0 1.5rem 1.3rem" }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section style={{ padding: "80px 2rem" }}>
      <div style={{
        maxWidth: 900, margin: "0 auto",
        borderRadius: 20,
        background: "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(110,231,183,0.1) 100%)",
        border: "1px solid rgba(110,231,183,0.15)",
        padding: "clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 4rem)",
        textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(59,130,246,0.08), transparent)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", margin: "0 0 1rem" }}>
            Ready to bid smarter?
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "rgba(255,255,255,0.5)", margin: "0 auto 2rem", maxWidth: 480, lineHeight: 1.65 }}>
            Join thousands of clients and freelancers who trust NexBid to get real work done.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/signup" style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15,
              color: "#000", textDecoration: "none",
              padding: "13px 28px", borderRadius: 10,
              background: "linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%)",
              transition: "opacity 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >Get started — it's free</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(255,255,255,0.06)",
      padding: "3rem 2rem",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "space-between", alignItems: "flex-start" }}>
        {/* Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background: "linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 800, color: "#000",
            }}>N</div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 16, color: "#fff" }}>NexBid</span>
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.35)", maxWidth: 220, lineHeight: 1.6, margin: 0 }}>
            Competitive freelance bidding for the modern workforce.
          </p>
        </div>

        {/* Links */}
        {[
          { heading: "Platform", links: ["Post a project", "Find work", "How it works", "Pricing"] },
          { heading: "Company", links: ["About", "Blog", "Careers", "Press"] },
          { heading: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
        ].map(col => (
          <div key={col.heading}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>{col.heading}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {col.links.map(l => (
                <a key={l} href="#" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                >{l}</a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 1200, margin: "2.5rem auto 0", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.2)" }}>© 2025 NexBid. All rights reserved.</span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.2)" }}>Made for builders, by builders.</span>
      </div>
    </footer>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Landing() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        html { scroll-behavior: smooth; }

        body {
          margin: 0;
          background: #08080C;
          color: #fff;
          -webkit-font-smoothing: antialiased;
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Responsive nav */
        @media (max-width: 680px) {
          .desktop-nav { display: none !important; }
          .mobile-nav  { display: flex !important; }
        }
      `}</style>

      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaBanner />
      <Footer />
    </>
  );
}