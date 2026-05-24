import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "@/components/auth/forgot-password/ForgotPasswordForm";
import ForgotPasswordVisual from "@/components/auth/forgot-password/ForgotPasswordVisual";
import "@/styles/auth/forgot-password.css";

const ForgotPasswordPage = () => {
  return (
    <AuthLayout visual={<ForgotPasswordVisual />}>
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
