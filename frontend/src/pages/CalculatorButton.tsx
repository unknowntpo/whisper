export enum Operator {
	Equal = "=",
	Add = "+",
	Minus = "-",
	Multiply = "x",
	Divide = "÷",
	Modulus = "%",
	Reset = "AC"
}

export interface CalculatorButtonProps 
{
	keyStroke: Operator;
	onClick: (value: Operator) => void;
}

export function CalculatorButton({keyStroke, onClick}: CalculatorButtonProps) {
	return (
		<div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-lg cursor-pointer 
	  hover:bg-grey-300
		" onClick={() => onClick(keyStroke)}>
			{keyStroke}
		</div>
	)
} 