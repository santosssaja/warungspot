import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LoginForm from '@/components/LoginForm'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  )
}
