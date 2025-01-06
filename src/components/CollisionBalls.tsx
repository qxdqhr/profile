import React, { useEffect, useRef, useState } from 'react';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  weight: number;
  color: string;
}

interface CollisionBallsProps {
  weights: number[];
  width?: number;
  height?: number;
  colors?: string[];
}

const CollisionBalls: React.FC<CollisionBallsProps> = ({
  weights,
  width = 800,
  height = 600,
  colors = ['#FFB6B9', '#FAE3D9', '#BBDED6', '#61C0BF']
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const [isShaking, setIsShaking] = useState(false);

  // 初始化小球
  const initBalls = (withVelocity = false) => {
    const maxWeight = Math.max(...weights);
    const minRadius = 20;
    const maxRadius = 50;

    return weights.map((weight, index) => ({
      x: Math.random() * (width - 100) + 50,
      y: Math.random() * (height - 100) + 50,
      vx: withVelocity ? (Math.random() - 0.5) * 10 : 0, // 增加初始速度
      vy: withVelocity ? (Math.random() - 0.5) * 10 : 0, // 增加初始速度
      radius: minRadius + (weight / maxWeight) * (maxRadius - minRadius),
      weight,
      color: colors[index % colors.length]
    }));
  };

  // 摇一摇功能
  const shake = () => {
    setIsShaking(true);
    ballsRef.current.forEach(ball => {
      ball.vx = (Math.random() - 0.5) * 10;
      ball.vy = (Math.random() - 0.5) * 10;
    });
    setTimeout(() => setIsShaking(false), 200); // 按钮动画效果
  };

  // 检测碰撞
  const checkCollision = (ball1: Ball, ball2: Ball) => {
    const dx = ball2.x - ball1.x;
    const dy = ball2.y - ball1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ball1.radius + ball2.radius) {
      // 碰撞响应
      const angle = Math.atan2(dy, dx);
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);

      // 旋转速度
      const vx1 = ball1.vx * cos + ball1.vy * sin;
      const vy1 = ball1.vy * cos - ball1.vx * sin;
      const vx2 = ball2.vx * cos + ball2.vy * sin;
      const vy2 = ball2.vy * cos - ball2.vx * sin;

      // 碰撞后的速度（考虑质量）
      const totalMass = ball1.weight + ball2.weight;
      const newVx1 = ((ball1.weight - ball2.weight) * vx1 + 2 * ball2.weight * vx2) / totalMass;
      const newVx2 = ((ball2.weight - ball1.weight) * vx2 + 2 * ball1.weight * vx1) / totalMass;

      // 更新速度
      ball1.vx = newVx1 * cos - vy1 * sin;
      ball1.vy = vy1 * cos + newVx1 * sin;
      ball2.vx = newVx2 * cos - vy2 * sin;
      ball2.vy = vy2 * cos + newVx2 * sin;

      // 防止重叠
      const overlap = (ball1.radius + ball2.radius - distance) / 2;
      ball1.x -= overlap * cos;
      ball1.y -= overlap * sin;
      ball2.x += overlap * cos;
      ball2.y += overlap * sin;
    }
  };

  // 更新位置
  const updatePosition = (ball: Ball) => {
    ball.x += ball.vx;
    ball.y += ball.vy;

    // 边界碰撞检测
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > width) {
      ball.vx *= -0.8;
      ball.x = ball.x - ball.radius < 0 ? ball.radius : width - ball.radius;
    }
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > height) {
      ball.vy *= -0.8;
      ball.y = ball.y - ball.radius < 0 ? ball.radius : height - ball.radius;
    }
  };

  // 绘制
  const draw = (ctx: CanvasRenderingContext2D, ball: Ball) => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();

    // 绘制权重文本
    ctx.fillStyle = '#fff';
    ctx.font = `${ball.radius * 0.5}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ball.weight.toString(), ball.x, ball.y);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ballsRef.current = initBalls();

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 更新所有球的位置
      ballsRef.current.forEach(ball => {
        updatePosition(ball);
      });

      // 检查所有可能的碰撞
      for (let i = 0; i < ballsRef.current.length; i++) {
        for (let j = i + 1; j < ballsRef.current.length; j++) {
          checkCollision(ballsRef.current[i], ballsRef.current[j]);
        }
      }

      // 绘制所有球
      ballsRef.current.forEach(ball => {
        draw(ctx, ball);
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, [width, height, weights, colors]);

  return (
    <div className="collision-balls-container">
      <button 
        className={`shake-button ${isShaking ? 'shaking' : ''}`}
        onClick={shake}
        disabled={isShaking}
      >
        摇一摇
      </button>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ border: '1px solid #ccc' }}
      />
    </div>
  );
};

export default CollisionBalls; 