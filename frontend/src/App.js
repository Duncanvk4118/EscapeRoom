"use client"


import { useState } from "react"
// @ts-ignore
import { Button } from "@/components/ui/button"
// @ts-ignore
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// @ts-ignore
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star, Lock, Play, Trophy, Zap } from "lucide-react"
// @ts-ignore
import { RoomSelector } from "@/components/room-selector"
// @ts-ignore
import { GameInterface } from "@/components/game-interface"

export default function App() {
    const [currentView, setCurrentView] = useState<"home" | "rooms" | "game">("home")
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null)

    const handleStartGame = (roomId: string) => {
        setSelectedRoom(roomId)
        setCurrentView("game")
    }

    const handleBackToRooms = () => {
        setCurrentView("rooms")
        setSelectedRoom(null)
    }

    const handleBackToHome = () => {
        setCurrentView("home")
        setSelectedRoom(null)
    }

    if (currentView === "game" && selectedRoom) {
        return <GameInterface roomId={selectedRoom} onBack={handleBackToRooms} />
    }

    if (currentView === "rooms") {
        return <RoomSelector onSelectRoom={handleStartGame} onBack={handleBackToHome} />
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
                <div className="relative container mx-auto px-4 py-16 lg:py-24">
                    <div className="text-center space-y-8">
                        <div className="space-y-4">
                            <Badge variant="secondary" className="text-sm font-medium pulse-glow">
                                <Zap className="w-3 h-3 mr-1" />
                                {"Digital Escape Experience"}
                            </Badge>
                            <h1 className="text-4xl lg:text-7xl font-bold text-balance">
                                {"ESCAPE"}
                                <span className="block text-primary flicker">{"QUEST"}</span>
                            </h1>
                            <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                                {
                                    "Immerse yourself in challenging digital escape rooms. Solve puzzles, uncover secrets, and race against time."
                                }
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button size="lg" className="text-lg px-8 py-6 pulse-glow" onClick={() => setCurrentView("rooms")}>
                                <Play className="w-5 h-5 mr-2" />
                                {"Start Playing"}
                            </Button>
                            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                                <Trophy className="w-5 h-5 mr-2" />
                                {"View Leaderboard"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">{"Why Choose Escape Quest?"}</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {"Experience the thrill of escape rooms from anywhere with our cutting-edge digital platform."}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <Card className="border-border/50 hover:border-primary/50 transition-colors">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                                <Clock className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle>{"Real-Time Challenges"}</CardTitle>
                            <CardDescription>
                                {"Experience authentic escape room pressure with live countdown timers and dynamic puzzles."}
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-border/50 hover:border-primary/50 transition-colors">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-accent" />
                            </div>
                            <CardTitle>{"Multiplayer Support"}</CardTitle>
                            <CardDescription>
                                {"Team up with friends or challenge other players in collaborative puzzle-solving adventures."}
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-border/50 hover:border-primary/50 transition-colors">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-chart-4/20 flex items-center justify-center mb-4">
                                <Star className="w-6 h-6 text-chart-4" />
                            </div>
                            <CardTitle>{"Immersive Themes"}</CardTitle>
                            <CardDescription>
                                {"Explore diverse environments from haunted mansions to space stations, each with unique storylines."}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </div>

            {/* Preview Rooms Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">{"Featured Escape Rooms"}</h2>
                    <p className="text-lg text-muted-foreground">{"Get a taste of our most popular escape room experiences."}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        {
                            title: "The Haunted Manor",
                            difficulty: "Hard",
                            time: "45 min",
                            players: "2-6",
                            description: "Uncover the dark secrets of Blackwood Manor before the spirits claim you.",
                            image: "/haunted-mansion-dark-gothic.jpg",
                        },
                        {
                            title: "Space Station Omega",
                            difficulty: "Medium",
                            time: "35 min",
                            players: "1-4",
                            description: "Fix the failing life support systems before oxygen runs out.",
                            image: "/futuristic-space-station-sci-fi.jpg",
                        },
                        {
                            title: "The Lost Temple",
                            difficulty: "Easy",
                            time: "25 min",
                            players: "1-5",
                            description: "Navigate ancient traps and puzzles to claim the golden artifact.",
                            image: "/ancient-temple-jungle-adventure.jpg",
                        },
                    ].map((room, index) => (
                        <Card
                            key={index}
                            className="overflow-hidden border-border/50 hover:border-primary/50 transition-all hover:scale-105"
                        >
                            <div className="aspect-video relative overflow-hidden">
                                <img src={room.image || "/placeholder.svg"} alt={room.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <Badge
                                    variant={
                                        room.difficulty === "Hard" ? "destructive" : room.difficulty === "Medium" ? "default" : "secondary"
                                    }
                                    className="absolute top-3 right-3"
                                >
                                    {room.difficulty}
                                </Badge>
                            </div>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    {room.title}
                                    <Lock className="w-4 h-4 text-muted-foreground" />
                                </CardTitle>
                                <CardDescription>{room.description}</CardDescription>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {room.time}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        {room.players}
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <Button size="lg" onClick={() => setCurrentView("rooms")} className="pulse-glow">
                        {"View All Rooms"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
