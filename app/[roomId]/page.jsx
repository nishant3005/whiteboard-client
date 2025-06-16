'use client';

import Whiteboard from '../../components/Whiteboard';

export default function RoomPage({ params }) {
  return (
    <div className="flex justify-center items-center h-screen">
      <Whiteboard roomId={params.roomId} />
    </div>
  );
}
