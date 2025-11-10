import React, { useEffect, useRef, useState, type CSSProperties } from "react";
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

const FourButtons: React.FC<ButtonProps> = ({ btn, name, style }) => {
    const AButton: React.FC<{ btn: GamepadButton; name: string; style: React.CSSProperties }> = ({
        btn, name, style, }) => (
        <div className={`button ${btn.pressed ? "pressed" : ""}`} 
        style={{...style}}>
            {name}
        </div>
    );

    return (
        <div className="setCenter" style={{...style}}>
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
        <div className="setCenter" style={{...style}}>
            <div className={`button ${btn[1].pressed ? "pressed" : ""}`}
                style={{ height: "20%", width: "15%", borderRadius: "10%",
                    top:"20%"}}>
                {name[1]}
            </div>
            <div className={`button ${btn[0].pressed ? "pressed" : ""}`}
                style={{ height: "15%", width: "20%", borderRadius: "10%" }}>
                {name[0]}
            </div>
        </div>
    )
};
const SmallButton: React.FC<ButtonProps> = ({ btn, name,style }) => {
    return (
        <div className="setCenter" style={{...style}}>
            <div className={`button ${btn[0].pressed ? "pressed" : ""}`}
                style={{ width: "7%"}}>
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
                style={{top: "50%", left: "55%",width: "20%"}} />
            <Joystick x={axes[0]} y={axes[1] * -1}
                pressed={buttons[11].pressed} name="L"
                style={{top: "15%", left: "10%",width: "20%"}} />
            <FourButtons btn={[buttons[0], buttons[3],
            buttons[1], buttons[2]]} name={["→", "↓", "←", "↑"]}
                style={{ top: "25%", left: "75%"}} />
            <FourButtons btn={[buttons[0], buttons[3],
            buttons[1], buttons[2]]} name={["→", "↓", "←", "↑"]}
                style={{ top: "60%", left: "30%"}} />
            <SideButtons btn={[buttons[5], buttons[7]]} name={["R1", "R2"]}
                style={{top:"-50%",left:"30%"}}/>
            <SideButtons btn={[buttons[4], buttons[6]]} name={["L1", "L2"]}
                style={{top:"-50%",left:"-30%"}}/>
            <SmallButton btn={[buttons[9]]} name={["+"]}
                style={{top:"-25%",left:"10%"}} />
            <SmallButton btn={[buttons[8]]} name={["-"]}
                style={{top:"-25%",left:"-10%"}} />
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
                            <button onClick={() => setPage("debug")} 
                            style={{position:"absolute",top:"0",margin:"10px"}}>
                                デバッグ表示へ</button>
                        </div>
                    ) : null}
                    {page === "debug" ? (
                        <div>
                            <button onClick={() => setPage("gamepad")} 
                            style={{position:"relative",margin:"10px"}}>
                                コントローラ表示へ</button>
                            <DebugUI {...controller} />
                        </div>
                    ) : null}
                </div>
            ) : (
                <div className="GamepadBackground" style={{ fontSize: "10vw" }}>未接続</div>
            )}

        </div>
    );
};

export default Main;
