import {getPatchedComponent, isNeededInnerHooksContainer} from '../lib/react-extension'
import * as jsxDevRuntime from 'react/jsx-dev-runtime'

const orgJsxDevRuntime = jsxDevRuntime as any

export const Fragment = orgJsxDevRuntime.Fragment

export function jsxDEV(type: any, props?:any, ...rest: any){
    const Component = isNeededInnerHooksContainer(type, props) ? getPatchedComponent(type) : type
    return orgJsxDevRuntime.jsxDEV(Component, props, ...rest)
}
