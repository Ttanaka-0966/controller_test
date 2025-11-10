import React, { useEffect, useRef, useState } from "react";
import GamepadUI from "./gamepadUI";

type GamepadState = {
    id: string;
    index: number;
    buttons: readonly GamepadButton[];
    axes: readonly number[];
};

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
                            <button onClick={() => setPage("debug")} 
                            style={{position:"absolute",top:"0",margin:"10px"}}>
                                デバッグ表示へ</button>
                            <GamepadUI {...controller} />
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