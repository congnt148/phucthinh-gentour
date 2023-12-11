import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Checkbox, TextField } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import fileSaver from 'file-saver'
import htmlDocx from 'html-docx-js/dist/html-docx'
import React, { useState, useMemo } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { EndHTML, FristHTML, HeaderHTML, StartTimeLineHTML, EndTimeLineHTML } from '../providers/html'
import { TOURIST_ATTRACTION } from '../providers/touristAttraction'

const defaultValues = {
  title: '',
  timeline: [
    {
      time: '',
      address: '',
      addressContent: ''
    }
  ]
}

const schema = yup.object({
  title: yup.string().required('Vui lòng nhập tiêu đề ngày 1'),
  timeline: yup
    .array(
      yup.object({
        time: yup.string(),
        address: yup.string(),
        addressContent: yup.string().required('Vui lòng nhập nội dung!')
      })
    )
    .min(1, 'Vui lòng tạo ít nhất một lộ trình')
})

const CreateTourForm = () => {
  const [meal, setMeal] = useState({
    breakfast: false,
    lunch: false,
    dinner: false
  })

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema)
  })
  const { fields, append, replace } = useFieldArray({
    control,
    name: 'timeline'
  })

  const onSubmit = data => {
    let doc = FristHTML + HeaderHTML('NGÀY 01:', getMealText(), data.title)
    doc += StartTimeLineHTML() + handleGetTimeLine(data.timeline) + EndTimeLineHTML() + EndHTML
    debugger
    var converted = htmlDocx.asBlob(doc, {
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

  const handleGetTimeLine = timeline => {
    let html = `<table style="border-collapse: collapse; border: none; width: 100%; margin-top: 30pt">
      <tbody>`

    for (let i = 0; i < timeline.length; i++) {
      if (i === 0 && timeline[i]?.time === '') {
        html += `<tr>
          <td style="width: 43pt; vertical-align: text-top">
          </td>
          <td >
            <p
              style="
                line-height: 150%;
                font-size: 16px;
                text-align: justify;
                color: #404040;
                margin-top: 0pt;
                margin-bottom: 0pt;
              "
            >
              ${timeline[i].addressContent}
            </p>
          </td>
        </tr>`
        continue
      } else if ((timeline[i]?.time ?? '') !== '') {
        html += `<tr>
          <td style="width: 43pt; vertical-align: text-top">
            <p
              style="
                line-height: 150%;
                font-size: 16px;
                color: #404040;
                margin-top: 0pt;
                margin-bottom: 0pt;
                font-weight: bold;
              "
            >
              ${timeline[i].time}
            </p>
          </td>
          <td>
            <p
              style="
                line-height: 150%;
                font-size: 16px;
                text-align: justify;
                color: #404040;
                margin-top: 0pt;
                margin-bottom: 0pt;
              "
            >
              ${timeline[i].addressContent}
            </p>
          </td>
        </tr>`
        continue
      } else {
        if ((timeline[i - 1]?.time ?? '') !== '') {
          html += `
          <tr >
          
          <td colspan="2" style="padding-left: 9pt">
            <ul
              style=" list-style-type: square;
              margin-block-end: 0px;
              margin-block-start: 0pt;"
            >
            <li  
            style="
                  margin-top: 3pt;
                  margin-bottom: 3pt;
                  text-align: justify;
                  line-height: 150%;
                  padding-left: 10pt;
                  -aw-number-format: ;
                ">
                <p
                  style="
                    line-height: 150%;
                    font-size: 16px;
                    text-align: justify;
                    color: #404040;
                    margin-top: 0pt;
                    margin-bottom: 0pt;
                  "
                >
                  ${timeline[i].addressContent}
                </p>
              </li>`
          continue
        }
        if ((timeline[i - 1]?.time ?? '') === '' && (timeline[i + 1]?.time ?? '') === '') {
          html += `<li  
          style="
                   margin-top: 3pt;
                  margin-left: 10.84pt;
                  margin-bottom: 3pt;
                  text-align: justify;
                  line-height: 150%;
                  padding-left: 3.71pt;
                  -aw-number-format: ;
                ">
                <p
                  style="
                    line-height: 150%;
                    font-size: 16px;
                    text-align: justify;
                    color: #404040;
                    margin-top: 0pt;
                    margin-bottom: 0pt;
                  "
                >
                  ${timeline[i].addressContent}
                </p>
                </li>
             `
          continue
        }

        if ((timeline[i]?.time ?? '') === '' && ((timeline[i + 1]?.time ?? '') !== '' || i === timeline.length - 1)) {
          html += ` <li  style="
                  margin-top: 3pt;
                  margin-left: 10.84pt;
                  margin-bottom: 3pt;
                  text-align: justify;
                  line-height: 150%;
                  padding-left: 3.71pt;
                  font-family: serif;
                  font-size: 12pt;
                  -aw-font-family: Roboto;
                  -aw-font-weight: normal;
                  -aw-number-format: ;
                ">
                <p
                  style="
                    line-height: 150%;
                    font-size: 16px;
                    text-align: justify;
                    color: #404040;
                    margin-top: 0pt;
                    margin-bottom: 0pt;
                  "
                >
                    ${timeline[i].addressContent}
                </p>
              </li>
              </ul>
          </td>
        </tr>`
          continue
        }
      }
    }
    html += `</tbody>
    </table>`

    debugger

    return html
  }

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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Paper variant='outlined' sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }, backgroundColor: 'white' }}>
        <Box sx={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between' }}>
          <Typography component='h1' variant='h6' align='left' color={'#0a5da8'}>
            Nhập tên chương trình
          </Typography>
          <Button
            variant='contained'
            type='submit'
            sx={{ color: 'white', textTransform: 'capitalize', backgroundColor: '#ff6600' }}
          >
            Xuất chương trình
          </Button>
        </Box>

        <Box mt={2}>
          <Controller
            fullWidth
            errors={errors}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                inputProps={{
                  style: { paddingTop: 10, paddingBottom: 10, fontWeight: 'bold', color: '#0a5da8' }
                }}
                fullWidth
                error={!!error}
                InputProps={{
                  startAdornment: (
                    <Typography align='left' color={'#0a5da8'} sx={{ width: 80, fontSize: 17, fontWeight: 'bold' }}>
                      NGÀY 1:
                    </Typography>
                  )
                }}
                helperText={error ? error.message : null}
                placeholder='NHẬP TIÊU ĐỀ'
              />
            )}
            name={'title'}
            control={control}
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

        {fields.map((item, index) => (
          <Box key={item.id} sx={{ flexDirection: 'row', display: 'flex', marginTop: 4 }}>
            <Box sx={{ flexDirection: 'column', display: 'flex', width: 300 }}>
              <Controller
                render={({ field }) => (
                  <TextField
                    {...field}
                    inputProps={{
                      style: { paddingTop: 10, paddingBottom: 10 }
                    }}
                    placeholder='Thời gian'
                  />
                )}
                name={`timeline.${index}.time`}
                control={control}
              />
              <Box mt={1}>
                <Controller
                  render={({ field: { onChange, value } }) => (
                    <Select
                      fullWidth
                      value={value}
                      sx={{
                        '.MuiInputBase-input': {
                          paddingTop: '10px',
                          paddingBottom: '10px'
                        }
                      }}
                      onChange={event => {
                        let item = TOURIST_ATTRACTION.find(i => i.id === event.target.value)
                        onChange(event.target.value)
                        if (item) {
                          let newTimeline = getValues('timeline')
                          newTimeline[index].addressContent = item?.content ?? ''
                          // setValue('timeline', newTimeline)
                          replace(newTimeline)
                        } else {
                          let newTimeline = getValues('timeline')
                          newTimeline[index].addressContent = ''
                          replace(newTimeline)
                          // setValue('timeline', newTimeline)
                        }
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
                  )}
                  name={`timeline.${index}.address`}
                  control={control}
                />
              </Box>
            </Box>
            <Box ml={1} sx={{ width: '100%' }}>
              <Controller
                control={control}
                name={`timeline.${index}.addressContent`}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <TextField
                      {...field}
                      multiline
                      sx={{
                        padding: 0,
                        '.MuiOutlinedInput-root': {
                          paddingTop: 0,
                          paddingBottom: 1
                        }
                      }}
                      rows={3}
                      fullWidth
                      error={!!error}
                      helperText={error ? error.message : null}
                      placeholder='Phần nhập nội dung'
                      inputProps={{
                        style: { paddingTop: 10, paddingBottom: 10 }
                      }}
                    />
                  )
                }}
              />
            </Box>
          </Box>
        ))}

        <Box sx={{ flexDirection: 'row', display: 'flex', marginTop: 2, justifyContent: 'center' }}>
          <Button
            variant='contained'
            onClick={() => {
              append({
                time: '',
                address: '',
                addressContent: ''
              })
            }}
            sx={{ color: 'white', textTransform: 'capitalize', backgroundColor: '#ff6600' }}
          >
            Thêm
          </Button>
        </Box>
      </Paper>
    </form>
  )
}

export default CreateTourForm
