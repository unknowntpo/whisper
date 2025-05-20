import { useState } from "react";

export default function Counter() {
	const [count, setCount] = useState(0);

	return (
		<div className="flex flex-col items-center p-8 max-w-md mx-auto bg-gray-50 rounded-lg shadow-md">
			<div className="text-2xl font-bold mb-4">
				Count: {count}
			</div>
			<div className="flex gap-2">
				<button onClick={() => setCount(count+1)} className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">+</button>
				<button onClick={() => setCount(count-1)} className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600">-</button>
			</div>
		</div>
	)
}