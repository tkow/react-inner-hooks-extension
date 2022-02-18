import 'react'

declare module 'react' {
    export type RestProps<Props, PatialProps> = Omit<Props, keyof PatialProps>

    export type WithInnerHooksProps<Props, IP, RefValue = any> = {
        connectContainer?: (props: RestProps<Props, IP>, ref?: MutableRefObject<RefValue>) => IP
    }

    type ConnectContainerProps<P, IP, RefValue> = RestProps<P, IP> & WithInnerHooksProps<P, IP, RefValue>

    export interface VoidFunctionComponent<P = {}, BIP = {}, BRefValue = any> {
      <IP = BIP, RefValue = BRefValue>(props: ConnectContainerProps<P, IP, RefValue>, context?: any): ReactElement<any, any> | null;
    }
    export interface FunctionComponent<P = {}, BIP = {}, BRefValue = any> {
      <IP = BIP, RefValue = BRefValue>(props: PropsWithChildren<RestProps<P, IP> & WithInnerHooksProps<P, IP, RefValue>>, context?: any): ReactElement<any, any> | null;
    }
    export interface ComponentClass<P = {}, S = ComponentState, BIP = {}, BRefValue = any> extends StaticLifecycle<P, S> {
        new <IP = BIP, RefValue = BRefValue>(props: ConnectContainerProps<P, IP, RefValue>, context?: any): Component<ConnectContainerProps<P, IP, RefValue>, S>;
    }
    export interface ExoticComponent<P = {}, BIP = {}, BRefValue = any> {
        /**
         * **NOTE**: Exotic components are not callable.
         */
         <IP = BIP, RefValue = BRefValue>(props: ConnectContainerProps<P, IP, RefValue>): (ReactElement|null);
    }

}

