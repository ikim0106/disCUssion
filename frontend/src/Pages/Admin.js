import React from 'react'
import {Box } from 'grommet'
import AdminPage from '../components/AdminPage'
import {useHistory} from 'react-router-dom'
// import { Chat } from '../state/State'
// import axios from 'axios'

const Admin = () => {
   const history = useHistory()
   let userJSON = localStorage.getItem('userJSON')
   userJSON = JSON.parse(userJSON)
   console.log('userJSON', userJSON.is_admin)
   // return
   if(userJSON===null || userJSON==='null' || userJSON.is_admin!==true){
      history.push('/discuss')
      return null
   }
   return (
   <div style={{width: '100%'}}>
      <Box
         align='center'
         margin={{top:'small'}}>
      </Box>
      <Box
         flex
         direction='row'
         justify='evenly'
         width='100%'
         height='90vh'
         >
         <AdminPage/>
      </Box>
   </div>
   )
}

export default Admin