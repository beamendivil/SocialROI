import { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { 
  RefreshCw, 
  ExternalLink, 
  TrendingUp, 
  ListChecks, 
  Users, 
  Target, 
  FileText,
  Menu,
  X,
  Wallet,
  Tag,
  Award
} from 'lucide-react';

// GSAP types for CDN-loaded library
interface ScrollTriggerVars {
  trigger?: string | Element | null;
  start?: string;
  end?: string;
  pin?: boolean;
  scrub?: number | boolean;
  onLeaveBack?: () => void;
  toggleActions?: string;
}

interface GSAPInstance {
  context: (callback: () => void) => { revert: () => void };
  timeline: (vars?: { 
    delay?: number;
    scrollTrigger?: ScrollTriggerVars;
  }) => GSAPTimeline;
  fromTo: (
    target: string | Element | Element[] | null,
    fromVars: Record<string, unknown>,
    toVars: Record<string, unknown>
  ) => GSAPAnimation;
  set: (target: string | Element | Element[] | null, vars: Record<string, unknown>) => void;
  registerPlugin: (...plugins: unknown[]) => void;
}

interface GSAPTimeline {
  fromTo: (
    target: string | Element | Element[] | null,
    fromVars: Record<string, unknown>,
    toVars: Record<string, unknown>,
    position?: string | number
  ) => GSAPTimeline;
  to: (
    target: string | Element | Element[] | null,
    vars: Record<string, unknown>,
    position?: string | number
  ) => GSAPTimeline;
}

interface GSAPAnimation {
  pause: () => void;
  play: () => void;
}

interface ScrollTriggerInstance {
  start: number;
  end?: number;
  vars: {
    pin?: boolean;
    [key: string]: unknown;
  };
}

interface ScrollTriggerStatic {
  create: (vars: {
    snap?: {
      snapTo: (value: number) => number;
      duration?: { min: number; max: number } | number;
      delay?: number;
      ease?: string;
    };
    trigger?: string | Element | null;
    start?: string;
    toggleActions?: string;
  }) => void;
  getAll: () => ScrollTriggerInstance[];
  maxScroll: (element: Window | Element) => number;
}

declare global {
  interface Window {
    gsap: GSAPInstance;
    ScrollTrigger: ScrollTriggerStatic;
  }
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Use BASE_URL for GitHub Pages compatibility
  const heroImage = `${import.meta.env.BASE_URL}hero-city.jpg`;
  
  // Refs for sections
  const heroRef = useRef<HTMLDivElement>(null);
  const problemRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);
  const collectiveRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const joinRef = useRef<HTMLDivElement>(null);
  
  // Hero load animation
  useEffect(() => {
    const gsap = window.gsap;
    if (!gsap) return;
    
    const ctx = gsap.context(() => {
      // Hero entrance animation (auto-play on load)
      const heroTl = gsap.timeline({ delay: 0.2 });
      
      heroTl
        .fromTo('.hero-bg', 
          { opacity: 0, scale: 1.06 }, 
          { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }
        )
        .fromTo('.hero-headline-1', 
          { y: 24, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 
          0.1
        )
        .fromTo('.hero-headline-2', 
          { y: 24, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 
          0.22
        )
        .fromTo('.hero-subheadline', 
          { y: 16, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 
          0.38
        )
        .fromTo('.hero-cta', 
          { y: 14, opacity: 0, scale: 0.98 }, 
          { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, 
          0.5
        )
        .fromTo('.hero-scroll-hint', 
          { opacity: 0 }, 
          { opacity: 1, duration: 0.4, ease: 'power2.out' }, 
          0.85
        );
    });
    
    return () => ctx.revert();
  }, []);
  
  // Scroll-driven animations
  useLayoutEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    
    if (!gsap || !ScrollTrigger) return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Hero scroll animation (exit only)
      const heroScrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            // Reset hero elements when scrolling back to top
            gsap.set('.hero-headline-group', { opacity: 1, y: 0, scale: 1 });
            gsap.set('.hero-cta', { opacity: 1, y: 0 });
            gsap.set('.hero-bg', { scale: 1, y: 0 });
          }
        }
      });
      
      heroScrollTl
        .fromTo('.hero-headline-group', 
          { opacity: 1, y: 0, scale: 1 }, 
          { opacity: 0, y: '-10vh', scale: 0.98, ease: 'power2.in' }, 
          0.7
        )
        .fromTo('.hero-cta', 
          { opacity: 1, y: 0 }, 
          { opacity: 0, y: '-6vh', ease: 'power2.in' }, 
          0.7
        )
        .fromTo('.hero-bg', 
          { scale: 1, y: 0 }, 
          { scale: 1.05, y: '-4vh', ease: 'power2.in' }, 
          0.7
        );
      
      // Section 2: Problem (two cards)
      const problemTl = gsap.timeline({
        scrollTrigger: {
          trigger: problemRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });
      
      problemTl
        // Entrance
        .fromTo('.problem-card-left', 
          { x: '-60vw', opacity: 0, rotate: -2, scale: 0.96 }, 
          { x: 0, opacity: 1, rotate: 0, scale: 1, ease: 'none' }, 
          0
        )
        .fromTo('.problem-card-right', 
          { x: '60vw', opacity: 0, rotate: 2, scale: 0.96 }, 
          { x: 0, opacity: 1, rotate: 0, scale: 1, ease: 'none' }, 
          0.05
        )
        .fromTo('.problem-card-content', 
          { y: 18, opacity: 0 }, 
          { y: 0, opacity: 1, stagger: 0.02, ease: 'none' }, 
          0.1
        )
        // Exit
        .fromTo('.problem-card-left', 
          { x: 0, opacity: 1, rotate: 0 }, 
          { x: '-18vw', opacity: 0, rotate: -1, ease: 'power2.in' }, 
          0.7
        )
        .fromTo('.problem-card-right', 
          { x: 0, opacity: 1, rotate: 0 }, 
          { x: '18vw', opacity: 0, rotate: 1, ease: 'power2.in' }, 
          0.7
        );
      
      // Section 3: Solution (single card)
      const solutionTl = gsap.timeline({
        scrollTrigger: {
          trigger: solutionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });
      
      solutionTl
        .fromTo('.solution-card', 
          { y: '100vh', opacity: 0, scale: 0.92 }, 
          { y: 0, opacity: 1, scale: 1, ease: 'none' }, 
          0
        )
        .fromTo('.solution-headline', 
          { x: '-10vw', opacity: 0 }, 
          { x: 0, opacity: 1, ease: 'none' }, 
          0.12
        )
        .fromTo('.solution-subheadline', 
          { x: '-6vw', opacity: 0 }, 
          { x: 0, opacity: 1, ease: 'none' }, 
          0.18
        )
        .fromTo('.solution-card', 
          { y: 0, opacity: 1, scale: 1 }, 
          { y: '-40vh', opacity: 0, scale: 0.98, ease: 'power2.in' }, 
          0.7
        );
      
      // Section 4: Feature
      const featureTl = gsap.timeline({
        scrollTrigger: {
          trigger: featureRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });
      
      featureTl
        .fromTo('.feature-card', 
          { x: '60vw', opacity: 0, rotate: 2 }, 
          { x: 0, opacity: 1, rotate: 0, ease: 'none' }, 
          0
        )
        .fromTo('.feature-headline', 
          { y: 22, opacity: 0 }, 
          { y: 0, opacity: 1, ease: 'none' }, 
          0.1
        )
        .fromTo('.feature-body', 
          { y: 16, opacity: 0 }, 
          { y: 0, opacity: 1, ease: 'none' }, 
          0.15
        )
        .fromTo('.feature-card', 
          { x: 0, opacity: 1, rotate: 0 }, 
          { x: '-18vw', opacity: 0, rotate: -1, ease: 'power2.in' }, 
          0.7
        );
      
      // Section 5: Collective
      const collectiveTl = gsap.timeline({
        scrollTrigger: {
          trigger: collectiveRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });
      
      collectiveTl
        .fromTo('.collective-card-left', 
          { x: '-60vw', opacity: 0, rotate: -2 }, 
          { x: 0, opacity: 1, rotate: 0, ease: 'none' }, 
          0
        )
        .fromTo('.collective-card-right', 
          { x: '60vw', opacity: 0, rotate: 2 }, 
          { x: 0, opacity: 1, rotate: 0, ease: 'none' }, 
          0.08
        )
        .fromTo('.collective-progress', 
          { scaleX: 0, opacity: 0 }, 
          { scaleX: 1, opacity: 1, ease: 'none' }, 
          0.18
        )
        .fromTo('.collective-card-left', 
          { y: 0, opacity: 1 }, 
          { y: '-30vh', opacity: 0, ease: 'power2.in' }, 
          0.7
        )
        .fromTo('.collective-card-right', 
          { y: 0, opacity: 1 }, 
          { y: '-30vh', opacity: 0, ease: 'power2.in' }, 
          0.72
        );
      
      // Section 6: Story
      const storyTl = gsap.timeline({
        scrollTrigger: {
          trigger: storyRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });
      
      storyTl
        .fromTo('.story-card', 
          { x: '-60vw', opacity: 0, rotate: -2 }, 
          { x: 0, opacity: 1, rotate: 0, ease: 'none' }, 
          0
        )
        .fromTo('.story-content', 
          { y: 20, opacity: 0 }, 
          { y: 0, opacity: 1, stagger: 0.03, ease: 'none' }, 
          0.1
        )
        .fromTo('.story-card', 
          { y: 0, opacity: 1, scale: 1 }, 
          { y: '-40vh', opacity: 0, scale: 0.98, ease: 'power2.in' }, 
          0.7
        );
      
      // Section 7: Join (flowing, not pinned)
      gsap.fromTo('.join-headline', 
        { y: 24, opacity: 0 }, 
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8,
          scrollTrigger: {
            trigger: '.join-headline',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
      
      gsap.fromTo('.join-form-card', 
        { x: '10vw', opacity: 0 }, 
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.8,
          scrollTrigger: {
            trigger: '.join-form-card',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
      
      gsap.fromTo('.how-it-works-card', 
        { y: 40, opacity: 0, scale: 0.98 }, 
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          stagger: 0.1,
          duration: 0.6,
          scrollTrigger: {
            trigger: '.how-it-works-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
      
      // Global snap for pinned sections
      const pinned = ScrollTrigger.getAll()
        .filter((st: ScrollTriggerInstance) => st.vars.pin)
        .sort((a: ScrollTriggerInstance, b: ScrollTriggerInstance) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      if (maxScroll && pinned.length > 0) {
        const pinnedRanges = pinned.map((st: ScrollTriggerInstance) => ({
          start: st.start / maxScroll,
          end: (st.end ?? st.start) / maxScroll,
          center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
        }));
        
        ScrollTrigger.create({
          snap: {
            snapTo: (value: number) => {
              const inPinned = pinnedRanges.some((r: { start: number; end: number }) => 
                value >= r.start - 0.08 && value <= r.end + 0.08
              );
              if (!inPinned) return value;
              
              const target = pinnedRanges.reduce((closest: number, r: { center: number }) =>
                Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
                pinnedRanges[0]?.center ?? 0
              );
              return target;
            },
            duration: { min: 0.15, max: 0.35 },
            delay: 0,
            ease: 'power2.out'
          }
        });
      }
    });
    
    return () => ctx.revert();
  }, []);
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="relative">
      {/* Grain overlay */}
      <div className="grain-overlay" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-[4vw] py-6 flex items-center justify-between">
        <div className="font-display font-bold text-xl text-[var(--paper)] tracking-tight">
          Tucson Impact Ledger
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection('solution')} className="text-[var(--text-secondary)] hover:text-[var(--paper)] transition-colors text-sm font-medium">
            How it works
          </button>
          <button onClick={() => scrollToSection('feature')} className="text-[var(--text-secondary)] hover:text-[var(--paper)] transition-colors text-sm font-medium">
            Features
          </button>
          <button onClick={() => scrollToSection('collective')} className="text-[var(--text-secondary)] hover:text-[var(--paper)] transition-colors text-sm font-medium">
            Community
          </button>
          <button onClick={() => scrollToSection('join')} className="text-[var(--text-secondary)] hover:text-[var(--paper)] transition-colors text-sm font-medium">
            Join
          </button>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-[var(--paper)]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[var(--charcoal)] flex flex-col items-center justify-center gap-8">
          <button onClick={() => scrollToSection('solution')} className="text-[var(--paper)] text-2xl font-display font-bold">
            How it works
          </button>
          <button onClick={() => scrollToSection('feature')} className="text-[var(--paper)] text-2xl font-display font-bold">
            Features
          </button>
          <button onClick={() => scrollToSection('collective')} className="text-[var(--paper)] text-2xl font-display font-bold">
            Community
          </button>
          <button onClick={() => scrollToSection('join')} className="text-[var(--paper)] text-2xl font-display font-bold">
            Join
          </button>
          <button 
            onClick={() => scrollToSection('join')} 
            className="cta-button-paper mt-8"
          >
            Request early access
          </button>
        </div>
      )}
      
      {/* Section 1: Hero */}
      <section ref={heroRef} className="section-pinned z-10">
        {/* Background image */}
        <div className="hero-bg absolute inset-0">
          <img 
            src={heroImage} 
            alt="Tucson skyline" 
            className="w-full h-full object-cover"
          />
          <div className="dark-scrim" />
          <div className="spotlight-vignette" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-6">
          <div className="hero-headline-group">
            <h1 className="headline-1 text-[var(--paper)] max-w-[62vw] mx-auto">
              <span className="hero-headline-1 block">Keep Tucson</span>
              <span className="hero-headline-2 block">thriving.</span>
            </h1>
          </div>
          
          <p className="hero-subheadline body-text text-[var(--text-secondary)] max-w-[44vw] mx-auto mt-6">
            Track your spending at local Old Pueblo businesses and watch your community impact grow.
          </p>
          
          <button 
            onClick={() => scrollToSection('join')}
            className="hero-cta cta-button mt-10"
          >
            Request early access
          </button>
        </div>
        
        {/* Scroll hint */}
        <div className="hero-scroll-hint absolute bottom-[8vh] left-1/2 -translate-x-1/2 text-center">
          <span className="label-tag text-[var(--text-secondary)]">Scroll to explore</span>
          <div className="w-px h-8 bg-[var(--text-secondary)] mx-auto mt-3 opacity-50" />
        </div>
      </section>
      
      {/* Section 2: Problem */}
      <section ref={problemRef} id="problem" className="section-pinned z-20">
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--charcoal)]/80 to-[var(--charcoal)]/90" />
        </div>
        
        {/* Cards */}
        <div className="relative z-10 w-full px-[6vw] flex flex-col md:flex-row gap-6 items-center justify-center">
          {/* Left card - Local */}
          <div className="problem-card-left paper-card w-full md:w-[42vw] h-auto md:h-[64vh] p-8 md:p-10 flex flex-col justify-between">
            <div>
              <span className="problem-card-content label-tag text-[var(--text-dark-secondary)]">Local</span>
              <h2 className="problem-card-content headline-1 text-[var(--text-dark)] mt-4">~68¢</h2>
              <p className="problem-card-content headline-3 text-[var(--text-dark)] mt-2">stays in Tucson</p>
            </div>
            <p className="problem-card-content body-text text-[var(--text-dark-secondary)] max-w-[80%]">
              Shop at Time Market, Exo Roast, or Antigone Books—wages, supplies, and taxes recirculate locally.
            </p>
            <div className="problem-card-content circular-icon mt-6 self-end">
              <RefreshCw size={24} className="text-[var(--charcoal)]" />
            </div>
          </div>
          
          {/* Right card - Outside */}
          <div className="problem-card-right paper-card w-full md:w-[42vw] h-auto md:h-[64vh] p-8 md:p-10 flex flex-col justify-between">
            <div>
              <span className="problem-card-content label-tag text-[var(--text-dark-secondary)]">Outside</span>
              <h2 className="problem-card-content headline-1 text-[var(--text-dark)] mt-4">~32¢</h2>
              <p className="problem-card-content headline-3 text-[var(--text-dark)] mt-2">leaks to outside chains</p>
            </div>
            <p className="problem-card-content body-text text-[var(--text-dark-secondary)] max-w-[80%]">
              Big-box spending leaves Tucson through distant corporate supply chains.
            </p>
            <div className="problem-card-content circular-icon mt-6 self-end opacity-50">
              <ExternalLink size={24} className="text-[var(--charcoal)]" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Section 3: Solution */}
      <section ref={solutionRef} id="solution" className="section-pinned z-30">
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--charcoal)]/85 to-[var(--charcoal)]/95" />
          <div className="spotlight-vignette" />
        </div>
        
        {/* Card */}
        <div className="solution-card paper-card w-[84vw] md:w-[74vw] h-auto md:h-[62vh] p-8 md:p-12 flex flex-col justify-between relative z-10">
          <div>
            <span className="label-tag text-[var(--text-dark-secondary)]">Multiplier Effect</span>
            <h2 className="solution-headline headline-2 text-[var(--text-dark)] mt-6">
              Your dollars work harder in Tucson.
            </h2>
            <p className="solution-subheadline body-text text-[var(--text-dark-secondary)] max-w-[80%] mt-4">
              Money spent on 4th Avenue, Congress Street, and Main Gate recirculates 2–3x through local wages and taxes.
            </p>
          </div>
          <div className="circular-icon mt-8 self-end">
            <TrendingUp size={24} className="text-[var(--charcoal)]" />
          </div>
        </div>
      </section>
      
      {/* Section 4: Feature */}
      <section ref={featureRef} id="feature" className="section-pinned z-40">
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="" 
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--charcoal)]/90 to-[var(--charcoal)]/95" />
        </div>
        
        {/* Card */}
        <div className="feature-card paper-card w-[84vw] md:w-[74vw] h-auto md:h-[62vh] p-8 md:p-12 flex flex-col justify-between relative z-10">
          <div>
            <span className="label-tag text-[var(--text-dark-secondary)]">Dashboard</span>
            <h2 className="feature-headline headline-2 text-[var(--text-dark)] mt-6">
              Track. Categorize. Improve.
            </h2>
            <p className="feature-body body-text text-[var(--text-dark-secondary)] max-w-[80%] mt-4">
              Connect accounts securely. Tag purchases as Tucson Local / Chain / Unknown. Set a monthly target—and watch your Old Pueblo impact grow.
            </p>
          </div>
          <div className="circular-icon mt-8 self-end">
            <ListChecks size={24} className="text-[var(--charcoal)]" />
          </div>
        </div>
      </section>
      
      {/* Section 5: Collective */}
      <section ref={collectiveRef} id="collective" className="section-pinned z-50">
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--charcoal)]/90 to-[var(--charcoal)]/95" />
        </div>
        
        {/* Cards */}
        <div className="relative z-10 w-full px-[6vw] flex flex-col md:flex-row gap-6 items-center justify-center">
          {/* Left card */}
          <div className="collective-card-left paper-card w-full md:w-[42vw] h-auto md:h-[64vh] p-8 md:p-10 flex flex-col justify-between">
            <div>
              <span className="label-tag text-[var(--text-dark-secondary)]">Collective Goal</span>
              <h2 className="headline-2 text-[var(--text-dark)] mt-4">
                Old Pueblo goals.
              </h2>
              <p className="body-text text-[var(--text-dark-secondary)] max-w-[90%] mt-4">
                When 50 Tucsonans shift just $50 to local businesses, we can fund a mural in Barrio Viejo or support Tucson Meet Yourself.
              </p>
            </div>
            <div className="circular-icon mt-6 self-end">
              <Users size={24} className="text-[var(--charcoal)]" />
            </div>
          </div>
          
          {/* Right card */}
          <div className="collective-card-right paper-card w-full md:w-[42vw] h-auto md:h-[64vh] p-8 md:p-10 flex flex-col justify-between">
            <div>
              <span className="label-tag text-[var(--text-dark-secondary)]">This Quarter</span>
              <h2 className="headline-1 text-[var(--text-dark)] mt-4">$48,200</h2>
              <p className="headline-3 text-[var(--text-dark)] mt-2">shifted to Tucson businesses</p>
              
              {/* Progress bar */}
              <div className="mt-6">
                <div className="progress-bar w-full">
                  <div 
                    className="progress-bar-fill collective-progress" 
                    style={{ width: '72%', transformOrigin: 'left' }}
                  />
                </div>
                <p className="label-tag text-[var(--text-dark-secondary)] mt-3">72% toward our next Tucson project</p>
              </div>
            </div>
            <div className="circular-icon mt-6 self-end">
              <Target size={24} className="text-[var(--charcoal)]" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Section 6: Story */}
      <section ref={storyRef} id="story" className="section-pinned z-[60]">
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="" 
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--charcoal)]/95 to-[var(--charcoal)]" />
        </div>
        
        {/* Card */}
        <div className="story-card paper-card w-[84vw] md:w-[74vw] h-auto md:h-[62vh] p-8 md:p-12 flex flex-col justify-between relative z-10">
          <div>
            <span className="story-content label-tag text-[var(--text-dark-secondary)]">Impact Narrative</span>
            <h2 className="story-content headline-2 text-[var(--text-dark)] mt-6">
              Your Tucson impact story.
            </h2>
            <p className="story-content body-text text-[var(--text-dark-secondary)] max-w-[80%] mt-4">
              Get a clear monthly story: how many hours of Tucson wages your spending supported—and what that means for your neighborhood.
            </p>
          </div>
          <div className="story-content circular-icon mt-8 self-end">
            <FileText size={24} className="text-[var(--charcoal)]" />
          </div>
        </div>
      </section>
      
      {/* Section 7: Join */}
      <section ref={joinRef} id="join" className="relative z-[70] bg-[var(--paper)] min-h-screen py-20">
        {/* Grain overlay for paper section */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }}
        />
        
        <div className="relative z-10 px-[6vw]">
          {/* Main content */}
          <div className="flex flex-col md:flex-row gap-12 items-start justify-between min-h-[70vh]">
            {/* Left - Headline */}
            <div className="join-headline w-full md:max-w-[40vw] pt-[10vh]">
              <h2 className="headline-1 text-[var(--text-dark)]">
                Be part of the ledger.
              </h2>
              <p className="body-text text-[var(--text-dark-secondary)] mt-6">
                Early access + community updates. No spam.
              </p>
            </div>
            
            {/* Right - Form */}
            <div className="join-form-card dark-card w-full md:w-[38vw] p-8 md:p-10">
              {!formSubmitted ? (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div>
                    <label className="label-tag text-[var(--text-secondary)] mb-2 block">Name</label>
                    <input 
                      type="text" 
                      placeholder="Your name"
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="label-tag text-[var(--text-secondary)] mb-2 block">Email</label>
                    <input 
                      type="email" 
                      placeholder="you@example.com"
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="label-tag text-[var(--text-secondary)] mb-2 block">Neighborhood</label>
                    <input 
                      type="text" 
                      placeholder="Sam Hughes, Armory Park, Iron Horse..."
                      className="form-input"
                      required
                    />
                  </div>
                  <button type="submit" className="cta-button-paper w-full justify-center mt-4">
                    Join the list
                  </button>
                  <p className="text-xs text-[var(--text-secondary)] text-center mt-4">
                    By joining, you agree to receive updates about Tucson Impact Ledger.
                  </p>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="circular-icon mx-auto mb-6">
                    <Award size={32} className="text-[var(--lime)]" />
                  </div>
                  <h3 className="headline-3 text-[var(--paper)]">You&apos;re on the list!</h3>
                  <p className="body-text text-[var(--text-secondary)] mt-4">
                    We&apos;ll be in touch with early access details soon.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* How it works */}
          <div className="how-it-works-section mt-24 pt-16 border-t border-[var(--charcoal)]/10">
            <h3 className="label-tag text-[var(--text-dark-secondary)] mb-10 text-center">How it works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="how-it-works-card text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--charcoal)]/5 flex items-center justify-center mx-auto mb-6">
                  <Wallet size={28} className="text-[var(--charcoal)]" />
                </div>
                <h4 className="font-display font-bold text-lg text-[var(--text-dark)]">
                  Connect accounts securely.
                </h4>
                <p className="body-text text-[var(--text-dark-secondary)] mt-3 max-w-[80%] mx-auto">
                  Link your bank accounts with bank-level encryption and security.
                </p>
              </div>
              
              <div className="how-it-works-card text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--charcoal)]/5 flex items-center justify-center mx-auto mb-6">
                  <Tag size={28} className="text-[var(--charcoal)]" />
                </div>
                <h4 className="font-display font-bold text-lg text-[var(--text-dark)]">
                  Tag spending in seconds.
                </h4>
                <p className="body-text text-[var(--text-dark-secondary)] mt-3 max-w-[80%] mx-auto">
                  Categorize purchases as Local, Chain, or Unknown with one tap.
                </p>
              </div>
              
              <div className="how-it-works-card text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--charcoal)]/5 flex items-center justify-center mx-auto mb-6">
                  <Award size={28} className="text-[var(--charcoal)]" />
                </div>
                <h4 className="font-display font-bold text-lg text-[var(--text-dark)]">
                  See Tucson wins.
                </h4>
                <p className="body-text text-[var(--text-dark-secondary)] mt-3 max-w-[80%] mx-auto">
                  Watch Tucson&apos;s collective impact grow and celebrate community milestones.
                </p>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <footer className="mt-24 pt-8 border-t border-[var(--charcoal)]/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="font-display font-bold text-lg text-[var(--text-dark)]">
              Tucson Impact Ledger
            </div>
            <div className="flex items-center gap-6">
              <button className="text-sm text-[var(--text-dark-secondary)] hover:text-[var(--text-dark)] transition-colors">
                Privacy
              </button>
              <button className="text-sm text-[var(--text-dark-secondary)] hover:text-[var(--text-dark)] transition-colors">
                Terms
              </button>
              <button className="text-sm text-[var(--text-dark-secondary)] hover:text-[var(--text-dark)] transition-colors">
                Contact
              </button>
            </div>
            <p className="text-sm text-[var(--text-dark-secondary)]">
              © Tucson Impact Ledger · Made with ❤️ in the Old Pueblo
            </p>
          </footer>
        </div>
      </section>
    </div>
  );
}

export default App;
