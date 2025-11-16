import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useLoginMutation } from "../mutations/auth.mutations";

interface LoginFormInputs {
  email: string;
  password: string;
}

export const useLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    loginMutation.mutate(data);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const emailValidation = {
    required: "Email hoặc tên đăng nhập là bắt buộc",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Email không hợp lệ",
    },
  };

  const passwordValidation = {
    required: "Mật khẩu là bắt buộc",
    minLength: {
      value: 6,
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    },
  };

  return {
    // Form handlers
    register,
    handleSubmit,
    onSubmit,
    errors,

    // Password visibility
    showPassword,
    handleTogglePassword,

    // Validation rules
    emailValidation,
    passwordValidation,

    // Mutation state
    isLoading: loginMutation.isPending,
  };
};
