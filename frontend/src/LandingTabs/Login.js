/*
No specific references were used to complete this file.
This file handles the log in interface of the landing pages. It is shown when "Log in" is clicked.
If an admin logs in, a new window will pop up with the admin interface for mongoDB, where they may edit anything to their liking. 
The login details to the database will be sent via the admin's email.
*/

import React from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import {TextInput, Text, Box, Button, Notification} from 'grommet'

const Login = () => {
  const history = useHistory()
  const [email, setEmail] = React.useState('')
  const [pw, setPw] = React.useState('')
  // const [reveal, setReveal] = React.useState(false)
  const [toast, setToast] = React.useState(false)
  const [wrong, setWrong] = React.useState(false)

    // React.useEffect(() => {
    //   return () => {}
    // }, [])


  const handleLogin = async () => {
    if(!email || !pw) {
      setToast(true)
      return
    }

    const postConfig = {
      headers: {"Content-type" : "application/json"}
    }


    let pepelaf
    await axios
    .post('/api/users/login', {email, pw}, postConfig)
    .then(res => {
      // console.log('pog logged in', res) //debug
      // console.log('cmon man', res.data)
      pepelaf=res.data
      if(!pepelaf) {
        setWrong(true)
        return
      }
    })
    .catch(error => {
      // console.log('error on login', error)
      setWrong(true)
      return
    })
    if(pepelaf===undefined || pepelaf==='undefined') {
      setWrong(true)
      return
    }
    localStorage.setItem('userJSON', JSON.stringify(pepelaf))
    if (pepelaf.is_admin) {
      history.push('/admin')
      axios.post('/api/users/adminEmail', {}, postConfig)
      window.open("https://cloud.mongodb.com/v2/621fb313afbcfd38fccb8e15#metrics/replicaSet/623ff7e41d7bde1b70109259/explorer", '_blank')
      return
    }
    // console.log('pepelaf', pepelaf)
    history.push('/discuss')
    // localStorage.setItem('userJSON', JSON.stringify(loginJSON))
  }

  return (
      <Box width='25em'>
      {toast && (
        <Notification
          toast
          status='warning'
          title="You have not entered all the required fields"
          onClose={() => setToast(false)}
        />
      )}

      {wrong && (
        <Notification
          toast
          status='warning'
          title="You have entered an incorrect email or password"
          onClose={() => setWrong(false)}
        />
      )}
      <Text margin={{top: '1em', bottom: '0.5em'}}>Email  <Text color='red'>*</Text></Text>
      <TextInput
        placeholder={<Text color='grey'>Enter email</Text>}
        value={email}
        size='medium'
        background={'green'}
        onChange={event => setEmail(event.target.value)}
        />

      <Text margin={{top: '1em', bottom: '0.5em'}}>Password  <Text color='red'>*</Text></Text>
      <Box direction = 'row'>
      <TextInput
        placeholder={<Text color='grey'>Enter password</Text>}
        value={pw}
        type='password'
        size='medium'
        onChange={event => setPw(event.target.value)}
        />
      </Box>
      <Box align='center' pad='small'>

      <Text align='center' color= 'red' size = '0.8em'>
        * are required fields
      </Text>
      <Button
        primary
        style={{marginTop: 20}}
        fill='horizontal'
        label='Log me in!'
        onClick={handleLogin}
        >
       </Button>
      </Box>
      </Box>
  )
}

export default Login