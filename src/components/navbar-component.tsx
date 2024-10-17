import { useUser, UserButton } from "@clerk/clerk-react";
import { useSearchParams } from "react-router-dom";
function Navbar() {
    const {user} = useUser();
    const [searchParams] = useSearchParams();
    const roomID = searchParams.get('roomID');
  return (
    <div>
        {user && !roomID ? (
            <div className="w-full min-w-[100vw] flex h-fit justify-between items-center px-10 p-2 border-b-[1px] overflow-hidden">
                <img src={"/visual-logo.ico"} alt="profile" className="h-10 w-10 rounded-full" />
                <UserButton />
            </div>
        ) : (<div></div>)}
    </div>
  )
}

export default Navbar;