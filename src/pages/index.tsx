import React, { useState } from "react"
import { api } from "~/utils/api"
import { signIn, signOut, useSession } from "next-auth/react"

const CreateUser = () => {
  const { data: sessionData } = useSession()
  const { data: secretMessage } = api.user.secret.useQuery(undefined, // no input
    { enabled: sessionData?.user !== undefined })
  const { mutate } = api.user.create.useMutation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const role = 'admin'
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (username && password) mutate({ username, password, role })
  }

  return (
    <div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="username"></label>
        <input type="text" value={username} id="username" onChange={e => setUsername(e.currentTarget.value)} />
        <label htmlFor="password"></label>
        <input type="password" value={password} id="password" onChange={e => setPassword(e.currentTarget.value)} />
        <button type="submit">Enviar</button>
      </form>
      <AuthShowcase></AuthShowcase>
    </div>
  )
}

export default CreateUser




function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.user.secret.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div >
      <p >
        {sessionData && <span>Logged in as {sessionData.user.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button

        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
