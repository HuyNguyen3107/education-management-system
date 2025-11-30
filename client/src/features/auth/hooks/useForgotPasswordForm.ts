import { useForm, type SubmitHandler } from "react-hook-form";
import { usePasswordResetRequestMutation } from "../mutations/auth.mutations";

interface ForgotPasswordFormInputs {
  email: string;
}

/**
 * Custom hook for Forgot Password form
 * Follows Single Responsibility Principle - handles only forgot password form logic
 */
export const useForgotPasswordForm = () => {
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
    passwordResetMutation.mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
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
    isLoading: passwordResetMutation.isPending,

    // Validation rules
    emailValidation,
  };
};
