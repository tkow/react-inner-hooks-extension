import { ComponentType, ForwardedRef, forwardRef } from 'react'
import Input from './Input'
import { withInnerHooks } from '../../'

type ExtractProps<C> = C extends ComponentType<infer Props> ? Props : any

function NumberInput(props: Omit<ExtractProps<typeof Input>, 'type'>, ref: ForwardedRef<HTMLInputElement>) {
  return <Input type="number" {...props} ref={ref} />
}

export default withInnerHooks(
  forwardRef(NumberInput)
)
