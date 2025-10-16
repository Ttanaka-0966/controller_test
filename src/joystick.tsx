import React, { useState, useEffect } from "react";
import "./joystick.css";

type JoystickProps = {
  x: number; // -1 ~ 1
  y: number; // -1 ~ 1
    pressed?: boolean;
    name?: string;
};

const Joystick: React.FC<JoystickProps> = ({ x, y, pressed,name}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // 値を -1〜1 の範囲にクリップ
    const clamp = (val: number) => Math.max(-1, Math.min(1, val));
    setPosition({
      x: clamp(x),
      y: clamp(y),
    });
  }, [x, y]);

  const baseSize = 180; // ベース円の直径(px)
  const knobSize = 100;  // ノブ円の直径(px)
  const radius = (baseSize - knobSize) / 2;

  // 座標変換 (-1〜1) → ピクセル位置
  const knobX = position.x * radius;
  const knobY = -position.y * radius; // Y軸は反転

  return (
    <div className="joystick-base" style={{ width: baseSize, height: baseSize }}>
      <div
        className="joystick-knob"
        style={{
          width: knobSize,
          height: knobSize,
          fontSize: knobSize/3,
          transform: `translate(${knobX}px, ${knobY}px)`,
            backgroundColor: pressed ? "#d32f2f" : "#4caf50",
        }}
      >{name}</div>
    </div>
  );
};

export default Joystick;
