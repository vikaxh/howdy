import React from 'react'
import { useState } from "react";
import { Box, Text } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import { Button } from "@chakra-ui/button";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { ChatState } from "../../context/ChatProvider"
import { useNavigate } from 'react-router-dom';
import { useToast } from "@chakra-ui/toast";
import {  useDisclosure} from "@chakra-ui/hooks"
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge";

import axios from "axios";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import ProfileModal from './ProfileModal';
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Spinner } from '@chakra-ui/react';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvator/UserListItem';
import { getSender } from '../../Config/ChatLogics';

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const {user, setSelectedChat, notification, setNotification} = ChatState();
  const history = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();


  const logoutHandler = ()  =>{
    localStorage.removeItem("userInfo");
    history('/')
  }
  const handleSearch = async () =>{
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }
  const acessChat= async (userId) =>{
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);
      console.log(data);

      // if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }
  return (
    <>
    <Box 
        display='flex'
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px">
    <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
    <Button variant="ghost" color='black' onClick={onOpen} >
          <i class="fa-solid fa-magnifying-glass"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
     </Button>
      </Tooltip>
        <Text fontSize="2xl" fontFamily="sans">
          Howdy
        </Text>
    <div>
        <Menu>
         <MenuButton p={1}>
         <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
            <BellIcon fontSize="2xl" m={1} />
          </MenuButton>
          <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `new Message in ${notif.chat.chatName}`
                    : `new Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
        </Menu>

         <Menu>
         <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic}/>
          </MenuButton>

          <MenuList>
            <ProfileModal user={user} >
            <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuDivider></MenuDivider>
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
    </div>
    </Box>
    <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay/>
      <DrawerContent>
      <DrawerHeader borderBottomWidth="1px">
          Search User
        </DrawerHeader>
      
      <DrawerBody>
       <Box display="flex" pb={2}>
       <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
        </Box> 
        {loading ? 
        (<ChatLoading />):
        (
         searchResult?.map(user =>(
          <UserListItem key ={user._id} user={user} handleFunction={()=>acessChat(user._id)} />
         ))
        )}
        {loadingChat && <Spinner ml="auto" display="flex"/>}
      </DrawerBody>
      </DrawerContent>
    </Drawer>
    </>
  )
}

export default SideDrawer;