import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-6 font-sans">
      <div className="max-w-5xl w-full mx-auto text-center">
        {/* Jenis Font */}
        <p className="text-2xl font-medium">Testing</p>

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-md">
            Vite + React + Tailwind
          </h1>
          <p className="text-gray-700 text-xl mt-3">Modern development setup with beautiful UI</p>
        </header>

        {/* Logos */}
        <div className="flex justify-center items-center gap-12 mb-10">
          <a href="https://vitejs.dev" target="_blank" className="transform hover:scale-110 transition duration-300">
            <img src={viteLogo} className="h-24 w-24 drop-shadow-xl" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" className="transform hover:scale-110 transition duration-300">
            <img src={reactLogo} className="h-24 w-24 drop-shadow-xl animate-spin-slow" alt="React logo" />
          </a>
        </div>

        {/* Card */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-white/30 mb-10">
          <button
            onClick={() => setCount(count + 1)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 active:scale-95"
          >
            Count is {count}
          </button>
          <p className="text-gray-800 mt-6 text-lg">
            Edit <code className="bg-gray-200 px-2 py-1 rounded text-sm font-mono">src/App.jsx</code> and save to test HMR
          </p>
        </div>

        {/* Status Footer */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-10">
          <p className="text-gray-600">Click the logos to learn more</p>
          <div className="mt-4 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">Tailwind CSS Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">React Ready</span>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            {
              icon: '⚡',
              title: 'Fast Development',
              desc: 'Hot Module Replacement for instant updates',
            },
            {
              icon: '🎨',
              title: 'Beautiful Styling',
              desc: 'Tailwind CSS for responsive design',
            },
            {
              icon: '🚀',
              title: 'Optimized Build',
              desc: "Fast, production-ready apps with Vite's compiler",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-md hover:shadow-2xl border border-white/30 transition duration-300"
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

export default App
