// import { useEffect, useState } from 'react';
import { useState } from 'react';
import {CalculatorButton, CalculatorButtonProps, Operator } from './CalculatorButton';

export default function Calculator() {
	const initExpression = '0';
	 
	const [expression, setExpression] = useState(initExpression);
	const rows: string[][] = [
		[Operator.Reset, "+/-", Operator.Modulus, Operator.Divide],
		["7", "8", "9", Operator.Multiply],
		["4", "5", "6", Operator.Minus],
		["1", "2", "3", Operator.Add],
		["", "0", ".", Operator.Equal]
	];

	const resetExpression = () => setExpression(()=> initExpression);
 
	const handleClick = (keyStroke: CalculatorButtonProps["keyStroke"]) => {
		console.log(`${keyStroke} is clicked`)
		switch (keyStroke) {
			case Operator.Reset:
				resetExpression();
				break;
			default:
				setExpression(prevExpression => prevExpression === initExpression ? keyStroke : prevExpression + keyStroke);
		}
	}

	return (
		<div className="flex flex-col gap-2"> {/* Changed to column layout with gap */}
		<div className="bg-green-50">{expression}</div>
		{rows.map((row, rowIndex) => (
				<div key={rowIndex} className="flex flex-row gap-2"> {/* Row container with gap */}
						{row.map((char) => (
								<CalculatorButton key={char} keyStroke={char as Operator} onClick={handleClick}/>
						))}
				</div>
		))}
	</div>
	)
} 