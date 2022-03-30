import React from 'react'
import {TextInput, Text, Box, Button, Notification} from 'grommet'

const Login = () => {
  const [email, setEmail] = React.useState('')
  const [pw, setPw] = React.useState('')
  // const [reveal, setReveal] = React.useState(false)
  const [toast, setToast] = React.useState(false)

  const handleLogin = () => {
    if(!email || !pw) {
      setToast(true)
    }
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