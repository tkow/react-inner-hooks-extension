import { ComponentType, ReactElement } from "react";

type RestProps<Props, ReturnedProps> = Omit<Props, keyof ReturnedProps>;

type WithInnerHooksReturnType<Props> = <
  WithInnerHookProps extends RestProps<Props, IP>,
  IP extends Partial<Props>
>(
  props: WithInnerHookProps & { innerHooks?: () => IP }
) => ReactElement;

export function withInnerHooks<Props extends Record<string, any>>(
  Child: React.ComponentType<Props>
): WithInnerHooksReturnType<Props> {
  return <
    WithInnerHookProps extends RestProps<Props, IP>,
    IP extends Partial<Props>
  >({
    innerHooks,
    ...props
  }: WithInnerHookProps & {
    innerHooks?: () => IP;
  }): ReactElement => {
    const ex = (innerHooks && innerHooks()) as IP;
    const composeProps = { ...props, ...ex } as Props;
    return <Child {...composeProps} />;
  };
}
