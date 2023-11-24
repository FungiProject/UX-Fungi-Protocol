import React from "react";

export default function Spinner() {
  const dots = Array.from({ length: 8 }, (_, index) => index);
  const numDots = 8;
  const duration = 5;

  return (
    <div className="spinner">
      {dots.map((dot) => (
        <div
          key={dot}
          className="dot"
          style={{
            animation: `colorChange ${duration}s infinite`,
            transform: `rotate(${
              (360 / numDots) * dot
            }deg) translate(-50%, -50%)`,
            marginLeft: `${
              Math.cos(((360 / numDots) * dot * Math.PI) / 180) * 30
            }px`,
            marginTop: `${
              Math.sin(((360 / numDots) * dot * Math.PI) / 180) * 30
            }px`,
            animationDelay: `-${(dot * duration) / numDots}s`,
          }}
        />
      ))}
    </div>
  );
}
