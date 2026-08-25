import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className='bg-[#080810] border-t border-white/5'>
      <div className='max-w-6xl mx-auto px-6 lg:px-8 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-12 mb-4'>

          {/* Brand column */}
          <div className='md:col-span-1'>
            <div className='text-2xl font-bold font-mono mb-3'>
              <span className='text-gray-100'>BuildMy</span>
              <span className='text-violet-500'>Idea</span>
            </div>
            <p className='text-gray-500 text-sm leading-relaxed max-w-xs'>
              Where early-stage startup founders meet talented developers.
              Turn ideas into reality — without writing a single line of code.
            </p>
            <div className='mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/25 bg-violet-500/8 text-violet-400 text-xs'>
              <span className='w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse inline-block' />
              Ideas are cheap — execution is here.
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h4 className='text-gray-300 font-semibold text-xs mb-5 uppercase tracking-widest'>Platform</h4>
            <ul className='space-y-3'>
              {[
                { label: 'Browse Projects', href: '/projects' },
                { label: 'Sign In', href: '/signin' },
                { label: 'Create Account', href: '/signup' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-gray-500 hover:text-gray-200 text-sm transition-colors flex items-center gap-2 group'
                  >
                    <span className='w-1 h-1 rounded-full bg-gray-700 group-hover:bg-violet-500 transition-colors inline-block' />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mission column */}
          <div>
            <h4 className='text-gray-300 font-semibold text-xs mb-5 uppercase tracking-widest'>Our Mission</h4>
            <p className='text-gray-500 text-sm leading-relaxed mb-4'>
              Every great idea deserves a chance to exist — regardless of whether you can code.
              We connect visionary founders with developers who want real-world startup experience.
            </p>
            <div className='flex flex-col gap-2 text-sm text-gray-600'>
              <div className='flex items-center gap-2'>
                <span className='text-emerald-500'>✓</span>
                <span>Bounty held upfront — zero scam risk</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-emerald-500'>✓</span>
                <span>Equity for idea-stage founders</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-emerald-500'>✓</span>
                <span>Real portfolio for developers</span>
              </div>
            </div>
          </div>

        </div>

        <div className='flex items-center justify-center gap-5 mb-4'>
          <Link href="https://x.com/MohdTalha732677" className='text-gray-500 hover:text-violet-400 transition-colors'>
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.007 3.985H5.078z" />
            </svg>
          </Link>
          <Link href="https://github.com/Talha9509/BuildMyIdea" className='text-gray-500 hover:text-violet-400 transition-colors'>
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </Link>
          <Link href="https://www.linkedin.com/in/mohd-talha5" className='text-gray-500 hover:text-violet-400 transition-colors'>
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </Link>
        </div>

        {/* Bottom bar */}
        <div className='pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4'>
          <p className='text-gray-600 text-xs'>
            © 2026 BuildMyIdea. All rights reserved.
          </p>

          <p className='text-gray-600 text-xs'>
            Crafted by{' '}
            <span className='text-gray-400 font-medium'>Mohd Abdul Wasay Talha</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
