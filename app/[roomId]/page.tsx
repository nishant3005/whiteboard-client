'use client';

import dynamic from 'next/dynamic';

type Props = {
  params: {
    roomId: string;
  };
};

const Whiteboard = dynamic(() => import('../../components/Whiteboard'), {
  ssr: false,
});

export default function Room({ params }: Props) {
  return (
    <div className="flex justify-center items-center h-screen">
      <Whiteboard roomId={params.roomId} />
    </div>
  );
}
