import styles from '../game.module.css'
import api from '../../api'
import { useState } from 'react'

const defaultRules = [
  "Repeated payments of similar amounts to the same destination SortCode or AccountHash in a short space of time",
  "Rejected payments",
  "Payments from lots of different sources to the same destination SortCode or AccountHash"
]

const getPromptTemplate = (rules) => `
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

Please provide the response in JSON format with no other information other than the table data starting with.

The format of the input dataset is a tab delimited table of text. I'm aware that you're not designed for sophisticated data analysis, but please try anyway, as an experiment.

`

export default function Dropzone({  options = [], messages = [], levelId, stepId = 1 }) {

  const [rules, setRules] = useState(defaultRules)

  const addRule = () => {
    setRules([...rules, ""])
  }

  const onClick = () => {
    console.log(Array.from(document.getElementsByName("rule"))?.map((rule) => rule.value))
    document.getElementById("answer").innerHTML = ""
    const { promptGpt} = api()
    return promptGpt(getPromptTemplate(Array.from(document.getElementsByName("rule")).map((rule) => rule.value).filter((rule) => rule !== "")))
    .then(({session}) => promptGpt(document.getElementById("txs").value, session))
    .then((answer) => document.getElementById("answer").innerHTML = answer.data.replace(/\n/g, "<br>"))
  }

  return (
    <div
      className={styles.codeinternal}
      id="dropzone1"
    >

      <div>
        <button className={styles.addrule} onClick={addRule}>Add rule</button>
      </div>
      <div className={styles.rules}>
      {rules.map((rule) => {
        return  (
          <div className={styles.rule} key={rule}>
            <input type='text' name="rule" defaultValue={rule} className={styles.ruleinput} />
          </div>
        )
      })}
      </div>

      <div>
      <label className={styles.label}>Paste in transaction data from spreadsheet</label>
        </div>
      <textarea className={styles.txs} id="txs" name="text" />

      <div>
        <button className={styles.getanswer} onClick={onClick}>Find fraud!</button>
      </div>

      <div id="answer" className={styles.answer}/>
    </div>
  )
}