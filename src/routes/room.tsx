import { useSearchParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';

function generateToken(tokenServerUrl: string, appID: number, userID: string, serverSecret: string, effectiveTimeInSeconds: number) {     
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
    const result = await res.json();
    return result.token;
  });
}

export default function App() {
  const [searchparam] = useSearchParams();
  const { isSignedIn, user } = useUser();
  const roomID = searchparam.get('roomID') as string;
  const appID = parseInt(import.meta.env.VITE_ZEGO_APP_ID);
  const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;
  const userID = user?.id as string;
  const effectiveTimeInSeconds = 3600;

  const userName = user?.fullName as string;

  let myMeeting = async (element: HTMLDivElement) => {
    const token = await generateToken(
      'https://videocall-nodejs-backend.vercel.app/api/token',
      appID,
      userID,
      serverSecret,
      effectiveTimeInSeconds,
    );

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
      appID,
      token,
      roomID,
      userID,
      userName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: 'Personal link',
          url: window.location.origin + window.location.pathname + '?roomID=' + roomID,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
      onUserAvatarSetter: (members) => {
        members.forEach((member) => {
          const avatarUrl = user?.imageUrl || 'https://example.com/avatars/default.png'; // Default avatar
          console.log(`Setting avatar for userID: ${member.userID}, Avatar URL: ${avatarUrl}`); // Log for debugging
          if (member.setUserAvatar) {
            member.setUserAvatar(avatarUrl);
          }
        });
      },
      onLeaveRoom: () => {
        window.location.href = '/';
      }
    });
  };

  useEffect(() => {
    if (!isSignedIn) {
      window.location.href = '/sign-up';
    }
  }, [isSignedIn]);

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
}
