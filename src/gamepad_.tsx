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

const DebugUI: React.FC<GamepadState> = ({ id, buttons, axes }) => {
    return (
        <div>
            <h2>{"id:" + id}</h2>
            <div>
                <h3>ボタン</h3>
                {buttons.map((btn, i) => (
                    <div key={i}>
                        ボタン {i}: {btn.pressed ? "押下中" : "離されている"} (値:{" "}
                        {btn.value})
                    </div>
                ))}
            </div>
            <div>
                <h3>スティック</h3>
                {axes.map((axis, i) => (
                    <div key={i}>
                        軸 {i}: {axis.toFixed(2)}
                    </div>
                ))}
            </div>
        </div>
    );
};

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

const GamepadUI: React.FC<GamepadState> = ({ buttons, axes }) => {
    return (
        <div className="GamepadBackground">
            <div style={{ display: "flex", position: "absolute" }}>
                <Joystick x={axes[2]} y={axes[3] * -1}
                    pressed={buttons[11].pressed} name="R" />
                <FourButtons btn={[buttons[0], buttons[3],
                buttons[1], buttons[2]]} name={["→", "←", "↓", "↑"]} />
                <SmallButton btn={[buttons[9]]} name={["+"]} />
                <SideButtons btn={[buttons[5], buttons[7]]} name={["R1", "R2"]} />
            </div>
        </div>
    )
};

const Main = () => {

    const [page, setPage] = useState<string>("gamepad");

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
        <div style={{}}>
            {controller ? (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    {page === "gamepad" ? (
                        <div>
                            <GamepadUI {...controller} />
                            <button onClick={() => setPage("debug")}>デバッグ表示へ</button>
                        </div>
                    ) : null}
                    {page === "debug" ? (
                        <div>
                            <DebugUI {...controller} />
                            <button onClick={() => setPage("gamepad")}>コントローラ表示へ</button>
                        </div>
                    ) : null}
                </div>
            ) : (
                <div className="GamepadBackground" style={{ fontSize: "80px" }}>未接続</div>
            )}

        </div>
    );
};

export default Main;
