import { ComponentType } from 'react'
import Input from './Input'

type ExtractProps<C> = C extends ComponentType<infer Props> ? Props : any

export default function TextInput(props: Omit<ExtractProps<typeof Input>, 'type'>) {
    return <Input type='number' {...props}/>
}
