import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider, { Mark } from '@material-ui/core/Slider';

const useStyles = makeStyles({
  root: {
    width: '100%',
    margin: '50px 0 20px'
  },
});


interface IProps {
  min: number,
  max: number,
  marks: boolean | Mark[],
  value: number[],
  setValue: (a: number[]) => void,
  valueLabelDisplay?: 'on' | 'auto' | 'off';
}

const defaultProps = {
  valueLabelDisplay: 'on',
};

export default function RangeSlider(props: IProps & typeof defaultProps) {
  const { min, max, marks, value, setValue, valueLabelDisplay } = props;
  const classes = useStyles();

  const handleChange = (event: any, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  return (
    <div className={classes.root}>
      <Slider
        value={value}
        onChange={handleChange}
        marks={marks}
        min={min}
        max={max}
        step={null}
        valueLabelDisplay={valueLabelDisplay}
      />
    </div>
  );
}

