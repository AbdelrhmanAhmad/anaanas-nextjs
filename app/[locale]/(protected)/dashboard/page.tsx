import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { callLaravel } from '@/lib/laravelClient'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/sign-in?redirectTo=/dashboard')
  }

  let userData = null
  try {
    // Fetch current user from Laravel
    const response = await callLaravel('/api/auth/me')
    if (response.success && response.data?.user) {
      userData = response.data.user
    }
  } catch (error) {
    console.error('Failed to fetch user data:', error)
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Dashboard</h1>
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Welcome, {session.user?.name || session.user?.email || 'User'}!</h2>
              <p className="card-text">This is a protected route. Only authenticated users can access it.</p>
              
              {userData && (
                <div className="mt-4">
                  <h3>User Information from Laravel:</h3>
                  <pre className="bg-light p-3 rounded">
                    {JSON.stringify(userData, null, 2)}
                  </pre>
                </div>
              )}

              <div className="mt-4">
                <h3>Session Information:</h3>
                <pre className="bg-light p-3 rounded">
                  {JSON.stringify(
                    {
                      user: session.user,
                      hasAccessToken: !!session.accessToken,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

