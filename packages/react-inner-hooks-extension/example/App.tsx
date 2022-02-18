import './extension'
import React, { createRef, FunctionComponent, MutableRefObject, useCallback, useEffect, useState } from 'react'
import { createSharedRefHooks, useSharedRef, useStateFactory } from '../'
import './App.css'
import Input from './components/Input'
import NumberInput from './components/NumberInput'
import TextInput from './components/TextInput'
import Timer from './components/Timer'
import logo from './logo.svg'

const [useScopedSharedRef] = createSharedRefHooks({
  focus: createRef<HTMLInputElement>()
})

const ScopableKeys = {
  focus: Symbol('focus')
}

debugger

const useSharedRefExample = () => {
  const focusEle: HTMLInputElement | undefined = useSharedRef('focus').current
  useEffect(() => {
    focusEle?.focus()
  }, [focusEle])
  const scopedEle: HTMLInputElement | undefined = useScopedSharedRef('focus').current
  useEffect(() => {
    scopedEle && console.log(scopedEle.value)
  }, [scopedEle])
  const symbolEle: HTMLInputElement | undefined = useSharedRef(ScopableKeys.focus).current
  useEffect(() => {
    symbolEle && console.log(symbolEle.value)
  }, [symbolEle])
}

const D: FunctionComponent<{ a: number; b: number }> = function (props) {
  return <></>
}

function App() {
  const [state, usePartialState] = useStateFactory({
    num: 0,
    str: '',
    timer: 1
  })

  const [stateLog, setStateLog] = useState({ ...state })

  // NOTE: If you check rendering count
  // useEffect(() => {
  //   console.log('render App')
  // },[state])

  const focusRef = useSharedRef('focus')
  const symbolFocusRef = useSharedRef(ScopableKeys.focus)
  const scopedFocusRef = useScopedSharedRef('focus')

  useSharedRefExample()

  const forwardedRef = useSharedRef<HTMLInputElement>('forwarded')
  const innerForwardedRef = useSharedRef('innerForwarded')
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Inner Hooks + Demo</p>
        <Input
          type={''}
          // value=''
          connectContainer={(a: {}, ref?: MutableRefObject<any>) => {
            debugger
            return {
              value: ''
            }
          }}
        />
        <D
          // a={1}
          b={2}
          connectContainer={() => {
            return {
              a: 1
            }
          }}
        />
        <NumberInput
          ref={innerForwardedRef}
          connectContainer={(_: {}) => {
            innerForwardedRef?.current
            const [value = 0, setValue] = usePartialState('num')
            return {
              value,
              onChange: (e) => {
                setValue(Number(e.target.value))
              }
            }
          }}
        />
        <TextInput
          ref={forwardedRef}
          connectContainer={(_: {}, ref?: typeof forwardedRef) => {
            const forwardedRef = useSharedRef<HTMLInputElement>('forwarded')
            const z = ref?.current === forwardedRef?.current
            const [value = '', setValue] = usePartialState('str')
            return {
              value,
              onChange: useCallback((e) => {
                // NOTE: You can see this is optimized rendering
                // See console in devtool and Input.tsx.
                setValue(e.target.value)
              }, [])
            }
          }}
        />
        <Timer
          connectContainer={(a: {}) => {
            const [value = 0, setValue] = usePartialState('timer')
            useEffect(() => {
              const i = setInterval(() => {
                setValue((state) => state + 1)
              }, 1000)
              return
            }, [])
            return {
              value
            }
          }}
        />
        <input
          type="button"
          onClick={() => {
            setStateLog(state)
          }}
          value={'Current State Update'}
        />
        <input ref={focusRef} type="number" />
        <input ref={scopedFocusRef} type="string" defaultValue={'scoped'} />
        <input ref={symbolFocusRef} type="string" defaultValue={'symbol'} />
        <p>current: {JSON.stringify(stateLog)}</p>
      </header>
    </div>
  )
}

export default App
