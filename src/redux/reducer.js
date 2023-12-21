import { combineReducers } from '@reduxjs/toolkit';

import userSlice from './userSlice';
import themeSlice from './theme';
import vacationSlice from './vacationSlice';
import postSlice from './postSlice';
import albumSlice from './albumSlice';

const rootReducer = combineReducers({
  user: userSlice,
  theme: themeSlice,
  vacations: vacationSlice,
  posts: postSlice,
  album: albumSlice,
});

export { rootReducer };
