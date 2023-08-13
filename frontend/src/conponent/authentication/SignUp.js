import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const toast = useToast();

    const [show, setshow] = useState(false)
    const [name, setname] = useState()
    const [email, setemail] = useState()
    const [password, setpassword] = useState()
    const [confirmPassword, setconfirmPassword] = useState()
    const [pic, setpic] = useState()
    const [loading, setloading] = useState(false)
    const [picLoading, setPicLoading] = useState(false);
    const history = useNavigate()

    

    const handleClick = () => setshow(!show);

   

    const postDetails = (pics) =>{
      setloading(true);
      
      if(pics === undefined){
        toast({
                title: "please select an image",
                status: "warning",
                duration: 5000,
                isClosable: "true",
                position: "bottom",
            });
        return;
      }
    if(pics.type === "image/jpeg" || pics.type === "image/png") {
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "Howdy_chat");
        data.append("cloud_name", "vikaxh");
         fetch("https://api.cloudinary.com/v1_1/vikaxh/image/upload", {
          method: "post",
          body: data
        })
          .then((res) => res.json())
          .then((data) => {
            setpic(data.url.toString());
            console.log(data);
            setloading(false);
          })
          .catch((err) => {
            console.log(err);
            setloading(false);
          });
        }else {
          toast({
            title: "Please Select an Image!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setloading(false);
          return;
        }
      }
    
    const submitHandler = async ()=>{
      setPicLoading(true);
         if (!name || !email || !password || !confirmPassword) {
          toast({
            title: "Please Fill all the Feilds",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setPicLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          toast({
            title: "Passwords Do Not Match",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
        }
        console.log(name, email, password, pic);

        try {
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };

          const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );

      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      history('/chats')
          
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setPicLoading(false);
        
        }
         
    
  }
  return (
   <VStack spacing='5px'>
    <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input placeholder='Enter Your Name' onChange={(e)=> setname(e.target.value)}></Input>
    </FormControl>
    <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input placeholder='Enter Your Email' onChange={(e)=> setemail(e.target.value)}></Input>
    </FormControl>
    <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
        <Input type={show ? "text": "password"} placeholder='Enter Your Password' onChange={(e)=> setpassword(e.target.value)}></Input>
        <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
           { show ? "Hide" : "Show"}
        </Button>
        </InputRightElement>
        </InputGroup>
    </FormControl>
    <FormControl id="confirmPassword" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
        <Input type={show ? "text": "password"} placeholder='Enter Your Password' onChange={(e)=> setconfirmPassword(e.target.value)}></Input>
        <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
           { show ? "Hide" : "Show"}
        </Button>
        </InputRightElement>
        </InputGroup>
    </FormControl>
    <FormControl>
        <FormLabel>
            Upload Your Picture
        </FormLabel>
        <Input
        
        type="file"
        p={1.5}
        accept='image/*'
        onChange={(e) => postDetails(e.target.files[0])}
        >
        </Input>
    </FormControl>

    <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>

   </VStack>
  )
}

export default SignUp