import { Check } from "lucide-react"

function page() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col justify-center items-center gap-4 border rounded-lg shadow p-4">
        <Check className="h-16 w-16 text-lime-800 bg-lime-400 rounded-full font-bold p-0.5" />
        <h1>Payment Success!</h1>
      </div>
    </div>
  );
}

export default page