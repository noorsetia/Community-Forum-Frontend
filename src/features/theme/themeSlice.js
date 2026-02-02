import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: { mode: "dark" },
  reducers: {},
});

export default themeSlice.reducer;
