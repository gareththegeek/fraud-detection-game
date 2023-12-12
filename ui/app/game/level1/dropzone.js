import styles from '../game.module.css'
import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'
import { setAnswer } from '../../answerSlice'
import { setText, resetText } from '../../textSlice'

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

    // TODO call fetch to server APIs and get response (maybe console.log for now)



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

  const onClick = () => {

  }

  const rules = [
"Repeated payments of similar amounts to the same destination SortCode or AccountHash in a short space of time",
"Rejected payments",
"Payments from lots of different sources to the same destination SortCode or AccountHash"
  ]

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

      <textarea id="summary" />

      <div>
        <button onClick={onClick}>Get stuff</button>
      </div>

      <div className={styles.answer}/>
    </div>
  )
}