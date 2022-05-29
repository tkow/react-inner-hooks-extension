import 'react'

declare module 'react' {
  export type RestProps<Props, PatialProps> = Omit<Props,  PatialProps extends void ? never : keyof PatialProps>

  export type AddInnerHooksProps<Props, IP extends Partial<Props> | void = void, RefValue = any> = RestProps<Props, ForceIP<IP>> & {
    connectContainer?: (props: RestProps<Props, ForceIP<IP>>, ref?: MutableRefObject<RefValue>) => ForceIP<IP>
  }

  export type ForceIP<IP> = IP extends Exclude<any, IP> ?
    IP : void


  export interface VoidFunctionComponent<P = {}> {
    <IP extends void | Partial<P> = void, RefValue = any>(props: AddInnerHooksProps<P, IP, RefValue>, context?: any): ReactElement<any, any> | null;
  }
  export interface FunctionComponent<P = {}> {
    <IP extends void | Partial<P> = void, RefValue = any>(props: PropsWithChildren<AddInnerHooksProps<P, IP, RefValue>>, context?: any): ReactElement<any, any> | null;
  }
  export interface ComponentClass<P = {}, S = ComponentState> extends StaticLifecycle<P, S> {
    new <IP extends void | Partial<P> = void, RefValue = any>(props: AddInnerHooksProps<P, IP, RefValue>, context?: any): Component<AddInnerHooksProps<P, IP, RefValue>, S>;
  }
  export interface ExoticComponent<P = {}> {
    /**
     * **NOTE**: Exotic components are not callable.
     */
    <IP extends void | Partial<P> = void, RefValue = any>(props: AddInnerHooksProps<P, IP, RefValue extends unknown ? any : RefValue>): (ReactElement | null);
  }

}

