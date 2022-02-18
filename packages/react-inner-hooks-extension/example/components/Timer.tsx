import { FC } from 'react'
import { withInnerHooks } from '../../'

const Text: FC<{value: number}> = function Text(props: {value: number}) {
  return <div>{props.value}</div>
}

export default withInnerHooks(Text)
