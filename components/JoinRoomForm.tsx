'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function JoinRoomForm() {
  const [roomIdInput, setRoomIdInput] = useState('');
  const router = useRouter();

  const handleCreateRoom = () => {
    const newRoomId = uuidv4();
    router.push(`/${newRoomId}`);
  };

  const handleJoinRoom = () => {
    if (roomIdInput.trim() !== '') {
      router.push(`/${roomIdInput}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 p-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Collaborative Whiteboard
        </h1>
        <input
          type="text"
          placeholder="Enter Room ID"
          className="w-full border px-4 py-2 rounded text-sm"
          value={roomIdInput}
          onChange={(e) => setRoomIdInput(e.target.value)}
        />
        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
          <button
            onClick={handleJoinRoom}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm w-full"
          >
            Join Room
          </button>
          <button
            onClick={handleCreateRoom}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm w-full"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
}
