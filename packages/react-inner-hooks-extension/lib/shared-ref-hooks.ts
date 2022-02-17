import React, { Context, createContext, NewLifecycle, useContext } from 'react'

export const GlobalSharedRefContext: React.Context<Record<string | symbol, React.MutableRefObject<any>>> = createContext({})

export const useSharedRef = <
  RefO extends any = any,
  T extends Extract<keyof O, string | symbol> | string | symbol = string | symbol,
  O extends Record<T, React.MutableRefObject<RefO>> = Record<string | symbol, React.MutableRefObject<RefO>>
>(
  sharedKey: T,
  SharedRefContext: Context<O> = GlobalSharedRefContext as any as Context<O>
): O[T] => {
  const refs = useContext(SharedRefContext)
  if (!refs[sharedKey]) {
    const ref = React.createRef<RefO>()
    refs[sharedKey] = ref as O[T]
    return ref as O[T]
  }
  return refs[sharedKey] as O[T]
}

export const createSharedRefContext = <T extends Record<string | symbol, React.MutableRefObject<any>>>(
  args: T
): React.Context<T> => {
  return createContext(args)
}

export const createSharedRefHooks = <T extends Record<string | symbol, React.MutableRefObject<any>>>(
  args: T
): [(key: Extract<keyof T, string | symbol> ) => T[keyof T], React.Context<T>] => {
  const InnerContext = createSharedRefContext(args)
  return [(key: Extract<keyof T, string | symbol> ) => useSharedRef(key, InnerContext), InnerContext]
}
