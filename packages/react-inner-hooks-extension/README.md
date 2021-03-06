## What is this

This makes react-hooks callable in a component's child scope by props passing.

## Summary

This makes react-hooks callable in prop as `connectContainer` named.
The `withInnerHooks` create HOC API do this.
In addition, `useStateFactory` API included that makes dynamic mutable object state to add state as the key-value, and it's added when you arbitrary call `usePartialState` hook passed by second tuple element generated by the `useStateFactory` function.

## Usage

```shell
yarn add react-inner-hooks-extension
# or
npm install react-inner-hooks-extension
```

```tsx
// components/NumberInput.tsx
import { ComponentType } from 'react'
import Input from './Input'
import { withInnerHooks } from 'react-inner-hooks-extension'

// components/NumberInput.tsx
type ExtractProps<C> = C extends ComponentType<infer Props> ? Props : any

function NumberInput(props: Omit<ExtractProps<typeof Input>, 'type'>) {
  return <Input type="number" {...props} />
}

export default withInnerHooks(NumberInput)

// App.tsx
import { useCallback, useEffect, useState } from 'react'
import NumberInput from './components/NumberInput'
import Timer from './components/Timer'
import { useStateFactory } from 'react-inner-hooks-extension'

function App() {
  const [state, usePartialState] = useStateFactory({
    num: 0,
  })

  return (
    <div className="App">
        <NumberInput
          connectContainer={() => {
            const [value = 0, setValue] = usePartialState('num')
            return {
              value,
              onChange: (e) => {
                setValue(Number(e.target.value))
              }
            }
          }}
        />
    </div>
  )
}

export default App

```

## API

### withInnerHooks(Component: ComponentType<Props>): ComponentType<Props & {connectContainer?: <RP extends Partial<Props> | void, Ref>(restProps: Rest<Props, RP>, ref?: MutableRefObject<Ref|null>)=> RP }>

This adds connectContainer prop to passed `Component`. The connectContainer calls in intermediate scope generated as HOC.
The returned object merge the other props from parent and passed to the child as the original `Component` props. The second arguments passed ref if it's set.

** innerHooks prop is renamed (version > 0.5.0) to connectContainer because it can be used without hooks and make it clearer that it maps props from component and return prop merged. If you use (version <= 0.5.0>) please use `innerHooks`.

This can be passed input props from the comopnent. The followed by an examples shows that

```tsx
const Example = (args: { a: number; b: number }) => {
  return <></>
}

const Ex = withInnerHooks(Example)

let ex1 = () => <Ex b={1} connectContainer={() => ({ a: 1 })} />
let ex2 = () => <Ex b={1} connectContainer={(d: {b: number}) => ({ a: 1 })} />

const fref = useSharedRef<HTMLInputElement>('forwarded')
let ex3 = () => <Ex ref={fref} b={1} connectContainer={(d: {b: number}, ref: typeof fref) => {
  useEffect(() => {
    console.log(ref.current)
  }, [ref.current])
  return { a: 1 }
}} />

const hooksContainer = (d: {b: number}) => ({ a: 1 })
let ex4 = () => <Ex b={1} connectContainer={hooksContainer} />
```

**warning**: You can't omit if you use from comopnent props because inference can't determine args props for the priority i higher than return type.

**NOTE**: If you only need to call hooks, you can return void instead of an empty object.

### useStateFactory(initialState: Partial<State> | (() => Partial<State>) [state, usePartialState, setState]

The `useStateFactory` hook return state, getState as first and third element derived from `useState` and `usePartialState` as second element of a tuple. The state and getState of it, and them of useState are completely same api.
The `usePartialState` returns [state, modifierThisState] similar to `useState`. The first difference is that it can't set initialValue from an argument. The reason why is that if you specify it many times the other places, you likely miss where initialize the state named so it must be specified by `useStateFactory` when you need some partial values initialized.
The second difference is you needs to specify state name as key of original state used using string value. Follow this example.

```tsx
import {useEffect} from 'react'
import {withInnerHooks, usePartialState} from 'react-inner-hooks-extension'

const TimerDisplay = withInnerHooks(value => <div>{value}</div>)

function Timer() {
    const [state, usePartialState, setState] = useStateFactory()

    return <TimerDisplay
        connectContainer={
            () => {
                // NOTE: You can avoid undefined by decomposition initialization.
                const [timer = 0, setTimerState] = usePartialState('timer')
                useEffect(()=> {
                    const i = setTimeInterval(()=> setTimerState((state)=> state + 1), 1000)
                    return () => {
                        clearTimeInterval(i)
                    }
                }, [])
                useEffect(()=> {
                    // NOTE: ResetValueEffect
                    if (timer === 10) setState({})
                    // NOTE: You can also write.
                    if (timer === 10) setTimerState(0)
                }, [timer])
                return {
                    value: timer
                }
            }
        }
    />
}
```

### useSharedRef(sharedKey: string,SharedRefContext: React.Context<Record<string, React.MutableRefObject<any>>>): React.MutableRefObject<any>
### createSharedRefHooks(initialRefs: Record<string, React.MutableRefObject<any>>): [useScopedSharedRef, SharedRefContext]

The `useSharedRef` names created ref by first argument and if it has been already created, simply retun it. The created refs are kept in global context.
So if you want to use refId in only local scope. You can use useScopedSharedRef.

```tsx
import { useSharedRef, createSharedRefHooks } from '../'

const [useScopedSharedRef] = createSharedRefHooks({
  'focus': createRef<HTMLInputElement>()
})

const useSharedRefExample = () => {
  const ele: HTMLInputElement | undefined = useSharedRef('focus').current
  useEffect(() => {
    ele?.focus()
  }, [focusRef])
  const scopedEle: HTMLInputElement | undefined = useScopedSharedRef('focus').current
  useEffect(() => {
    scopedEle && alert(scopedEle.value)
  }, [scopedEle])
}

() => {
  const focusRef = useSharedRef('fucus')
  const scopedFocusRef: HTMLInputElement | undefined = useScopedSharedRef('focus')
  return (
    <div>
      <input ref={focusRef} type='number' />
      <input ref={scopedFocusRef} type='number' defaultValue={2} />
    </div>
  )
}
```

In addition, you can also use with your original RefContext. If you use typescript, you can use createSharedRefContext is only difference from createContext with typed.

```tsx
import { useSharedRef, createSharedRefHooks, createSharedRefContext } from '../'

// How to create RefContext

// 1. createSharedRefHooks's second element.
const [useScopedSharedRef, FromCreateSharedRefHooksContext] = createSharedRefHooks({
  'focus': createRef<HTMLInputElement>()
})

// 2. createSharedRefContext
const FromCreateSharedRefContext = createSharedRefContext({
  'focus': createRef<HTMLInputElement>()
})

// 3. React.createContext
const NomalContext = React.createContext({})

// You can use arbitrary context has SharedRefContext subtype.
const focusRef = useSharedRef('focus', FromCreateSharedRefContext)

// This line code and useScopedSharedRef('focus') same.
const focusRef = useSharedRef('focus', FromCreateSharedRefHooksContext)

```

You can also use symbol and it's recommended if you want to use defalut global context only.

```tsx
const ScopableRefKeys = {
  focus: Symbol('focus'),
}

// This compensates all SharedRef keys unique, so you can avoid conflict other components.
const focusRef = useSharedRef(ScopableRefKeys.focus)
```


# Motivation

A component often needs conditional rendering but hooks must be written before their first starting line even if they don't depend on the condition for [idempotent calling rule of hooks](https://reactjs.org/docs/hooks-rules.html).

Good:

```tsx
const Example = (props) => {
  const options = useOptions();
  const { initialized, data } = useFetchData();
  if (!initialized) return null;
  return <Component {...data} options={options} />;
};
```

Bad:

```tsx
const Example = (props) => {
  const { initialized, data } = useFetchData();
  if (!initialized) return null;
  const options = useOptions();
  return <Component {...data} options={options} />;
};
```

or

```tsx
const Example = (props) => {
  const { initialized, data } = useFetchData();
  if (!initialized) return null;
  return <Component {...data} options={useOptions()} />;
};
```

This is not problem when component is small, but big one is tough to read.

```tsx
const Example = (props) => {
    const options = useOptions()
    const [optionValue, setOptionValue] = useState()
    const {initialized, data} = useFetchData()
    const someValue = ''
    const someChange = () => {}
    if (!initialized) return null
    return (
        <Component>
            <Child>
              <AnnoyedField
                value={someValue}
                onChange={someChange}
                class='test'
                otherProps
              />
              <AnnoyedField
                value={someValue}
                onChange={someChange}
                class='test'
                otherProps
              />
              <AnnoyedField
                value={someValue}
                onChange={someChange}
                class='test'
                otherProps
              />
              <AnnoyedField
                value={someValue}
                onChange={someChange}
                class='test'
                otherProps
              />
              <AnnoyedField
                value={someValue}
                onChange={someChange}
                class='test'
                otherProps
              />
              <AnnoyedField
                value={someValue}
                onChange={someChange}
                class='test'
                otherProps
              />
              <AnnoyedField
                value={someValue}
                onChange={someChange}
                class='test'
                otherProps
              />
              <Select
                value={optionValue}
                onChange={setOptionValue}
                options={options}
                otherProps
              />
              <AnnoyedField
                value={someValue}
                onChange={someChange}
                class='test'
                otherProps
              />
              <AnnoyedField
                value={someValue}
                onChange={someChange}
                class='test'
                otherProps
              />
            <Child/>
        </Component>
    )
}
```

As the farther place it's used from definition, it's more tough to remember the variable name and we are forced to use editor's trick like code jump, bookmark, splited view, etc. Or scroll and switch page many times.

Briefly, connectContainer enables to inject container layer from props using hooks as container component once did. we split one component to presentational component and the container component when we define container in the past. Also in react hooks, it might be better to separate hooks and presentational component like container layer as bigger it is though it can put them together to one component. However hooks have regulation that they should be defined before rendering, thus you might often be annoyed in the situation as you've seen above. InnerHooks tackles this problem and realize it can completely encapsulate the business logic to one component in some cases.

For example, if you use Redux,

```tsx
    <NumberInput
      connectContainer={() => {
        const num = useSelector(({num}) => { return num})
        const dispatch = useDispatch()
        return {
          value,
          onChange: (e) => {
            dispatch({type: 'mutateNum', payload: num})
          }
        }
      }}
    />
```

you write once this, you can use or move it another place everywhere with cut and paste. This is more convenient in some case than you obey strictly React's hooks rendering rules and declarative policy.

## Global Mode

You can use innerHooks globaly without withInnerHooks hoc. If you want do so, create initial file like named react-inner-hooks-initializer.tsx as an example.

```tsx
import React from 'react'
import {enableInnerHooksGlobal} from 'react-inner-hooks-extension'

enableInnerHooksGlobal(React)
```

and call it at application entrypoint and before first React called.

For example, if your application entrypoint is App.tsx.

```tsx
import 'react-inner-hooks-initializer'
import React

export defalut App() {
  "..."
}
```

If you use runtime automatic mode in @babel/preset-react or the similar preset, you can change jsx transform behavior. In the case of @babel/preset-react specify importSource like followed by an example.

```.babelrc
['@babel/preset-react', {
  runtime: 'automatic',
  importSource: 'react-inner-hooks-extension',
}]
```

then, enable type extension if you use typescript.

```tsx
/// <reference types="react-inner-hooks-extension/react-inner-hooks-extension" />
```

Then you can use FunctionalComponent have connectContainer prop and if set it, automatically generate hoc and call it when react element is created.

## Caveat

Inner hooks look opposed to React declarative policy though it can also be encapsulated and abstracted by custom hooks. Furthermore, I think this feature should be equipped in React library itself or extend its render function as possible for more effective about performance and avoidance to repeat to write withInnerHooks hoc everywhere. If you use eslint with several react-hooks rules, this library violates some of them. So you may need to ignore them.

This library use intensionally out of the way of [concept of React Hooks](https://overreacted.io/why-do-hooks-rely-on-call-order/), though I believe that our library is useful in limited situations. As I thought, the fact that some proposals are rejected is React doesn't need them, but there are some situations we want to do this and make it means especially for typescript or flow users.

But, you use carefully following link's article above, and I recommend you not to somewhat complicated cases. The discussion about this is [here](https://dev.to/tkow/inner-hooks-new-idea-of-react-hooks-59kb).

## Develop Environment

See example in App.tsx.

```shell
npx yarn
cd ./examples && yarn dev
```

runs example application.

## License

MIT
