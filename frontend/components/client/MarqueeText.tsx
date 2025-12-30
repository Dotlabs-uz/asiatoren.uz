"use client";

interface MarqueeTextProps {
    text: string;
    speed?: number;
}

export const MarqueeText = ({ text, speed = 10 }: MarqueeTextProps) => {
    return (
        <div className="marquee-wrapper w-full">
            <div
                className="marquee-content"
                style={
                    { "--marquee-speed": `${speed}s` } as React.CSSProperties
                }
            >
                {Array(20)
                    .fill(text)
                    .map((item, index) => (
                        <div className="flex justify-center items-center">
                            <span key={index} className="marquee-item">
                                {item}
                            </span>
                            <img
                                src={"/images/star.svg"}
                                alt="star"
                                className="text-cRed w-10 h-10 mr-8"
                            />
                        </div>
                    ))}
            </div>
        </div>
    );
};
