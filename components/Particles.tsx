
import React, { useEffect, useRef } from 'react';
import { EffectType } from '../types';

interface ParticlesProps {
  type: EffectType;
}

export const Particles: React.FC<ParticlesProps> = ({ type }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (type === EffectType.NONE) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    const particleCount = 100;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number = Math.random() * canvas!.width;
      y: number = Math.random() * canvas!.height;
      size: number = Math.random() * 3 + 1;
      speedY: number = type === EffectType.SNOW ? Math.random() * 1 + 0.5 : Math.random() * 2 + 1;
      speedX: number = Math.random() * 1 - 0.5;
      color: string = '';

      constructor() {
        if (type === EffectType.SNOW) this.color = 'white';
        else if (type === EffectType.LAVA) this.color = '#ff4500';
        else if (type === EffectType.CHERRY) this.color = '#ffb7c5';
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y > canvas!.height) {
          this.y = -10;
          this.x = Math.random() * canvas!.width;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        if (type === EffectType.CHERRY) {
            ctx.ellipse(this.x, this.y, this.size * 2, this.size, Math.PI / 4, 0, Math.PI * 2);
        } else {
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        }
        ctx.fill();
      }
    }

    const init = () => {
      resize();
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [type]);

  if (type === EffectType.NONE) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[1]"
    />
  );
};
