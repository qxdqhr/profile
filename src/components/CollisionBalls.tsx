import React, { useEffect, useRef, useState } from 'react';
import '../styles/components/CollisionBalls.css';

interface BallConfig {
  text?: string;          // 球上显示的文本
  textColor?: string;     // 文本颜色
  weight: number;         // 球的质量
  image?: string;         // 可选的图片URL
  color: string;          // 球的颜色
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  weight: number;
  color: string;
  text?: string;
  textColor?: string;
  image?: HTMLImageElement | null;
  isDragging?: boolean;
}

interface CollisionBallsProps {
  collisionBallsConfig: {
    balls: BallConfig[];
    width?: number;
    height?: number;
    minVelocity?: number;
    maxVelocity?: number;
  }
}

const CollisionBalls: React.FC<CollisionBallsProps> = ({
  collisionBallsConfig: {
    balls,
    width = 1000,
    height = 800,
    minVelocity = 5,
    maxVelocity = 10,
  }
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const [isShaking, setIsShaking] = useState(false);
  const [draggedBall, setDraggedBall] = useState<Ball | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const initBalls = (minVelocity: number, maxVelocity: number) => {
    const maxWeight = Math.max(...balls.map(b => b.weight));
    const minRadius = 50;
    const maxRadius = 80;

    return balls.map((ballConfig) => ({
      x: Math.random() * (width - 100) + 50,
      y: Math.random() * (height - 100) + 50,
      vx: (Math.random() - 0.5) * (maxVelocity - minVelocity) + minVelocity,
      vy: (Math.random() - 0.5) * (maxVelocity - minVelocity) + minVelocity,
      radius: minRadius + (ballConfig.weight / maxWeight) * (maxRadius - minRadius),
      weight: ballConfig.weight,
      color: ballConfig.color,
      text: ballConfig.text,
      textColor: ballConfig.textColor || '#fff',
      image: ballConfig.image ? loadImage(ballConfig.image) : null
    }));
  };

  const shake = () => {
    setIsShaking(true);
    ballsRef.current.forEach(ball => {
      ball.vx = (Math.random() - 0.5) * 10;
      ball.vy = (Math.random() - 0.5) * 10;
    });
    setTimeout(() => setIsShaking(false), 200); // 按钮动画效果
  };

  const checkCollision = (ball1: Ball, ball2: Ball) => {
    const dx = ball2.x - ball1.x;
    const dy = ball2.y - ball1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ball1.radius + ball2.radius) {
      // 碰撞响应
      const angle = Math.atan2(dy, dx);
      const overlap = (ball1.radius + ball2.radius - distance) / 2;

      // 如果其中一个球正在被拖动
      if (ball1.isDragging || ball2.isDragging) {
        const draggedBall = ball1.isDragging ? ball1 : ball2;
        const otherBall = ball1.isDragging ? ball2 : ball1;
        
        // 只移动非拖动的球
        otherBall.x += (draggedBall === ball1 ? 1 : -1) * overlap * Math.cos(angle);
        otherBall.y += (draggedBall === ball1 ? 1 : -1) * overlap * Math.sin(angle);
        
        // 给非拖动球一个速度
        const pushForce = 2;
        otherBall.vx = (draggedBall === ball1 ? -1 : 1) * Math.cos(angle) * pushForce;
        otherBall.vy = (draggedBall === ball1 ? -1 : 1) * Math.sin(angle) * pushForce;
        
        return;
      }

      // 正常的碰撞物理计算（两个球都在自由运动）
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
      ball1.x -= overlap * Math.cos(angle);
      ball1.y -= overlap * Math.sin(angle);
      ball2.x += overlap * Math.cos(angle);
      ball2.y += overlap * Math.sin(angle);
    }
  };

  const updatePosition = (ball: Ball) => {
    if (ball.isDragging) return;
    
    ball.x += ball.vx;
    ball.y += ball.vy;

    // 创建边界碰撞处理的匿名函数
    const handleBoundaryCollision = (
      velocity: number,
      position: number,
      boundary: number,
      radius: number
    ): [number, number] => {
      if (position - radius < 0 || position + radius > boundary) {
        let newVelocity = -velocity * 0.8;
        const newPosition = position - radius < 0 ? radius : boundary - radius;
        
        if (Math.abs(newVelocity) < minVelocity) {
          newVelocity = minVelocity * Math.sign(newVelocity);
        }
        return [newVelocity, newPosition];
      }
      return [velocity, position];
    };

    // 分别处理水平和垂直方向的碰撞
    [ball.vx, ball.x] = handleBoundaryCollision(ball.vx, ball.x, width, ball.radius);
    [ball.vy, ball.y] = handleBoundaryCollision(ball.vy, ball.y, height, ball.radius);
  };

  const draw = (ctx: CanvasRenderingContext2D, ball: Ball) => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    
    if (ball.image && ball.image.complete) {
      // 如果有图片且已加载完成，绘制图片
      ctx.save();
      ctx.clip();
      ctx.drawImage(
        ball.image,
        ball.x - ball.radius,
        ball.y - ball.radius,
        ball.radius * 2,
        ball.radius * 2
      );
      ctx.restore();
    } else {
      // 否则使用颜色填充
      ctx.fillStyle = ball.color;
      ctx.fill();
    }
    ctx.closePath();

    // 绘制文本
    if (ball.text) {
      ctx.fillStyle = ball.textColor;
      ctx.font = `${ball.radius * 0.4}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ball.text, ball.x, ball.y);
    }
  };

  const loadImage = (src: string): HTMLImageElement => {
    const img = new Image();
    img.src = src;
    return img;
  };

  // 添加鼠标事件处理函数
  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 检查是否点击到了某个球
    const clickedBall = ballsRef.current.find(ball => {
      const dx = ball.x - x;
      const dy = ball.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= ball.radius;
    });

    if (clickedBall) {
      clickedBall.isDragging = true;
      setDraggedBall(clickedBall);
      // 暂停被拖动球的速度
      clickedBall.vx = 0;
      clickedBall.vy = 0;
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !draggedBall) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 更新拖动球的位置
    draggedBall.x = Math.max(draggedBall.radius, Math.min(width - draggedBall.radius, x));
    draggedBall.y = Math.max(draggedBall.radius, Math.min(height - draggedBall.radius, y));
    setMousePos({ x, y });
  };

  const handleMouseUp = () => {
    if (draggedBall) {
      draggedBall.isDragging = false;
      
      // 计算释放时的速度（基于鼠标移动）
      const speedFactor = 0.2; // 调整这个值来改变释放后的速度
      draggedBall.vx = (mousePos.x - draggedBall.x) * speedFactor;
      draggedBall.vy = (mousePos.y - draggedBall.y) * speedFactor;
      
      // 确保速度不会太小
      const minSpeed = 0.5;
      const speed = Math.sqrt(draggedBall.vx * draggedBall.vx + draggedBall.vy * draggedBall.vy);
      if (speed < minSpeed) {
        const angle = Math.atan2(draggedBall.vy, draggedBall.vx);
        draggedBall.vx = Math.cos(angle) * minSpeed;
        draggedBall.vy = Math.sin(angle) * minSpeed;
      }
    }
    setDraggedBall(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ballsRef.current = initBalls(minVelocity, maxVelocity);

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
  }, [width, height, balls]);

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
        style={{ border: '1px solid #ccc', cursor: draggedBall ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
};

export default CollisionBalls; 