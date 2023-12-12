'use client'
import styles from './game.module.css'
import Image from 'next/image'
import StepsList from './steps-list'
import OptionsList from './options-list'
import { useSelector, useDispatch } from 'react-redux'
import { setStepId } from '../stepSlice'
import { setText } from '../textSlice'
import Link from 'next/link'

export default function LevelPage({
  levelTitleImageName,
  levelTitleAltText,
  levelTitleWidth = 0,
  levelTitleHeight = 0,
  steps = [],
  options = [],
  stepId,
  levelId,
  children
}) {
  const dispatch = useDispatch()
  const text = useSelector((state) => state.text.text)
  const answers = useSelector((state) => state.answer[levelId][stepId] || {})

  const showConsentComplete = stepId === 2 && levelId === "level1" && answers.consent

  const answersCorrect = Object.keys(answers).map((answerKey) => answers[answerKey])
  const allCorrect = answersCorrect.length > 0 && answersCorrect.every((answerCorrect) => answerCorrect)

  const showStep1Complete = stepId === 1 && levelId === "level1" && allCorrect
  const showStep3Complete = stepId === 3 && levelId === "level1" && allCorrect

  if (showConsentComplete || showStep1Complete) {
    dispatch(setText("Nice work! Let's move on to the next step"))
  }

  if (showStep3Complete) {
    dispatch(setText("We did it! Implicit flow successful!!"))
  }

  const onStep1Click = () => {
    dispatch(setStepId({ levelId: "level1", stepId: 2 }))
  }

  const onStep2Click = () => {
    dispatch(setStepId({ levelId: "level1", stepId: 3 }))
  }

  return (
    <div className={styles.levelpage}>
      <div className={styles.pagetitle}>
        <div className={styles.center}>
          <Image
            className={styles.logo}
            src={`/${levelTitleImageName}.png`}
            alt={`${levelTitleAltText}`}
            width={levelTitleWidth}
            height={levelTitleHeight}
            priority
            unoptimized
          />
        </div>
      </div>
      <div className={styles.content}>
        {children}
      </div>

    </div>
  )
}