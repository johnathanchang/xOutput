export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold mb-4">xOutput</h1>
      <p className="text-gray-400 text-lg mb-8">Stake real money on your morning routine.</p>
      <a href="/signup" className="px-8 py-4 bg-green-500 rounded-lg font-bold text-xl">
        Get Started
      </a>
    </div>
  );
}