'use client';

import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface WhiteboardProps {
  roomId: string;
}

const Whiteboard: React.FC<WhiteboardProps> = ({ roomId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const isDrawingRef = useRef(false);
  const [color, setColor] = useState('#000000');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const drawLine = (
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      color: string
    ) => {
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    };

    socketRef.current = io('https://whiteboard-server-425a.onrender.com');

    socketRef.current.emit('join', roomId);

    fetch(`https://whiteboard-server-425a.onrender.com/rooms/${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        data.forEach((line: any) => {
          drawLine(line.x0, line.y0, line.x1, line.y1, line.color);
        });
      });

    socketRef.current.on(
      'draw',
      (data: {
        x0: number;
        y0: number;
        x1: number;
        y1: number;
        color: string;
      }) => {
        drawLine(data.x0, data.y0, data.x1, data.y1, data.color);
      }
    );

    socketRef.current.on(
      'load-canvas',
      (
        data: {
          x0: number;
          y0: number;
          x1: number;
          y1: number;
          color: string;
        }[]
      ) => {
        data.forEach((line) => {
          drawLine(line.x0, line.y0, line.x1, line.y1, line.color);
        });
      }
    );

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let lastX = 0,
      lastY = 0;

    const startDrawing = (clientX: number, clientY: number) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      lastX = clientX - rect.left;
      lastY = clientY - rect.top;
      isDrawingRef.current = true;
    };

    const draw = (clientX: number, clientY: number) => {
      if (!isDrawingRef.current || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      socketRef.current.emit('draw', {
        roomId,
        x0: lastX,
        y0: lastY,
        x1: x,
        y1: y,
        color,
      });

      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();

      lastX = x;
      lastY = y;
    };

    const stopDrawing = () => {
      isDrawingRef.current = false;
    };

    // Mouse events
    canvas.addEventListener('mousedown', (e) =>
      startDrawing(e.clientX, e.clientY)
    );
    canvas.addEventListener('mousemove', (e) => draw(e.clientX, e.clientY));
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // Touch events
    canvas.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      startDrawing(touch.clientX, touch.clientY);
    });
    canvas.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      draw(touch.clientX, touch.clientY);
    });
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', (e) =>
        startDrawing(e.clientX, e.clientY)
      );
      canvas.removeEventListener('mousemove', (e) =>
        draw(e.clientX, e.clientY)
      );
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);

      canvas.removeEventListener('touchstart', () => {});
      canvas.removeEventListener('touchmove', () => {});
      canvas.removeEventListener('touchend', stopDrawing);
      canvas.removeEventListener('touchcancel', stopDrawing);
    };
  }, [color, roomId]);

  const handleSave = () => {
    if (roomId) {
      socketRef.current.emit('save', roomId);
      alert('Canvas saved!');
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full touch-none"
      />
      <div className="fixed top-4 left-4 z-50 bg-white p-2 rounded shadow flex items-center space-x-2">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8 border rounded"
        />
        <button
          onClick={handleSave}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          Save
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(roomId);
            alert(`Room ID copied: ${roomId}`);
          }}
          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
        >
          Copy ID
        </button>
      </div>
    </div>
  );
};

export default Whiteboard;
