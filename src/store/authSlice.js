import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const login = createAsyncThunk(
  'auth/login',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch('https://take-home-test-api.nutech-integrasi.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok && data.status === 0) {
        return data.data.token;
      } else {
        return rejectWithValue(data.message || 'Login gagal');
      }
    } catch (error) {
      return rejectWithValue('Terjadi kesalahan. Silakan coba lagi.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    errorMessage: '',
    loading: false,
    isBalanceVisible: localStorage.getItem('isBalanceVisible') === 'true',
  },
  reducers: {
    clearErrorMessage: (state) => {
      state.errorMessage = '';
    },
    logout: (state) => {
      state.token = null;
    },
    toggleBalanceVisibility: (state) => {
      state.isBalanceVisible = !state.isBalanceVisible;
      localStorage.setItem('isBalanceVisible', state.isBalanceVisible);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.errorMessage = '';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      });
  },
});

export const { clearErrorMessage, logout, toggleBalanceVisibility } = authSlice.actions;
export default authSlice.reducer;
