import { Space_Grotesk } from 'next/font/google'
import Footer from './../components/Footer'
import { ButtonRotatingBackgroundGradient } from './../components/Button'
import DemoTable from "@/components/DemoTable"
import Link from 'next/link'
import { ShieldCheck, Gem, Rocket, Compass, Target, Coins, Briefcase, Users, Star } from 'lucide-react'

// Scoped only to this page and its child components
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
})

export default function Home() {
  return (
    <div className={`${spaceGrotesk.className} bg-[#0A0A0F] min-h-screen text-white`}>

      {/* ── HERO ─────────────────────────────────────── */}
      <section
        className="relative min-h-[92vh] flex flex-col justify-center items-center overflow-hidden pt-5"
        style={{
          background:
            'radial-gradient(ellipse 80% 55% at 50% 0%, rgba(124,58,237,0.28) 0%, transparent 65%), #0A0A0F',
        }}
      >
        {/* Ambient glow orbs */}
        <div className="pointer-events-none absolute top-24 left-1/4 w-72 h-72 bg-violet-700/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="pointer-events-none absolute bottom-28 right-1/4 w-96 h-96 bg-purple-800/8 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1.4s' }}
        />

        <div className="relative z-10 flex flex-col items-center text-center px-5 max-w-5xl mx-auto">
          {/* Pill badge */}
          <div className="mb-7 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse inline-block" />
            The startup launchpad for founders &amp; builders
          </div>

          {/* Main headline */}
          <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-5">
            Your Idea<br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-violet-500 bg-clip-text text-transparent">
              Deserves to Exist.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-gray-300 text-lg lg:text-xl max-w-2xl mb-3 leading-relaxed">
            You think it. We build it. Where ideas meet developers who turn them into reality.
          </p>
          <p className="text-gray-500 text-sm lg:text-base mb-10">
            Ideas are cheap —{' '}
            <span className="text-violet-400 font-medium">execution is here.</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <ButtonRotatingBackgroundGradient text="Get Started Free" />
            <Link
              href="/projects"
              className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1.5 group"
            >
              Create Account
              <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </Link>
          </div>

          {/* Stats strip */}
          <div className="mt-16 mb-6 flex gap-8 lg:gap-20 flex-wrap justify-center">
            {[
              { label: 'Ideas Shared', value: '100+' },
              { label: 'Developers', value: '300+' },
              { label: 'Projects Built', value: '50+' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A0A0F] to-transparent" />
      </section>

      <div className="border-t border-white/5" />

      {/* ── FOR FOUNDERS ─────────────────────────────── */}
      <section className="py-24 px-5 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-300 text-xs font-medium mb-5 uppercase tracking-widest">
            For Founders
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight">
            Turn Ideas Into Reality -
            <br className="hidden lg:block" />
            <span className="text-violet-400"> Without Writing Code</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            You think it. We build it. Share your vision and let developers bring it to life — on your terms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: <ShieldCheck className="w-8 h-8 text-orange-400" />,
              title: 'Zero Scam Risk',
              desc: 'When you post a bounty, the funds are held by us upfront. The winning developer gets paid only after you approve the best submission. No fraud, ever.',
            },
            {
              icon: <Gem className="w-8 h-8 text-orange-400" />,
              title: 'No Funding Required',
              desc: 'Even pre-seed founders can share ideas. Offer equity instead of cash and attract developers who genuinely believe in your vision.',
            },
            {
              icon: <Rocket className="w-8 h-8 text-orange-400" />,
              title: 'Go From Idea to MVP',
              desc: 'Post your software, SaaS, AI, or Web3 project. Get real submissions from motivated developers. Pick the best. Launch faster.',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="relative group rounded-2xl border border-white/10 bg-white/[0.03] p-7 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all duration-300"
            >
              {/* Subtle corner glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="mb-5 bg-white/5 w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">{card.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{card.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-white/5" />

      {/* ── FOR DEVELOPERS ───────────────────────────── */}
      <section className="py-24 px-5 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-5 uppercase tracking-widest">
            For Developers
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight">
            Build Projects That
            <br className="hidden lg:block" />
            <span className="text-violet-400"> Actually Matter</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Stop building to-do apps for your portfolio. Build real startups. Get paid — or get equity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[
            {
              icon: <Compass className="w-6 h-6 text-violet-400" />,
              title: 'Explore Real-World Project Ideas Instantly',
              desc: 'Browse a curated feed of startup ideas posted by real founders. No filler, no toy projects — just genuine ideas waiting to be built.',
            },
            {
              icon: <Target className="w-6 h-6 text-violet-400" />,
              title: 'Pick Ideas That Match Your Skills & Interests',
              desc: 'Filter by tech stack, domain (AI, Web3, SaaS), or reward type. Build what excites you, not what you\'re forced to.',
            },
            {
              icon: <Coins className="w-6 h-6 text-violet-400" />,
              title: 'Earn Bounties or Gain Equity',
              desc: 'Get paid instantly when your submission wins a bounty, or become a co-founder through equity. Your skills, your choice.',
            },
            {
              icon: <Briefcase className="w-6 h-6 text-violet-400" />,
              title: 'Strengthen Your Portfolio With Real Use-Cases',
              desc: 'Even if the startup doesn\'t take off, you\'ve shipped something real. That\'s what employers and clients want to see.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="flex gap-4 items-start p-6 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-300 group"
            >
              <div className="shrink-0 mt-0.5 bg-white/5 w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-violet-500/20 transition-colors duration-300">{feature.icon}</div>
              <div>
                <h3 className="text-white font-semibold text-base mb-1.5">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Team callout banner */}
        <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/5 px-7 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div className="flex gap-4 items-center">
            <div className="bg-violet-500/20 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
               <Users className="w-6 h-6 text-violet-300" />
            </div>
            <div>
              <p className="text-white font-semibold text-base">Build as a team</p>
              <p className="text-gray-400 text-sm mt-1">
                Form a team of up to 4 developers and split the bounty or equity together.
              </p>
            </div>
          </div>
          <Link
            href="/signin"
            className="shrink-0 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors whitespace-nowrap"
          >
            Find Your Next Project →
          </Link>
        </div>
      </section>

      <div className="border-t border-white/5" />

      {/* ── DEMO TABLE ───────────────────────────────── */}
      <DemoTable />

      <div className="border-t border-white/5" />

      {/* ── FINAL CTA BANNER ─────────────────────────── */}
      <section className="py-28 px-5 relative overflow-hidden">
        {/* Background treatment */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-950/40 via-purple-950/25 to-violet-950/40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
        {/* Center ambient glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[500px] h-[300px] bg-violet-700/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
             <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
             </div>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight">
            Where Ideas Meet Developers.
          </h2>
          <p className="text-gray-400 text-lg mb-2 italic">
            &quot;The best startups weren&apos;t built alone.&quot;
          </p>
          <p className="text-gray-600 text-sm mb-10">
            Join hundreds of founders &amp; developers building the next generation of startups — right now.
          </p>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {[ 'No Code Required', 'Bounty Protected', 'Equity Options', 'Team Building', 'Real Portfolio'].map(
              (chip) => (
                <span
                  key={chip}
                  className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-gray-400 text-xs font-medium"
                >
                  {chip}
                </span>
              ),
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/signup"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-500/20"
            >
              Create Free Account
            </Link>
            <Link
              href="/projects"
              className="px-8 py-3.5 rounded-full border border-white/15 text-gray-300 hover:text-white hover:bg-white/5 font-semibold text-sm transition-all"
            >
              Browse Projects
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <Footer />
    </div>
  )
}
