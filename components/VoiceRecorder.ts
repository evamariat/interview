'use client';
import { useState, useRef, useCallback } from 'react';

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorderRef.current.onstop = handleStop;
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const handleStop = async () => {
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const res = await fetch('/api/transcribe', { 
        method: 'POST', 
        body: formData 
      });
      
      if (!res.ok) {
        throw new Error('Transcription failed');
      }
      
      const { text } = await res.json();
      setTranscript(text);
    } catch (error) {
      console.error('Error processing recording:', error);
      setTranscript('Transcription failed. Please try again.');
    } finally {
      // Clean up stream and chunks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      audioChunksRef.current = [];
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
          {isRecording ? (
            <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse" />
          ) : (
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4z" />
              <path d="M5.25 8.5A2.75 2.75 0 018 11.25v3.5a2.75 2.75 0 11-5.5 0v-3.5A2.75 2.75 0 015.25 8.5z" />
            </svg>
          )}
        </div>
        
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!navigator.mediaDevices}
          className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 transform ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 shadow-2xl shadow-red-200 active:scale-95' 
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-2xl shadow-blue-200 active:scale-95'
          } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isRecording ? '⏹️ Stop Recording' : '🎤 Start Recording'}
        </button>
      </div>
      
      {transcript && (
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 1100-12 6 6 0 010 12z" />
              <path fillRule="evenodd" d="M12.207 10.793a1 1 0 011.414 0l2.647 2.647a1 1 0 01-1.414 1.414l-2.647-2.647a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Transcription Result
          </h3>
          <p className="text-gray-800 leading-relaxed">{transcript}</p>
        </div>
      )}
    </div>
  );
}
