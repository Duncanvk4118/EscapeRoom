import {useEffect, useState} from "react";
import {useParams} from "react-router";
import { FaRegLightbulb } from 'react-icons/fa';
import api from '../utils/api';

export const Quest = () => {
    const [quest, setQuest] = useState(null);
    const {id} = useParams();

    useEffect(() => {
        const receiveQuest = async () => {
            try {
                let response;
                if (id) {
                    response = await api(`/game/get-question/${encodeURIComponent(id)}`);
                } else {
                    response = await api('/game/get-question');
                }
                console.log(response);
                setQuest(response);
                return response;
            } catch (e) {
                console.error('Error fetching question:', e);
                return e;
            }
        }
        receiveQuest();
    }, [id])

    const [selectedAwnser, setSelectedAwnser] = useState(null);
    const [answerResult, setAnswerResult] = useState(null);

    const handleSubmitAnswer = async () => {
        if (!selectedAwnser || !quest?.er_question_id) return;
        try {
            const resp = await api('/game/answer-question', {
                method: 'POST',
                body: JSON.stringify({ er_session_question_id: quest.er_question_id, answer_id: selectedAwnser })
            });
            setAnswerResult(resp);
            console.log('Answer response', resp);
            // After receiving answer result (correct or not), fetch the next question preview
            try {
                const next = await api('/game/get-question');
                console.log('Next question', next);
                setQuest(next);
                setSelectedAwnser(null);
                setAnswerResult(null);
            } catch (err) {
                // api throws on non-OK status; backend uses 204 when no more questions
                console.warn('Error fetching next question', err);
                if (err && err.status === 204) {
                    // No more questions
                    setQuest(null);
                    setAnswerResult({ info: err.body?.message || 'No more questions' });
                    setSelectedAwnser(null);
                } else {
                    // other errors, keep the answerResult visible and log
                    setAnswerResult({ error: err.message || 'Error fetching next question' });
                }
            }
        } catch (e) {
            console.error('Error submitting answer', e);
            setAnswerResult({ error: e.message || 'Unknown error' });
        }
    }

    return (
        <div className={"flex flex-col gap-4 items-center justify-center w-full min-h-[100vh]"}>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 w-full max-w-screen-lg justify-center items-center">
                <div>
                    <div className="bg-gray-700 rounded mt-4 shadow-lg py-6">
                        <div className="px-8">
                            <div className="flex items-end">
                                <span className="text-gray-300 text-sm font-thin focus:outline-none -ml-1">
                                    Vraag {quest?.question_id}
                                </span>
                            </div>
                            <img src="https://static.vecteezy.com/system/resources/thumbnails/009/383/627/small_2x/bicycle-clipart-design-illustration-free-png.png" alt="Vraag Img" className={"h-56 w-56 p-2"} />
                            <div className="flex flex-col items-end">
                            <span className="text-lg font-medium focus:outline-none -ml-1">
                                    {quest?.title}
                                </span>
                                <span>{quest?.description}</span>
                            </div>
                            {quest?.answers && (
                            <span className="text-xs text-gray-300 mt-2">Nog {"2"} hints over.</span>
                            )}
                        </div>
                        {quest?.answers && (
                        <div className="grid grid-flow-col grid-cols-5 px-8 pt-4 gap-2">
                            <button
                                className="flex col-span-1 items-center justify-center disabled:bg-amber-300 bg-amber-500 text-xl font-medium w-full h-15 rounded text-blue-50 hover:bg-amber-700 active:bg-amber-800 transition">
                                <FaRegLightbulb />
                            </button>
                            <button
                                onClick={handleSubmitAnswer}
                                disabled={!selectedAwnser}
                                className="flex col-span-4 items-center justify-center disabled:bg-orange-300 bg-orange-500 text-sm font-medium w-full h-10 rounded text-blue-50 hover:bg-orange-700 active:bg-orange-800 transition">
                                Controleren
                            </button>
                        </div>
                        )}
                        {!selectedAwnser && quest?.answers && <div className={"flex justify-center items-center"}><span className={"text-red-500 text-sm"}>{"Er is nog geen antwoord gegeven."}</span></div>}
                    </div>
                </div>
                {quest?.answers && (
                <div className="lg:col-span-2">
                    <h2 className="text-sm font-medium">Opties</h2>
                    <form className="bg-gray-700 rounded mt-4 shadow-lg">
                        {quest.answers.map((a, idx) => (
                            <div key={a.id} className={`cursor-pointer flex items-center px-8 py-5 ${idx > 0 ? 'border-t' : ''}`} onClick={() => setSelectedAwnser(a.id)}>
                                <input
                                    name="answers"
                                    checked={selectedAwnser === a.id}
                                    className={`cursor-pointer appearance-none w-4 h-4 rounded-full border-2 border-gray-700 ring-2 ring-orange-600 ring-opacity-100 ${selectedAwnser === a.id ? ' bg-orange-500' : ''}`}
                                    type="radio" readOnly />
                                <label className="cursor-pointer flex flex-row items-center text-sm font-medium ml-4"><span className={"cursor-pointer font-bold text-lg px-2"}>{String.fromCharCode(65 + idx)}</span>{a.answer}</label>
                            </div>
                        ))}
                    </form>
                </div>
                )}

                {answerResult && (
                    <div className="lg:col-span-3 px-8">
                        {answerResult.error ? (
                            <div className="text-red-400">Error: {answerResult.error}</div>
                        ) : (
                            <div className="text-green-400">{answerResult.correct ? 'Correct! +' + answerResult.points + ' points' : 'Incorrect'}</div>
                        )}
                    </div>
                )}

            </div>
        </div>
    )
}
