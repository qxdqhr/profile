import type { FC } from 'react';
import { useState } from 'react';
import $styles from './app.module.css';
import Home from './components/Home';
import Navbar from './components/Navbar';
import NavbarToggle from './components/NavbarToggle';
import Timeline from './components/Timeline';
import CollisionBalls from './components/CollisionBalls';

// 导航配置
const navConfig = {
    direction: 'vertical' as 'horizontal' | 'vertical',
    items: [
        { id: 'home', label: '主页', href: '#home' },
        {
            id: 'timeline',
            label: '关于我',
            href: '#timeline',
            children: [
                { id: 'skills', label: '技能', href: '#skills' },
                { id: 'experience', label: '经历', href: '#experience' },
            ],
        },
        {
            id: 'projects',
            label: '项目',
            href: '#projects',
            children: [
                { id: 'web', label: 'Web项目', href: '#web-projects' },
                { id: 'mobile', label: '移动端项目', href: '#mobile-projects' },
            ],
        },
        { id: 'contact', label: '联系方式', href: '#contact' },
    ],
};

// 首页配置
const homeConfig = {
    title: '你好，我是皋月朔星',
    subtitle: '我会在这里记录coding生活中遇到的大大小小的故事',
    buttons: [
        { text: '查看作品', link: '#projects' },
        { text: '联系我', link: '#contact' },
    ],
    imageSrc: './src/assets/images/home.webp',
};

// 时间线配置
const timelineConfig = {
    timelines: [
        {
            direction: 'horizontal' as const,
            items: [
                { date: 'Career Start' },
                {
                    date: '2021.6',
                    title: '哈尔滨理工大学',
                    description: '在学校学习了C++ 与Qt开发、网络编程、数据结构、算法等',
                    tags: ['C++', 'Qt']
                },
                { date: '北京篇' },
                {
                    date: '2021.7',
                    title: '校招实习：Go开发工程师',
                    description: '在公司学习了Go开发、Gin、Gorm、MySQL 对于后端应用的curd操作有了一定的了解',
                    tags: ['Go', 'Gin', 'Gorm', 'MySQL']
                },
                {
                    date: '2021.12',
                    title: '校招实习+报道：Mac开发工程师',
                    description: '在公司学习了Objective-C、Swift、Mac开发、CocoaPods、Xcode等',
                    tags: ['Objective-C', 'Swift', 'CocoaPods', 'Xcode']
                },
                {
                    date: '2024.04',
                    title: '第一次社招：iOS开发工程师',
                    description: '在公司学习了Objective-C、Swift、iOS开发、CocoaPods、Xcode等',
                    tags: ['Objective-C', 'Swift', 'CocoaPods', 'Xcode']
                },
                {
                    date: '2025.01',
                    title: '个人学习：React',
                    description: '在个人学习了React、TypeScript、Next.js、Tailwind CSS等',
                    tags: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS']
                }
            ]
        },
        
    ]
};

// 页面组件
const Section: FC<{ id: string; title: string; children?: React.ReactNode }> = ({ id, title, children }) => (
    <section id={id} className="tw-min-h-screen tw-flex tw-items-center tw-flex-col">
        <h2>{title}</h2>
        {children}
    </section>
);

const App: FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const isVertical = navConfig.direction === ('vertical' as const);

    return (
        <div className={$styles.app}>
            {isVertical && (
                <NavbarToggle isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
            )}
            <div className={`main-container ${isOpen ? 'open' : 'closed'} ${isVertical ? 'vertical' : 'horizontal'}`}>
                <Navbar
                    direction={navConfig.direction}
                    items={navConfig.items}
                    isOpen={isOpen}
                />
                <div className="content-wrapper">
                    <Home {...homeConfig} />
                    <Timeline timelines={timelineConfig.timelines} />
                    <CollisionBalls 
                        weights={[10, 20, 15, 30, 25]}
                        width={800}
                        height={600}
                        colors={['#FFB6B9', '#FAE3D9', '#BBDED6', '#61C0BF']}
                    />
                    <Section id="projects" title="项目展示">
                        <p>这里展示我的项目...</p>
                    </Section>

                    <Section id="contact" title="联系方式">
                        <p>这是我的联系方式...</p>
                    </Section>

                    <Section id="experience" title="经历" />

                    <CollisionBalls 
                        weights={[10, 20, 15, 30, 25]}
                        width={800}
                        height={600}
                        colors={['#FFB6B9', '#FAE3D9', '#BBDED6', '#61C0BF']}
                    />
                </div>
            </div>
        </div>
    );
};

export default App;
