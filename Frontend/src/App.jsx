function App() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-xl text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Tailwind is Working 🚀
        </h1>

        <p className="text-gray-700">
          If you can see a white card on a black background,
          Tailwind CSS is configured correctly.
        </p>

        <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition">
          Test Button
        </button>
      </div>
    </div>
  );
}

export default App;