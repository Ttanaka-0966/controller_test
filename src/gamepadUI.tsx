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
    btn: GamepadButton[];
    name: string[];
    style?: CSSProperties;
}

const FourButtons: React.FC<ButtonProps> = ({ btn, name, style }) => {
    const AButton: React.FC<{ btn: GamepadButton; name: string; style: React.CSSProperties }> = ({
        btn, name, style, }) => (
        <div className={`button ${btn.pressed ? "pressed" : ""}`}
            style={{ ...style }}>
            {name}
        </div>
    );

    return (
        <div className="setCenter" style={{ ...style }}>
            {/* 上 */}
            <AButton btn={btn[1]} name={name[3]}
                style={{ top: "-15%", left: "0%" }} />
            {/* 右 */}
            <AButton btn={btn[2]} name={name[0]}
                style={{ top: "0%", left: "8%" }} />
            {/* 下 */}
            <AButton btn={btn[0]} name={name[1]}
                style={{ top: "15%", left: "0%" }} />
            {/* 左 */}
            <AButton btn={btn[3]} name={name[2]}
                style={{ top: "0%", left: "-8%" }} />
        </div>
    );
};
const SideButtons: React.FC<ButtonProps> = ({ btn, name, style }) => {
    return (
        <div className="setCenter" style={{ ...style }}>
            <div className={`button ${btn[1].pressed ? "pressed" : ""}`}
                style={{
                    height: "20%", width: "15%", borderRadius: "10%",
                    top: "20%"
                }}>
                {name[1]}
            </div>
            <div className={`button ${btn[0].pressed ? "pressed" : ""}`}
                style={{ height: "15%", width: "20%", borderRadius: "10%" }}>
                {name[0]}
            </div>
        </div>
    )
};
const SmallButton: React.FC<ButtonProps> = ({ btn, name, style }) => {
    return (
        <div className="setCenter" style={{ ...style }}>
            <div className={`button ${btn[0].pressed ? "pressed" : ""}`}
                style={{ width: "7%" }}>
                {name[0]}
            </div>
        </div>
    )
};

const GamepadUI: React.FC<GamepadState> = ({ buttons, axes }) => {
    return (
        <div className="GamepadBackground">
            <Joystick x={axes[2]} y={axes[3] * -1}
                pressed={buttons[12].pressed} name="R"
                style={{ top: "55%", left: "55%", width: "20%" }} />
            <Joystick x={axes[0]} y={axes[1] * -1}
                pressed={buttons[11].pressed} name="L"
                style={{ top: "15%", left: "10%", width: "20%" }} />
            <FourButtons btn={[buttons[0], buttons[3],
            buttons[1], buttons[2]]} name={["→", "↓", "←", "↑"]}
                style={{ top: "25%", left: "75%" }} />
            <FourButtons btn={[buttons[0], buttons[3],
            buttons[1], buttons[2]]} name={["→", "↓", "←", "↑"]}
                style={{ top: "63%", left: "33%" }} />
            <SideButtons btn={[buttons[5], buttons[7]]} name={["R1", "R2"]}
                style={{ top: "-50%", left: "30%" }} />
            <SideButtons btn={[buttons[4], buttons[6]]} name={["L1", "L2"]}
                style={{ top: "-50%", left: "-30%" }} />
            <SmallButton btn={[buttons[9]]} name={["+"]}
                style={{ top: "-25%", left: "10%" }} />
            <SmallButton btn={[buttons[8]]} name={["-"]}
                style={{ top: "-25%", left: "-10%" }} />
            <SmallButton btn={[buttons[10]]} name={["home"]}
                style={{ top: "-10%", left: "0%" }} />
        </div>
    )
};

export default GamepadUI;
