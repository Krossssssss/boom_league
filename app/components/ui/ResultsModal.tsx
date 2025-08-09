import React, { useState } from 'react';
import Modal from './Modal';
import { useTheme } from '../../contexts/ThemeContext';
import type { ResultsModalProps } from '../../types';

const ResultsModal: React.FC<ResultsModalProps> = ({ players, onClose, onSubmit, round }) => {
    const { theme } = useTheme();
    const [rankedPlayers, setRankedPlayers] = useState(players.map(p => p.id));
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const handleDragStart = (e: React.DragEvent, index: number) => {
        e.dataTransfer.setData("draggedIndex", index.toString());
        e.dataTransfer.effectAllowed = 'move';
        setDraggedIndex(index);
        
        // Add ghost image styling
        const dragElement = e.currentTarget as HTMLElement;
        dragElement.style.opacity = '0.5';
        
        // Create custom drag image
        setTimeout(() => {
            dragElement.style.opacity = '1';
        }, 0);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverIndex(index);
    };

    const handleDragEnter = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        // Only clear if we're leaving the container entirely
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            setDragOverIndex(null);
        }
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        const draggedIdx = parseInt(e.dataTransfer.getData("draggedIndex"));
        
        if (draggedIdx !== dropIndex) {
            const newRankedPlayers = [...rankedPlayers];
            const [draggedItem] = newRankedPlayers.splice(draggedIdx, 1);
            newRankedPlayers.splice(dropIndex, 0, draggedItem);
            setRankedPlayers(newRankedPlayers);
        }
        
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        e.preventDefault();
        setDraggedIndex(null);
        setDragOverIndex(null);
        
        // Reset any styling
        const dragElement = e.currentTarget as HTMLElement;
        dragElement.style.opacity = '1';
    };

    const getPlayerById = (id: string) => players.find(p => p.id === id);

    return (
        <Modal onClose={onClose} title={`输入第 ${round} 轮比赛结果`}>
            <div>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4 text-sm sm:text-base`}>
                    请拖动玩家卡片以确定本轮名次（从上到下为 1-N 名）。
                </p>
                <div className="space-y-2 sm:space-y-3 max-h-60 sm:max-h-72 overflow-y-auto">
                    {rankedPlayers.map((playerId, index) => {
                        const player = getPlayerById(playerId);
                        if (!player) return null;
                        return (
                            <div
                                key={playerId}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleDrop(e, index)}
                                className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 active:scale-[0.98] ${
                                    theme === 'dark' 
                                        ? 'bg-gray-700 hover:bg-gray-600 active:bg-gray-600' 
                                        : 'bg-gray-200 hover:bg-gray-300 active:bg-gray-300'
                                }`}
                            >
                                <span className="font-bold text-base sm:text-lg text-orange-400 w-5 sm:w-6 flex-shrink-0 text-center">{index + 1}</span>
                                <span className="text-xl sm:text-2xl flex-shrink-0">{player.avatar}</span>
                                <span className={`font-semibold text-sm sm:text-base truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{player.name}</span>
                            </div>
                        );
                    })}
                </div>
                <button
                    onClick={() => onSubmit(rankedPlayers)}
                    className="w-full mt-4 sm:mt-6 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-3 sm:py-4 rounded-lg transition-all duration-200 active:scale-[0.98] text-sm sm:text-base"
                >
                    确认并进入下一轮
                </button>
            </div>
        </Modal>
    );
};

export default ResultsModal;
