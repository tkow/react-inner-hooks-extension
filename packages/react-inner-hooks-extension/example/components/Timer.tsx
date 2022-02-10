import { withInnerHooks } from "../../";

function Text(props: any) {
    return <div>{props.value}</div>;
}

export default withInnerHooks(Text)
