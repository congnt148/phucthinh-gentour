import { Autocomplete, TextField } from '@mui/material';
import { TOURIST_ATTRACTION } from '../providers/touristAttraction';
import { styled } from '@mui/system';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

const Location = styled(TextField)({
  '& .MuiInput-underline:before': {
    borderBottom: 'none'
  },
  '& .MuiInput-underline:hover:before': {
    borderBottom: 'none'
  },
  '& .MuiInput-underline:after': {
    borderBottom: 'none'
  }
});

const TouristAttraction = ({ control, dayIndex, timeIndex, getValues, replace }) => {
  const [locationSelected, setLocationSelected] = useState([]);

  return (
    <Controller
      render={({ field: { onChange, value } }) => (
        <Autocomplete
          sx={{ width: '100%' }}
          multiple
          variant="standard"
          value={value}
          options={TOURIST_ATTRACTION}
          getOptionLabel={(option) => option.title}
          getOptionKey={(option) => option.id}
          onChange={(event, value) => {
            if (value.length > locationSelected.length) {
              let days = getValues(`days.${dayIndex}.timeline`);
              let temp = days[timeIndex].addressContent;
              days[timeIndex].addressContent = temp += `\n <p>${value.slice(-1)[0].content}</p>`;
              replace(days);
            }
            onChange(value);
            setLocationSelected(value);
          }}
          renderInput={(params) => (
            <Location
              ref={params.InputProps.ref}
              variant="standard"
              {...params}
              placeholder="Thêm điểm đến"
              inputProps={{
                ...params.inputProps,
                style: { paddingTop: 10, paddingBottom: 10 }
              }}
            />
          )}
        />
      )}
      name={`days.${dayIndex}.timeline.${timeIndex}.address`}
      control={control}
    />
  );
};

export default TouristAttraction;
