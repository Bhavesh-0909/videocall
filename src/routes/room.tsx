import { useSearchParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useUser } from '@clerk/clerk-react';

function generateToken(tokenServerUrl: string, appID: number, userID: string, serverSecret: string, effectiveTimeInSeconds: number) {     
  // Obtain the token interface provided by the App Server
  return fetch(tokenServerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      appId: appID,
      userId: userID,
      serverSecret: serverSecret,
      effectiveTimeInSeconds: effectiveTimeInSeconds,
    }),
  }).then(async (res) => {
    const result = await res.text();
    return result;
  });
}

export default function App() {
  const [searchparam] = useSearchParams();
  const { user } = useUser();
  const roomID = searchparam.get('roomID') as string;
  const appID = parseInt(import.meta.env.VITE_ZEGO_APP_ID); // Updated
  const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET; // Updated
  const userID = user?.id as string;
  const effectiveTimeInSeconds = 3600;

  const userName = user?.fullName as string;
  let myMeeting = async (element: HTMLDivElement) => {
    // generate token
    const token = await generateToken(
      'http://localhost:3000/token',
      appID,
      userID,
      serverSecret,
      effectiveTimeInSeconds,
    );
    
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
      2013980891,
      token,
      roomID,
      userID,
      userName
    );
    // create instance object from token
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    // start the call
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: 'Personal link',
          url:
            window.location.origin +
            window.location.pathname +
            '?roomID=' +
            roomID,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
      },
    });
  };

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
}
