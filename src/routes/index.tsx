import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'

export default function IndexPage() {
  const navigate = useNavigate()
  const { isSignedIn } = useUser()
  const [roomID, setRoomID] = useState('');

  const handleNavigateRoom = () =>{
    if(roomID){
      navigate(`/room?roomID=${roomID}`)
    } else {
      alert('Please enter room ID')
    }
  }

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/sign-in')
    }
  }, [isSignedIn, navigate])

  return (
    <main className='w-full min-h-[85vh] h-full flex'>
        <div className='max-w-[50%] w-full h-full flex flex-col items-start justify-evenly gap-5 p-10 py-20'>
            <h1>Video calls and meeting for everyone</h1>
            <p>Connect, collabrate and celebrate fron anywhere with Video</p>
            <div className='w-full flex justify-between gap-2'>
                <div className='w-full max-w-[30%]'>
                    <button className='w-full'>New Meeting</button>
                </div>
                <div className='h-102 w-0.5 bg-gray-600'></div>
                <div className='w-full flex gap-2'>
                    <input 
                      className='max-w-[70%] w-full rounded-lg p-2 px-3' 
                      onChange={(e)=> setRoomID(e.target.value)} 
                      value={roomID} 
                      type="text" 
                      placeholder="Enter your meeting code" 
                    />
                    <button className={`${roomID ? "": "cursor-not-allowed"}`} onClick={handleNavigateRoom} disabled={roomID ? false : true}>Join</button>
                </div>
            </div>
        </div>
        <div className='max-w-[50%] w-full h-full flex items-start justify-center p-10'>
          <img className='w-[60%] h-[60%]' src="/video-call.png" alt="videocall" />
        </div>
    </main>
  )
}