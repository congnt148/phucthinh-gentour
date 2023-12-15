import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Checkbox, TextField } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import fileSaver from 'file-saver'
import htmlDocx from 'html-docx-js/dist/html-docx'
import React, { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { EndHTML, EndTimeLineHTML, FristHTML, HeaderHTML, StartTimeLineHTML } from '../providers/html'
import { TIME } from '../providers/touristAttraction'
import AddTimeLineField from './add-timeline-field'

const defaultValues = {
  tourName: '',
  timeDay: 3,
  transport: '',
  stay: '',
  location: [],
  days: []
}

const schema = yup.object({
  tourName: yup.string().required('Vui lòng nhập tên chương trình'),
  timeDay: yup.number().required('Vui lòng chọn thời gian'),
  transport: yup.string().required('Vui lòng nhập phương tiện'),
  stay: yup.string().required('Vui lòng nhập lưu trú'),
  // location: yup.array(yup.string()).min(1, 'Vui lòng chọn ít nhất một điểm đến'),
  location: yup.array(yup.string()),
  days: yup.array(
    yup.object({
      dayTitle: yup.string().required('Vui lòng nhập tiêu đề'),
      meal: yup.object({
        breakfast: yup.boolean(),
        lunch: yup.boolean(),
        dinner: yup.boolean()
      }),
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
  )
})

const CreateTourForm = () => {
  schema
    .validate(defaultValues)
    .then(() => console.log('Validation successful'))
    .catch(err => console.error('Validation failed:', err))

  const { control, handleSubmit, getValues, watch, setValue, formState } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema)
  })

  const { errors } = formState
  const {
    fields,
    append: appendDays,
    replace: replaceDays,
    remove
  } = useFieldArray({
    control,
    name: 'days'
  })

  useEffect(() => {
    const countDay = watch('timeDay')

    remove()
    for (let i = 0; i < countDay; i++) {
      appendDays({
        dayTitle: '',
        meal: {
          breakfast: false,
          lunch: false,
          dinner: false
        },
        timeline: [
          {
            time: '',
            address: '',
            addressContent: ''
          }
        ]
      })
    }
  }, [watch('timeDay'), replaceDays])

  const onSubmit = data => {
    let doc = FristHTML + handleGetDays(data.days) + EndHTML

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

  const handleGetDays = days => {
    let htmlDays = ``
    for (let i = 0; i < days.length; i++) {
      let day = days[i]
      htmlDays += HeaderHTML(
        `NGÀY 0${i + 1}:`,
        getMealText(day.meal.breakfast, day.meal.lunch, day.meal.dinner),
        day.dayTitle
      )
      htmlDays += handleGetTimeLine(day.timeline)
    }

    return htmlDays
  }

  const handleGetTimeLine = timeline => {
    let html =
      StartTimeLineHTML() +
      `<table style="border-collapse: collapse; border: none; width: 100%; margin-top: 30pt">
      <tbody>`

    for (let i = 0; i < timeline.length; i++) {
      if (i === 0 && timeline[i]?.time === '') {
        html += `<tr>
          <td style="width: 43pt; vertical-align: text-top"></td>
          <td ><p style="
                line-height: 150%;
                font-size: 16px;
                text-align: justify;
                color: #404040;
                margin-top: 0pt;
                margin-bottom: 0pt;
              "
            >
              ${timeline[i].addressContent.trim()}
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
              ${timeline[i].time.trim()}
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
              ${timeline[i].addressContent.trim()}
            </p>
          </td>
        </tr>`
        continue
      } else {
        if ((timeline[i - 1]?.time ?? '') !== '') {
          html += `
          <tr >
          <td colspan="2" >
            <ul
              style=" list-style-type: square;
              margin-block-end: 0px;
              margin-block-start: 0pt;"
            >
            <li  
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
                  ${timeline[i].addressContent.trim()}
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
                  ${timeline[i].addressContent.trim()}
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
                    ${timeline[i].addressContent.trim()}
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

    html += EndTimeLineHTML()

    return html
  }

  const getMealText = (breakfast, lunch, dinner) => {
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
          <Button
            variant='contained'
            type='submit'
            sx={{ color: 'white', textTransform: 'capitalize', backgroundColor: '#ff6600' }}
          >
            Xuất chương trình
          </Button>
        </Box>

        <Box mt={2} fullWidth>
          <Controller
            fullWidth
            errors={errors}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                inputProps={{
                  style: { paddingTop: 10, paddingBottom: 10, fontWeight: 'bold', color: '#2D3B63' }
                }}
                fullWidth
                error={!!error}
                helperText={error ? error.message : null}
                placeholder='Nhập tên chương trình'
              />
            )}
            name={'tourName'}
            control={control}
          />
        </Box>
        <Box mt={2} sx={{ flexDirection: 'row', display: 'flex', width: '100%' }}>
          <Box sx={{ width: '100%' }}>
            <Typography color={'#2D3B63'} fontWeight='400'>
              Thời gian:
            </Typography>
            <Controller
              render={({ field: { value, onChange } }) => (
                <Select
                  variant='standard'
                  fullWidth
                  value={value}
                  onChange={event => {
                    onChange(event.target.value)
                  }}
                  sx={{
                    '.MuiInputBase-input': {
                      paddingTop: '10px',
                      paddingBottom: '10px'
                    }
                  }}
                >
                  {TIME.map(item => (
                    <MenuItem key={item.id} value={item.daytime}>
                      {item.title}
                    </MenuItem>
                  ))}
                </Select>
              )}
              name={`timeDay`}
              control={control}
            />
          </Box>
          <Box width={100} />
          <Box sx={{ width: '100%' }}>
            <Typography color={'#2D3B63'} fontWeight='400'>
              Phương tiện:
            </Typography>
            <Controller
              fullWidth
              errors={errors}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  variant='standard'
                  inputProps={{
                    style: { paddingTop: 10, paddingBottom: 10, fontWeight: 'bold', color: '#2D3B63' }
                  }}
                  fullWidth
                  error={!!error}
                  helperText={error ? error.message : null}
                  placeholder='Vd: Máy bay, ô tô'
                />
              )}
              name={'transport'}
              control={control}
            />
          </Box>
          <Box width={100} />
          <Box sx={{ width: '100%' }}>
            <Typography color={'#2D3B63'} fontWeight='400'>
              Lưu trú:
            </Typography>
            <Controller
              fullWidth
              errors={errors}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  variant='standard'
                  inputProps={{
                    style: { paddingTop: 10, paddingBottom: 10, fontWeight: 'bold', color: '#2D3B63' }
                  }}
                  fullWidth
                  error={!!error}
                  helperText={error ? error.message : null}
                  placeholder='Vd: Resort 3 sao'
                />
              )}
              name={'stay'}
              control={control}
            />
          </Box>
          <Box width={300} />
        </Box>
        <Box mt={2}>
          <Typography color={'#2D3B63'} fontWeight='400'>
            Điểm đến:
          </Typography>
        </Box>

        {fields.map((item, index) => {
          return (
            <Box key={index}>
              <Box mt={2}>
                <Controller
                  fullWidth
                  errors={errors}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      inputProps={{
                        style: { paddingTop: 10, paddingBottom: 10, fontWeight: 'bold', color: '#2D3B63' }
                      }}
                      fullWidth
                      error={!!error}
                      InputProps={{
                        startAdornment: (
                          <Typography
                            align='left'
                            color={'#2D3B63'}
                            sx={{ width: 80, fontSize: 17, fontWeight: 'bold' }}
                          >
                            {`NGÀY ${index + 1}:`}
                          </Typography>
                        )
                      }}
                      helperText={error ? error.message : null}
                      placeholder='NHẬP TIÊU ĐỀ'
                    />
                  )}
                  name={`days.${index}..dayTitle`}
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
                <Typography color={'#2D3B63'} fontWeight='600'>
                  Bửa ăn:
                </Typography>
                <FormControlLabel
                  sx={{ marginLeft: 1 }}
                  control={
                    <Controller
                      render={({ field }) => <Checkbox {...field} />}
                      name={`days.${index}.meal.breakfast`}
                      control={control}
                      label='Bửa sáng'
                    />
                  }
                  label='Bửa sáng'
                />
                <FormControlLabel
                  sx={{ marginLeft: 1 }}
                  control={
                    <Controller
                      render={({ field }) => <Checkbox {...field} />}
                      name={`days.${index}.meal.lunch`}
                      control={control}
                    />
                  }
                  label='Bửa trưa'
                />
                <FormControlLabel
                  sx={{ marginLeft: 1 }}
                  control={
                    <Controller
                      render={({ field }) => <Checkbox {...field} />}
                      name={`days.${index}.meal.dinner`}
                      control={control}
                    />
                  }
                  label='Bửa tối'
                />
              </Box>
              <AddTimeLineField dayIndex={index} control={control} getValues={getValues} setValue={setValue} />
            </Box>
          )
        })}
      </Paper>
    </form>
  )
}

export default CreateTourForm
