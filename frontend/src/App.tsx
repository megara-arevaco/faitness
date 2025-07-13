import ChatWS from "./components/ChatWS";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chat con LLM
          </h1>
          <p className="text-gray-600">
            Interfaz de chat simple construida con React y shadcn/ui lolens molens
          </p>
        </div>

        <div className="h-[600px]">
          <ChatWS />
        </div>
      </div>
    </div>
  );
}

export default App;
