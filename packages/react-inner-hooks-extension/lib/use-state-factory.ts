import { useState, useCallback } from "react";


type FactoryFunction<State> = <StateName extends keyof State>(
    stateName: StateName
) => ReturnTypeStateTuple<State[StateName]>

type ReturnTypeStateTuple<State> = [
    State | undefined,
    (current: State | ((arg: State) => State)) => void
]

type StateFactoryTuple<State> = [
    Partial<State>,
    FactoryFunction<State>,
    (current: Partial<State> | ((arg: Partial<State>) => Partial<State>)) => void,
]

export function useStateFactory<State extends object>(
    initialState: Partial<State> = {}
): StateFactoryTuple<State> {
    const [state, setState] = useState<Partial<State>>(initialState);
    const getStateAndHandler = <StateName extends keyof State>(stateName: StateName): ReturnTypeStateTuple<State[StateName]> => {
        const handler = useCallback((value: State[StateName] | ((arg: State[StateName]) => State[StateName])): void => {
            typeof value !== "function"
                ? setState({ ...state, [stateName]: value })
                : setState((state) => ({
                    ...state,
                    [stateName]: (value as any)(state[stateName])
                }));
        }, [])
        return [
            state[stateName],
            handler
        ];
    }
    return [
        state,
        getStateAndHandler,
        setState
    ];
}
