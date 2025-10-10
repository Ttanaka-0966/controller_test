import React, { useEffect, useRef, useState } from "react";

type GamepadState = {
    id: string;
    index: number;
    buttons: readonly GamepadButton[];
    axes: readonly number[];
};

const Main = () => {

    //Gamepad一台シンプルに使いたければここから...
    const [controller, setController] = useState<GamepadState | null>(null);
    const requestRef = useRef<number | null>(null);

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
    //ここまでコピペする

    return (
        <div>
            <h1>コントローラ接続</h1>
            {controller ? (
                <div>
                    <h2>{controller.id}</h2>
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
                </div>
            ) : (
                <div>コントローラ未接続</div>
            )}
        </div>
    );
};

export default Main;
