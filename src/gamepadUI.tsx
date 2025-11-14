import React, { type CSSProperties } from "react";
import "./gamepadUI.css";
import Joystick from "./joystick";

type GamepadState = {
    id: string;
    index: number;
    buttons: readonly GamepadButton[];
    axes: readonly number[];
};

type ButtonProps = {
    btn: (GamepadButton | undefined)[];
    name: string[];
    style?: CSSProperties;
};

// 安全に pressed を取得する関数
const isPressed = (btn?: GamepadButton) => btn?.pressed ?? false;

const FourButtons: React.FC<ButtonProps> = ({ btn, name, style }) => {
    const AButton: React.FC<{ btn?: GamepadButton; name: string; style: React.CSSProperties }> = ({
        btn,
        name,
        style,
    }) => (
        <div
            className={`button ${isPressed(btn) ? "pressed" : ""}`}
            style={{ ...style }}
        >
            {name}
        </div>
    );

    return (
        <div className="setCenter" style={{ ...style }}>
            {/* 上 */}
            <AButton btn={btn[3]} name={name[3]} style={{ top: "-15%", left: "0%" }} />
            {/* 右 */}
            <AButton btn={btn[0]} name={name[0]} style={{ top: "0%", left: "8%" }} />
            {/* 下 */}
            <AButton btn={btn[1]} name={name[1]} style={{ top: "15%", left: "0%" }} />
            {/* 左 */}
            <AButton btn={btn[2]} name={name[2]} style={{ top: "0%", left: "-8%" }} />
        </div>
    );
};

const SideButtons: React.FC<ButtonProps> = ({ btn, name, style }) => {
    return (
        <div className="setCenter" style={{ ...style }}>
            <div
                className={`button ${isPressed(btn[1]) ? "pressed" : ""}`}
                style={{
                    height: "20%",
                    width: "15%",
                    borderRadius: "10%",
                    top: "20%",
                }}
            >
                {name[1]}
            </div>
            <div
                className={`button ${isPressed(btn[0]) ? "pressed" : ""}`}
                style={{ height: "15%", width: "20%", borderRadius: "10%" }}
            >
                {name[0]}
            </div>
        </div>
    );
};

const SmallButton: React.FC<ButtonProps> = ({ btn, name, style }) => {
    return (
        <div className="setCenter" style={{ ...style }}>
            <div
                className={`button ${isPressed(btn[0]) ? "pressed" : ""}`}
                style={{ width: "7%" }}
            >
                {name[0]}
            </div>
        </div>
    );
};

const GamepadUI: React.FC<GamepadState> = ({ buttons, axes }) => {
    // 安全に配列アクセス（存在しない場合は undefined）
    const safe = (i: number) => buttons[i];

    return (
        <div className="GamepadBackground">
            <Joystick
                x={axes[2]}
                y={axes[3] * -1}
                pressed={safe(11)?.pressed ?? false}
                name="R"
                style={{ top: "55%", left: "55%", width: "20%" }}
            />
            <Joystick
                x={axes[0]}
                y={axes[1] * -1}
                pressed={safe(10)?.pressed ?? false}
                name="L"
                style={{ top: "15%", left: "10%", width: "20%" }}
            />
            <FourButtons
                btn={[safe(1), safe(0), safe(2), safe(3)]}
                name={["B", "A", "X", "Y"]}
                style={{ top: "25%", left: "75%" }}
            />
            <FourButtons
                btn={[safe(15), safe(13), safe(14), safe(12)]}
                name={["→", "↓", "←", "↑"]}
                style={{ top: "63%", left: "33%" }}
            />
            <SideButtons
                btn={[safe(5), safe(7)]}
                name={["R1", "R2"]}
                style={{ top: "-50%", left: "30%" }}
            />
            <SideButtons
                btn={[safe(4), safe(6)]}
                name={["L1", "L2"]}
                style={{ top: "-50%", left: "-30%" }}
            />
            <SmallButton btn={[safe(9)]} name={["+"]} style={{ top: "-25%", left: "10%" }} />
            <SmallButton btn={[safe(8)]} name={["-"]} style={{ top: "-25%", left: "-10%" }} />
            <SmallButton btn={[safe(16)]} name={["H"]} style={{ top: "-10%", left: "0%" }} />
        </div>
    );
};

export default GamepadUI;
