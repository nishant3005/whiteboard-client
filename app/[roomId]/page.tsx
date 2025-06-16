'use client';

import dynamic from 'next/dynamic';

const Whiteboard = dynamic(() => import('../../components/Whiteboard'), {
  ssr: false,
});

export default function Room({ params }: { params: { roomId: string } }) {
  return (
    <div className="flex justify-center items-center h-screen">
      <Whiteboard roomId={params.roomId} />
    </div>
  );
}
