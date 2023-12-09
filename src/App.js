import { Checkbox, TextField, Button, Box } from '@mui/material'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import fileSaver from 'file-saver'
import htmlDocx from 'html-docx-js/dist/html-docx'
import React, { useState } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import { TOURIST_ATTRACTION } from './providers/touristAttraction'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { EndHTML, FristHTML, HeaderHTML, TimeLineHTML } from './providers/html'

function App() {
  const [meal, setMeal] = useState({
    breakfast: false,
    lunch: false,
    dinner: false
  })
  const [titleDay, setTitleDay] = useState('NGÀY 1:')

  const [tourA, setTourA] = useState({
    time: '',
    address: '',
    addressContent: ''
  })
  const [tourB, setTourB] = useState({
    time: '',
    address: '',
    addressContent: ''
  })

  const getMealText = () => {
    const { breakfast, lunch, dinner } = meal

    if (breakfast && lunch && dinner) {
      return 'Bửa sáng, bửa trưa và bửa tối'
    } else if (!breakfast && lunch && dinner) {
      return 'Bửa trưa và bửa tối'
    } else if (breakfast && !lunch && dinner) {
      return 'Bửa sáng và bửa tối'
    } else if (breakfast && lunch && !dinner) {
      return 'Bửa sáng và bửa trưa'
    } else if (!breakfast && !lunch && dinner) {
      return 'Bửa tối'
    } else if (breakfast && !lunch && !dinner) {
      return 'Bửa sáng'
    } else if (!breakfast && lunch && !dinner) {
      return 'Bửa trưa'
    } else {
      return 'Không'
    }
  }

  function exportDoc() {
    let doc =
      FristHTML +
      HeaderHTML('NGÀY 01:', getMealText(), titleDay) +
      TimeLineHTML(tourA.time, tourB.time, tourA.addressContent, tourB.addressContent)

    var converted = htmlDocx.asBlob(doc + EndHTML, {
      margins: {
        header: 0,
        top: 850.39,
        left: 850.39,
        right: 567,
        buttom: 567,
        gutter: 0,
        footer: 0
      }
    })
    fileSaver.saveAs(converted, 'CHUONG-TRINH-TOUR.docx')
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container component='main' maxWidth='md' sx={{ mb: 4 }}>
        <Paper variant='outlined' sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }, backgroundColor: 'white' }}>
          <Typography component='h1' variant='h6' align='left' color={'#0a5da8'}>
            Nhập tên chương trình
          </Typography>
          <Box mt={2}>
            <TextField
              fullWidth
              value={titleDay}
              inputProps={{
                style: { paddingTop: 10, paddingBottom: 10, fontWeight: 'bold', color: '#0a5da8' }
              }}
              onChange={value => setTitleDay(value.target.value)}
            />
          </Box>
          <Box
            sx={{
              flexDirection: 'row',
              marginTop: 1,
              marginLeft: 1,
              display: 'flex',
              alignContent: 'center',
              alignItems: 'center'
            }}
          >
            <Typography color={'#0a5da8'} fontWeight='600'>
              Bửa ăn:
            </Typography>
            <FormControlLabel
              sx={{ marginLeft: 1 }}
              control={
                <Checkbox
                  checked={meal.breakfast}
                  onChange={() => {
                    let newMeal = { ...meal, breakfast: !meal.breakfast }
                    setMeal(newMeal)
                  }}
                  name='Bửa sáng'
                />
              }
              label='Bửa sáng'
            />
            <FormControlLabel
              sx={{ marginLeft: 1 }}
              control={
                <Checkbox
                  checked={meal.lunch}
                  onChange={() => {
                    let newMeal = { ...meal, lunch: !meal.lunch }
                    setMeal(newMeal)
                  }}
                  name='Bửa trưa'
                />
              }
              label='Bửa trưa'
            />
            <FormControlLabel
              sx={{ marginLeft: 1 }}
              control={
                <Checkbox
                  checked={meal.dinner}
                  onChange={() => {
                    let newMeal = { ...meal, dinner: !meal.dinner }
                    setMeal(newMeal)
                  }}
                  name='Bửa tối'
                />
              }
              label='Bửa tối'
            />
          </Box>
          <Box sx={{ flexDirection: 'row', display: 'flex', marginTop: 2 }}>
            <Box sx={{ flexDirection: 'column', display: 'flex', width: 300 }}>
              <Box>
                <TextField
                  fullWidth
                  value={tourA.time}
                  inputProps={{
                    style: { paddingTop: 10, paddingBottom: 10 }
                  }}
                  placeholder='Thời gian'
                  onChange={value => {
                    let tourNew = { ...tourA }
                    tourNew.time = value.target.value
                    setTourA(tourNew)
                  }}
                />
              </Box>
              <Box mt={1}>
                <Select
                  fullWidth
                  value={tourA.address}
                  sx={{
                    '.MuiInputBase-input': {
                      paddingTop: '10px',
                      paddingBottom: '10px'
                    }
                  }}
                  onChange={(event, data) => {
                    let tourNew = { ...tourA }

                    let item = TOURIST_ATTRACTION.find(i => i.id == event.target.value)
                    if (item) {
                      tourNew.address = item.id
                      tourNew.addressContent = item?.content ?? ''
                    } else {
                      tourNew.address = ''
                      tourNew.addressContent = ''
                    }

                    setTourA(tourNew)
                  }}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value=''>
                    <em>Trống</em>
                  </MenuItem>
                  {TOURIST_ATTRACTION.map(item => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.title}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
            <Box ml={1} sx={{ width: '100%' }}>
              <TextField
                multiline
                sx={{
                  padding: 0,
                  '.MuiOutlinedInput-root': {
                    paddingTop: 0,
                    paddingBottom: 1
                  }
                }}
                rows={3}
                value={tourA.addressContent}
                fullWidth
                placeholder='Phần nhập nội dung'
                inputProps={{
                  style: { paddingTop: 10, paddingBottom: 10 }
                }}
                onChange={value => {
                  let tourNew = { ...tourA }
                  tourNew.addressContent = value.target.value
                  setTourA(tourNew)
                }}
              />
            </Box>
          </Box>

          <Box sx={{ flexDirection: 'row', display: 'flex', marginTop: 2 }}>
            <Box sx={{ flexDirection: 'column', display: 'flex', width: 300 }}>
              <Box>
                <TextField
                  fullWidth
                  value={tourB.time}
                  inputProps={{
                    style: { paddingTop: 10, paddingBottom: 10 }
                  }}
                  placeholder='Thời gian'
                  onChange={value => {
                    let tourNew = { ...tourB }
                    tourNew.time = value.target.value
                    setTourB(tourNew)
                  }}
                />
              </Box>
              <Box mt={1}>
                <Select
                  fullWidth
                  value={tourB.address}
                  sx={{
                    '.MuiInputBase-input': {
                      paddingTop: '10px',
                      paddingBottom: '10px'
                    }
                  }}
                  onChange={(event, data) => {
                    let tourNew = { ...tourB }

                    let item = TOURIST_ATTRACTION.find(i => i.id == event.target.value)
                    if (item) {
                      tourNew.address = item.id
                      tourNew.addressContent = item?.content ?? ''
                    } else {
                      tourNew.address = ''
                      tourNew.addressContent = ''
                    }

                    setTourB(tourNew)
                  }}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value=''>
                    <em>Trống</em>
                  </MenuItem>
                  {TOURIST_ATTRACTION.map(item => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.title}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
            <Box ml={1} sx={{ width: '100%' }}>
              <TextField
                multiline
                sx={{
                  padding: 0,
                  '.MuiOutlinedInput-root': {
                    paddingTop: 0,
                    paddingBottom: 1
                  }
                }}
                rows={3}
                value={tourB.addressContent}
                fullWidth
                placeholder='Phần nhập nội dung'
                inputProps={{
                  style: { paddingTop: 10, paddingBottom: 10 }
                }}
                onChange={value => {
                  let tourNew = { ...tourB }
                  tourNew.addressContent = value.target.value
                  setTourB(tourNew)
                }}
              />
            </Box>
          </Box>
          <Box sx={{ flexDirection: 'row', display: 'flex', marginTop: 2, justifyContent: 'center' }}>
            <Button variant='contained' onClick={exportDoc}>
              Xuất WORD
            </Button>
          </Box>
        </Paper>
      </Container>
    </React.Fragment>
  )
}

export default App
