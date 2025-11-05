import React, { useState, useEffect } from "react";
import { FaTrophy, FaMedal } from "react-icons/fa";

export const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        // Simulated API data
        const mockData = [
            { id: 1, name: "Team 1", score: 980},
            { id: 2, name: "Team 2", score: 945},
            { id: 3, name: "Team 3", score: 920},
            { id: 4, name: "Team 4", score: 890},
            { id: 5, name: "Team 5", score: 875},
            { id: 6, name: "Team 6", score: 860},
            { id: 7, name: "Team 7", score: 845},
            { id: 8, name: "Team 8", score: 830},
        ];

        setLeaderboardData(mockData);
    }, []);

    const getPositionIcon = (position) => {
        switch (position) {
            case 0:
                return <FaTrophy className="text-yellow-500 text-2xl" />;
            case 1:
                return <FaMedal className="text-gray-400 text-2xl" />;
            case 2:
                return <FaMedal className="text-amber-700 text-2xl" />;
            default:
                return <span className="text-gray-500 font-bold text-xl">{position + 1}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br bg-gray-700 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-orange-500 mb-4">Quiz Leaderboard</h1>
                    <p className="text-lg text-gray-100">Wie staat er op het punt te winnen?</p>
                </div>

                <div className="bg-gray-400 rounded-xl shadow-xl overflow-hidden">
                    <div className="divide-y divide-gray-200">
                        {leaderboardData.map((user, index) => (
                            <div
                                key={user.id}
                                className={`transition-all duration-150 flex items-center p-6 ${index < 3 ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400" : ""}
                  ${index === 0 ? "bg-yellow-50" : ""}
                  hover:bg-gray-50 transition duration-150 ease-in-out`}
                            >
                                <div className="flex-shrink-0 w-12 flex justify-center">
                                    {getPositionIcon(index)}
                                </div>
                                <div className="ml-6 flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-2xl font-bold text-orange-700">{user.score}</span>
                                            <span className="ml-2 text-sm text-gray-500">points</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};