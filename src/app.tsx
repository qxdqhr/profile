import type { FC } from "react";
import { useState } from "react";

import $styles from "./app.module.css";
import About from "./components/About";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import NavbarToggle from "./components/NavbarToggle";
import ProjectCarousel from "./components/ProjectCarousel";

const config = {
  // 首页配置
  homeConfig: {
    title: "你好，我是皋月朔星",
    subtitle: "我会在这里记录coding生活中遇到的大大小小的故事",
    buttons: [
      { text: "查看作品", link: "#projects" },
      { text: "联系我", link: "#contact" },
    ],
    imageSrc: "/images/home.webp",
  },
  // 导航配置
  navConfig: {
    avatar: "/images/avatar.jpg",
    direction: "vertical" as "horizontal" | "vertical",
    items: [
      { id: "home", label: "主页", href: "#home" },
      {
        id: "about",
        label: "关于我",
        href: "#about",
      },
      {
        id: "projects",
        label: "项目",
        href: "#projects",
        children: [
          { id: "web", label: "Web项目", href: "#web-projects" },
          { id: "mobile", label: "移动端项目", href: "#mobile-projects" },
        ],
      },
      { id: "contact", label: "联系方式", href: "#contact" },
    ],
  },
  // 时间线配置
  timelineConfig: {
    timelines: [
      {
        direction: "vertical" as const,
        items: [
          { date: "Career Start" },
          {
            date: "2021.6",
            title: "哈尔滨理工大学",
            description: "在学校学习了C++ 与Qt开发、网络编程、数据结构、算法等",
            tags: ["C++", "Qt"],
          },
          { date: "北京篇" },
          {
            date: "2021.7",
            title: "校招实习：Go开发工程师",
            description:
              "在公司学习了Go开发、Gin、Gorm、MySQL 对于后端应用的curd操作有了一定的了解",
            tags: ["Go", "Gin", "Gorm", "MySQL"],
          },
          {
            date: "2021.12",
            title: "校招实习+报道：Mac开发工程师",
            description:
              "在公司学习了Objective-C、Swift、Mac开发、CocoaPods、Xcode等",
            tags: ["Objective-C", "Swift", "CocoaPods", "Xcode"],
          },
          {
            date: "2024.04",
            title: "第一次社招：iOS开发工程师",
            description:
              "在公司学习了Objective-C、Swift、iOS开发、CocoaPods、Xcode等",
            tags: ["Objective-C", "Swift", "CocoaPods", "Xcode"],
          },
          {
            date: "2025.01",
            title: "个人学习：React",
            description:
              "在个人学习了React、TypeScript、Next.js、Tailwind CSS等",
            tags: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
          },
        ],
      },
    ],
  },
  // 碰撞球配置
  collisionBallsConfig: {
    balls: [
      { text: "Swift", textColor: "#fff", weight: 30, color: "#FFB6B9" },
      { text: "Objective-C", textColor: "#fff", weight: 25, color: "#FAE3D9" },
      { text: "C++", textColor: "#fff", weight: 20, color: "#BBDED6" },
      { text: "TypeScript", textColor: "#fff", weight: 15, color: "#61C0BF" },
      { text: "React", textColor: "#000", weight: 10, color: "#61C0BF" },
    ],
    width: 800,
    height: 600,
    minVelocity: 0.5,
    maxVelocity: 2,
  },
  // 项目展示配置
  projectsConfig: {
    projects: [
      {
        id: "1",
        title: "个人博客系统",
        description:
          "使用 React + TypeScript 开发的个人博客系统，支持文章管理、评论系统等功能",
        image: "/images/blog-image.jpg",
        tags: ["React", "TypeScript", "Node.js"],
        link: "https://github.com/yourusername/blog",
      },
      {
        id: "2",
        title: "在线聊天应用",
        description: "基于 WebSocket 的实时聊天应用，支持群聊和私聊功能",
        image: "/images/chat-image.jpg",
        tags: ["WebSocket", "React", "Express"],
        link: "https://github.com/yourusername/chat",
      },
      {
        id: "3",
        title: "在线聊天应用",
        description: "基于 WebSocket 的实时聊天应用，支持群聊和私聊功能",
        image: "/images/chat-image.jpg",
        tags: ["WebSocket", "React", "Express"],
        link: "https://github.com/yourusername/chat",
      },
      // 添加更多项目...
    ],
  },
};

// 页面组件
const Section: FC<{
  id: string;
  title: string;
  children?: React.ReactNode;
}> = ({ id, title, children }) => (
  <section
    id={id}
    className="tw-min-h-screen tw-flex tw-items-center tw-flex-col"
  >
    <h2>{title}</h2>
    {children}
  </section>
);

const App: FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const isVertical = config.navConfig.direction === ("vertical" as const);

  return (
    <div className={$styles.app}>
      {isVertical && (
        <NavbarToggle isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
      )}
      <div
        className={`main-container ${isOpen ? "open" : "closed"} ${isVertical ? "vertical" : "horizontal"}`}
      >
        <Navbar
          direction={config.navConfig.direction}
          items={config.navConfig.items}
          isOpen={isOpen}
          avatarSrc={config.navConfig.avatar}
        />
        <div className="content-wrapper">
          <Home homeConfig={config.homeConfig} />
          <About
            timelineConfig={config.timelineConfig}
            collisionBallsConfig={config.collisionBallsConfig}
          />
          <ProjectCarousel projects={config.projectsConfig.projects} />
          <Section id="contact" title="联系方式">
            <p>这是我的联系方式...</p>
          </Section>
          <Section id="experience" title="经历" />
        </div>
      </div>
    </div>
  );
};

export default App;
