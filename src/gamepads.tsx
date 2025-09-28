import React, { useEffect, useState, useRef } from "react";
import "./gamepads.css";

type GamepadState = {
    id: string;   //コントローラ名
    index: number;//コントローラ番号
    buttons: readonly GamepadButton[] | readonly (GamepadButton | number)[];
    axes: readonly number[];
};

const isGamepadButton = (b: GamepadButton | number): b is GamepadButton =>
    typeof b === "object" && b !== null && "pressed" in (b as any);

const GamepadViewer: React.FC = () => {
    const [controllers, setControllers] = useState<Record<number, GamepadState>>({});
    const requestRef = useRef<number | null>(null);

    const addGamepad = (gamepad: Gamepad) => {
        setControllers((prev) => ({
            ...prev,
            [gamepad.index]: {
                id: gamepad.id,
                index: gamepad.index,
                buttons: gamepad.buttons,
                axes: gamepad.axes,
            },
        }));
    };

    const connectHandler = (e: GamepadEvent) => {
        addGamepad(e.gamepad);
    };

    const disconnectHandler = (e: GamepadEvent) => {
        setControllers((prev) => {
            // 非破壊的に指定キーを除去して返す方法
            const { [e.gamepad.index]: _removed, ...rest } = prev;
            return rest;
        });
    };

    const updateStatus = () => {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];

        const newControllers: Record<number, GamepadState> = {};
        for (let i = 0; i < gamepads.length; i++) {
            const gp = gamepads[i];
            if (gp) {
                newControllers[gp.index] = {
                    id: gp.id,
                    index: gp.index,
                    buttons: gp.buttons,
                    axes: gp.axes,
                };
            }
        }

        // 必要なら差分チェックを入れて更新回数を減らす（ここでは単純に置き換え）
        setControllers(newControllers);
        requestRef.current = requestAnimationFrame(updateStatus);
    };

    useEffect(() => {
        window.addEventListener("gamepadconnected", connectHandler);
        window.addEventListener("gamepaddisconnected", disconnectHandler);

        // 初期スキャン（接続済みのパッドがある場合を補完）
        const initial = navigator.getGamepads ? navigator.getGamepads() : [];
        for (const gp of initial) {
            if (gp) addGamepad(gp);
        }

        requestRef.current = requestAnimationFrame(updateStatus);

        return () => {
            window.removeEventListener("gamepadconnected", connectHandler);
            window.removeEventListener("gamepaddisconnected", disconnectHandler);

            if (requestRef.current != null) {
                cancelAnimationFrame(requestRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div id="gamepad-viewer">
            <h1 className="controller">{Object.keys(controllers).length === 0
             ? "接続待機中 入力すると接続されます" : Object.keys(controllers).length+"台接続完了"}</h1>
            {Object.values(controllers).map((controller) => (
                <div key={controller.index} className="controller">
                    <h2>接続Gamepad情報:</h2>
                    <h1>{controller.id}</h1>

                    <div className="buttons">
                        <h2>ボタンコントロール情報:</h2>
                        {controller.buttons.map((btn, i) => {
                            const pressed = isGamepadButton(btn) ? btn.pressed : btn === 1.0;
                            const val = isGamepadButton(btn) ? btn.value : Number(btn);
                            return (
                                <div key={i} className={`button ${pressed ? "pressed" : ""}`}>
                                    B{i}
                                    <div className="value-bar">
                                        <div
                                            className="value-bar-fill"
                                            style={{ width: `${Math.round(val * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="axes">
                        <h2>アナログコントロール情報:</h2>
                        {controller.axes.map((axis, i) => (
                            <div key={i}>
                                <h3>axis {i}</h3>
                                <meter min={-1} max={1} value={axis}></meter>
                                <span>{axis.toFixed(4)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GamepadViewer;
