import { create } from 'zustand';

const useAppStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,

  login: (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    set({ user: userData, token });
  },

  logout: () => {
    localStorage.clear();
    set({ user: null, token: null });
  }
}));

export default useAppStore;
