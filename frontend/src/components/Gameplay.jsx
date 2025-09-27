import bg from "../assets/bg.png";
import { FaHome } from 'react-icons/fa';
import Card from './CardboardQuestion';
import { useEffect, useState } from 'react';
import Data from '../assets/exampleQuestions.json'
import sampleCard from '../game/sampleCard'

function Gameplay() {
    const [index, setIndex] = useState(0);
    const [question, setQuestion] = useState(null);

    useEffect(() => {
        if (!Array.isArray(Data) || Data.length === 0) {
            setQuestion(null);
            return;
        }
        // initialize to first True_or_False or index 0
        const tfIndex = Data.findIndex(q => q.puzzle_type === 'True_or_False');
        setIndex(tfIndex >= 0 ? tfIndex : 0);
        setQuestion(Data[tfIndex >= 0 ? tfIndex : 0]);
    }, []);

    const handleAnswer = (isCorrect, dmg, choice) => {
        console.log('answered', { isCorrect, dmg, choice });
    };

    const handleNext = () => {
        if (!Array.isArray(Data) || Data.length === 0) {
            // no real data; nothing to advance
            return;
        }
        const next = (index + 1) % Data.length;
        setIndex(next);
        setQuestion(Data[next]);
    };

    return (
        <div
            className="relative min-h-screen bg-center bg-cover bg-no-repeat"
            style={{ backgroundImage: `url(${bg})` }}
        >
            <button className="p-[30px] text-2xl text-white z-40 relative inline-flex items-center justify-center bg-black/70 rounded-full">
                <FaHome />
            </button>
            <div className="absolute left-1/2 top-96 -translate-x-1/2 z-20">
                <Card data={question || sampleCard} onAnswer={handleAnswer} onNext={handleNext} />
            </div>
            <div className="absolute inset-0 bg-black/40 pointer-events-none z-10" />
        </div>
    );
}

export default Gameplay;
