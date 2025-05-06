// components/GameContent.tsx
'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import GamePlayer from '@/components/GamePlayer'
import { GameInfo } from '@/types'
import gameData from '../public/gameData.json'
import { MiniGameCard } from './GameCard'
import Navbar from './Navbar'

export default function GameContent({ gameInfo }: { gameInfo: GameInfo }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playerName, setPlayerName] = useState<string>('')

  // Load player name from localStorage on component mount
  useEffect(() => {
    const savedName = localStorage.getItem('playerName')
    if (savedName) {
      setPlayerName(savedName)
    }
  }, [])

  const handlePlayClick = () => {
    // Save player name to localStorage
    if (playerName.trim()) {
      localStorage.setItem('playerName', playerName.trim())
    }
    setIsPlaying(true)
  }

  return (
    <>

        <GamePlayer {...gameInfo} playerName={"kontolodon"} />
 
    </>
  )
}
