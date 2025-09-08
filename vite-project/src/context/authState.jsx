import React, { useReducer } from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import AuthReducer from './authReducer';
import api from '../utils/api';
import setAuthToken from '../utils/setAuthToken'; 
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
} from './types';

const AuthState = (props) => {
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  // Load User
  const loadUser = async () => {
    try {
      if (!localStorage.token) {
        dispatch({ type: AUTH_ERROR });
        return;
      }

      setAuthToken(localStorage.token);
      const res = await api.get('/api/auth/user');

      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    } catch (err) {
      console.error('Error loading user:', err.response ? err.response.data : err.message);
      dispatch({ type: AUTH_ERROR });
    }
  };

  // Register User
  const register = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const res = await axios.post('/api/auth/register', formData, config);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response.data.msg,
      });
    }
  };

  // Login User
  const login = async (formData) => {
    try {
      // Validate input
      if (!formData.email || !formData.password || !formData.role) {
        console.error('Missing required fields:', formData);
        dispatch({
          type: LOGIN_FAIL,
          payload: 'Please fill in all fields'
        });
        return;
      }
      // Normalize the data
    const loginData = {
      email: formData.email.toLowerCase().trim(),
      password: formData.password,
      role: formData.role.toLowerCase().trim()
    };

    console.log('Attempting login with:', loginData);

      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const res = await api.post('/api/auth/login', loginData, config);

      // Add debug logging
    console.log('Login response:', res.data);

    if (res.data.token) {
      if (res.data && res.data.token) {
        // Store token in localStorage
        setAuthToken(res.data.token);
        
        // Update auth state
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data
        });
      
       // Load user data
       await loadUser();
     } else {
       throw new Error('Invalid response from server - no token received');
     }
    }
  }catch (err) {
    console.error('Login error:', {
      message: err.response?.data?.msg || err.message,
      status: err.response?.status,
      data: err.response?.data
    });
  
    dispatch({
      type: LOGIN_FAIL,
      payload: err.response?.data?.msg || 'Invalid credentials'
    });
  }
};

  // Logout
  const logout = () => dispatch({ type: LOGOUT });

  // Clear Errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        loadUser,
        login,
        logout,
        clearErrors,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;