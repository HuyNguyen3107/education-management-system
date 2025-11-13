import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import {
  useValidateTokenMutation,
  useSubmitNewPasswordMutation,
} from "../mutations/auth.mutations";

interface ResetPasswordFormInputs {
  newPassword: string;
  confirmPassword: string;
}

/**
 * Custom hook for Reset Password form
 * Follows Single Responsibility Principle - handles only reset password form logic
 */
export const useResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateTokenMutation = useValidateTokenMutation();
  const submitPasswordMutation = useSubmitNewPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormInputs>({
    mode: "onBlur",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Validate token on mount
  useEffect(() => {
    if (token) {
      validateTokenMutation.mutate(token);
    }
  }, [token]);

  const onSubmit: SubmitHandler<ResetPasswordFormInputs> = async (data) => {
    try {
      const result = await submitPasswordMutation.mutateAsync({
        token,
        newPassword: data.newPassword,
      });
      if (result.success) {
        setIsSuccess(true);
      }
    } catch (error) {
      setIsSuccess(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const password = watch("newPassword");

  const passwordValidation = {
    required: "Mật khẩu mới là bắt buộc",
    minLength: {
      value: 8,
      message: "Mật khẩu phải có ít nhất 8 ký tự",
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message: "Mật khẩu phải chứa chữ hoa, chữ thường và số",
    },
  };

  const confirmPasswordValidation = {
    required: "Xác nhận mật khẩu là bắt buộc",
    validate: (value: string) =>
      value === password || "Mật khẩu xác nhận không khớp",
  };

  return {
    // Form handlers
    register,
    handleSubmit,
    onSubmit,
    errors,

    // Token state
    token,
    isTokenValid:
      validateTokenMutation.isSuccess && validateTokenMutation.data?.isValid,
    isTokenValidating: validateTokenMutation.isPending,
    tokenError:
      validateTokenMutation.data?.isValid === false
        ? validateTokenMutation.data.message
        : null,

    // Password visibility
    showPassword,
    showConfirmPassword,
    handleTogglePassword,
    handleToggleConfirmPassword,

    // Validation rules
    passwordValidation,
    confirmPasswordValidation,

    // Submit state
    isSuccess,
    isLoading: submitPasswordMutation.isPending,
    isError: submitPasswordMutation.isError,
    errorMessage:
      submitPasswordMutation.error?.message ||
      "Đặt lại mật khẩu thất bại. Vui lòng thử lại.",
    successMessage:
      submitPasswordMutation.data?.message ||
      "Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập...",
  };
};
