import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #d2a606, #f3dc0d);
  position: relative;
`

const Title = styled.h1`
  position: absolute;
  top: 50px;
  font-size: 60px;
  color: #000000;
  font-weight: bold;
  z-index: 10;
`

const TimerContainer = styled.div`
  display: flex;
  align-items: center;
`

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 20px;
`

const Card = styled(motion.div)`
  width: 150px;
  height: 200px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 80px;
  font-weight: bold;
  color: #000000;
  z-index: 10;
`

const Separator = styled.div`
  font-size: 80px;
  color: #000000;
  margin: 0 10px;
  z-index: 10;
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`

const ControlButton = styled.button`
  width: 60px;
  height: 60px;
  font-size: 15px;
  margin: 15px 0;
  background-color: rgba(255, 255, 255, 0.7);
  color: #000000;
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  cursor: pointer;
  &:hover {
    border: 1px solid rgba(0, 0, 0, 0.5);
  }
`

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`

const ProgressText = styled.div`
  font-size: 24px;
  color: #000000;
  margin: 5px 0;
  z-index: 10;
`

const Overlay = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
`

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
}

const cardVariants = {
  initial: { rotateX: 90, opacity: 0 },
  animate: { rotateX: 0, opacity: 1, transition: { duration: 0.3 } },
  exit: { rotateX: -90, opacity: 0, transition: { duration: 0.3 } }
}

function PomodoroApp () {
  const TOTAL_TIME = 25 * 60
  const [totalSeconds, setTotalSeconds] = useState(TOTAL_TIME)
  const [isRunning, setIsRunning] = useState(false)
  const [round, setRound] = useState(0)
  const [goal, setGoal] = useState(12)
  const [hasStarted, setHasStarted] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)

  const startCountdown = () => {
    if (!hasStarted) {
      setTotalSeconds(TOTAL_TIME)
    }
    setIsRunning(true)
    setHasStarted(true)
    setShowOverlay(true)
  }

  const pauseCountdown = () => {
    setIsRunning(false)
  }

  const clearCountdown = () => {
    setTotalSeconds(TOTAL_TIME)
    setIsRunning(false)
    setHasStarted(false)
    setRound(0)
    setGoal(12)
    setShowOverlay(false)
  }

  useEffect(() => {
    if (isRunning && totalSeconds > 0) {
      const timer = setInterval(() => {
        setTotalSeconds(t => t - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (totalSeconds === 0 && isRunning) {
      setIsRunning(false)
      setRound(r => r + 1)
      if ((round + 1) % 4 === 0) {
        setGoal(g => g + 1)
        alert('4라운드 완료! 목표가 1 증가했어요. 긴 휴식을 취하세요!')
      } else {
        alert('25분 완료! 5분 쉬세요.')
      }
      setTotalSeconds(TOTAL_TIME)
    }
  }, [isRunning, totalSeconds, round, TOTAL_TIME])

  const displayMinutes = Math.floor(totalSeconds / 60)
  const displaySeconds = totalSeconds % 60

  return (
    <Wrapper>
      <Title>Pomodoro</Title>
      <TimerContainer>
        <CardWrapper>
          <AnimatePresence mode='wait'>
            <Card
              key={displayMinutes}
              variants={cardVariants}
              initial='initial'
              animate='animate'
              exit='exit'
            >
              {displayMinutes < 10 ? `0${displayMinutes}` : displayMinutes}
            </Card>
          </AnimatePresence>
        </CardWrapper>
        <Separator>:</Separator>
        <CardWrapper>
          <AnimatePresence mode='wait'>
            <Card
              key={displaySeconds}
              variants={cardVariants}
              initial='initial'
              animate='animate'
              exit='exit'
            >
              {displaySeconds < 10 ? `0${displaySeconds}` : displaySeconds}
            </Card>
          </AnimatePresence>
        </CardWrapper>
      </TimerContainer>
      <ButtonContainer>
        <ControlButton onClick={isRunning ? pauseCountdown : startCountdown}>
          {isRunning ? '⏸' : '▶'}
        </ControlButton>
        {hasStarted && !isRunning && (
          <ControlButton onClick={clearCountdown}>Clear</ControlButton>
        )}
      </ButtonContainer>
      <ProgressContainer>
        <ProgressText>라운드: {round} / 4</ProgressText>
        <ProgressText>
          목표 진행: {Math.floor(round / 4)} / {goal}
        </ProgressText>
      </ProgressContainer>
      <AnimatePresence>
        {showOverlay && (
          <Overlay
            variants={overlayVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
          />
        )}
      </AnimatePresence>
    </Wrapper>
  )
}

export default PomodoroApp
