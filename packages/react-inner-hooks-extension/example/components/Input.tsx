import { InputHTMLAttributes } from "react";

export interface Props {
  type: string;
  onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
  value: string | number;
}

export default function Input({ type, onChange, value }: Props) {
  return (
    <div>
      <input type={type} onChange={onChange} value={value} />
    </div>
  );
}
