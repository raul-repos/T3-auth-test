import React, { useState } from "react"
import { api } from "~/utils/api"
import { signIn } from "next-auth/react"

const CreateUser = () => {
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
      <button onClick={() => void signIn()}>signIn</button>
    </div>
  )
}

export default CreateUser