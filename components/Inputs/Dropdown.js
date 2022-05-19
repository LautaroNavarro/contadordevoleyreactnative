import React, {useState} from 'react';
import styled from 'styled-components';
import {useSelector} from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';

import {selectTheme} from './../../reducers/theme/themeSlice';

const Label = styled.Text`
  color: ${({theme}) => theme.colors.secondaryText};
  padding-bottom: 8px;
  padding-left: 2px;
`;

const Dropdown = ({value, items, label, onValueChange = () => {}}) => {
  const [open, setOpen] = useState(false);
  const theme = useSelector(selectTheme);

  return (
    <>
      {label && <Label>{label}</Label>}
      <DropDownPicker
        value={value}
        items={items}
        setValue={onValueChange}
        open={open}
        setOpen={setOpen}
        style={{backgroundColor: theme.colors.background, borderColor: theme.colors.text}}
        labelStyle={{color: theme.colors.text}}
        dropDownContainerStyle={{backgroundColor: theme.colors.secondaryBackground, borderColor: theme.colors.text}}
        listItemLabelStyle={{color: theme.colors.text}}
      />
    </>
  );
};

export default Dropdown;
