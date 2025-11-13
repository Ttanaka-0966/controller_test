import React, { useState, useEffect } from "react";
import GamepadUI from "./gamepadUI";
import useController from "./gamepadAPI";

type GamepadState = {
    id: string;
    index: number;
    buttons: readonly GamepadButton[];
    axes: readonly number[];
};

const DebugUI: React.FC<GamepadState> = ({ id, buttons, axes }) => {

    const [preButtons, setPreButtons] = useState<readonly GamepadButton[]>(buttons);
    const [log, setLog] = useState<number[]>([]);
    useEffect(() => {
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].pressed && !preButtons[i].pressed) {
                setLog(prev => {
                    const updated = [i,...prev];
                    return updated.slice(0,20);
                });
            }
        }
        setPreButtons(buttons);
    }, [buttons]);

    return (
        <div>
            <h2>{"id: " + id}</h2>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <div>
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
                <div style={{ marginLeft: "50px" }}>
                    <h2>ボタンログ(最新順)</h2>
                    {log.map((btnIndex, i) => (
                        <div key={i} style={{border: "2px solid black",
                            display: "flex",justifyContent: "center",alignItems: "center",
                            aspectRatio: "1",borderRadius: "50%",backgroundColor: "lightgray",
                            color: "gray",width:"30px"
                        }}>{btnIndex}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Main = () => {

    const [page, setPage] = useState<string>("gamepad");

    const Controller = useController();

    return (
        <div>
            {Controller ? (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    {page === "gamepad" ? (
                        <div>
                            <button onClick={() => setPage("debug")}
                                style={{ position: "absolute", top: "0", margin: "10px", fontSize: "30px" }}>
                                デバッグ表示へ</button>
                            <GamepadUI {...Controller} />
                        </div>
                    ) : null}
                    {page === "debug" ? (
                        <div>
                            <button onClick={() => setPage("gamepad")}
                                style={{ position: "relative", margin: "10px" }}>
                                コントローラ表示へ</button>
                            <DebugUI {...Controller} />
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