import styles from '../game.module.css'
import api from '../../api'
import { useState } from 'react'
// import { getMoneyhubClient } from "../../mh-client"
import { useSearchParams, useRouter } from 'next/navigation'

const fraudulentIDs = ["d12d9140","27db3552","f79d21fd","23a1cfe7","5e7219dd","b808a3b3","3c6f297f","4cb6d298","3d0aa14f","138bdd5a","39a5aa53","62977d25","edf5c9dc","329e3ec5","ee875dc8","ebcbc2a4","d5a013d0","5aa1ca11","7f1bb038","e04d57b8","dea9c18f","59ec9c62","e070dc74","033ea6e1","585cda40","edf1b1ae","a21d24d4","8b196d7a","b04407d8","601b7553","0b09d5b3","569e2554","1d0a043f","d75a2b4f","fd25ea40","b2b647ff","02cd260e","ad5a0c0a","cf695e9a","e8c977ee","0436d031","e058473e","3055b9ad","8b91e255","21c16c5f","489cc28a","a006b6b7","7c32addf","08a2efee","2f27d2a7","24cf698c","544d38e7","9a6b2300","dc536b0d","1789428f","4dead711","2aeccc9b","347b74b1","a9177cda","1b294aff","7d45f443","7583a4fd","5d73d84e","0e96870f","c3b96968","75cff55d","4008ae09","670d035e","de8cb838","506a7fb3","604ce947","6d91ac99","aa06f621","08289bb0","cb8f3684","6c1d36d5","a033d995","082e97ad","1d807137","8732f6af","29b3f4a6","29bcfb12","cd9f1bbc","3549df75"]

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
Please provide the results in json format, and for each payment, include:

Please provide the response in JSON format with no other information other than the table data starting with.

The format of the input dataset is a tab delimited table of text. I'm aware that you're not designed for sophisticated data analysis, but please try anyway, as an experiment.

respond in the format {
  "payments": [{
    IDHash
    Amount
    createdAt
    status
    reasonForSuspicion
    activityPatternGroup
  }, ...]
}

`

export default function Dropzone({  options = [], messages = [], levelId, stepId = 1 }) {

  // const router = useRouter()

  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  if(token) {
    const {getTransactions} = api()
    getTransactions(token).then((data) => {
      document.getElementById("txs").innerHTML = JSON.stringify(data.data)
    })
  }

  const [rules, setRules] = useState(defaultRules)

  const addRule = () => {
    setRules([...rules, ""])
  }

  const connect = () => {
    const {getUrl} = api()

    getUrl()
    .then(url => {
      console.log(url)
      router.push(url.data)
    })
    .catch(error => {
      console.error('Error:', error)
    })
  }

  const onClick = () => {
    console.log(Array.from(document.getElementsByName("rule"))?.map((rule) => rule.value))
    document.getElementById("answer").innerHTML = ""
    const { promptGpt, closeGpt} = api()
    return promptGpt(getPromptTemplate(Array.from(document.getElementsByName("rule")).map((rule) => rule.value).filter((rule) => rule !== "")))
    .then(({session}) => promptGpt(document.getElementById("txs").value, session))
    .then((answer) => document.getElementById("answer").innerHTML = answer.data.replace(/\n/g, "<br>"))
    .then(closeGpt)
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
      <div>
        <button className={styles.getanswer} onClick={connect}>Add Moneyhub Transactions</button>
      </div>
        </div>
      <textarea className={styles.txs} id="txs" name="text" />

      <div>
        <button className={styles.getanswer} onClick={onClick}>Find fraud!</button>
      </div>

      <div id="answer" className={styles.answer}/>
    </div>
  )
}
