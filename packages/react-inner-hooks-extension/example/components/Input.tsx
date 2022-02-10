import { InputHTMLAttributes, memo, useEffect } from 'react'

export interface Props {
  type: string
  onChange?: InputHTMLAttributes<HTMLInputElement>['onChange']
  value: string | number
}

function Input({ type, onChange, value }: Props) {
  // NOTE: If you check rendering count
  useEffect(() => {
    console.log(`render ${type}`)
  })
  return (
    <div>
      <input type={type} onChange={onChange} value={value} />
    </div>
  )
}

export default memo(Input)
