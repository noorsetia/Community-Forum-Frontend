import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: { id: 1, name: "Demo User" },
  },
  reducers: {},
});

export default authSlice.reducer;
