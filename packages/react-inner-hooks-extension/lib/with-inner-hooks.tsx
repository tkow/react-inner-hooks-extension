import { ReactElement } from 'react'

type RestProps<Props, PatialProps> = Omit<Props, keyof PatialProps>

type ConnectContaierProps<RestProps, IP> = {
  connectContainer?: (props: RestProps) => IP
}

type WithInnerHooksReturnType<Props> = <
  WithInnerHookProps extends RestProps<Props, IP>,
  IP extends Partial<Props> = {}
>(
  props: WithInnerHookProps & ConnectContaierProps<RestProps<Props, IP>, IP>
) => ReactElement

export function withInnerHooks<Props extends Record<string, any>>(
  Child: React.ComponentType<Props>
): WithInnerHooksReturnType<Props> {
  return function WithInnerHooksContainer<
    WithInnerHookProps extends RestProps<Props, IP>,
    IP extends Partial<Props> = {}
  >({ connectContainer, ...props }: WithInnerHookProps & ConnectContaierProps<RestProps<Props, IP>, IP>): ReactElement {
    const ex = connectContainer && connectContainer(props as RestProps<Props, IP>)
    const composeProps = { ...props, ...ex } as Props
    return <Child {...composeProps} />
  }
}
