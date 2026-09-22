"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  depth: number;
  hue: "blue" | "purple";
  featured: boolean;
  pulsePhase: number;
  pulseSpeed: number;
  baseAlpha: number;
};

type Ripple = { x: number; y: number; start: number };

const DESKTOP = { connectDist: 150, mouseRadius: 170, mouseConnectRadius: 220, areaPerParticle: 13000, maxParticles: 110 };
const MOBILE = { connectDist: 95, mouseRadius: 110, mouseConnectRadius: 0, areaPerParticle: 16000, maxParticles: 42 };
const RIPPLE_DURATION = 900;
const RIPPLE_SPEED = 0.42; // px/ms

function particleColor(hue: "blue" | "purple", alpha: number) {
  return hue === "blue" ? `rgba(96,165,255,${alpha})` : `rgba(158,120,255,${alpha})`;
}

function buildBrandMark(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.filter = "blur(38px)";
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "rgba(124,92,255,0.55)");
  gradient.addColorStop(1, "rgba(34,211,238,0.55)");

  const cx = width / 2;
  const top = height * 0.02;
  const bottom = height * 0.78;
  const spread = width * 0.24;
  const strokeW = width * 0.055;

  ctx.strokeStyle = gradient;
  ctx.lineWidth = strokeW;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(cx - spread, top);
  ctx.lineTo(cx, bottom);
  ctx.moveTo(cx + spread, top);
  ctx.lineTo(cx, bottom);
  ctx.stroke();

  return canvas;
}

export function ParticleBackground() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    const canvasEl = canvasRef.current;
    const context2d = canvasEl?.getContext("2d", { alpha: true });
    if (!canvasEl || !context2d) return;

    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = context2d;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let isMobile = window.innerWidth < 768;
    let particles: Particle[] = [];
    let ripples: Ripple[] = [];
    let brandMark: HTMLCanvasElement | null = null;
    let frameId = 0;
    let lastTime = 0;
    let intensity = 1;
    let targetIntensity = 1;

    const mouse = { x: -9999, y: -9999, active: false };

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;
    const cfg = () => (isMobile ? MOBILE : DESKTOP);

    function createParticles() {
      const c = cfg();
      const count = Math.min(c.maxParticles, Math.max(18, Math.round((width * height) / c.areaPerParticle)));
      particles = Array.from({ length: count }, (_, i) => ({
        x: rand(0, width),
        y: rand(0, height),
        vx: rand(-0.1, 0.1),
        vy: rand(-0.08, 0.08),
        radius: i % 12 === 0 ? rand(2.1, 2.9) : rand(1, 1.9),
        depth: rand(0.45, 1),
        hue: Math.random() > 0.5 ? "blue" : "purple",
        featured: i % 12 === 0,
        pulsePhase: rand(0, Math.PI * 2),
        pulseSpeed: rand(0.35, 0.8),
        baseAlpha: rand(0.35, 0.7),
      }));
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      isMobile = width < 768;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      createParticles();
      brandMark = buildBrandMark(Math.min(width * 0.9, 1100), Math.min(height * 0.9, 700));
    }

    function updateScrollIntensity() {
      const heroSpan = Math.max(window.innerHeight * 1.05, 480);
      targetIntensity = Math.max(0.32, 1 - (window.scrollY / heroSpan) * 0.72);
    }

    function onMouseMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }

    function onMouseLeave() {
      mouse.active = false;
    }

    function onPointerDown(x: number, y: number) {
      ripples.push({ x, y, start: performance.now() });
      if (ripples.length > 6) ripples.shift();
    }

    function onClick(e: MouseEvent) {
      onPointerDown(e.clientX, e.clientY);
    }

    function onTouchMove(e: TouchEvent) {
      const t = e.touches[0];
      if (!t) return;
      mouse.x = t.clientX;
      mouse.y = t.clientY;
      mouse.active = true;
    }

    function onTouchStart(e: TouchEvent) {
      const t = e.touches[0];
      if (!t) return;
      mouse.x = t.clientX;
      mouse.y = t.clientY;
      mouse.active = true;
      onPointerDown(t.clientX, t.clientY);
    }

    function onTouchEnd() {
      mouse.active = false;
    }

    function drawStatic() {
      ctx.clearRect(0, 0, width, height);
      if (brandMark) {
        ctx.globalAlpha = 0.4;
        ctx.drawImage(brandMark, (width - brandMark.width) / 2, 0);
        ctx.globalAlpha = 1;
      }
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < cfg().connectDist) {
            ctx.strokeStyle = `rgba(150,160,220,${0.12 * (1 - dist / cfg().connectDist)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = particleColor(p.hue, p.baseAlpha * 0.7);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function step(now: number) {
      frameId = requestAnimationFrame(step);
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;

      intensity += (targetIntensity - intensity) * 0.05;
      const c = cfg();

      ctx.clearRect(0, 0, width, height);

      if (brandMark) {
        ctx.globalAlpha = 0.4 * intensity;
        ctx.drawImage(brandMark, (width - brandMark.width) / 2, 0);
        ctx.globalAlpha = 1;
      }

      // Active ripples, oldest-fading-out first.
      ripples = ripples.filter((r) => now - r.start < RIPPLE_DURATION);
      for (const r of ripples) {
        const elapsed = now - r.start;
        const progress = elapsed / RIPPLE_DURATION;
        const radius = elapsed * RIPPLE_SPEED;
        ctx.strokeStyle = `rgba(124,180,255,${0.35 * (1 - progress) * intensity})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (const p of particles) {
        // Gentle drift with a soft velocity cap so motion never looks jittery.
        p.vx += rand(-0.0025, 0.0025);
        p.vy += rand(-0.0025, 0.0025);
        p.vx = Math.max(-0.22, Math.min(0.22, p.vx));
        p.vy = Math.max(-0.22, Math.min(0.22, p.vy));

        let dx = 0;
        let dy = 0;
        let mouseDist = Infinity;
        if (mouse.active && c.mouseRadius > 0) {
          dx = p.x - mouse.x;
          dy = p.y - mouse.y;
          mouseDist = Math.hypot(dx, dy);
          if (mouseDist < c.mouseRadius && mouseDist > 0.01) {
            const force = (1 - mouseDist / c.mouseRadius) * 0.018;
            p.vx += (dx / mouseDist) * force;
            p.vy += (dy / mouseDist) * force;
          }
        }

        p.x += p.vx * (dt / 16) * p.depth;
        p.y += p.vy * (dt / 16) * p.depth;

        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > height) { p.y = height; p.vy *= -1; }

        let boost = 0;
        if (mouseDist < c.mouseRadius) {
          boost = (1 - mouseDist / c.mouseRadius) * 0.45;
        }
        for (const r of ripples) {
          const rd = Math.hypot(p.x - r.x, p.y - r.y);
          const elapsed = now - r.start;
          const radius = elapsed * RIPPLE_SPEED;
          if (Math.abs(rd - radius) < 26) {
            boost = Math.max(boost, (1 - elapsed / RIPPLE_DURATION) * 0.6);
          }
        }

        p.pulsePhase += p.pulseSpeed * (dt / 1000);
        const pulse = p.featured ? (Math.sin(p.pulsePhase) + 1) / 2 : 0;

        const alpha = Math.min(1, (p.baseAlpha + boost + pulse * 0.25) * intensity);

        if (p.featured) {
          const glowRadius = p.radius * 6;
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
          glow.addColorStop(0, particleColor(p.hue, 0.25 * intensity));
          glow.addColorStop(1, particleColor(p.hue, 0));
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = particleColor(p.hue, alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          if (Math.abs(dx) > c.connectDist || Math.abs(dy) > c.connectDist) continue;
          const dist = Math.hypot(dx, dy);
          if (dist < c.connectDist) {
            const lineAlpha = 0.16 * (1 - dist / c.connectDist) * intensity;
            ctx.strokeStyle = `rgba(150,165,225,${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        if (mouse.active && c.mouseConnectRadius > 0) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < c.mouseConnectRadius) {
            const lineAlpha = 0.22 * (1 - dist / c.mouseConnectRadius) * intensity;
            ctx.strokeStyle = `rgba(180,200,255,${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    }

    resize();
    updateScrollIntensity();

    if (reduceMotion) {
      drawStatic();
    } else {
      lastTime = performance.now();
      frameId = requestAnimationFrame(step);
    }

    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        resize();
        if (reduceMotion) drawStatic();
      });
    };

    let scrollRaf = 0;
    const onScroll = () => {
      cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(updateScrollIntensity);
    };

    const onVisibility = () => {
      if (reduceMotion) return;
      if (document.hidden) {
        cancelAnimationFrame(frameId);
      } else {
        lastTime = performance.now();
        frameId = requestAnimationFrame(step);
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    if (!reduceMotion) {
      if (!isMobile) {
        window.addEventListener("mousemove", onMouseMove, { passive: true });
        window.addEventListener("mouseleave", onMouseLeave);
        window.addEventListener("click", onClick);
      } else {
        window.addEventListener("touchmove", onTouchMove, { passive: true });
        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchend", onTouchEnd);
      }
    }

    return () => {
      cancelAnimationFrame(frameId);
      cancelAnimationFrame(resizeRaf);
      cancelAnimationFrame(scrollRaf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("click", onClick);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
        aria-hidden="true"
      >
        <div className="glow-blob glow-blob-a absolute -left-32 -top-32 h-[560px] w-[560px] rounded-full bg-accent/25 blur-[110px]" />
        <div className="glow-blob glow-blob-b absolute -right-24 top-[38vh] h-[480px] w-[480px] rounded-full bg-accent-2/20 blur-[110px]" />
      </div>
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true" />
    </>
  );
}
