import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialsState {
  initialQuestion: string;
  avatarContent: string;
  questionCount: number;
}

interface InterviewState {
  initials: InitialsState | null;
}

const initialState: InterviewState = {
  initials: null,
};

export const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    setInitials: (state, action: PayloadAction<InitialsState>) => {
      state.initials = action.payload;
    },
    clearInitials: (state) => {
      state.initials = null;
    },
  },
});

export const { setInitials, clearInitials } = interviewSlice.actions;

export default interviewSlice.reducer;
