'use client';

import dynamic from 'next/dynamic';
import Whiteboard from '../../components/Whiteboard';

// const Whiteboard = dynamic(() => import('@/components/Whiteboard'), {
//   ssr: false,
// });

// interface PageProps {
//   params: {
//     roomId: string;
//   };
// }

export default function RoomPage({ params }) {
  return (
    <div className="flex justify-center items-center h-screen">
      <Whiteboard roomId={params.roomId} />
    </div>
  );
}
