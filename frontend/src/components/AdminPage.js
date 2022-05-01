import React from 'react'
import {InfiniteScroll, Box, Avatar, Button, Accordion, AccordionPanel, Layer, Text, TextInput, Notification, Tip} from 'grommet'
import { Search, Edit} from 'grommet-icons'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import {Chat} from '../state/State'

const TipContent = ({ message }) => (
  <Box direction="row" align="center">
    <svg viewBox="0 0 22 22" version="1.1" width="22px" height="22px">
      <polygon
        fill="lightgrey"
        points="6 2 18 12 6 22"
        transform="matrix(-1 0 0 1 30 0)"
      />
    </svg>
    <Box background="lightgrey" direction="row" pad="small" round="xsmall">
      <Text>{message}</Text>
    </Box>
  </Box>
)

const AdminPage = () => {
   const {setLoggedinUser, setSelectedChat} = Chat()
   const history = useHistory()
   const [noSearch, setNoSearch] = React.useState(false)
   const [searchContent, setSearchContent] = React.useState('')
   const [searchLabel, setSearchLabel] = React.useState(false)
   const [showProfile, setShowProfile] = React.useState(false)
   const [newPw, setNewPw] = React.useState('')
   const [newPwToast, setNewPwToast] = React.useState(false)
   const [searchResult, setSearchResult] = React.useState([])
   const [users, setUsers] = React.useState([])
   const [selectedUser, setSelectedUser] = React.useState()
   const [showUser, setShowUser] = React.useState(false)
   const [pwToast, setPwToast] = React.useState(false)

   let userJSON = localStorage.getItem('userJSON')
   userJSON = JSON.parse(userJSON)
   // setLoading(false)


   const getAllUsers = async() => {
      let reqConfig = {
         headers: {
            Authorization: `userid ${userJSON._id}`,
         }
      }
      // console.log('wtf', reqConfig.headers.Authorization)

      const {data} = await axios.get(`/api/users?search=@`, reqConfig)
      if(!data) {
         throw Error('something went wrong')
      }
      // console.log('search', data)
      setUsers(data)
   }
   
   const walao = async(user) => {
      setSelectedUser(user)
      setShowUser(true)
   }

   React.useEffect(() => {
      let temp = JSON.parse(localStorage.getItem('userJSON'))
      setLoggedinUser(temp)
      getAllUsers()
   }, [])

   const searchUsers = async() => {
      if(!searchContent) {
         setNoSearch(true)
         return
      }
      let reqConfig = {
         headers: {
            Authorization: `userid ${userJSON._id}`,
         }
      }
      // console.log('wtf', reqConfig.headers.Authorization)

      const {data} = await axios.get(`/api/users?search=${searchContent}`, reqConfig)
      if(!data) {
         throw Error('something went wrong')
      }
      // console.log('search', data)
      setSearchResult(data)
   }

   const logout = async() => {
      // console.log('logout')
      localStorage.removeItem('userJSON')
      history.push('/')
   }
   
   const updatePw = async() => {
      const postConfig = {
         headers: {"Content-type" : "application/json"}
      }

      let id = selectedUser._id
      let newPassword = newPw

      if(!newPassword) {
         setNewPwToast(true)
         return
      }

      await axios.post('/api/users/changePassword', {id, newPassword}, postConfig)
      setPwToast(true)
      setNewPw('')
   }
   

  return (
   <Box height='97vh' width='50vw'>
   <Box 
    background="#98ACF8" 
    width='50vw' 
    responsive={true} 
    height='8vh'
    border={{color:'#BEDCFA', size: 'medium'}}
   >
     <Box pad='small' direction='row' alignContent='stretch'>
        <Box direction='row' 
         style = {{
            position:'absolute',
            zIndex: '1'
         }}>
         <Accordion>
            <AccordionPanel label={<Avatar src={userJSON.avatar}/>}>
               <Box pad="medium" background="light-1">
                  <Button 
                     plain={true} 
                     label='Log out'
                     onClick={logout}
                     />
               </Box>
               <Box pad="medium" background="light-1">
                  <Button 
                  plain={true} 
                  label='View profile'
                  onClick={()=> setShowProfile(true)}
                  />
               </Box>
               <Box pad="medium" background="light-1">
                  <Button 
                  plain={true} 
                  label='Discuss'
                  onClick={()=> history.push('/discuss')}
                  />
               </Box>
            </AccordionPanel>
         </Accordion>
         
        </Box>

        <Box direction='row' margin={{left: 'auto', right: '0'}}>
         <Box
            align='center'
            width='5vw'
            direction='row'>
               <Tip
                  dropProps={{ align: { left: 'right' } }}
                  content={<TipContent message='Search users'/>}
                  plain
               >
            <Button 
               icon={<Search/>} 
               reverse={true} 
               hoverIndicator
               onClick={() => setSearchLabel(true)}
               />
               </Tip>
         </Box>
      </Box>
      </Box>
      
   </Box>     
            
   <Box 
      style = {{
         position:'absolute',
         zIndex: '0'
      }}
      background='#BEDCFA'
      width='50vw'
      margin={{top:'8vh'}}
      height='87vh'
      overflow='overlay'>
         <InfiniteScroll items={users}>         
         {((item)=>
            <Box 
               pad='small'
               flex={false}
               border={{
                  color:'grey',
                  size:'small',
                  side:'bottom'
               }}
               margin='xsmall'
               key={item._id}
               direction='row'
               align='center'
               onClick={()=>walao(item)}
            >
               <Avatar size='medium' src={item.avatar}> </Avatar>
               <Text color='Black' size='large' margin='small'>
                  {item.displayName}
               </Text>
            </Box>
         )}
         </InfiniteScroll>
      </Box>

      { showProfile && <Layer
         onEsc={()=> {setShowProfile(false); setNewPw('')}}
         onClickOutside={()=> {setShowProfile(false); setNewPw('')}}
      >
         <Box
            direction='column'
            width='30vw'
            height='50vh'
            align='center'
            pad='medium'
         >
         <Text size='3xl' margin='small'>{userJSON.displayName}</Text>
         <Avatar size='3xl' src={userJSON.avatar}/>
         <Text size='xlarge' margin='large'>Email: {userJSON.email}</Text>
         <Box direction='row'>  
            <TextInput
               placeholder="New password"
               type='password'
               value={newPw}
               onChange={event => setNewPw(event.target.value)}
            />
               <Button
                  active
                  color='black'
                  onClick={updatePw}
                  icon={<Edit/>}
                  >
               </Button>
         </Box>
         </Box>
      </Layer>
      }

      { showUser && <Layer
         onEsc={()=> {setShowUser(false); setNewPw('')}}
         onClickOutside={()=> {setShowUser(false); setNewPw('')}}
      >
         <Box
            direction='column'
            width='40vw'
            height='50vh'
            align='center'
            pad='medium'
         >
         <Text size='3xl' margin='small'>{selectedUser.displayName}</Text>
         <Avatar size='3xl' src={selectedUser.avatar}/>
         <Text size='xlarge' margin='large'>Email: {selectedUser.email}</Text>
         <Box direction='row'>  
            <TextInput
               placeholder="New password"
               type='password'
               value={newPw}
               onChange={event => setNewPw(event.target.value)}
            />
               <Button
                  active
                  color='black'
                  onClick={updatePw}
                  icon={<Edit/>}
                  >
               </Button>
         </Box>
         </Box>
      </Layer>
      }

      {searchLabel && (
         <Layer
            onEsc={()=> setSearchLabel(false)}
            onClickOutside={()=> setSearchLabel(false)}
            >
               <Box height='80vh' width='40vw' direction='column' align='center' pad='medium'>
                  <Text size='large'>Search users</Text>
                  <Box direction='row' width='30vw' margin='small'>    
                     <TextInput
                        placeholder='Search users'
                        value={searchContent}
                        onChange={(e)=> setSearchContent(e.target.value)}
                     />
                     <Button 
                        icon={<Search/>} 
                        reverse={true} 
                        hoverIndicator
                        onClick={searchUsers}
                     />

                  </Box>
               <Box 
                  style = {{
                     position:'absolute',
                     zIndex: '0'
                  }}
                  height='60vh' 
                  margin={{top:'10vh'}}
                  overflow='overlay'>  
                     <InfiniteScroll items={searchResult}>
                        {((user) =>
                           <Box 
                           direction='row'
                           border={{color: '#b19cd9', size:'small'}} 
                           height='7vh'
                           flex={false}
                           pad='small'
                           round='small'
                           width='30vw'
                           key={user._id}
                           margin='xsmall'
                           align='center'
                           onClick={() => walao(user)}
                           background='#ffffed'
                           hoverIndicator={{color:'#f0f0f0'}}
                           >
                           <Avatar src={user.avatar}/>
                           <Box direction='column' margin='small'>
                              <Text weight='bold'>{user.displayName}</Text>
                              <Text size='small'>Email: {user.email}</Text>
                           </Box>
                        </Box>
                        )}
                     </InfiniteScroll>
                  </Box>
               </Box>
         </Layer>
      )}
      {newPwToast && (
        <Notification
          toast
          status='warning'
          title="Please provide a password"
          onClose={() => setNewPwToast(false)}
        />
      )}

      {noSearch && (
        <Notification
          toast
          status='warning'
          title="Please provide something to search"
          onClose={() => setNoSearch(false)}
        />
      )}
      
      {pwToast && (
        <Notification
          toast
          status='normal'
          title="Password has been changed"
          onClose={() => setPwToast(false)}
        />
      )}
   </Box>
  )
}

export default AdminPage