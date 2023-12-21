import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  vacations: {},
};

const vacationSlice = createSlice({
  name: 'vacation',
  initialState,
  reducers: {
    getVacations(state, action) {
      state.vacations = action.payload;
    },
  },
});

export default vacationSlice.reducer;

export function SetVacations(vacation) {
  return (dispatch, getState) => {
    dispatch(vacationSlice.actions.getVacations(vacation));
  };
}
