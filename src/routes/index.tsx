import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'

export default function IndexPage() {
  const navigate = useNavigate()
  const { isSignedIn, user } = useUser();
  const [roomID, setRoomID] = useState('');

  console.log("user", user);

  const generateRoomID = () => {
    const randomID = Math.floor(100000 + Math.random() * 900000).toString();
    return randomID;
  }

  const handleNewMeeting = () => {
    const newRoomID = generateRoomID();
    setRoomID(newRoomID);
    navigate(`/room?roomID=${newRoomID}`);
  }

  const handleNavigateRoom = () => {
    if (roomID) {
      navigate(`/room?roomID=${roomID}`)
    } else {
      alert('Please enter room ID')
    }
  }

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/sign-up');
    }
  }, [isSignedIn, navigate])

  return (
    <main className='w-full min-h-[85vh] h-full flex flex-col lg:flex-row'>
      <div className='lg:max-w-[50%] w-full h-full flex flex-col items-start justify-evenly gap-5 p-6 lg:p-10 py-10 lg:py-20'>
        <h1 className='text-3xl lg:text-4xl font-bold'>Video calls and meetings for everyone</h1>
        <p className='text-lg lg:text-xl'>
          Connect, collaborate, and celebrate from anywhere with Video
        </p>
        <div className='w-full flex flex-col lg:flex-row justify-between gap-4 lg:gap-2'>
          <div className='w-full lg:max-w-[30%]'>
            <button onClick={handleNewMeeting} className='w-full bg-blue-600 text-white py-2 rounded-lg'>New Meeting</button>
          </div>
          <div className='hidden lg:block h-10 w-0.5 bg-gray-600'></div>
          <div className='w-full flex gap-2'>
            <input 
              className='w-full lg:max-w-[70%] rounded-lg p-2 px-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500' 
              onChange={(e) => setRoomID(e.target.value)} 
              value={roomID} 
              type="text" 
              placeholder="Enter your meeting code" 
            />
            <button 
              className={`bg-blue-600 text-white py-2 px-4 rounded-lg ${roomID ? "" : "opacity-50 cursor-not-allowed"}`} 
              onClick={handleNavigateRoom} 
              disabled={!roomID}
            >
              Join
            </button>
          </div>
        </div>
      </div>
      {/* Hide image on smaller devices */}
      <div className='hidden lg:flex lg:max-w-[50%] w-full h-full items-center justify-center p-6 lg:p-10'>
        <img 
          className='w-[60%] h-[60%] object-cover' 
          src="/video-call.png" 
          alt="videocall" 
        />
      </div>
    </main>
  )
}
