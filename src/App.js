import { Container, Box } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import React from 'react'
import CreateTourForm from './features/create-tour-form'

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Box sx={{ backgroundColor: '#FFF2E5' }}>
        <Container component='main' maxWidth='md' sx={{ mb: 4, backgroundColor: '#FFF2E5' }}>
          <CreateTourForm />
        </Container>
      </Box>
    </React.Fragment>
  )
}

export default App
