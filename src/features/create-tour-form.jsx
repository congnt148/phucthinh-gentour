import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Checkbox, Grid, TextField } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import fileSaver from 'file-saver';
import htmlDocx from 'html-docx-js/dist/html-docx';
import React, { useEffect, useMemo } from 'react';
import { styled } from '@mui/system';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';
import {
  EndHTML,
  FristHTML,
  HeaderHTML,
} from '../providers/html';
import { TIME } from '../providers/touristAttraction';
import AddTimeLineField from './add-timeline-field';
import { convertToTable } from '../utils/helper-html';
import { generateDocx} from '../providers/convert_html_to_docx'

const HeaderText = styled(TextField)({
  '& .MuiInput-underline:before': {
    borderBottom: 'none'
  },
  '& .MuiInput-underline:hover:before': {
    borderBottom: 'none'
  },
  '& .MuiInput-underline:after': {
    borderBottom: 'none'
  },
  '& .MuiInputBase-input': {
    color: 'green',
    fontSize: '22px'
  },
  '& .MuiInputLabel-root': {
    color: 'blue',
    fontSize: '22px'
  }
});
const HeaderMinimunText = styled(TextField)({
  '& .MuiInput-underline:before': {
    borderBottom: 'none'
  },
  '& .MuiInput-underline:hover:before': {
    borderBottom: 'none'
  },
  '& .MuiInput-underline:after': {
    borderBottom: 'none'
  },
  '& .MuiInputBase-input': {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ff6600'
  },
  '& .MuiInputLabel-root': {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ff6600'
  }
});

const defaultValues = {
  tourName: '',
  timeDay: 1,
  transport: '',
  stay: '',
  location: [],
  days: []
};

const schema = yup.object({
  tourName: yup.string().required('Vui lòng nhập tên chương trình'),
  timeDay: yup.number().required('Vui lòng chọn thời gian'),
  transport: yup.string().required('Vui lòng nhập phương tiện'),
  stay: yup.string().required('Vui lòng nhập lưu trú'),
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
            address: yup.array(
              yup.object({
                id: yup.string(),
                title: yup.string(),
                content: yup.string()
              })
            ),
            addressContent: yup.string().required('Vui lòng nhập nội dung!')
          })
        )
        .min(1, 'Vui lòng tạo ít nhất một lộ trình')
    })
  )
});

const CreateTourForm = () => {
  schema
    .validate(defaultValues)
    .then(() => console.log('Validation successful'))
    .catch((err) => console.error('Validation failed:', err));

  const { control, handleSubmit, getValues, watch, setValue, formState } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema)
  });

  const { errors } = formState;
  const {
    fields,
    append: appendDays,
    replace: replaceDays,
    remove
  } = useFieldArray({
    control,
    name: 'days'
  });

  useEffect(() => {
    const countDay = watch('timeDay');

    remove();
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
            address: [],
            addressContent: ''
          }
        ]
      });
    }
  }, [watch('timeDay'), replaceDays]);

  const onSubmit = (data) => {
      let doc = FristHTML + handleGetDays(data.days) + EndHTML;
      var parser = new DOMParser();
      var docu = parser.parseFromString(doc, "text/html"); 
      var myDocx = generateDocx(docu);
      saveAs(myDocx, "CHUONG-TRINH-TOUR.docx");
      // var parser = new DOMParser();
      // var docu = parser.parseFromString(doc, "text/html"); 

      // convert all Images url to data base64
      // convertAllUrlImagesToBase64(docu);

      // var converted = htmlDocx.asBlob(doc, {
      //   margins: {
      //     header: 0,
      //     top: 850.39,
      //     left: 850.39,
      //     right: 567,
      //     buttom: 567,
      //     gutter: 0,
      //     footer: 0
      //   }
      // });

      // fileSaver.saveAs(converted, 'CHUONG-TRINH-TOUR.docx');
  };

  const handleGetDays = (days) => {
    let htmlDays = ``;
    for (let i = 0; i < days.length; i++) {
      let day = days[i];
      htmlDays += HeaderHTML(
        `NGÀY 0${i + 1}:`,
        getMealText(day.meal.breakfast, day.meal.lunch, day.meal.dinner),
        day.dayTitle
      );
      htmlDays += handleGetTimeLine(day.timeline);
    }

    return htmlDays;
  };

  const handleGetTimeLine = (timeline) => {
    let html = ``;
    for (let i = 0; i < timeline.length; i++) {
      let item = timeline[i];
      html += `<br />` + convertToTable(item.time, item.addressContent.replace(`\n`, ''));
    }
    return html;
  };

  const getMealText = (breakfast, lunch, dinner) => {
    if (breakfast && lunch && dinner) {
      return 'Bửa sáng, bửa trưa và bửa tối';
    } else if (!breakfast && lunch && dinner) {
      return 'Bửa trưa và bửa tối';
    } else if (breakfast && !lunch && dinner) {
      return 'Bửa sáng và bửa tối';
    } else if (breakfast && lunch && !dinner) {
      return 'Bửa sáng và bửa trưa';
    } else if (!breakfast && !lunch && dinner) {
      return 'Bửa tối';
    } else if (breakfast && !lunch && !dinner) {
      return 'Bửa sáng';
    } else if (!breakfast && lunch && !dinner) {
      return 'Bửa trưa';
    } else {
      return 'Không';
    }
  };

  const renderHeader = () => {
    return (
      <Paper
        variant="outlined"
        sx={{
          my: { xs: 3, md: 6 },
          p: { xs: 2, md: 3 },
          backgroundColor: 'white',
          borderColor: 'white',
          marginTop: '10px !important',
          marginBottom: '10px !important'
        }}>
        <Box mt={2}>
          <Controller
            errors={errors}
            render={({ field, fieldState: { error } }) => (
              <HeaderText
                {...field}
                variant="standard"
                inputProps={{
                  style: {
                    paddingTop: 10,
                    paddingBottom: 10,
                    color: '#2D3B63',
                    fontWeight: 700,
                    fontSize: 22
                  }
                }}
                fullWidth
                error={!!error}
                helperText={error ? error.message : null}
                placeholder="Nhập tên chương trình"
              />
            )}
            name={'tourName'}
            control={control}
          />
        </Box>
        <Grid container spacing={4} mt={0}>
          <Grid item>
            <Typography color={'#2D3B63'} fontWeight="400">
              Thời gian:
            </Typography>
            <Controller
              render={({ field: { value, onChange } }) => (
                <Select
                  variant="standard"
                  fullWidth
                  value={value}
                  onChange={(event) => {
                    onChange(event.target.value);
                  }}
                  sx={{
                    '.MuiInputBase-input': {
                      paddingTop: '10px',
                      paddingBottom: '10px'
                    }
                  }}>
                  {TIME.map((item) => (
                    <MenuItem key={item.id} value={item.daytime}>
                      {item.title}
                    </MenuItem>
                  ))}
                </Select>
              )}
              name={`timeDay`}
              control={control}
            />
          </Grid>
          <Grid item>
            <Typography color={'#2D3B63'} fontWeight="400">
              Phương tiện:
            </Typography>
            <Controller
              errors={errors}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  variant="standard"
                  inputProps={{
                    style: { paddingTop: 10, paddingBottom: 10, color: '#2D3B63' }
                  }}
                  fullWidth
                  error={!!error}
                  helperText={error ? error.message : null}
                  placeholder="Vd: Máy bay, ô tô"
                />
              )}
              name={'transport'}
              control={control}
            />
          </Grid>
          <Grid item>
            <Typography color={'#2D3B63'} fontWeight="400">
              Lưu trú:
            </Typography>
            <Controller
              errors={errors}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  variant="standard"
                  inputProps={{
                    style: { paddingTop: 10, paddingBottom: 10, color: '#2D3B63' }
                  }}
                  fullWidth
                  error={!!error}
                  helperText={error ? error.message : null}
                  placeholder="Vd: Resort 3 sao"
                />
              )}
              name={'stay'}
              control={control}
            />
          </Grid>
          <Grid item flex={1}>
            <Typography color={'#2D3B63'} fontWeight="400">
              Điểm đến:
            </Typography>
            <TextField
              variant="standard"
              inputProps={{
                style: { paddingTop: 10, paddingBottom: 10, fontWeight: '500', color: '#2D3B63' }
              }}
              fullWidth
              placeholder="Vd: Resort 3 sao"
            />
          </Grid>
        </Grid>
      </Paper>
    );
  };

  const renderCustome = () => {
    return (
      <Paper
        variant="outlined"
        sx={{
          my: { xs: 3, md: 6 },
          p: { xs: 2, md: 3 },
          backgroundColor: 'white',
          borderColor: 'white',
          marginTop: '18px !important',
          marginBottom: '10px !important'
        }}>
        <Grid container spacing={4}>
          <Grid item flex={1} paddingLeft={0}>
            <Typography color={'#2D3B63'} fontWeight="600">
              Khách hàng
            </Typography>
            <TextField
              variant="standard"
              inputProps={{
                style: { paddingTop: 10, paddingBottom: 10, fontWeight: '500', color: '#2D3B63' }
              }}
              fullWidth
              placeholder="Loại hình"
            />
          </Grid>
          <Grid
            item
            flex={1}
            sx={{ alignItems: 'end', display: 'flex', paddingLeft: 0 }}
            paddingLeft={0}>
            <TextField
              variant="standard"
              inputProps={{
                style: { paddingTop: 10, paddingBottom: 10, fontWeight: '500', color: '#2D3B63' }
              }}
              fullWidth
              placeholder="Tên khách hàng"
            />
          </Grid>
        </Grid>
      </Paper>
    );
  };

  const renderTitle = () => {
    return (
      <Paper
        variant="outlined"
        sx={{
          my: { xs: 3, md: 6 },
          p: { xs: 2, md: 3 },
          backgroundColor: 'white',
          borderColor: 'white',
          marginTop: '18px !important',
          marginBottom: '10px !important',
          paddingTop: '14px !important',
          paddingBottom: '14px !important'
        }}>
        <Typography color={'#2D3B63'} fontWeight="600" fontSize={22}>
          Chương trình chi tiết
        </Typography>
      </Paper>
    );
  };

  const renderTimeline = useMemo(() => {
    return fields.map((item, index) => {
      return (
        <Paper
          key={index}
          variant="outlined"
          sx={{
            my: { xs: 3, md: 6 },
            p: { xs: 2, md: 3 },
            backgroundColor: 'white',
            borderColor: 'white',
            marginTop: '18px !important',
            marginBottom: '10px !important'
          }}>
          <Controller
            errors={errors}
            render={({ field, fieldState: { error } }) => (
              <HeaderMinimunText
                {...field}
                inputProps={{
                  style: {
                    paddingTop: 10,
                    paddingBottom: 10,
                    fontWeight: 'bold',
                    color: '#ff6600'
                  }
                }}
                variant="standard"
                fullWidth
                error={!!error}
                InputProps={{
                  startAdornment: (
                    <Typography
                      align="left"
                      color={'#ff6600'}
                      sx={{ width: 80, fontSize: 17, fontWeight: 'bold' }}>
                      {`NGÀY ${index + 1}:`}
                    </Typography>
                  )
                }}
                helperText={error ? error.message : null}
                placeholder="NHẬP TIÊU ĐỀ"
              />
            )}
            name={`days.${index}..dayTitle`}
            control={control}
          />

          <Box
            sx={{
              flexDirection: 'row',
              display: 'flex',
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}>
            <FormControlLabel
              sx={{ marginLeft: 0 }}
              control={
                <Controller
                  render={({ field }) => <Checkbox {...field} />}
                  name={`days.${index}.meal.breakfast`}
                  control={control}
                  label="Bửa sáng"
                />
              }
              label="Bửa sáng"
            />
            <FormControlLabel
              sx={{ marginLeft: 0 }}
              control={
                <Controller
                  render={({ field }) => <Checkbox {...field} />}
                  name={`days.${index}.meal.lunch`}
                  control={control}
                />
              }
              label="Bửa trưa"
            />
            <FormControlLabel
              sx={{ marginLeft: 0 }}
              control={
                <Controller
                  render={({ field }) => <Checkbox {...field} />}
                  name={`days.${index}.meal.dinner`}
                  control={control}
                />
              }
              label="Bửa tối"
            />
          </Box>
          <AddTimeLineField dayIndex={index} control={control} getValues={getValues} />
        </Paper>
      );
    });
  }, [fields]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ paddingTop: 6 }}>
        {renderHeader()}
        {renderCustome()}
        {renderTitle()}
        {renderTimeline}
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }, backgroundColor: 'white' }}>
          <Box sx={{ flexDirection: 'row', display: 'flex', justifyContent: 'end' }}>
            <Button
              variant="contained"
              type="submit"
              sx={{ color: 'white', textTransform: 'capitalize', backgroundColor: '#ff6600' }}>
              Xuất chương trình
            </Button>
          </Box>
        </Paper>
      </Box>
    </form>
  );
};

export default CreateTourForm;
