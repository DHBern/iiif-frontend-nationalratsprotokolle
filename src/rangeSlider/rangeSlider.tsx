import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider, { Mark } from '@material-ui/core/Slider';
import Cookie from 'universal-cookie';

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
  const { min, max, value, setValue, valueLabelDisplay } = props;
  const classes = useStyles();
  const [innerValue, setInnerValue] = useState<number[]>(value)
  const cookie = new Cookie();

  const handleChange = (event: any, newValue: number | number[]) => {
    setInnerValue(newValue as number[]);
  };

  const handleChangeCommited = (event: any, newValue: number | number[]) => {
    setValue(newValue as number[]);
    cookie.set('timelineRange', newValue, {
      secure: true,
      sameSite: 'strict'
    });
  };

  return (
    <div className={classes.root}>
      <Slider
        value={innerValue}
        onChange={handleChange}
        onChangeCommitted={handleChangeCommited}
        min={min}
        max={max}
        valueLabelDisplay={valueLabelDisplay}
      />
    </div>
  );
}

