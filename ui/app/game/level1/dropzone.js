import styles from '../game.module.css'
import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'
import { setAnswer } from '../../answerSlice'
import { setText, resetText } from '../../textSlice'
import api from '../../api'

export default function Dropzone({ requestPanelImagePath, options = [], messages = [], levelId, stepId = 1 }) {
  const dispatch = useDispatch()
  const dragId = useSelector((state) => state.drag.dragId)
  const answers = useSelector((state) => state.answer[levelId][stepId])
  const allowDrop = (event) => {
    event.preventDefault()
  }

  const optionNames = options.map((option) => option.name)

  const drop = (event) => {
    event.preventDefault()

    if (optionNames.includes(dragId)) {
      dispatch(setAnswer({ levelId, stepId, answerName: dragId }))
      dispatch(setText(messages.filter(({name}) => name == dragId)[0].message))
    }
    else {
      dispatch(setText(messages.filter(({name}) => name == dragId)[0].message))
    }
  }

  const click = (event) => {
    event.preventDefault()
    if (levelId === "level1" && stepId === 2) {
      dispatch(setAnswer({ levelId, stepId, answerName: "consent" }))
    }
  }



  const rules = [
    "Repeated payments of similar amounts to the same destination SortCode or AccountHash in a short space of time",
    "Rejected payments",
    "Payments from lots of different sources to the same destination SortCode or AccountHash"
  ]

  const promptTemplate = `
  Let's play a game.

We have a dataset of fake payments that we made up for the game. We're pretending that some of the payments were fraudulent. Think about what aspects of a set of payments might indicate fraudulent activity over time.

Indicators of fraudulent payment activity may include:
 ${rules.map((rule) => `\n ${rule}`)}

 In the next message, I will give you a dataset of payments, and I would like you to identify any payments that have a high probability of being fraudulent.

For each potentially fraudulent payment, provide your reasoning for identifying. Where there are groups of payments that belong to the same pattern of activity, please allocate a unique number to each group.
Please provide the results in table format, and for each payment, include:

IDHash
Amount
createdAt
status
Reason for suspicion
Activity pattern group

The format of the input dataset is a tab delimited table of text. I'm aware that you're not designed for sophisticated data analysis, but please try anyway, as an experiment.

  `

  const onClick = () => {
    const { promptGpt} = api()
    return promptGpt(promptTemplate).then((answer) => document.getElementById("answer").innerHTML = answer.data.replace(/\n/g, "<br>"))
  }

  return (
    <div
      className={styles.codeinternal}
      id="dropzone1"
      onDrop={(e) => drop(e)}
      onDragOver={(e) => allowDrop(e)}
      onClick={(e) => click(e)}
    >

      {rules.map((rule) => {
        return  (
          <div className={styles.rule}>
            <input type='text' name="rule" defaultValue={rule} className={styles.ruleinput} />
          </div>
        )
      })}

      <div>
        <button className={styles.getanswer} onClick={onClick}>Find fraud!</button>
      </div>

      <div id="answer" className={styles.answer}/>
    </div>
  )
}