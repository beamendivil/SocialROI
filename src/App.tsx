import { useEffect, useRef, useLayoutEffect, useState } from 'react';
import { 
  RefreshCw, 
  ExternalLink, 
  TrendingUp, 
  Users, 
  Target, 
  FileText,
  Menu,
  X,
  Wallet,
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
  
  // Scroll-driven animations - simplified for natural flow
  useLayoutEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    
    if (!gsap || !ScrollTrigger) return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Hero parallax (subtle, no pin)
      gsap.to('.hero-bg', {
        yPercent: 30,
        scale: 1.1,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
      
      gsap.to('.hero-headline-group', {
        y: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '60% top',
          scrub: true,
        }
      });
      
      // Simple fade-in animations for all sections
      const fadeInElements = [
        '.problem-card-left',
        '.problem-card-right', 
        '.solution-card',
        '.feature-card',
        '.collective-card-left',
        '.collective-card-right',
        '.story-card',
        '.join-form-card',
        '.how-it-works-card'
      ];
      
      fadeInElements.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) {
          gsap.fromTo(el,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
      });
      
      // Stagger business cards
      gsap.fromTo('.business-card',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#directory',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );
      
      // Stagger grassroots org cards
      gsap.fromTo('#community-roots .paper-card',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#community-roots',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );
      
      // Join section elements
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
          Tucson Local
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection('directory')} className="text-[var(--text-secondary)] hover:text-[var(--paper)] transition-colors text-sm font-medium">
            Directory
          </button>
          <button onClick={() => scrollToSection('community-roots')} className="text-[var(--text-secondary)] hover:text-[var(--paper)] transition-colors text-sm font-medium">
            Community Roots
          </button>
          <button onClick={() => scrollToSection('stories')} className="text-[var(--text-secondary)] hover:text-[var(--paper)] transition-colors text-sm font-medium">
            Impact Stories
          </button>
          <button onClick={() => scrollToSection('why-local')} className="text-[var(--text-secondary)] hover:text-[var(--paper)] transition-colors text-sm font-medium">
            Why Local?
          </button>
          <button onClick={() => scrollToSection('nominate')} className="text-[var(--text-secondary)] hover:text-[var(--paper)] transition-colors text-sm font-medium">
            Nominate
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
          <button onClick={() => scrollToSection('directory')} className="text-[var(--paper)] text-2xl font-display font-bold">
            Directory
          </button>
          <button onClick={() => scrollToSection('community-roots')} className="text-[var(--paper)] text-2xl font-display font-bold">
            Community Roots
          </button>
          <button onClick={() => scrollToSection('stories')} className="text-[var(--paper)] text-2xl font-display font-bold">
            Impact Stories
          </button>
          <button onClick={() => scrollToSection('why-local')} className="text-[var(--paper)] text-2xl font-display font-bold">
            Why Local?
          </button>
          <button onClick={() => scrollToSection('nominate')} className="text-[var(--paper)] text-2xl font-display font-bold">
            Nominate
          </button>
          <button 
            onClick={() => scrollToSection('nominate')} 
            className="cta-button-paper mt-8"
          >
            Request early access
          </button>
        </div>
      )}
      
      {/* Section 1: Hero */}
      <section ref={heroRef} className="section-hero z-10">
        {/* Background image */}
        <div className="hero-bg absolute inset-0">
          <img 
            src={heroImage} 
            alt="Tucson landscape" 
            className="w-full h-full object-cover"
          />
          <div className="dark-scrim" />
          <div className="spotlight-vignette" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-6">
          <div className="hero-headline-group">
            <h1 className="headline-1 text-[var(--paper)] max-w-[68vw] mx-auto">
              <span className="hero-headline-1 block">Your spending</span>
              <span className="hero-headline-2 block">is your vote.</span>
            </h1>
          </div>
          
          <p className="hero-subheadline body-text text-[var(--text-secondary)] max-w-[48vw] mx-auto mt-6">
            Find local Tucson businesses investing back into our community. Conscious commerce starts here.
          </p>
          
          <button 
            onClick={() => scrollToSection('directory')}
            className="hero-cta cta-button mt-10"
          >
            Explore the Directory
          </button>
        </div>
        
        {/* Scroll hint */}
        <div className="hero-scroll-hint absolute bottom-[8vh] left-1/2 -translate-x-1/2 text-center">
          <span className="label-tag text-[var(--text-secondary)]">Discover local</span>
          <div className="w-px h-8 bg-[var(--text-secondary)] mx-auto mt-3 opacity-50" />
        </div>
      </section>
      
      {/* Section 2: Why Local */}
      <section ref={problemRef} id="why-local" className="section-flow z-20 bg-[var(--charcoal)]">
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
              <span className="problem-card-content label-tag text-[var(--text-dark-secondary)]">Local Impact</span>
              <h2 className="problem-card-content headline-1 text-[var(--text-dark)] mt-4">~68¢</h2>
              <p className="problem-card-content headline-3 text-[var(--text-dark)] mt-2">stays in Tucson</p>
            </div>
            <p className="problem-card-content body-text text-[var(--text-dark-secondary)] max-w-[80%]">
              Shop at Time Market, Exo Roast, or Antigone Books—wages, supplies, and taxes recirculate locally.
            </p>
            <div className="problem-card-content circular-icon mt-6 self-end">
              <RefreshCw size={24} className="text-[var(--forest)]" />
            </div>
          </div>
          
          {/* Right card - Outside */}
          <div className="problem-card-right paper-card w-full md:w-[42vw] h-auto md:h-[64vh] p-8 md:p-10 flex flex-col justify-between">
            <div>
              <span className="problem-card-content label-tag text-[var(--text-dark-secondary)]">Chain Leakage</span>
              <h2 className="problem-card-content headline-1 text-[var(--text-dark)] mt-4">~32¢</h2>
              <p className="problem-card-content headline-3 text-[var(--text-dark)] mt-2">exits the community</p>
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
      
      {/* Section 3: Our Standards */}
      <section ref={solutionRef} id="standards" className="section-flow z-30 bg-[var(--charcoal)]">
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
        <div className="solution-card paper-card w-[84vw] md:w-[74vw] h-auto md:h-auto p-8 md:p-12 flex flex-col justify-between relative z-10">
          <div>
            <span className="label-tag text-[var(--text-dark-secondary)]">Our Standards</span>
            <h2 className="solution-headline headline-2 text-[var(--text-dark)] mt-6">
              How we vet businesses.
            </h2>
            <p className="solution-subheadline body-text text-[var(--text-dark-secondary)] max-w-[80%] mt-4">
              Every business in our directory is evaluated on values that matter to the community.
            </p>
            
            {/* Standards grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="p-4 bg-[var(--forest)]/10 rounded-xl text-center">
                <div className="text-2xl mb-2">💰</div>
                <p className="text-sm font-medium text-[var(--text-dark)]">Living Wage Employer</p>
              </div>
              <div className="p-4 bg-[var(--forest)]/10 rounded-xl text-center">
                <div className="text-2xl mb-2">🌱</div>
                <p className="text-sm font-medium text-[var(--text-dark)]">Sustainable Sourcing</p>
              </div>
              <div className="p-4 bg-[var(--forest)]/10 rounded-xl text-center">
                <div className="text-2xl mb-2">🤝</div>
                <p className="text-sm font-medium text-[var(--text-dark)]">Community Reinvestment</p>
              </div>
              <div className="p-4 bg-[var(--forest)]/10 rounded-xl text-center">
                <div className="text-2xl mb-2">🏳️‍🌈</div>
                <p className="text-sm font-medium text-[var(--text-dark)]">Inclusive Ownership</p>
              </div>
            </div>
          </div>
          <div className="circular-icon mt-8 self-end">
            <TrendingUp size={24} className="text-[var(--forest)]" />
          </div>
        </div>
      </section>
      
      {/* Section 4: Directory */}
      <section ref={featureRef} id="directory" className="section-flow z-40 bg-[var(--charcoal)] py-20">
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
        <div className="feature-card paper-card w-[88vw] md:w-[80vw] h-auto p-8 md:p-12 flex flex-col relative z-10">
          <div>
            <span className="label-tag text-[var(--text-dark-secondary)]">The Directory</span>
            <h2 className="feature-headline headline-2 text-[var(--text-dark)] mt-6">
              Find by values, not just category.
            </h2>
            
            {/* Value Filter Tags */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button className="value-tag active">All Businesses</button>
              <button className="value-tag">Living Wage</button>
              <button className="value-tag">Eco-Friendly</button>
              <button className="value-tag">Woman-Owned</button>
              <button className="value-tag">BIPOC-Owned</button>
              <button className="value-tag">LGBTQ+-Owned</button>
            </div>
            
            {/* Business Cards - Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="business-card">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-display font-bold text-lg text-[var(--text-dark)]">Time Market</h4>
                    <p className="text-sm text-[var(--text-dark-secondary)]">Cafe & Grocery · University</p>
                  </div>
                  <span className="impact-badge">🌱 Eco</span>
                </div>
                <p className="text-sm text-[var(--text-dark-secondary)] mt-3">
                  Sources 70% of produce from Arizona farms. Donated 500+ meals to Community Food Bank this year. All staff earn $18+/hour.
                </p>
                <div className="mt-4 pt-3 border-t border-[var(--charcoal)]/10">
                  <p className="text-xs text-[var(--forest)] font-medium">🔄 Your $10 here = $6.80 staying in Tucson</p>
                </div>
              </div>
              
              <div className="business-card">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-display font-bold text-lg text-[var(--text-dark)]">Antigone Books</h4>
                    <p className="text-sm text-[var(--text-dark-secondary)]">Bookstore · 4th Avenue</p>
                  </div>
                  <span className="impact-badge">👩 Woman</span>
                </div>
                <p className="text-sm text-[var(--text-dark-secondary)] mt-3">
                  Woman-owned since 1973. Hosts 50+ free community events annually. Partners with Literacy Connects for youth reading programs.
                </p>
                <div className="mt-4 pt-3 border-t border-[var(--charcoal)]/10">
                  <p className="text-xs text-[var(--forest)] font-medium">📚 Funded 200 books for TUSD classrooms</p>
                </div>
              </div>
              
              <div className="business-card">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-display font-bold text-lg text-[var(--text-dark)]">Exo Roast Co.</h4>
                    <p className="text-sm text-[var(--text-dark-secondary)]">Coffee · Downtown</p>
                  </div>
                  <span className="impact-badge">💰 Living Wage</span>
                </div>
                <p className="text-sm text-[var(--text-dark-secondary)] mt-3">
                  Fair-trade beans, $20/hour minimum wage. 2% of every sale funds Tucson Pima Arts Council grants for local artists.
                </p>
                <div className="mt-4 pt-3 border-t border-[var(--charcoal)]/10">
                  <p className="text-xs text-[var(--forest)] font-medium">🎨 $12,000 to local artists this year</p>
                </div>
              </div>
            </div>
            
            {/* Business Cards - Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="business-card">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-display font-bold text-lg text-[var(--text-dark)]">Barrio Bread</h4>
                    <p className="text-sm text-[var(--text-dark-secondary)]">Bakery · Barrio Viejo</p>
                  </div>
                  <span className="impact-badge">🌾 Local Source</span>
                </div>
                <p className="text-sm text-[var(--text-dark-secondary)] mt-3">
                  Heritage grains from Arizona farms. Trains formerly incarcerated individuals through baking apprenticeship program.
                </p>
                <div className="mt-4 pt-3 border-t border-[var(--charcoal)]/10">
                  <p className="text-xs text-[var(--forest)] font-medium">👥 15 apprentices employed this year</p>
                </div>
              </div>
              
              <div className="business-card">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-display font-bold text-lg text-[var(--text-dark)]">Native Seeds/SEARCH</h4>
                    <p className="text-sm text-[var(--text-dark-secondary)]">Seeds & Garden · Campbell</p>
                  </div>
                  <span className="impact-badge">🏜️ Indigenous</span>
                </div>
                <p className="text-sm text-[var(--text-dark-secondary)] mt-3">
                  Preserves 2,000+ heritage seed varieties. Free seeds to Native American communities. Youth garden education programs.
                </p>
                <div className="mt-4 pt-3 border-t border-[var(--charcoal)]/10">
                  <p className="text-xs text-[var(--forest)] font-medium">🌱 50,000 free seed packets distributed</p>
                </div>
              </div>
              
              <div className="business-card">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-display font-bold text-lg text-[var(--text-dark)]">Hotel Congress</h4>
                    <p className="text-sm text-[var(--text-dark-secondary)]">Venue & Hotel · Downtown</p>
                  </div>
                  <span className="impact-badge">🎵 Arts</span>
                </div>
                <p className="text-sm text-[var(--text-dark-secondary)] mt-3">
                  Hosts 300+ live music events yearly featuring Arizona artists. Pays performers 80% of door vs industry standard 50%.
                </p>
                <div className="mt-4 pt-3 border-t border-[var(--charcoal)]/10">
                  <p className="text-xs text-[var(--forest)] font-medium">🎤 $180,000 paid to local musicians</p>
                </div>
              </div>
            </div>
            
            {/* Business Cards - Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="business-card">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-display font-bold text-lg text-[var(--text-dark)]">Flores Concepts</h4>
                    <p className="text-sm text-[var(--text-dark-secondary)]">Restaurants · Multiple</p>
                  </div>
                  <span className="impact-badge">🌮 BIPOC</span>
                </div>
                <p className="text-sm text-[var(--text-dark-secondary)] mt-3">
                  Mexican-American owned. Employs 200+ locals at living wages. Sponsors youth culinary scholarships at Pima Community College.
                </p>
                <div className="mt-4 pt-3 border-t border-[var(--charcoal)]/10">
                  <p className="text-xs text-[var(--forest)] font-medium">🎓 12 culinary scholarships funded</p>
                </div>
              </div>
              
              <div className="business-card">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-display font-bold text-lg text-[var(--text-dark)]">Tucson Hop Shop</h4>
                    <p className="text-sm text-[var(--text-dark-secondary)]">Craft Beer · 4th Avenue</p>
                  </div>
                  <span className="impact-badge">🏳️‍🌈 LGBTQ+</span>
                </div>
                <p className="text-sm text-[var(--text-dark-secondary)] mt-3">
                  LGBTQ+ owned safe space. 100% Arizona craft beers. Monthly fundraisers for Southern Arizona AIDS Foundation.
                </p>
                <div className="mt-4 pt-3 border-t border-[var(--charcoal)]/10">
                  <p className="text-xs text-[var(--forest)] font-medium">❤️ $8,500 raised for SAAF</p>
                </div>
              </div>
              
              <div className="business-card">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-display font-bold text-lg text-[var(--text-dark)]">Iskashitaa Refugee Network</h4>
                    <p className="text-sm text-[var(--text-dark-secondary)]">Food Rescue · Citywide</p>
                  </div>
                  <span className="impact-badge">🤝 Nonprofit</span>
                </div>
                <p className="text-sm text-[var(--text-dark-secondary)] mt-3">
                  Refugee-led food rescue. Harvests 100,000+ lbs of fruit annually from Tucson yards. Sells preserves to fund job training.
                </p>
                <div className="mt-4 pt-3 border-t border-[var(--charcoal)]/10">
                  <p className="text-xs text-[var(--forest)] font-medium">🍊 80 refugee families employed</p>
                </div>
              </div>
            </div>
          </div>
          <button className="cta-button-paper mt-8 self-start">
            View Full Directory →
          </button>
        </div>
      </section>

      {/* Section: Community Roots - Grassroots Organizations */}
      <section id="community-roots" className="section-flow z-50 bg-[var(--sage)]/20 py-20">
        <div className="w-full px-[6vw]">
          <div className="text-center mb-12">
            <span className="label-tag text-[var(--forest)]">Beyond Commerce</span>
            <h2 className="headline-1 text-[var(--text-dark)] mt-4">
              Community Roots
            </h2>
            <p className="body-text text-[var(--text-dark-secondary)] max-w-2xl mx-auto mt-4">
              These grassroots organizations are the backbone of Tucson's mutual aid network. 
              They don't sell products—they build power, share resources, and take care of each other.
            </p>
          </div>

          {/* Ways to Support */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <span className="px-4 py-2 bg-[var(--forest)] text-white rounded-full text-sm font-medium">
              🤝 Volunteer
            </span>
            <span className="px-4 py-2 bg-[var(--terracotta)] text-white rounded-full text-sm font-medium">
              💚 Donate
            </span>
            <span className="px-4 py-2 bg-[var(--ochre)] text-[var(--charcoal)] rounded-full text-sm font-medium">
              📢 Amplify
            </span>
          </div>

          {/* Grassroots Orgs Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* ALMA */}
            <div className="paper-card p-6 border-l-4 border-[var(--forest)]">
              <h3 className="font-serif text-xl text-[var(--text-dark)]">ALMA</h3>
              <p className="text-sm text-[var(--forest)] font-medium mb-2">Amphi Liberation Mutual Aid</p>
              <p className="text-sm text-[var(--text-dark-secondary)] mt-2">
                Community-led mutual aid collective providing direct support to Tucsonans in need. Redistributes resources, organizes community fridges, and builds solidarity networks.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-[var(--sage)]/30 rounded">Mutual Aid</span>
                <span className="text-xs px-2 py-1 bg-[var(--sage)]/30 rounded">Food Access</span>
              </div>
            </div>

            {/* Flowers & Bullets */}
            <div className="paper-card p-6 border-l-4 border-[var(--terracotta)]">
              <h3 className="font-serif text-xl text-[var(--text-dark)]">Flowers & Bullets</h3>
              <p className="text-sm text-[var(--terracotta)] font-medium mb-2">Community Collective</p>
              <p className="text-sm text-[var(--text-dark-secondary)] mt-2">
                Radical community space offering free programming, political education, and mutual aid. A hub for organizers building a more just Tucson.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-[var(--sage)]/30 rounded">Political Ed</span>
                <span className="text-xs px-2 py-1 bg-[var(--sage)]/30 rounded">Community Space</span>
              </div>
            </div>

            {/* Tucson Food Share */}
            <div className="paper-card p-6 border-l-4 border-[var(--ochre)]">
              <h3 className="font-serif text-xl text-[var(--text-dark)]">Tucson Food Share</h3>
              <p className="text-sm text-[var(--ochre)] font-medium mb-2">Food Solidarity Network</p>
              <p className="text-sm text-[var(--text-dark-secondary)] mt-2">
                Volunteer-run food rescue and redistribution. Redirects surplus from local farms and grocers to families facing food insecurity.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-[var(--sage)]/30 rounded">Food Rescue</span>
                <span className="text-xs px-2 py-1 bg-[var(--sage)]/30 rounded">Zero Waste</span>
              </div>
            </div>

            {/* BICAS */}
            <div className="paper-card p-6 border-l-4 border-[var(--forest)]">
              <h3 className="font-serif text-xl text-[var(--text-dark)]">BICAS</h3>
              <p className="text-sm text-[var(--forest)] font-medium mb-2">Bicycle Inter-Community Art & Salvage</p>
              <p className="text-sm text-[var(--text-dark-secondary)] mt-2">
                DIY bike shop teaching repair skills to anyone. Provides affordable transportation and builds self-reliance through hands-on learning.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-[var(--sage)]/30 rounded">DIY Skills</span>
                <span className="text-xs px-2 py-1 bg-[var(--sage)]/30 rounded">Transportation</span>
              </div>
            </div>

            {/* Casa Alitas */}
            <div className="paper-card p-6 border-l-4 border-[var(--terracotta)]">
              <h3 className="font-serif text-xl text-[var(--text-dark)]">Casa Alitas</h3>
              <p className="text-sm text-[var(--terracotta)] font-medium mb-2">Migrant Welcome Center</p>
              <p className="text-sm text-[var(--text-dark-secondary)] mt-2">
                Emergency shelter and humanitarian aid for asylum-seeking families. Provides food, clothing, medical care, and travel assistance.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-[var(--sage)]/30 rounded">Immigrant Rights</span>
                <span className="text-xs px-2 py-1 bg-[var(--sage)]/30 rounded">Shelter</span>
              </div>
            </div>

            {/* Primavera Foundation */}
            <div className="paper-card p-6 border-l-4 border-[var(--ochre)]">
              <h3 className="font-serif text-xl text-[var(--text-dark)]">Primavera Foundation</h3>
              <p className="text-sm text-[var(--ochre)] font-medium mb-2">Housing & Economic Justice</p>
              <p className="text-sm text-[var(--text-dark-secondary)] mt-2">
                Building pathways out of poverty through housing, workforce development, and financial empowerment. 50+ years serving Tucson.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-[var(--sage)]/30 rounded">Housing</span>
                <span className="text-xs px-2 py-1 bg-[var(--sage)]/30 rounded">Job Training</span>
              </div>
            </div>

            {/* Community Roots Collective */}
            <div className="paper-card p-6 border-l-4 border-[var(--forest)]">
              <h3 className="font-serif text-xl text-[var(--text-dark)]">Community Roots Collective</h3>
              <p className="text-sm text-[var(--forest)] font-medium mb-2">Food Sovereignty</p>
              <p className="text-sm text-[var(--text-dark-secondary)] mt-2">
                Community garden network growing food sovereignty in Tucson neighborhoods. Free seeds, workshops, and garden plots for all.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-[var(--sage)]/30 rounded">Urban Farming</span>
                <span className="text-xs px-2 py-1 bg-[var(--sage)]/30 rounded">Food Justice</span>
              </div>
            </div>

            {/* Southern Arizona Gender Alliance */}
            <div className="paper-card p-6 border-l-4 border-[var(--terracotta)]">
              <h3 className="font-serif text-xl text-[var(--text-dark)]">Southern AZ Gender Alliance</h3>
              <p className="text-sm text-[var(--terracotta)] font-medium mb-2">SAGA</p>
              <p className="text-sm text-[var(--text-dark-secondary)] mt-2">
                Support, advocacy, and community for transgender and gender-diverse Tucsonans. Peer support groups, name change clinics, and mutual aid.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-[var(--sage)]/30 rounded">LGBTQ+</span>
                <span className="text-xs px-2 py-1 bg-[var(--sage)]/30 rounded">Peer Support</span>
              </div>
            </div>

            {/* Poder in Action */}
            <div className="paper-card p-6 border-l-4 border-[var(--ochre)]">
              <h3 className="font-serif text-xl text-[var(--text-dark)]">Poder in Action</h3>
              <p className="text-sm text-[var(--ochre)] font-medium mb-2">Community Power Building</p>
              <p className="text-sm text-[var(--text-dark-secondary)] mt-2">
                Youth-led movement for racial and economic justice. Campaigns against police violence, for housing rights, and immigrant dignity.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-[var(--sage)]/30 rounded">Racial Justice</span>
                <span className="text-xs px-2 py-1 bg-[var(--sage)]/30 rounded">Youth Led</span>
              </div>
            </div>

          </div>

          <div className="text-center mt-10">
            <p className="text-sm text-[var(--text-dark-secondary)] max-w-lg mx-auto">
              These orgs run on community power—not profit. 
              <span className="text-[var(--forest)] font-medium"> Follow them, show up, share what you can.</span>
            </p>
          </div>
        </div>
      </section>
      
      {/* Section 5: Impact Stories */}
      <section ref={collectiveRef} id="stories" className="section-flow z-50 bg-[var(--charcoal)] py-20">
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
          {/* Left card - Meet the Maker */}
          <div className="collective-card-left paper-card w-full md:w-[42vw] h-auto md:h-auto p-8 md:p-10 flex flex-col justify-between">
            <div>
              <span className="label-tag text-[var(--text-dark-secondary)]">Meet the Maker</span>
              <h2 className="headline-2 text-[var(--text-dark)] mt-4">
                Don Guerra, Barrio Bread
              </h2>
              <p className="body-text text-[var(--text-dark-secondary)] max-w-[90%] mt-4">
                "I started baking in my backyard because I believed Tucson deserved better bread. Now we employ 20 people from our neighborhood—many who faced barriers to employment. Every loaf we sell funds job training for someone rebuilding their life."
              </p>
              <div className="mt-6 p-4 bg-[var(--forest)]/10 rounded-xl">
                <p className="text-sm font-medium text-[var(--forest)]">Community Impact:</p>
                <ul className="text-sm text-[var(--text-dark-secondary)] mt-2 space-y-1">
                  <li>• 15 formerly incarcerated individuals trained</li>
                  <li>• 100% Arizona heritage grains</li>
                  <li>• $85,000 in local wages annually</li>
                </ul>
              </div>
              <p className="label-tag text-[var(--terracotta)] mt-6">— Don Guerra, Barrio Bread</p>
            </div>
            <div className="circular-icon mt-6 self-end">
              <Users size={24} className="text-[var(--forest)]" />
            </div>
          </div>
          
          {/* Right card - Community Impact */}
          <div className="collective-card-right paper-card w-full md:w-[42vw] h-auto md:h-auto p-8 md:p-10 flex flex-col justify-between">
            <div>
              <span className="label-tag text-[var(--text-dark-secondary)]">Collective Giving</span>
              <h2 className="headline-2 text-[var(--text-dark)] mt-4">What our directory businesses gave back in 2025:</h2>
              
              {/* Impact stats */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-[var(--terracotta)]/10 rounded-xl text-center">
                  <p className="headline-3 text-[var(--terracotta)]">$287K</p>
                  <p className="text-xs text-[var(--text-dark-secondary)] mt-1">Local wages above min</p>
                </div>
                <div className="p-4 bg-[var(--forest)]/10 rounded-xl text-center">
                  <p className="headline-3 text-[var(--forest)]">2,400</p>
                  <p className="text-xs text-[var(--text-dark-secondary)] mt-1">Meals donated</p>
                </div>
                <div className="p-4 bg-[var(--ochre)]/15 rounded-xl text-center">
                  <p className="headline-3 text-[var(--ochre)]">$45K</p>
                  <p className="text-xs text-[var(--text-dark-secondary)] mt-1">Arts & education grants</p>
                </div>
                <div className="p-4 bg-[var(--sage)]/20 rounded-xl text-center">
                  <p className="headline-3 text-[var(--forest)]">156</p>
                  <p className="text-xs text-[var(--text-dark-secondary)] mt-1">Jobs for neighbors</p>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-6">
                <div className="progress-bar w-full">
                  <div 
                    className="progress-bar-fill collective-progress" 
                    style={{ width: '72%', transformOrigin: 'left' }}
                  />
                </div>
                <p className="label-tag text-[var(--text-dark-secondary)] mt-3">72% toward funding a Barrio Viejo mural</p>
              </div>
            </div>
            <div className="circular-icon mt-6 self-end">
              <Target size={24} className="text-[var(--forest)]" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Section 6: Local Circularity */}
      <section ref={storyRef} id="circularity" className="section-flow z-[60] bg-[var(--charcoal)] py-20">
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
        <div className="story-card paper-card w-[84vw] md:w-[74vw] h-auto p-8 md:p-12 flex flex-col relative z-10">
          <div>
            <span className="story-content label-tag text-[var(--text-dark-secondary)]">Local Circularity</span>
            <h2 className="story-content headline-2 text-[var(--text-dark)] mt-6">
              See how your dollar moves.
            </h2>
            <p className="story-content body-text text-[var(--text-dark-secondary)] max-w-[80%] mt-4">
              When you shop local, your money creates a ripple effect through the community.
            </p>
            
            {/* Circularity visualization */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
              <div className="text-center p-4 bg-[var(--terracotta)]/10 rounded-xl flex-1">
                <p className="text-sm font-medium text-[var(--text-dark)]">Your $10 at</p>
                <p className="font-display font-bold text-[var(--terracotta)]">Time Market</p>
              </div>
              <div className="text-2xl">→</div>
              <div className="text-center p-4 bg-[var(--forest)]/10 rounded-xl flex-1">
                <p className="text-sm font-medium text-[var(--text-dark)]">Pays wages to</p>
                <p className="font-display font-bold text-[var(--forest)]">Local Staff</p>
              </div>
              <div className="text-2xl">→</div>
              <div className="text-center p-4 bg-[var(--ochre)]/20 rounded-xl flex-1">
                <p className="text-sm font-medium text-[var(--text-dark)]">Who spend at</p>
                <p className="font-display font-bold text-[var(--ochre)]">4th Ave Shops</p>
              </div>
              <div className="text-2xl">→</div>
              <div className="text-center p-4 bg-[var(--sage)]/20 rounded-xl flex-1">
                <p className="text-sm font-medium text-[var(--text-dark)]">Taxes fund</p>
                <p className="font-display font-bold text-[var(--forest)]">Reid Park</p>
              </div>
            </div>
          </div>
          <div className="story-content circular-icon mt-8 self-end">
            <FileText size={24} className="text-[var(--forest)]" />
          </div>
        </div>
      </section>
      
      {/* Section 7: Nominate */}
      <section ref={joinRef} id="nominate" className="relative z-[70] bg-[var(--paper)] min-h-screen py-20">
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
                Know a progressive business?
              </h2>
              <p className="body-text text-[var(--text-dark-secondary)] mt-6">
                Help us grow the directory. Nominate a Tucson business that's investing in our community through living wages, sustainable practices, or local reinvestment.
              </p>
              <div className="mt-8 p-6 bg-[var(--forest)]/10 rounded-xl">
                <p className="label-tag text-[var(--forest)] mb-2">What we look for</p>
                <ul className="space-y-2 text-sm text-[var(--text-dark-secondary)]">
                  <li>✓ Living wages for employees</li>
                  <li>✓ Local or sustainable sourcing</li>
                  <li>✓ Community reinvestment</li>
                  <li>✓ Inclusive ownership or practices</li>
                </ul>
              </div>
            </div>
            
            {/* Right - Form */}
            <div className="join-form-card dark-card w-full md:w-[38vw] p-8 md:p-10">
              {!formSubmitted ? (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div>
                    <label className="label-tag text-[var(--text-secondary)] mb-2 block">Business Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Time Market"
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="label-tag text-[var(--text-secondary)] mb-2 block">Location / Neighborhood</label>
                    <input 
                      type="text" 
                      placeholder="4th Ave, Downtown, Main Gate..."
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="label-tag text-[var(--text-secondary)] mb-2 block">What values apply?</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
                        <input type="checkbox" className="accent-[var(--terracotta)]" /> Living Wage
                      </label>
                      <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
                        <input type="checkbox" className="accent-[var(--terracotta)]" /> Local Sourcing
                      </label>
                      <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
                        <input type="checkbox" className="accent-[var(--terracotta)]" /> Eco-Friendly
                      </label>
                      <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
                        <input type="checkbox" className="accent-[var(--terracotta)]" /> Woman-Owned
                      </label>
                      <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
                        <input type="checkbox" className="accent-[var(--terracotta)]" /> BIPOC-Owned
                      </label>
                      <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
                        <input type="checkbox" className="accent-[var(--terracotta)]" /> LGBTQ+-Owned
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="label-tag text-[var(--text-secondary)] mb-2 block">How do they give back?</label>
                    <textarea 
                      placeholder="e.g., Donates meals to food bank, sponsors youth programs, pays above minimum wage..."
                      className="form-input min-h-[80px] resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="label-tag text-[var(--text-secondary)] mb-2 block">Your Email (optional)</label>
                    <input 
                      type="email" 
                      placeholder="you@example.com"
                      className="form-input"
                    />
                  </div>
                  <button type="submit" className="cta-button-paper w-full justify-center mt-4">
                    Submit Nomination
                  </button>
                  <p className="text-xs text-[var(--text-secondary)] text-center mt-4">
                    We'll verify community impact before adding to the directory.
                  </p>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="circular-icon mx-auto mb-6">
                    <Award size={32} className="text-[var(--terracotta)]" />
                  </div>
                  <h3 className="headline-3 text-[var(--paper)]">Thank you!</h3>
                  <p className="body-text text-[var(--text-secondary)] mt-4">
                    We&apos;ll review this nomination and reach out to the business.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* How Conscious Commerce Works */}
          <div className="how-it-works-section mt-24 pt-16 border-t border-[var(--charcoal)]/10">
            <h3 className="label-tag text-[var(--text-dark-secondary)] mb-10 text-center">How Conscious Commerce Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="how-it-works-card text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--terracotta)]/10 flex items-center justify-center mx-auto mb-6">
                  <Target size={28} className="text-[var(--terracotta)]" />
                </div>
                <h4 className="font-display font-bold text-lg text-[var(--text-dark)]">
                  Find by values.
                </h4>
                <p className="body-text text-[var(--text-dark-secondary)] mt-3 max-w-[80%] mx-auto">
                  Filter businesses by what matters: living wages, sustainability, inclusive ownership.
                </p>
              </div>
              
              <div className="how-it-works-card text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--forest)]/10 flex items-center justify-center mx-auto mb-6">
                  <Wallet size={28} className="text-[var(--forest)]" />
                </div>
                <h4 className="font-display font-bold text-lg text-[var(--text-dark)]">
                  Shift your spending.
                </h4>
                <p className="body-text text-[var(--text-dark-secondary)] mt-3 max-w-[80%] mx-auto">
                  Move just $50/month from chains to local businesses that share your values.
                </p>
              </div>
              
              <div className="how-it-works-card text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--ochre)]/15 flex items-center justify-center mx-auto mb-6">
                  <Award size={28} className="text-[var(--ochre)]" />
                </div>
                <h4 className="font-display font-bold text-lg text-[var(--text-dark)]">
                  Watch Tucson thrive.
                </h4>
                <p className="body-text text-[var(--text-dark-secondary)] mt-3 max-w-[80%] mx-auto">
                  See collective impact grow and celebrate community milestones together.
                </p>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <footer className="mt-24 pt-8 border-t border-[var(--charcoal)]/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="font-display font-bold text-lg text-[var(--text-dark)]">
              Tucson Local
            </div>
            <div className="flex items-center gap-6">
              <button onClick={() => scrollToSection('standards')} className="text-sm text-[var(--text-dark-secondary)] hover:text-[var(--text-dark)] transition-colors">
                Our Standards
              </button>
              <button className="text-sm text-[var(--text-dark-secondary)] hover:text-[var(--text-dark)] transition-colors">
                Privacy
              </button>
              <button className="text-sm text-[var(--text-dark-secondary)] hover:text-[var(--text-dark)] transition-colors">
                Contact
              </button>
            </div>
            <p className="text-sm text-[var(--text-dark-secondary)]">
              © Tucson Local · Made with ❤️ in the Old Pueblo
            </p>
          </footer>
        </div>
      </section>
    </div>
  );
}

export default App;
