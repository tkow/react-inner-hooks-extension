import { ComponentType, forwardRef } from 'react'
import Input from './Input'
import { withInnerHooks } from '../../'

type ExtractProps<C> = C extends ComponentType<infer Props> ? Props : any

function NumberInput(props: Omit<ExtractProps<typeof Input>, 'type'>, ref) {
  return <Input type="number" {...props} ref={ref} />
}

export default withInnerHooks(
  forwardRef(NumberInput)
)
