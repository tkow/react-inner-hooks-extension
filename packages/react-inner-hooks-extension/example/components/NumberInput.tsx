import { ComponentType } from 'react'
import Input from './Input'
import {withInnerHooks} from '../../'

type ExtractProps<C> = C extends ComponentType<infer Props> ? Props : any

function NumberInput(props: Omit<ExtractProps<typeof Input>, 'type'>) {
    return <Input type='number' {...props}/>
}

export default withInnerHooks(NumberInput)


function ANumberInput(props: {a: 1}) {
    return <div >{props.a}</div>
}
withInnerHooks(ANumberInput)
