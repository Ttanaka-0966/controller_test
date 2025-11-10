import React, { useState, useEffect, type CSSProperties } from "react";
import "./joystick.css";

type JoystickProps = {
  x: number; // -1 ~ 1
  y: number; // -1 ~ 1
  pressed?: boolean;
  name?: string;
  style?:CSSProperties;
};

const Joystick: React.FC<JoystickProps> = ({ x, y, pressed,name,style}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // 値を -1〜1 の範囲にクリップ
    const clamp = (val: number) => Math.max(-1, Math.min(1, val));
    setPosition({
      x: clamp(x),
      y: clamp(y),
    });
  }, [x, y]);

  const baseSize = 100; // ベース円
  const knobSize = 60;  // ノブ円
  const radius = (baseSize - knobSize);

  // 座標変換 (-1〜1) → ピクセル位置
  const knobX = position.x * radius;
  const knobY = -position.y * radius; // Y軸は反転

  return (
    <div className="joystick-base" style={{width: baseSize,
     ...style}}>
      <div
        className="joystick-knob"
        style={{
          width: `${knobSize}%`,
          height: `${knobSize}%`,
          transform: `translate(${knobX}%, ${knobY}%)`,
          backgroundColor: pressed ? "green":"#888"  ,
        }}
      >{name}</div>
    </div>
  );
};

export default Joystick;
