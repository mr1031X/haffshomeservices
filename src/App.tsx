import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Star,
  ChevronRight,
  Check,
  Loader2,
  TreePine,
  Flower2,
  Sparkles,
  Trash2,
  Shield,
  Heart
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────
   DATA
   ────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];

const SERVICE_CARDS = [
  { img: '/images/service-lawn.jpg', title: 'Lawn \u0026 Yard Care', desc: 'Mowing, edging \u0026 maintenance' },
  { img: '/images/service-landscape.jpg', title: 'Landscaping', desc: 'Mulch, beds \u0026 trimming' },
  { img: '/images/service-garage.jpg', title: 'Garage Organization', desc: 'Storage \u0026 cleanout services' },
  { img: '/images/service-room.jpg', title: 'Room Organization', desc: 'Closets, attics \u0026 sheds' },
  { img: '/images/service-cleaning.jpg', title: 'Cleaning Services', desc: 'Deep \u0026 move-in/out cleans' },
  { img: '/images/service-debris.jpg', title: 'Debris Removal', desc: 'Brush, trees \u0026 hauling' },
];

const TRUSTED_SERVICES = [
  { icon: TreePine, title: 'Lawn \u0026 Yard Care', desc: 'Mowing, edging, brush clearing, and seasonal maintenance' },
  { icon: Flower2, title: 'Landscaping \u0026 Bed Care', desc: 'Mulch, rock beds, weeding, and bush trimming' },
  { icon: Sparkles, title: 'Cleaning \u0026 Organization', desc: 'Deep cleans, move-in/out, and room organization' },
  { icon: Trash2, title: 'Debris \u0026 Removal', desc: 'Brush hauling, small tree work, and material cleanup' },
];

const ACCORDION_DATA = [
  {
    category: 'Lawn \u0026 Yard Care',
    count: 5,
    items: ['Lawn Mowing', 'Edging \u0026 Trimming', 'Brush Clearing', 'Seasonal Cleanup', 'Fertilizing'],
  },
  {
    category: 'Landscaping \u0026 Bed Care',
    count: 4,
    items: ['Mulch Installation', 'Rock Bed Maintenance', 'Weeding', 'Bush \u0026 Shrub Trimming'],
  },
  {
    category: 'Tree \u0026 Debris Services',
    count: 4,
    items: ['Small Tree Cutting', 'Brush Hauling', 'Firewood Prep', 'Storm Cleanup'],
  },
  {
    category: 'Cleaning Services',
    count: 4,
    items: ['Deep Cleaning', 'Move-In/Move-Out Cleaning', 'Dryer Duct Cleaning', 'Regular Maintenance Cleaning'],
  },
  {
    category: 'Organization \u0026 Indoor',
    count: 4,
    items: ['Room Organization', 'Garage Organization', 'Attic Cleanout', 'Shed Organization'],
  },
  {
    category: 'Odd Jobs \u0026 Handyman',
    count: 4,
    items: ['Minor Carpentry', 'Furniture Moving', 'Heavy Lifting', 'General Repairs'],
  },
];

const REVIEWS = [
  { stars: 5, text: "Zack did an amazing job on our yard. Showed up right on time, worked hard all day, and the results look fantastic. Highly recommend!", name: "Sarah M.", service: "Lawn Care" },
  { stars: 5, text: "Professional, courteous, and fairly priced. Our garage has never looked better. Will definitely be calling again.", name: "Mike T.", service: "Organization" },
  { stars: 5, text: "Great communication from start to finish. The landscaping work exceeded our expectations. A+ service!", name: "Jennifer K.", service: "Landscaping" },
];

const CITIES = ['Otsego', 'Buffalo', 'Elk River', 'Eden Prairie', 'Plymouth', 'Minneapolis', 'Saint Michael', 'Rogers', 'Maple Grove', 'And Surrounding Areas'];

/* ──────────────────────────────────────────────
   AREA MAP CANVAS COMPONENT
   ────────────────────────────────────────────── */

function AreaMapCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const container = canvas.parentElement;
    if (!container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Seeded random for reproducibility
    let seed = 42;
    const seededRandom = () => {
      seed = (seed * 16807 + 0) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const locations = [
      { x: 0.35, y: 0.25, name: 'Otsego' },
      { x: 0.40, y: 0.35, name: 'Buffalo' },
      { x: 0.28, y: 0.20, name: 'Elk River' },
      { x: 0.50, y: 0.55, name: 'Eden Prairie' },
      { x: 0.42, y: 0.45, name: 'Plymouth' },
      { x: 0.55, y: 0.50, name: 'Minneapolis' },
      { x: 0.32, y: 0.28, name: 'St. Michael' },
      { x: 0.38, y: 0.30, name: 'Rogers' },
      { x: 0.45, y: 0.40, name: 'Maple Grove' },
    ];

    const terrainColors = ['#d4cbb8', '#c4d4a8', '#8faa74', '#5a7a3a', '#4a6a30'];

    const drawTerrain = (w: number, h: number) => {
      ctx.fillStyle = '#e8e5df';
      ctx.fillRect(0, 0, w, h);

      // Draw organic contour blobs
      for (let i = 0; i < 25; i++) {
        const cx = seededRandom() * w;
        const cy = seededRandom() * h;
        const r = 40 + seededRandom() * 120;
        const colorIdx = Math.floor(seededRandom() * terrainColors.length);

        ctx.beginPath();
        ctx.fillStyle = terrainColors[colorIdx];
        ctx.globalAlpha = 0.35 + seededRandom() * 0.3;

        for (let a = 0; a <= Math.PI * 2; a += 0.3) {
          const pr = r + (seededRandom() - 0.5) * 30;
          const px = cx + Math.cos(a) * pr;
          const py = cy + Math.sin(a) * pr;
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Draw roads
      const roadColors = ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.4)'];
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.strokeStyle = roadColors[i % 3];
        ctx.lineWidth = 2 + (i % 3) * 2;
        const startX = seededRandom() * w;
        const startY = seededRandom() * h;
        ctx.moveTo(startX, startY);
        for (let j = 0; j < 3; j++) {
          ctx.bezierCurveTo(
            startX + seededRandom() * 200 - 100,
            startY + seededRandom() * 200 - 100,
            startX + seededRandom() * 200 - 100,
            startY + seededRandom() * 200 - 100,
            startX + seededRandom() * 300 - 150,
            startY + seededRandom() * 300 - 150
          );
        }
        ctx.stroke();
      }

      // Water features
      ctx.fillStyle = '#7a9a8a';
      ctx.globalAlpha = 0.5;
      for (let i = 0; i < 3; i++) {
        const wx = 0.2 + seededRandom() * 0.6;
        const wy = 0.2 + seededRandom() * 0.6;
        ctx.beginPath();
        ctx.ellipse(wx * w, wy * h, 15 + seededRandom() * 25, 10 + seededRandom() * 15, seededRandom() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const drawMarkers = (w: number, h: number, time: number) => {
      locations.forEach((loc, i) => {
        const x = loc.x * w;
        const y = loc.y * h;

        // Ripple rings
        const ripplePhase = (time + i * 0.7) % 3;
        if (ripplePhase < 2) {
          ctx.beginPath();
          ctx.strokeStyle = '#c4e39c';
          ctx.globalAlpha = 0.4 * (1 - ripplePhase / 2);
          ctx.lineWidth = 1.5;
          ctx.arc(x, y, 6 + ripplePhase * 12, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Center dot
        ctx.beginPath();
        ctx.fillStyle = '#354a21';
        ctx.globalAlpha = 1;
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = '#c4e39c';
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = '#354a21';
        ctx.font = '500 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(loc.name, x, y + 18);
      });
    };

    const animate = () => {
      timeRef.current += 0.016;
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      seed = 42; // reset seed
      drawTerrain(w, h);
      drawMarkers(w, h, timeRef.current);

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        borderRadius: '8px',
      }}
    />
  );
}

/* ──────────────────────────────────────────────
   MAIN APP
   ────────────────────────────────────────────── */

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', city: '', service: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const heroHeadlineRef = useRef<HTMLHeadingElement>(null);
  const heroSubRef = useRef<HTMLParagraphElement>(null);
  const heroCtasRef = useRef<HTMLDivElement>(null);
  const heroTrustRef = useRef<HTMLParagraphElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const trustedRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const mapSectionRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const contactLeftRef = useRef<HTMLDivElement>(null);
  const contactFormRef = useRef<HTMLDivElement>(null);

  // ── Navigation scroll effect ──
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Smooth scroll ──
  const scrollTo = useCallback((href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // ── Hero entrance animation ──
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    // Headline line reveal
    if (heroHeadlineRef.current) {
      const lines = heroHeadlineRef.current.querySelectorAll('.line-inner');
      gsap.set(lines, { yPercent: 120, opacity: 0 });
      tl.to(lines, {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.2,
      });
    }

    // Subheadline
    if (heroSubRef.current) {
      gsap.set(heroSubRef.current, { opacity: 0, y: 20 });
      tl.to(heroSubRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');
    }

    // CTAs
    if (heroCtasRef.current) {
      const btns = heroCtasRef.current.children;
      gsap.set(btns, { yPercent: 120, opacity: 0 });
      tl.to(btns, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.1 }, '-=0.2');
    }

    // Trust line
    if (heroTrustRef.current) {
      gsap.set(heroTrustRef.current, { opacity: 0 });
      tl.to(heroTrustRef.current, { opacity: 0.7, duration: 0.5 }, '-=0.1');
    }

    return () => { tl.kill(); };
  }, []);

  // ── Scroll-triggered animations ──
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    // Service cards
    if (servicesRef.current) {
      const cards = servicesRef.current.querySelectorAll('.service-card');
      gsap.set(cards, { yPercent: 20, opacity: 0 });
      const st = ScrollTrigger.create({
        trigger: servicesRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(cards, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.15 });
        },
      });
      triggers.push(st);
    }

    // Trusted section
    if (trustedRef.current) {
      const leftCol = trustedRef.current.querySelector('.trusted-left');
      const items = trustedRef.current.querySelectorAll('.trusted-item');
      if (leftCol) {
        gsap.set(leftCol, { x: -50, opacity: 0 });
        const st = ScrollTrigger.create({
          trigger: trustedRef.current,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(leftCol, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
          },
        });
        triggers.push(st);
      }
      if (items.length) {
        gsap.set(items, { x: 50, opacity: 0 });
        const st = ScrollTrigger.create({
          trigger: trustedRef.current,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(items, { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.15 });
          },
        });
        triggers.push(st);
      }
    }

    // Accordion panels
    if (accordionRef.current) {
      const panels = accordionRef.current.querySelectorAll('.accordion-panel');
      gsap.set(panels, { yPercent: 20, opacity: 0 });
      const st = ScrollTrigger.create({
        trigger: accordionRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(panels, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.1 });
        },
      });
      triggers.push(st);
    }

    // About section
    if (aboutRef.current) {
      const img = aboutRef.current.querySelector('.about-img');
      const contentEls = aboutRef.current.querySelectorAll('.about-animate');
      if (img) {
        gsap.set(img, { x: -50, opacity: 0 });
        const st = ScrollTrigger.create({
          trigger: aboutRef.current,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(img, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
          },
        });
        triggers.push(st);
      }
      if (contentEls.length) {
        gsap.set(contentEls, { yPercent: 20, opacity: 0 });
        const st = ScrollTrigger.create({
          trigger: aboutRef.current,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(contentEls, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.1 });
          },
        });
        triggers.push(st);
      }
    }

    // City pills
    if (mapSectionRef.current) {
      const pills = mapSectionRef.current.querySelectorAll('.city-pill');
      gsap.set(pills, { yPercent: 20, opacity: 0 });
      const st = ScrollTrigger.create({
        trigger: mapSectionRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(pills, { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power2.out', stagger: 0.05 });
        },
      });
      triggers.push(st);
    }

    // Gallery items
    if (galleryRef.current) {
      const items = galleryRef.current.querySelectorAll('.gallery-item');
      gsap.set(items, { yPercent: 20, opacity: 0 });
      const st = ScrollTrigger.create({
        trigger: galleryRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(items, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.12 });
        },
      });
      triggers.push(st);
    }

    // Review cards
    if (reviewsRef.current) {
      const cards = reviewsRef.current.querySelectorAll('.review-card');
      gsap.set(cards, { yPercent: 20, opacity: 0 });
      const st = ScrollTrigger.create({
        trigger: reviewsRef.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(cards, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.15 });
        },
      });
      triggers.push(st);
    }

    // Contact section
    if (contactRef.current) {
      if (contactLeftRef.current) {
        const els = contactLeftRef.current.querySelectorAll('.contact-animate');
        gsap.set(els, { yPercent: 20, opacity: 0 });
        const st = ScrollTrigger.create({
          trigger: contactRef.current,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(els, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'power2.out', stagger: 0.1 });
          },
        });
        triggers.push(st);
      }
      if (contactFormRef.current) {
        gsap.set(contactFormRef.current, { x: 50, opacity: 0 });
        const st = ScrollTrigger.create({
          trigger: contactRef.current,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.to(contactFormRef.current, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
          },
        });
        triggers.push(st);
      }
    }

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, []);

  // ── Load Facebook SDK ──
  useEffect(() => {
    if ((window as any).FB) return;
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      if ((window as any).FB) {
        (window as any).FB.XFBML.parse();
      }
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // ── Form handler — submits to Formspree ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const response = await fetch('https://formspree.io/f/mpqvyvvb', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          city: formData.city,
          service: formData.service,
          message: formData.message,
          _subject: `New quote request from ${formData.name} - Haff's Home Services`,
        }),
      });
      if (response.ok) {
        setFormSubmitted(true);
        // Push conversion event to dataLayer for GA4
        if ((window as any).dataLayer) {
          (window as any).dataLayer.push({ event: 'form_submit', form_name: 'quote_request' });
        }
      } else {
        alert('Something went wrong. Please try again or call (320) 217-1801.');
      }
    } catch {
      alert('Something went wrong. Please try again or call (320) 217-1801.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // ── Accordion toggle ──
  const toggleAccordion = (idx: number) => {
    setOpenAccordion(openAccordion === idx ? null : idx);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* ═══════════════════════════════════════
          NAVIGATION
          ═══════════════════════════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navScrolled ? 'nav-scrolled' : 'bg-transparent'}`}
        style={{ height: 60 }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="text-lg font-medium"
            style={{ color: navScrolled ? '#000000' : '#ffffff', fontFamily: 'Inter, sans-serif' }}
          >
            Haff's Home Services
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-sm transition-colors duration-200 hover:opacity-70"
                style={{ color: navScrolled ? '#000000' : '#ffffff' }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <a
            href="tel:3202171801"
            className="hidden md:inline-flex btn-primary text-sm"
            style={{ padding: '8px 20px' }}
          >
            <Phone size={14} />
            Call Now
          </a>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: navScrolled ? '#000000' : '#ffffff' }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu-overlay md:hidden">
          {NAV_LINKS.map((link, i) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-2xl font-medium"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {link.label}
            </button>
          ))}
          <a href="tel:3202171801" className="btn-primary mt-4">
            <Phone size={18} />
            (320) 217-1801
          </a>
        </div>
      )}

      {/* ═══════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image with Ken Burns */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-bg.jpg"
            alt="Beautiful home with well-maintained yard"
            className="w-full h-full object-cover animate-bg-overlay-zoom"
          />
        </div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 z-[1]" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} />

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-[800px] mx-auto">
          <div ref={heroHeadlineRef} className="mb-6 flex flex-col items-center justify-center">
            <img
              src="/images/logo-white.png"
              alt="HSH Honest, Hardworking, Home Services - Quality Work You Can Trust"
              className="line-inner block max-w-[320px] sm:max-w-[400px] md:max-w-[480px] w-full h-auto"
              style={{ filter: 'drop-shadow(0 2px 20px rgba(0,0,0,0.3))' }}
            />
            <p
              className="mt-5 sm:mt-6 text-center"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(20px, 3.5vw, 36px)',
                fontWeight: 500,
                lineHeight: 1.3,
                color: '#e8e5df',
                textShadow: '0 2px 16px rgba(0,0,0,0.5)',
                letterSpacing: '0.12em',
              }}
            >
              Hardworking. Honest. Professional.
            </p>
          </div>

          <p
            ref={heroSubRef}
            className="mb-8 max-w-[600px] mx-auto"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(18px, 2vw, 24px)',
              fontWeight: 400,
              lineHeight: 1.4,
              color: 'rgba(232,229,223,0.9)',
            }}
          >
            Yard care, landscaping, cleaning, and more for homes and businesses throughout the Minneapolis area.
          </p>

          <div ref={heroCtasRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button onClick={() => scrollTo('#contact')} className="btn-primary">
              Get a Free Quote
            </button>
            <a href="tel:3202171801" className="btn-outline">
              <Phone size={16} />
              Call (320) 217-1801
            </a>
          </div>

          <p
            ref={heroTrustRef}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              color: 'rgba(232,229,223,0.7)',
            }}
          >
            Serving Otsego, Buffalo, Maple Grove, Minneapolis &amp; surrounding areas
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SERVICES OVERVIEW SECTION
          ═══════════════════════════════════════ */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="max-w-[1200px] mx-auto" ref={servicesRef}>
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="section-label">What We Do</div>
            <button onClick={() => scrollTo('#detailed-services')} className="hidden sm:inline-flex items-center gap-1 text-sm link-underline">
              View All Services <ChevronRight size={14} />
            </button>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {SERVICE_CARDS.map((card, i) => (
              <div key={i} className="service-card rounded overflow-hidden" style={{ backgroundColor: 'var(--color-surface)' }}>
                <div className="overflow-hidden" style={{ aspectRatio: '3/4' }}>
                  <img
                    src={card.img}
                    alt={card.title}
                    className="service-card-img w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-medium mb-1">{card.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--color-muted)' }}>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-3 justify-center">
            {['Lawn \u0026 Yard Care', 'Landscaping', 'Cleaning', 'Organization', 'Debris Removal', 'Handyman Services'].map((tag) => (
              <button key={tag} onClick={() => scrollTo('#detailed-services')} className="service-tag">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TRUSTED SERVICES (DARK) SECTION
          ═══════════════════════════════════════ */}
      <section ref={trustedRef} className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-primary)' }}>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column */}
          <div className="trusted-left flex flex-col justify-center">
            <h2
              className="mb-6"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(32px, 3.5vw, 48px)',
                fontWeight: 400,
                lineHeight: 1.2,
                color: '#e8e5df',
              }}
            >
              Dependable Home<br />&amp; Property Services
            </h2>
            <p
              className="mb-8 max-w-[480px]"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 18,
                lineHeight: 1.6,
                color: 'rgba(232,229,223,0.8)',
              }}
            >
              From lawn maintenance to deep cleaning, we handle the work so you don't have to. Residential and commercial services across the greater Minneapolis area.
            </p>
            <div>
              <button onClick={() => scrollTo('#projects')} className="btn-outline-dark">
                See Our Work
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8">
            {TRUSTED_SERVICES.map((service, i) => (
              <div key={i} className="trusted-item flex items-start gap-5">
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-lg"
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: 'rgba(196,227,156,0.15)',
                  }}
                >
                  <service.icon size={24} color="#c4e39c" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1" style={{ color: '#e8e5df' }}>{service.title}</h3>
                  <p className="text-sm" style={{ color: 'rgba(232,229,223,0.7)' }}>{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          DETAILED SERVICES (ACCORDION) SECTION
          ═══════════════════════════════════════ */}
      <section id="detailed-services" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="section-label justify-center mb-4">Our Services</div>
            <h2
              className="mb-4"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(32px, 3.5vw, 48px)',
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              Everything Your Home Needs
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: 18, maxWidth: 600, margin: '0 auto' }}>
              Don't see your project listed? Just ask — we're happy to help with all kinds of home and property work.
            </p>
          </div>

          {/* Accordion */}
          <div ref={accordionRef} className="flex flex-col gap-4">
            {ACCORDION_DATA.map((item, idx) => (
              <div
                key={idx}
                className="accordion-panel"
                style={{ borderBottom: '1px solid var(--color-border)' }}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between py-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl sm:text-2xl font-normal">{item.category}</span>
                    <span
                      className="text-xs px-3 py-1 rounded-full"
                      style={{ backgroundColor: 'var(--color-surface)' }}
                    >
                      {item.count} services
                    </span>
                  </div>
                  <span className={`accordion-icon text-2xl ${openAccordion === idx ? 'open' : ''}`}>+</span>
                </button>
                <div
                  className="accordion-content"
                  style={{
                    maxHeight: openAccordion === idx ? '300px' : '0',
                  }}
                >
                  <div className="pb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {item.items.map((sub, si) => (
                      <div
                        key={si}
                        className="flex items-center gap-2 py-2 px-3 rounded"
                        style={{ backgroundColor: 'var(--color-surface)' }}
                      >
                        <Check size={16} style={{ color: 'var(--color-primary)' }} />
                        <span className="text-sm">{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ABOUT ZACK SECTION
          ═══════════════════════════════════════ */}
      <section id="about" ref={aboutRef} className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left: Photo */}
          <div className="lg:col-span-2">
            <div className="about-img overflow-hidden rounded" style={{ aspectRatio: '3/4' }}>
              <img
                src="/images/about-zack.jpg"
                alt="Zack Haffner, owner of Haff's Home Services"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="lg:col-span-3 flex flex-col justify-center">
            <div className="about-animate section-label mb-4">Meet Zack</div>
            <h2
              className="about-animate mb-2"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(32px, 3.5vw, 48px)',
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              Zack Haffner
            </h2>
            <p className="about-animate text-lg mb-6" style={{ color: 'var(--color-muted)' }}>
              Owner, Haff's Home Services
            </p>
            <p
              className="about-animate text-base sm:text-lg leading-relaxed mb-8"
              style={{ lineHeight: 1.7 }}
            >
              I'm a hardworking, honest professional who takes pride in doing the job right. I started Haff's Home Services to help homeowners and businesses in the Minneapolis area keep their properties looking great without the hassle. Whether it's mowing lawns, organizing garages, or tackling that odd job you've been putting off, I show up on time, work hard, and treat every property like it's my own. No job is too small — I believe every customer deserves quality work at a fair price.
            </p>

            {/* Trust Badges */}
            <div className="about-animate flex flex-wrap gap-6 mb-8">
              {[
                { icon: Star, label: 'Reliable \u0026 On Time' },
                { icon: Shield, label: 'Fully Insured' },
                { icon: Heart, label: 'Customer First' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2">
                  <badge.icon size={18} style={{ color: 'var(--color-primary)' }} />
                  <span className="text-sm font-medium">{badge.label}</span>
                </div>
              ))}
            </div>

            <div className="about-animate">
              <button onClick={() => scrollTo('#contact')} className="btn-primary">
                Get in Touch
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SERVICE AREAS SECTION
          ═══════════════════════════════════════ */}
      <section ref={mapSectionRef} className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="section-label justify-center mb-4">Service Area</div>
            <h2
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(32px, 3.5vw, 48px)',
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              Proudly Serving the Minneapolis Area
            </h2>
          </div>

          {/* Map Canvas */}
          <div className="relative w-full mb-8 overflow-hidden rounded-lg" style={{ aspectRatio: '16/9', backgroundColor: '#e8e5df' }}>
            <AreaMapCanvas />
          </div>
          <p className="text-center text-xs mb-10" style={{ color: 'var(--color-muted)' }}>
            Click and drag to explore. Cities shown include our primary service areas.
          </p>

          {/* City Pills */}
          <div className="flex flex-wrap gap-3 justify-center">
            {CITIES.map((city) => (
              <span key={city} className="city-pill">{city}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PROJECTS GALLERY SECTION
          ═══════════════════════════════════════ */}
      <section id="projects" ref={galleryRef} className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="section-label justify-center mb-4">Our Work</div>
            <h2
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(32px, 3.5vw, 48px)',
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              Recent Projects
            </h2>
            <p className="mt-3 text-sm" style={{ color: 'var(--color-muted)' }}>
              See our latest work directly from Facebook
            </p>
          </div>

          {/* Facebook Page Plugin */}
          <div className="mt-12 max-w-[600px] mx-auto">
            <div
              className="fb-page"
              data-href="https://www.facebook.com/profile.php?id=61579202682595"
              data-tabs="timeline"
              data-width="600"
              data-height="500"
              data-small-header="false"
              data-adapt-container-width="true"
              data-hide-cover="false"
              data-show-facepile="true"
            >
              <blockquote cite="https://www.facebook.com/profile.php?id=61579202682595" className="fb-xfbml-parse-ignore">
                <a href="https://www.facebook.com/profile.php?id=61579202682595">Haff's Home Services</a>
              </blockquote>
            </div>
          </div>

          {/* Facebook CTA */}
          <p className="text-center mt-6 text-sm" style={{ color: 'var(--color-muted)' }}>
            <a
              href="https://www.facebook.com/profile.php?id=61579202682595"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-medium link-underline"
              style={{ color: 'var(--color-primary)' }}
            >
              <Facebook size={16} />
              Visit our Facebook page
            </a>
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          REVIEWS SECTION
          ═══════════════════════════════════════ */}
      <section id="reviews" ref={reviewsRef} className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="section-label justify-center mb-4">Testimonials</div>
            <h2
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(32px, 3.5vw, 48px)',
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              What Our Customers Say
            </h2>
          </div>

          {/* Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {REVIEWS.map((review, i) => (
              <div
                key={i}
                className="review-card p-6 rounded"
                style={{ backgroundColor: 'var(--color-surface)' }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: review.stars }).map((_, si) => (
                    <Star key={si} size={18} fill="#c4e39c" color="#c4e39c" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-base italic mb-4 leading-relaxed">"{review.text}"</p>
                {/* Name */}
                <p className="text-sm font-medium">{review.name}</p>
                <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{review.service}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex mb-4"
            >
              <Star size={16} />
              Leave a Google Review
            </a>
            <p className="text-sm">
              <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="link-underline" style={{ color: 'var(--color-muted)' }}>
                Read More Reviews
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CONTACT SECTION
          ═══════════════════════════════════════ */}
      <section id="contact" ref={contactRef} className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-primary)' }}>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column */}
          <div ref={contactLeftRef}>
            <h2
              className="contact-animate mb-4"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(32px, 3.5vw, 48px)',
                fontWeight: 400,
                lineHeight: 1.2,
                color: '#e8e5df',
              }}
            >
              Get Your Free Quote
            </h2>
            <p
              className="contact-animate mb-10"
              style={{
                fontSize: 18,
                color: 'rgba(232,229,223,0.8)',
              }}
            >
              Call, text, or fill out the form. We'll get back to you quickly.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col gap-6 mb-10">
              <a href="tel:3202171801" className="contact-animate flex items-center gap-4 group">
                <div className="flex items-center justify-center rounded-full" style={{ width: 44, height: 44, backgroundColor: 'rgba(196,227,156,0.15)' }}>
                  <Phone size={20} color="#c4e39c" />
                </div>
                <span className="text-2xl font-medium" style={{ color: '#e8e5df' }}>(320) 217-1801</span>
              </a>

              <a href="mailto:haffn007@gmail.com" className="contact-animate flex items-center gap-4">
                <div className="flex items-center justify-center rounded-full" style={{ width: 44, height: 44, backgroundColor: 'rgba(196,227,156,0.15)' }}>
                  <Mail size={20} color="#c4e39c" />
                </div>
                <span className="text-lg" style={{ color: '#e8e5df' }}>haffn007@gmail.com</span>
              </a>

              <div className="contact-animate flex items-center gap-4">
                <div className="flex items-center justify-center rounded-full" style={{ width: 44, height: 44, backgroundColor: 'rgba(196,227,156,0.15)' }}>
                  <MapPin size={20} color="#c4e39c" />
                </div>
                <span className="text-lg" style={{ color: 'rgba(232,229,223,0.8)' }}>Greater Minneapolis, MN Area</span>
              </div>

              <div className="contact-animate flex items-center gap-4">
                <div className="flex items-center justify-center rounded-full" style={{ width: 44, height: 44, backgroundColor: 'rgba(196,227,156,0.15)' }}>
                  <Clock size={20} color="#c4e39c" />
                </div>
                <span className="text-lg" style={{ color: 'rgba(232,229,223,0.8)' }}>Mon–Sat: 7:00 AM – 6:00 PM</span>
              </div>
            </div>

            {/* Social */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-animate inline-flex items-center gap-2"
              style={{ color: '#e8e5df' }}
            >
              <Facebook size={20} />
              <span>Follow us on Facebook</span>
            </a>
          </div>

          {/* Right Column: Form */}
          <div
            ref={contactFormRef}
            className="rounded-lg p-6 sm:p-8"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            {formSubmitted ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div
                  className="flex items-center justify-center rounded-full mb-4"
                  style={{ width: 64, height: 64, backgroundColor: 'rgba(53,74,33,0.1)' }}
                >
                  <Check size={32} style={{ color: 'var(--color-primary)' }} />
                </div>
                <h3 className="text-2xl font-medium mb-2" style={{ color: 'var(--color-primary)' }}>Thanks!</h3>
                <p className="text-base" style={{ color: 'var(--color-muted)' }}>We'll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Your City"
                  required
                  className="form-input"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
                <select
                  required
                  className="form-input"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                >
                  <option value="">What service do you need?</option>
                  <option value="lawn">Lawn &amp; Yard Care</option>
                  <option value="landscaping">Landscaping &amp; Bed Care</option>
                  <option value="tree">Tree &amp; Debris Removal</option>
                  <option value="cleaning">Cleaning Services</option>
                  <option value="organization">Organization</option>
                  <option value="handyman">Odd Jobs &amp; Handyman</option>
                  <option value="other">Other</option>
                </select>
                <textarea
                  placeholder="Tell us about your project"
                  rows={4}
                  className="form-input resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="btn-primary w-full justify-center"
                  style={{ padding: '14px' }}
                >
                  {formSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
                <p className="text-xs text-center" style={{ color: 'var(--color-muted)' }}>
                  We respect your privacy. Your information will never be shared.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════ */}
      <footer className="py-10 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-bg)', borderTop: '1px solid var(--color-border)' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Left */}
            <div>
              <h3 className="text-lg font-medium mb-2">Haff's Home Services</h3>
              <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                Honest, hardworking home services in Minneapolis.
              </p>
            </div>

            {/* Center */}
            <div>
              <h4 className="text-sm font-medium mb-3">Quick Links</h4>
              <div className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-left hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right */}
            <div>
              <h4 className="text-sm font-medium mb-3">Contact</h4>
              <div className="flex flex-col gap-2">
                <a href="tel:3202171801" className="text-sm flex items-center gap-2" style={{ color: 'var(--color-muted)' }}>
                  <Phone size={14} /> (320) 217-1801
                </a>
                <a href="mailto:haffn007@gmail.com" className="text-sm flex items-center gap-2" style={{ color: 'var(--color-muted)' }}>
                  <Mail size={14} /> haffn007@gmail.com
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm flex items-center gap-2 hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--color-muted)' }}
                >
                  <Facebook size={14} /> Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div
            className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2"
            style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}
          >
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
              &copy; 2026 Haff's Home Services. All rights reserved.
            </p>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
              Licensed &amp; Insured
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
