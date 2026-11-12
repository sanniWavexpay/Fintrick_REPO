import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // LocalStorage se purani history uthao agar hai toh
  history: JSON.parse(localStorage.getItem("recent_searches")) || [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    addSearchTerm: (state, action) => {
      const term = action.payload.trim();
      if (!term) return;

      // 1. Purane duplicate ko hatao (taaki naya term top par aaye)
      state.history = state.history.filter((item) => item !== term);

      // 2. Naya term start mein dalo
      state.history.unshift(term);

      // 3. Max 6 items hi rakho
      state.history = state.history.slice(0, 6);

      // 4. LocalStorage update karo
      localStorage.setItem("recent_searches", JSON.stringify(state.history));
    },
    clearHistory: (state) => {
      state.history = [];
      localStorage.removeItem("recent_searches");
    },
  },
});

export const { addSearchTerm, clearHistory } = searchSlice.actions;
export default searchSlice.reducer;
