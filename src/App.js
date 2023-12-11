import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import React from 'react'
import CreateTourForm from './features/create-tour-form'

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container component='main' maxWidth='md' sx={{ mb: 4 }}>
        <CreateTourForm />
      </Container>
    </React.Fragment>
  )
}

export default App
