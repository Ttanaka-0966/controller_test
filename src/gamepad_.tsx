import React, { useEffect, useRef, useState } from "react";
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
}

const FourButtons: React.FC<ButtonProps> = ({ btn, name }) => {
    return (
        <div className="fourButtons">
            <div className={`button ${btn[3].pressed ? "pressed" : ""}`}>
                {name[3]}
            </div>
            <div>
                <div className={`button ${btn[1].pressed ? "pressed" : ""}`}>
                    {name[1]}
                </div>
                <div style={{ padding: "60px" }}></div>
                <div className={`button ${btn[0].pressed ? "pressed" : ""}`}>
                    {name[0]}
                </div>
            </div>
            <div className={`button ${btn[2].pressed ? "pressed" : ""}`}>
                {name[2]}
            </div>
        </div>
    )
};
const SideButtons: React.FC<ButtonProps> = ({ btn, name }) => {
    return (
        <div className="sideButtons">
            <div className={`button ${btn[1].pressed ? "pressed" : ""}`}
                style={{ height: "100px", width: "70px", borderRadius: "10%" }}>
                {name[1]}
            </div>
            <div className={`button ${btn[0].pressed ? "pressed" : ""}`}
                style={{ width: "100px", height: "40px", borderRadius: "10%" }}>
                {name[0]}
            </div>
        </div>
    )
};
const SmallButton: React.FC<ButtonProps> = ({ btn, name }) => {
    return (
        <div className="smallButton">
            <div className={`button ${btn[0].pressed ? "pressed" : ""}`}
                style={{ width: "40px", height: "40px" }}>
                {name[0]}
            </div>
        </div>
    )
};

const Main = () => {

    //Gamepad一台シンプルに使いたければここから...
    const [controller, setController] = useState<GamepadState | null>(null);
    const requestRef = useRef<number | null>(null);

    useEffect(() => {
        const handleConnect = (e: GamepadEvent) => {
            setController({
                id: e.gamepad.id,
                index: e.gamepad.index,
                buttons: [...e.gamepad.buttons],
                axes: [...e.gamepad.axes],
            });
        };

        const handleDisconnect = () => {
            setController(null);
        };

        window.addEventListener("gamepadconnected", handleConnect);
        window.addEventListener("gamepaddisconnected", handleDisconnect);

        return () => {
            window.removeEventListener("gamepadconnected", handleConnect);
            window.removeEventListener("gamepaddisconnected", handleDisconnect);
        };
    }, []);

    useEffect(() => {
        const update = () => {
            const gamepads = navigator.getGamepads();

            const gp = gamepads[0];

            if (gp) {
                setController(prev => {
                    if (
                        !prev ||
                        prev.id !== gp.id ||
                        gp.buttons.some((b, i) => b.pressed !== prev.buttons[i]?.pressed) ||
                        gp.axes.some((a, i) => a !== prev.axes[i])
                    ) {
                        return {
                            id: gp.id,
                            index: gp.index,
                            buttons: [...gp.buttons],
                            axes: [...gp.axes],
                        };
                    }
                    return prev; // 状態が変わっていないなら再レンダーしない
                });
            }
            requestRef.current = requestAnimationFrame(update);
        };
        requestRef.current = requestAnimationFrame(update);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);
    //ここまでコピペする！！
    //複数台接続は非対応、切断してから接続する

    //ここからはUI表示例

    return (
        <div>
            <h1>コントローラ接続</h1>
            {controller ? (
                <div style={{ display: "flex" }}>
                    <div>
                        <h2>{"id:" + controller.id}</h2>
                        <div>
                            <h3>ボタン</h3>
                            {controller.buttons.map((btn, i) => (
                                <div key={i}>
                                    ボタン {i}: {btn.pressed ? "押下中" : "離されている"} (値:{" "}
                                    {btn.value})
                                </div>
                            ))}
                        </div>
                        <div>
                            <h3>スティック</h3>
                            {controller.axes.map((axis, i) => (
                                <div key={i}>
                                    軸 {i}: {axis.toFixed(2)}
                                </div>
                            ))}
                        </div>
                        <div className="GamepadBackground">
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Joystick x={controller.axes[2]} y={controller.axes[3] * -1}
                                    pressed={controller.buttons[11].pressed} name="R" />
                                <FourButtons btn={[controller.buttons[15], controller.buttons[14],
                                controller.buttons[13], controller.buttons[12]]} name={["→", "←", "↓", "↑"]} />
                                <SideButtons btn={[controller.buttons[5], controller.buttons[7]]} name={["R1", "R2"]} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <FourButtons btn={[controller.buttons[1], controller.buttons[2],
                        controller.buttons[0], controller.buttons[3]]} name={["→", "←", "↓", "↑"]} />
                        <SideButtons btn={[controller.buttons[4], controller.buttons[6]]} name={["L1", "L2"]} />
                        <SmallButton btn={[controller.buttons[9]]} name={["+"]} />

                        <Joystick x={controller.axes[0]} y={controller.axes[1] * -1}
                            pressed={controller.buttons[10].pressed} name="L" />

                    </div>
                </div>
            ) : (
                <div className="GamepadBackground">コントローラ未接続</div>
            )}
        </div>
    );
};

export default Main;
