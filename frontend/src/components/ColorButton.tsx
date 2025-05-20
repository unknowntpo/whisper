import { useState } from 'react';

export default function ColorButton() {
	const [color, setColor] = useState('red');
	const colors = ["red", "blue", "yellow"];

	const setRandomColor = () => {
		const idx = Math.floor(Math.random() * colors.length);
		const newColor = colors[idx];
		console.log(`color: ${newColor}`)
		setColor(newColor)
	}
	return (
		<>
			<button
				style={{backgroundColor: color}}
				className={color}
				onClick={() => setRandomColor()}>Change Color</button>
			<p>The color is {color}</p>
		</>
	)
}