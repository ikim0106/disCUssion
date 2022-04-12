import React from 'react'
import {Box } from 'grommet'
import AdminPage from '../components/AdminPage'
import {useHistory} from 'react-router-dom'
// import { Chat } from '../state/State'
// import axios from 'axios'

const Admin = () => {
   const history = useHistory()
   let userJSON = localStorage.getItem('userJSON')
   if(userJSON===null || userJSON==='null'){
      history.push('/')
      return null
   }
   userJSON = JSON.parse(userJSON)
   // console.log('jibai knn', userJSON)
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