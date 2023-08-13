import { Box } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider"
import SideDrawer from "../conponent/miscellaneous/SideDrawer";
import MyChats from "../conponent/MyChats";
import ChatBox from "../conponent/ChatBox";
import { useState } from "react";





const ChatPage = () => {

 const [fetchAgain, setFetchAgain] = useState(false)
 const {user} = ChatState();
   
  return (
    <div style={{ width : "100%"}}>
         {user && <SideDrawer></SideDrawer>}
         <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
            {user && <MyChats fetchAgain={fetchAgain} />}
            {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
         </Box>
    </div>
  )
}

export default ChatPage