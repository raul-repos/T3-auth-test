import { api } from "~/utils/api"

const GetUsers = () => {
  const { data, isLoading } = api.user.getAll.useQuery()

  if (isLoading) return <h1>Loading...</h1>
  if (!data) return <h1>No hay usuarios</h1>

  return <div>{data.map(user => <p key={user.id}>{user.username}</p>)}</div>
}


export default GetUsers