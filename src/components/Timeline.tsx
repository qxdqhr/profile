import React from 'react';

interface TimelineItem {
    date: string;
    title?: string;
    description?: string;
    tags?: string[];
}

interface Timeline {
    items: TimelineItem[];
    direction?: 'vertical' | 'horizontal';
}

interface TimelineProps {
    timelines: Timeline[];
}

const TimelineContent: React.FC<{ item: TimelineItem }> = ({ item }) => (
    <div className="timeline__content">
        <div className="timeline__dot" />
        {item.title && <h3 className="timeline__title">{item.title}</h3>}
        {item.description && <p className="timeline__description">{item.description}</p>}
        {item.tags && (
            <div className="timeline__tags">
                {item.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="timeline__tag">
                        {tag}
                    </span>
                ))}
            </div>
        )}
    </div>
);

const TimelineItem: React.FC<{ item: TimelineItem }> = ({ item }) => (
    <div className={`timeline__item ${(!item.title && !item.description) ? 'date-only' : ''}`}>
        <div className="timeline__date">{item.date}</div>
        {(item.title || item.description) && <TimelineContent item={item} />}
    </div>
);

const SingleTimeline: React.FC<{ timeline: Timeline }> = ({ timeline }) => (
    <div className={`timeline ${timeline.direction === 'horizontal' ? 'horizontal' : 'vertical'}`}>
        {timeline.items.map((item, index) => (
            <TimelineItem key={index} item={item} />
        ))}
    </div>
);

const Timeline: React.FC<TimelineProps> = ({ timelines }) => (
    <div className="timelines">
        {timelines.map((timeline, index) => (
            <SingleTimeline key={index} timeline={timeline} />
        ))}
    </div>
);

export default Timeline; 