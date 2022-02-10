import { ComponentType } from 'react'
import Input from './Input'
import {withInnerHooks} from '../../'

type ExtractProps<C> = C extends ComponentType<infer Props> ? Props : any

function TextInput(props: Omit<ExtractProps<typeof Input>, 'type'>) {
    return <Input type='string' {...props}/>
}

export default withInnerHooks(TextInput)
