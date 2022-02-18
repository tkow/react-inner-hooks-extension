import React, { ComponentType, ForwardedRef, forwardRef, ReactElement, RefAttributes, MutableRefObject } from 'react'

type RestProps<Props, PatialProps> = Omit<Props, keyof PatialProps>

type ConnectContaierProps<Props, IP, RefValue = any> = {
  connectContainer?: (props: RestProps<Props, IP>, ref?: MutableRefObject<RefValue>) => IP
}

type WithInnerHooksReturnType<Props> = <IP extends Partial<Props> = {}>(
  props: RestProps<Props, IP> & ConnectContaierProps<Props, IP>
) => ReactElement

function refCheck<Ref>(ref: ForwardedRef<Ref>): MutableRefObject<Ref | null> | undefined {
  if(typeof ref === 'function') return undefined
  return ref ? ref : undefined
}

export const CONTAINER_ID = 'WithInnerHooksContainer'

export function withInnerHooks<Props extends Record<string, any>, Ref = any>(
  Child: ComponentType<Props>
): WithInnerHooksReturnType<Props & RefAttributes<Ref>> {
  function WithInnerHooksContainer<IP extends Partial<Props> = {}>(
    { connectContainer, ...props }: RestProps<Props, IP> & ConnectContaierProps<Props, IP>,
    ref: ForwardedRef<Ref>
  ): ReactElement {
    const ex = connectContainer && connectContainer(props as RestProps<Props, IP>, refCheck(ref))
    const composeProps = { ...props, ...ex } as Props
    return <Child ref={ref} {...composeProps} />
  }
  WithInnerHooksContainer.displayName = CONTAINER_ID
  return forwardRef(WithInnerHooksContainer) as unknown as WithInnerHooksReturnType<
    Props & RefAttributes<Ref>
  >
}
