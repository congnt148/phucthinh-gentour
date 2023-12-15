import { Box, Button, TextField } from '@mui/material'

import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { Controller, useFieldArray } from 'react-hook-form'
import { TOURIST_ATTRACTION } from '../providers/touristAttraction'

const AddTimeLineField = ({ dayIndex, control, getValues, setValue }) => {
  const { fields, append, replace } = useFieldArray({
    control,
    name: `days.${dayIndex}.timeline`
  })

  return (
    <Box>
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
              name={`days.${dayIndex}.timeline.${index}.time`}
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
                      let days = getValues(`days.${dayIndex}.timeline`)
                      debugger
                      let item = TOURIST_ATTRACTION.find(i => i.id === event.target.value)
                      onChange(event.target.value)
                      if (item) {
                        days[index].addressContent = item?.content ?? ''
                      } else {
                        days[index].addressContent = item?.content ?? ''
                      }
                      replace(days)
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
                name={`days.${dayIndex}.timeline.${index}.address`}
                control={control}
              />
            </Box>
          </Box>
          <Box ml={1} sx={{ width: '100%' }}>
            <Controller
              control={control}
              name={`days.${dayIndex}.timeline.${index}.addressContent`}
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
    </Box>
  )
}

export default AddTimeLineField
