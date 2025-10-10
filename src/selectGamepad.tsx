import React, { useEffect, useRef, useState } from "react";

type GamepadState = {
  id: string;
  index: number;
  buttons: readonly GamepadButton[];
  axes: readonly number[];
};

function GamepadViewer({
  selectController,
}: {
  selectController: (c: GamepadState) => void;
}): React.JSX.Element {
  const [controllers, setControllers] = useState<Record<number, GamepadState>>(
    {}
  );
  const requestRef = useRef<number | null>(null);

  // 接続検出
  useEffect(() => {
    const connectHandler = (e: GamepadEvent) => {
      const gamepad = e.gamepad;
      setControllers((prev) => ({
        ...prev,
        [gamepad.index]: {
          id: gamepad.id,
          index: gamepad.index,
          buttons: [...gamepad.buttons],
          axes: [...gamepad.axes],
        },
      }));
    };

    const disconnectHandler = (e: GamepadEvent) => {
      setControllers((prev) => {
        const copy = { ...prev };
        delete copy[e.gamepad.index];
        return copy;
      });
    };

    window.addEventListener("gamepadconnected", connectHandler);
    window.addEventListener("gamepaddisconnected", disconnectHandler);

    return () => {
      window.removeEventListener("gamepadconnected", connectHandler);
      window.removeEventListener("gamepaddisconnected", disconnectHandler);
    };
  }, []);

  // 入力更新ループ
  useEffect(() => {
    const update = () => {
      const gamepads = navigator.getGamepads();
      const newControllers: Record<number, GamepadState> = {};

      for (const gp of gamepads) {
        if (gp) {
          newControllers[gp.index] = {
            id: gp.id,
            index: gp.index,
            buttons: [...gp.buttons],
            axes: [...gp.axes],
          };
        }
      }

      if (Object.keys(newControllers).length > 0) {
        setControllers(newControllers);
      }

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div>
      <h2>🎮 接続中のコントローラ 一覧</h2>
      {Object.values(controllers).map((c) => (
        <div key={c.index} style={{ marginBottom: "1em" }}>
          <strong>{c.id}</strong>
          <div>ボタン数: {c.buttons.length}</div>
          <div>スティック数: {c.axes.length}</div>
          <button onClick={() => selectController(c)}>use</button>
        </div>
      ))}
    </div>
  );
}

const Main = () => {
  const [page, setPage] = useState(0);
  const [controller, setController] = useState<GamepadState | null>(null);
  const requestRef = useRef<number | null>(null);
  const controllerRef = useRef<GamepadState | null>(null);

  useEffect(() => {
    controllerRef.current = controller;
  }, [controller]);

  useEffect(() => {
    const update = () => {
      const gamepads = navigator.getGamepads();
      const current = controllerRef.current;

      if (current) {
        const gp = gamepads[current.index];
        if (gp) {
          // Reactが再描画するように新しい配列を作成
          setController({
            id: gp.id,
            index: gp.index,
            buttons: [...gp.buttons],
            axes: [...gp.axes],
          });
        }
      }

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return page === 0 ? (
    <GamepadViewer
      selectController={(c) => {
        setController(c);
        setPage(1);
      }}
    />
  ) : (
    <div>
      <button onClick={() => setPage(0)}>戻る</button>
      <h1>選択中のコントローラ</h1>
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
        <div>コントローラが選択されていません。</div>
      )}
    </div>
  );
};

export default Main;
