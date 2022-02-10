import { useCallback, useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import NumberInput from "./components/NumberInput";
import TextInput from "./components/TextInput";
import Timer from "./components/Timer";
import { useStateFactory } from "../";

function App() {
  const [state, usePartialState] = useStateFactory({
    num: 0,
    str: "",
    timer: 1,
  });

  const [stateLog, setStateLog] = useState({ ...state });

  // NOTE: If you check rendering count
  // useEffect(() => {
  //   console.log('render App')
  // },[state])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Inner Hooks + Demo</p>
        <NumberInput
          innerHooks={() => {
            const [value = 0, setValue] = usePartialState("num");
            return {
              value,
              onChange: (e) => {
                setValue(Number(e.target.value));
              },
            };
          }}
        />
        <TextInput
          innerHooks={() => {
            const [value = 0, setValue] = usePartialState("str");
            return {
              value,
              onChange: useCallback((e) => {
                // NOTE: You can see this is optimized rendering
                // See console in devtool and Input.tsx.
                setValue(e.target.value);
              }, []),
            };
          }}
        />
        <Timer
          innerHooks={() => {
            const [value = 0, setValue] = usePartialState("timer");
            useEffect(() => {
              const i = setInterval(() => {
                setValue((state) => state + 1);
              }, 1000);
              return;
            }, []);
            return {
              value,
            };
          }}
        />
        <input
          type="button"
          onClick={() => {
            setStateLog(state);
          }}
          value={"Current State Update"}
        />
        <p>current: {JSON.stringify(stateLog)}</p>
      </header>
    </div>
  );
}

export default App;
