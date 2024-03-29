import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'

export default function Login() {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [localData, setLocalData] = useState()

  const [userLocal, setUserLocal] = useState('')
  const { push } = useRouter()

  function handleLogin() {
    //event.preventDefault()

    if (!localData) {
      const userData = {
        user: user,
        password: password
      }

      localStorage.setItem('@admin-console-user', JSON.stringify(userData))
    } else {
      localStorage.removeItem('@admin-console-user')
    }
    push('/')
  }

  useEffect(() => {
    try {
      const storageData = localStorage.getItem('@admin-console-user')
      const userData = JSON.parse(storageData)
      setLocalData(userData.user)

    } catch (error) {
      setLocalData(null)
    }
  }, [])


  useEffect(() => {
    try {
      const storageData = localStorage.getItem('@admin-console-user')
      const userData = JSON.parse(storageData)

      setUserLocal(userData)

      if (userLocal) {
        push('/')
      }

    } catch (error) {

    }

  }, [userLocal])


  return (
    <div className="flex w-full items-center justify-center p-20">
      <form className="max-w-[620px] flex flex-col w-full gap-1">
        <label>Admin Console login</label>
        <input type="text" value={user} onChange={(e) => setUser(e.target.value)} className="h-8 rounded-sm p-2 bg-gray-300" />

        <label>password</label>
        <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="h-8 rounded-sm p-2 bg-gray-300" />

        <button onClick={handleLogin} className="flex items-center justify-center h-8 rounded-sm p-2 bg-Trutly">
          {localData ? (
            <span>Desconectar</span>
          ) : (
            <span>
              Save information in my computer
            </span>
          )}

        </button>
      </form>
    </div>
  )
}