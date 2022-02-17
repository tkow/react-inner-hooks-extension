import { withInnerHooks } from '../../'

function Text(props: {value: number}) {
  return <div>{props.value}</div>
}

export default withInnerHooks(Text)
