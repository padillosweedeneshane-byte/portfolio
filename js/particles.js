(function () {
  let canvas, ctx, particles, mouse, animationId, mouseGlow;
  let isReduced = false;

  const CONFIG = {
    count: 140,
    maxDistance: 130,
    particleRadius: { min: 1.2, max: 3.2 },
    speed: 0.25,
    lineOpacity: 0.12,
    mouseRadius: 120,
    repelForce: 9
  };

  function init() {
    isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    canvas = document.createElement('canvas');
    canvas.className = 'particles-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    
    // Style the canvas to sit fixed behind all sections
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');

    mouseGlow = document.getElementById('mouseGlow');
    mouse = { x: -9999, y: -9999, prevX: -9999, prevY: -9999 };
    particles = [];
    
    resize();
    for (let i = 0; i < CONFIG.count; i++) {
      particles.push(createParticle());
    }

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onMouseLeave, { passive: true });
    window.addEventListener('touchstart', onTouchMove, { passive: true });

    animate();
  }

  function resize() {
    if (!canvas) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * devicePixelRatio;
    canvas.height = h * devicePixelRatio;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(devicePixelRatio, devicePixelRatio);

    particles.forEach(p => {
      p.x = Math.random() * w;
      p.y = Math.random() * h;
    });
  }

  function createParticle() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * CONFIG.speed * 2,
      vy: (Math.random() - 0.5) * CONFIG.speed * 2,
      radius: CONFIG.particleRadius.min + Math.random() * (CONFIG.particleRadius.max - CONFIG.particleRadius.min),
      alpha: 0.35 + Math.random() * 0.55
    };
  }

  let accentColor = '14, 165, 233';

  function getAccentRGB() {
    if (!document.body) return accentColor;
    const temp = document.createElement('div');
    temp.style.color = 'var(--color-accent)';
    document.body.appendChild(temp);
    const c = getComputedStyle(temp).color;
    document.body.removeChild(temp);
    const match = c.match(/[\d.]+/g);
    if (match) {
      accentColor = match.slice(0, 3).join(', ');
    }
    return accentColor;
  }

  function onMouseMove(e) {
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (mouseGlow) {
      mouseGlow.style.left = e.clientX + 'px';
      mouseGlow.style.top = e.clientY + 'px';
      mouseGlow.classList.add('visible');
    }
  }

  function onTouchMove(e) {
    const touch = e.touches[0];
    if (!touch) return;
    mouse.x = touch.clientX;
    mouse.y = touch.clientY;
    if (mouseGlow) {
      mouseGlow.style.left = touch.clientX + 'px';
      mouseGlow.style.top = touch.clientY + 'px';
      mouseGlow.classList.add('visible');
    }
  }

  function onMouseLeave() {
    mouse.x = -9999;
    mouse.y = -9999;
    if (mouseGlow) {
      mouseGlow.classList.remove('visible');
    }
  }

  function animate() {
    animationId = requestAnimationFrame(animate);
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    const rgb = getAccentRGB();

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) { p.x = 0; p.vx *= -1; }
      if (p.x > w) { p.x = w; p.vx *= -1; }
      if (p.y < 0) { p.y = 0; p.vy *= -1; }
      if (p.y > h) { p.y = h; p.vy *= -1; }

      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.mouseRadius && dist > 0) {
        const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius * CONFIG.repelForce;
        p.x += (dx / dist) * force;
        p.y += (dy / dist) * force;
      }
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.maxDistance) {
          const opacity = (1 - dist / CONFIG.maxDistance) * CONFIG.lineOpacity;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(' + rgb + ', ' + opacity + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + rgb + ', ' + p.alpha * 0.5 + ')';
      ctx.fill();
    });

    const mouseDx = mouse.x - mouse.prevX;
    const mouseDy = mouse.y - mouse.prevY;
    const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
    if (mouseDist > 2) {
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + rgb + ', 0.35)';
      ctx.fill();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('theme-changed', function () {
    accentColor = '14, 165, 233';
  });
})();
