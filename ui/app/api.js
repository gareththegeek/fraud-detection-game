

export default function api() {
  const getSession = async (sess) => {
    if(sess) {
      return {
        data: sess
      }
    }
    const session = await fetch("http://localhost:5000/new-session")
    const parsedSession = await session.json()
    return parsedSession
  }
  const promptGpt = async (prompt, session) => {
    const parsedSession = await getSession(session)
    console.log(prompt)
    const response = await fetch(`http://localhost:5000/send/${parsedSession.data}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({message: prompt}),
    })
    const parsedResponse = await response.json()

    return {...parsedResponse, session: parsedSession.data}
  }

  const closeGpt = async (session) => {
    const response = await fetch(`http://localhost:5000/delete-session/${session}`, {
      method: "POST",
    })
    const parsedResponse = await response.json()

    return parsedResponse
  }

  const getUrl = async () => {
    const response = await fetch(`http://localhost:5000/get-url`)
    const parsedResponse = await response.json()

    return parsedResponse
  }

  const getTransactions = async (token) => {
    const response = await fetch(`https://api.moneyhub.co.uk/v2.0/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    
    })
    const parsedResponse = await response.json()

    return parsedResponse
  }

  return {
    promptGpt,
    closeGpt,
    getUrl,
    getTransactions
  }
}