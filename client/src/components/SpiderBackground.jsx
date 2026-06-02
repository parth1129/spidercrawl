import { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function SpiderBackground() {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let animId;
    const mouse = { x: null, y: null };

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const onResize    = () => resize();
    const onMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onMouseOut  = () => { mouse.x = null; mouse.y = null; };

    window.addEventListener('resize',    onResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseout',  onMouseOut);

    // ── Node setup ────────────────────────────────────────────────────────
    const COUNT   = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 14000), 90);
    const CONNECT = 140;

    const nodes = Array.from({ length: COUNT }, () => ({
      x:      Math.random() * canvas.width,
      y:      Math.random() * canvas.height,
      vx:     (Math.random() - 0.5) * 0.35,
      vy:     (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.5 + 0.8,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const nodeColor = isDark
        ? 'rgba(0, 212, 255, 0.65)'
        : 'rgba(0, 140, 200, 0.5)';
      const lineBase  = isDark
        ? [0, 212, 255]
        : [0, 140, 200];

      // Update positions
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

        // Gentle repulsion from cursor
        if (mouse.x !== null) {
          const dx   = n.x - mouse.x;
          const dy   = n.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 90) {
            const force = (90 - dist) / 90;
            n.x += (dx / dist) * force * 1.8;
            n.y += (dy / dist) * force * 1.8;
          }
        }
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx   = nodes[i].x - nodes[j].x;
          const dy   = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < CONNECT) {
            const alpha = (1 - dist / CONNECT) * (isDark ? 0.45 : 0.3);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${lineBase[0]},${lineBase[1]},${lineBase[2]},${alpha})`;
            ctx.lineWidth   = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize',    onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseout',  onMouseOut);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: isDark ? 0.28 : 0.18 }}
      aria-hidden="true"
    />
  );
}
