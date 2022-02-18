import { ComponentType, ForwardedRef, forwardRef } from 'react'
import Input from './Input'
import { withInnerHooks } from '../../'

type ExtractProps<C> = C extends ComponentType<infer Props> ? Props : any

function TextInput(props: Omit<ExtractProps<typeof Input>, 'type'>, ref: ForwardedRef<HTMLInputElement>) {
  return <Input type="string" {...props} ref={ref} />
}

export default withInnerHooks(TextInput)
