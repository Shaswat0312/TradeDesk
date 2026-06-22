import { useMutation } from '@tanstack/react-query';
import { loginUser, registerUser } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      navigate('/dashboard');
    },
  });
};

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      navigate('/dashboard');
    },
  });
};