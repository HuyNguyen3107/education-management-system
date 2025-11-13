import { useForm, type SubmitHandler } from "react-hook-form";
import { usePasswordResetRequestMutation } from "../mutations/auth.mutations";
import { useState } from "react";

interface ForgotPasswordFormInputs {
  email: string;
}

/**
 * Custom hook for Forgot Password form
 * Follows Single Responsibility Principle - handles only forgot password form logic
 */
export const useForgotPasswordForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const passwordResetMutation = usePasswordResetRequestMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormInputs>({
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = async (data) => {
    try {
      await passwordResetMutation.mutateAsync(data);
      setIsSuccess(true);
      reset();
    } catch (error) {
      setIsSuccess(false);
    }
  };

  const emailValidation = {
    required: "Email là bắt buộc",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Email không hợp lệ",
    },
  };

  return {
    // Form handlers
    register,
    handleSubmit,
    onSubmit,
    errors,

    // State
    isSuccess,
    isLoading: passwordResetMutation.isPending,
    isError: passwordResetMutation.isError,
    errorMessage:
      passwordResetMutation.error?.message ||
      "Gửi yêu cầu thất bại. Vui lòng thử lại.",
    successMessage:
      passwordResetMutation.data?.message ||
      "Link reset mật khẩu đã được gửi đến email của bạn!",

    // Validation rules
    emailValidation,
  };
};
