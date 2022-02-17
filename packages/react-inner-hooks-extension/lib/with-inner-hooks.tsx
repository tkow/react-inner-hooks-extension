import { ComponentType, ForwardedRef, forwardRef, ReactElement, RefAttributes, MutableRefObject } from 'react'

type RestProps<Props, PatialProps> = Omit<Props, keyof PatialProps>

type ConnectContaierProps<RestProps, IP, RefValue = any> = {
  connectContainer?: (props: RestProps, ref?: MutableRefObject<RefValue>) => IP
}

type WithInnerHooksReturnType<Props> = <IP extends Partial<Props> = {}>(
  props: RestProps<Props, IP> & ConnectContaierProps<RestProps<Props, IP>, IP>
) => ReactElement

function refCheck<Ref>(ref: ForwardedRef<Ref>): MutableRefObject<Ref | null> | undefined {
  if(typeof ref === 'function') return undefined
  return ref ? ref : undefined
}

export function withInnerHooks<Props extends Record<string, any>, Ref = any>(
  Child: ComponentType<Props>
): WithInnerHooksReturnType<Props & RefAttributes<Ref>> {
  function WithInnerHooksContainer<IP extends Partial<Props> = {}>(
    { connectContainer, ...props }: RestProps<Props, IP> & ConnectContaierProps<RestProps<Props, IP>, IP>,
    ref: ForwardedRef<Ref>
  ): ReactElement {
    const ex = connectContainer && connectContainer(props as RestProps<Props, IP>, refCheck(ref))
    const composeProps = { ...props, ...ex } as Props
    return <Child ref={ref} {...composeProps} />
  }
  return forwardRef(WithInnerHooksContainer) as unknown as WithInnerHooksReturnType<
    Props & RefAttributes<Ref>
  >
}
