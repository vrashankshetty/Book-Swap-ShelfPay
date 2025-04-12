import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
        <h2 className="mt-4 text-xl font-semibold text-gray-500">Loading</h2>
        <p className="mt-2 text-gray-500">Please wait while we fetch your data...</p>
      </div>
    </div>
  )
}
