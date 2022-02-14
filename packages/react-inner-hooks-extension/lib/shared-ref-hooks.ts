import React, { Context, createContext, useContext } from 'react'

export const GlobalSharedRefContext: React.Context<Record<string | symbol, React.MutableRefObject<any>>> = createContext({})

export const useSharedRef = <
  T extends Extract<keyof O, string | symbol> | string,
  RefO extends React.MutableRefObject<any>,
  O extends Record<T, RefO> = Record<string | symbol, RefO>
>(
  sharedKey: T,
  SharedRefContext: Context<O> = GlobalSharedRefContext as any as Context<O>
): O[T] => {
  const refs = useContext(SharedRefContext)
  if (!refs[sharedKey]) {
    const ref = React.createRef<O[T] extends React.MutableRefObject<infer R> ? R : any>()
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
