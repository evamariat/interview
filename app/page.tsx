import VoiceRecorder from '@/components/VoiceRecorder';
import { ClientOnly } from '@/components/ClientOnly';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <ClientOnly 
        fallback={
          <div className="max-w-md mx-auto p-8 text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading voice recorder...</p>
          </div>
        }
      >
        <VoiceRecorder />
      </ClientOnly>
    </main>
  );
}

