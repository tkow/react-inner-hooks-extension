import { useState, useCallback } from "react";


type FactoryFunction<State> = <StateName extends keyof State>(
    stateName: StateName
) => ReturnTypeStateTuple<State[StateName]>

type ReturnTypeStateTuple<State> = [
    State | undefined,
    (current: State | ((arg?: State) => State)) => void
]

type StateFactoryTuple<State> = [
    Partial<State>,
    FactoryFunction<State>,
    (current: Partial<State> | ((arg: Partial<State>) => Partial<State>)) => void,
]

export function useStateFactory<State extends object = Record<string, any>>(
    initialState: Partial<State> | (() => Partial<State>) = {}
): StateFactoryTuple<State> {
    const [state, setState] = useState<Partial<State>>(initialState);
    const usePartialState = <StateName extends keyof State>(stateName: StateName): ReturnTypeStateTuple<State[StateName]> => {
        const handler = useCallback((value: State[StateName] | ((arg?: State[StateName]) => State[StateName])): void => {
            setState((state) => {
                const newPartialState = typeof value === 'function' ? (value as ((arg?: State[StateName]) => State[StateName]))(state[stateName]): value
                // NOTE: For optimization rendering.
                // return previous state don't render so, do this if arg value and state are same.
                if(newPartialState === state[stateName]) return state
                return ({
                    ...state,
                    [stateName]: newPartialState
                })}
            );
        }, [])
        return [
            state[stateName],
            handler
        ];
    }
    return [
        state,
        usePartialState,
        setState
    ];
}
