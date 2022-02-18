import { ComponentType } from 'react'
import {withInnerHooks, CONTAINER_ID} from './with-inner-hooks'

const componentsMap = new WeakMap()

export function getPatchedComponent(Component: ComponentType<any>) {
    if (componentsMap.has(Component)) {
      return componentsMap.get(Component);
    }

    const withInnerHooksComponent = withInnerHooks(Component);

    componentsMap.set(Component, withInnerHooksComponent);

    return withInnerHooksComponent;
}

export function isNeededInnerHooksContainer(Component: any, props?: any) {
    return props?.connectContainer && Component.displayName !== CONTAINER_ID
}

export function enableInnerHooksGlobal(React: any) {
    const OrgMethods: any = {
        createElement: React.createElement
    }

    React.createElement = function(origType: any, props?: any, ...rest: any) {
        const Component = isNeededInnerHooksContainer(origType, props) ? getPatchedComponent(origType) : origType
        return OrgMethods.createElement(Component, props, ...rest);
    } as any as typeof OrgMethods.createElement
}
