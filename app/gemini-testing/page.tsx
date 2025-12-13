// app/page.tsx
"use client";

import { useState } from "react";
import axios from "axios";

export default function AIBuilder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input) return;
    setLoading(true);
    setOutput("");

    try {
      const res = await axios.post("/api/ai-model-gemini", {
        prompt: input,
      });

      const data = res.data;
      if (data.output) {
        // Simple check: If it looks like HTML, we can render it or display it
        setOutput(data.output);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">
          AI Website Builder
        </h1>

        <div className="flex gap-4 mb-8">
          <input
            type="text"
            className="flex-1 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g., Build a user dashboard for an ecommerce website"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {/* Output Preview Area */}
        <div className="border rounded-xl bg-white shadow-lg min-h-[500px] overflow-hidden relative">
          {output ? (
            // NOTE: This renders the raw HTML. Be careful with XSS in production.
            // Since we instructed Gemini to only give body content, we wrap it in a div.
            <div
              className="w-full h-full p-4 overflow-auto"
              dangerouslySetInnerHTML={{ __html: output }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Your generated website will appear here...
            </div>
          )}
        </div>

        {/* Optional: Show raw code */}
        {output && (
          <details className="mt-4">
            <summary className="cursor-pointer text-gray-600">
              View Raw Code
            </summary>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg mt-2 overflow-x-auto text-sm">
              {output}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
