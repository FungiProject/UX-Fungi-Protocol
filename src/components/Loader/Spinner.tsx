// React
import React from "react";

export default function Loader() {
  const numDots = 8;
  const duration = 1.2;
  const dots = Array.from({ length: numDots }, (_, index) => index);

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
