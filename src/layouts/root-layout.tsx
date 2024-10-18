import { Outlet, useNavigate } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import Navbar from '../components/navbar-component';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

export default function RootLayout() {
  const navigate = useNavigate();

  return (
    <div className='w-screen max-w-screen min-h-screen flex flex-col items-center justify-center overflow-x-hidden'>
    <ClerkProvider
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      publishableKey={PUBLISHABLE_KEY}
    >
      <Navbar />
      <Outlet/>
    </ClerkProvider>
    </div>
    
  )
}