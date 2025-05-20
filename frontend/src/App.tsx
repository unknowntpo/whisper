import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Task, { taskData } from './components/Task'
import Test from './pages/Test'
import Chat from './pages/Chat'
import Calculator from './pages/Calculator'
import WhisperChat from './pages/WhisperChat'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm p-4">
          <div className="max-w-4xl mx-auto flex gap-4">
            <Link to="/" className="text-blue-500 hover:text-blue-700">
              Home
            </Link>
            <Link to="/test" className="text-blue-500 hover:text-blue-700">
              Test
            </Link>
						<Link to="/chat" className="text-blue-500 hover:text-blue-700">
              Chat
            </Link>
						<Link to="/calculator" className="text-blue-500 hover:text-blue-700">
              Calculator
            </Link>
            <Link to="/whisper-chat" className="text-blue-500 hover:text-blue-700">
              WhisperChat
            </Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="p-8">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                  Task Manager
                </h1>
                <Task 
                  subTasks={taskData} 
                  level={0}
                />
              </div>
            </div>
          } />
          <Route path="/test" element={<Test />} />
					<Route path="/chat" element={<Chat />} />
					<Route path="/calculator" element={<Calculator />} />
          <Route path="/whisper-chat" element={<WhisperChat />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
