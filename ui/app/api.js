export default function api() {

  const promptGpt = async (prompt) => {
    const session = await fetch("http://localhost:5000/new-session")
    const parsedSession = await session.json()
    console.log(prompt)
    const response = await fetch(`http://localhost:5000/send/${parsedSession.data}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({message: prompt}),
    })
    const parsedResponse = await response.json()

    return parsedResponse
  }

  return {
    promptGpt
  }
}