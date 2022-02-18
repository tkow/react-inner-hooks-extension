import {getPatchedComponent, isNeededInnerHooksContainer} from '../lib/react-extension'
import * as jsxDevRuntime from 'react/jsx-runtime'

const orgJsxDevRuntime = jsxDevRuntime as any

export const Fragment = orgJsxDevRuntime.Fragment

export function jsx(type: any, props?:any, ...rest: any){
    const Component = isNeededInnerHooksContainer(type, props) ? getPatchedComponent(type) : type
    return orgJsxDevRuntime.jsx(Component, props, ...rest)
}

export function jsxs(type: any, props?:any, ...rest: any){
    const Component = isNeededInnerHooksContainer(type, props) ? getPatchedComponent(type) : type
    return orgJsxDevRuntime.jsxs(Component, props, ...rest)
}
