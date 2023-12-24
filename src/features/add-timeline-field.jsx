import { Box, Button,  TextField } from '@mui/material';
import { Controller, useFieldArray } from 'react-hook-form';
import { styled } from '@mui/system';
import WYSIWYGEditor from '../components/WYSIWYGEditor';
import TouristAttraction from '../components/tourist-attraction'
const HeaderTimeText = styled(TextField)({
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
    fontWeight: '600',
    color: '#ff6600'
  },
  '& .MuiInputLabel-root': {
    fontSize: 17,
    fontWeight: '600',
    color: '#ff6600'
  }
});


const AddTimeLineField = ({control, dayIndex,  getValues }) => {
  
  const { fields, append, replace } = useFieldArray({
    control,
    name: `days.${dayIndex}.timeline`
  });

  return (
    <Box>
      {fields.map((item, index) => (
        <Box
          key={item.id}
          sx={{
            flexDirection: 'column',
            display: 'flex',
            borderRadius: 1,
            border: '1px solid #D9D9D9',
            padding: 1,
            marginBottom: 2
          }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <Controller
              render={({ field }) => (
                <HeaderTimeText
                  variant="standard"
                  {...field}
                  inputProps={{
                    style: { paddingTop: 10, paddingBottom: 10 }
                  }}
                  placeholder="Thời gian"
                />
              )}
              name={`days.${dayIndex}.timeline.${index}.time`}
              control={control}
            />
            <Box sx={{ width: '1px', height: 40, background: '#D9D9D9', marginX: 2 }} />
            <TouristAttraction 
              dayIndex={dayIndex}
              timeIndex={index}
              getValues={getValues}
              replace={replace}
              control={control}
            />
          </Box>
          <Controller
            control={control}
            name={`days.${dayIndex}.timeline.${index}.addressContent`}
            render={({ field, fieldState: { error } }) => {
              return <WYSIWYGEditor {...field} />;
            }}
          />
        </Box>
      ))}
      <Box sx={{flexDirection: 'row', display: 'flex', justifyContent: 'center', marginTop: 2}}>
        <Button
          variant="contained"
          onClick={() => {
            append({
              time: '',
              address:[],
              addressContent: ''
            });
          }}
          sx={{
            color: 'white',
            textTransform: 'capitalize',
            backgroundColor: '#ff6600',
            borderRadius: 20
          }}>
          Thêm thời gian
        </Button>
      </Box>
    </Box>
  );
};

export default AddTimeLineField;
