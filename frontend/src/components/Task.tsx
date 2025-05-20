interface TaskItem {
	id: string;
	title: string;
	subTasks: TaskItem[];
}

interface TaskProps {
	subTasks: TaskItem[];
	level?: number;
	onTaskClick?: (task: TaskItem) => void;
	isExpanded?: boolean;
	theme?: 'light' | 'dark';
}

// eslint-disable-next-line react-refresh/only-export-components
export const taskData: TaskItem[] = [
	{
			id: '1',
			title: '1',
			subTasks: [
					{
							id: '1.1',
							title: '1.1',
							subTasks: [
									{
											id: '1.1.1',
											title: '1.1.1',
											subTasks: []
									}
							]
					},
					{
							id: '1.2',
							title: '1.2',
							subTasks: [
									{
											id: '1.2.1',
											title: '1.2.1',
											subTasks: []
									}
							]
					},
					{
							id: '1.3',
							title: '1.3',
							subTasks: [
									{
											id: '1.3.1',
											title: '1.3.1',
											subTasks: []
									}
							]
					}
			]
	},
	{
			id: '2',
			title: '2', 
			subTasks: [
					{
							id: '2.1',
							title: '2.1',
							subTasks: [
									{
											id: '2.1.1',
											title: '2.1.1',
											subTasks: []
									}
							]
					},
					{
							id: '2.2',
							title: '2.2',
							subTasks: []
					}
			]
	},
	{
			id: '3',
			title: '3',
			subTasks: [
					{
							id: '3.1',
							title: '3.1',
							subTasks: [
									{
											id: '3.1.1',
											title: '3.1.1',
											subTasks: []
									}
							]
					}
			]
	}
]

export default function Task({
	subTasks,
	level = 0,
	isExpanded = true,
}: TaskProps) {
	return subTasks.map((task) => (
		<div 
			key={task.id} 
			style={{ marginLeft: `50px` }}
		>
			<div className="
				bg-white 
				hover:bg-gray-50 
				border-l-4 border-blue-500 
				rounded-lg 
				shadow-md 
				p-4 
				my-2 
				transition-all 
				duration-200
			">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-3">
						<span className="text-lg font-semibold text-gray-800">
							{task.title}
						</span>
						<span className="
							px-2 
							py-1 
							text-xs 
							font-medium 
							bg-blue-100 
							text-blue-800 
							rounded-full
						">
							Level {level}
						</span>
					</div>
					<span className="
						px-3 
						py-1 
						bg-gray-100 
						text-gray-700 
						rounded-full 
						text-sm 
						font-medium
					">
						{task.subTasks.length} subtasks
					</span>
				</div>
			</div>
			
			{isExpanded && task.subTasks.length > 0 && (
				<Task 
					subTasks={task.subTasks} 
					level={level + 1}
					isExpanded={isExpanded}
				/>
			)}
		</div>
	))
}