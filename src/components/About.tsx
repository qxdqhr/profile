import React from "react";

import CollisionBalls from "./CollisionBalls";
import Timeline from "./Timeline";

interface AboutProps {
  timelineConfig: any; // 使用实际的类型
  collisionBallsConfig: any; // 使用实际的类型
}

const About: React.FC<AboutProps> = ({
  timelineConfig,
  collisionBallsConfig,
}) => {
  return (
    <div id="about" className="about-container">
      <div className="module-title h2">关于我</div>
      <div className="about-content">
        <Timeline timelineConfig={timelineConfig} />
        <CollisionBalls collisionBallsConfig={collisionBallsConfig} />
      </div>
    </div>
  );
};

export default About;
