import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import jwt from 'jsonwebtoken'

export default async function Home() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  console.log(token);

  if (!token) {
    redirect('/login')
  }

  try {
    console.log('Acessou aqui');

    jwt.verify(token, process.env.JWT_SECRET!)
    redirect('/dashboard')
  } catch {
    console.log('Acessou aqui erro');

    redirect('/login')
  }
}
