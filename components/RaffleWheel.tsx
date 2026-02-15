import React, { useRef, useEffect, useState } from 'react';

interface RaffleWheelProps {
    participants: string[];
    onWinnerSelected: (winner: string) => void;
    disabled?: boolean;
}

const colors = ["#8B5CF6", "#EC4899", "#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#6366F1", "#14B8A6"];

const RaffleWheel: React.FC<RaffleWheelProps> = ({ participants, onWinnerSelected, disabled }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const rotationRef = useRef(0);
    // FIX: Explicitly initialize useRef with `undefined` to support older TypeScript/React type definitions that may not have the no-argument overload.
    const prevParticipantsRef = useRef<string[] | undefined>(undefined);


    const wheelSize = 380;
    const halfSize = wheelSize / 2;

    const drawWheel = (rotationInDegrees: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const arc = 2 * Math.PI / participants.length;
        const rotationInRadians = rotationInDegrees * Math.PI / 180;

        ctx.clearRect(0, 0, wheelSize, wheelSize);
        ctx.save();
        ctx.translate(halfSize, halfSize);
        ctx.rotate(rotationInRadians);
        ctx.translate(-halfSize, -halfSize);
        
        ctx.font = '16px "Poppins", sans-serif';

        for (let i = 0; i < participants.length; i++) {
            const angle = i * arc;
            ctx.fillStyle = colors[i % colors.length];

            ctx.beginPath();
            ctx.moveTo(halfSize, halfSize);
            ctx.arc(halfSize, halfSize, halfSize - 5, angle, angle + arc);
            ctx.lineTo(halfSize, halfSize);
            ctx.fill();

            ctx.save();
            ctx.fillStyle = "white";
            ctx.translate(halfSize + Math.cos(angle + arc / 2) * (halfSize * 0.65), halfSize + Math.sin(angle + arc / 2) * (halfSize * 0.65));
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            const text = participants[i];
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            ctx.restore();
        }
        ctx.restore();
    };
    
    useEffect(() => {
        // Compara a lista de participantes atual com a anterior para decidir se reseta.
        const participantsHaveChanged = JSON.stringify(prevParticipantsRef.current) !== JSON.stringify(participants);

        if (participantsHaveChanged) {
            // Se mudou (ex: novo mês selecionado), reseta a rotação.
            rotationRef.current = 0;
        }

        // Sempre redesenha a roleta na sua posição atual (seja 0 ou a final).
        drawWheel(rotationRef.current);

        // Armazena a lista atual para a próxima comparação.
        prevParticipantsRef.current = participants;

    }, [participants]); // O hook reavalia quando a referência de `participants` muda.

    const handleSpin = () => {
        if (isSpinning || participants.length === 0 || disabled) return;
        
        setIsSpinning(true);

        const winnerIndex = Math.floor(Math.random() * participants.length);
        const winner = participants[winnerIndex];
        const arcDegrees = 360 / participants.length;
        const targetSliceCenter = (winnerIndex + 0.5) * arcDegrees;
        const randomOffset = (Math.random() - 0.5) * (arcDegrees * 0.8);
        const targetAngle = 270 - targetSliceCenter - randomOffset;
        const totalRotations = 7 * 360;
        const targetRotation = totalRotations + targetAngle;

        let start: number | null = null;
        const duration = 6000;
        const startRotation = rotationRef.current % 360; // Start from the current visual position

        const easeOutQuint = (t: number) => 1 + (--t) * t * t * t * t;

        const animate = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const t = Math.min(progress / duration, 1);
            const easedT = easeOutQuint(t);

            const currentRotation = startRotation + (targetRotation - startRotation) * easedT;
            rotationRef.current = currentRotation; // Update ref continuously for smooth animation
            drawWheel(currentRotation);

            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                rotationRef.current = currentRotation % 360; // Normalize final angle
                drawWheel(rotationRef.current); // Final draw
                setIsSpinning(false);
                onWinnerSelected(winner);
            }
        };

        requestAnimationFrame(animate);
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative w-[380px] h-[380px]">
                <canvas ref={canvasRef} width={wheelSize} height={wheelSize}></canvas>
                <div className="absolute w-12 h-12 bg-slate-900 border-4 border-slate-500 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"></div>
                <div 
                    className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-0 h-0 z-10"
                    style={{
                        borderLeft: '15px solid transparent',
                        borderRight: '15px solid transparent',
                        borderTop: '25px solid #f87171',
                    }}
                ></div>
            </div>
            <button 
                onClick={handleSpin} 
                disabled={isSpinning || disabled}
                className="w-full max-w-xs bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-violet-600/30 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105"
            >
                {isSpinning ? "Girando..." : "Girar a Roleta!"}
            </button>
        </div>
    );
};

export default RaffleWheel;