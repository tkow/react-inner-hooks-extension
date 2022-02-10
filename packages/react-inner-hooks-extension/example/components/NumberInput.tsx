import { ComponentType } from 'react'
import Input from './Input'
import {withInnerHooks} from '../../'

type ExtractProps<C> = C extends ComponentType<infer Props> ? Props : any

function NumberInput(props: Omit<ExtractProps<typeof Input>, 'type'>) {
    return <Input type='number' {...props}/>
}

export default withInnerHooks(NumberInput)

