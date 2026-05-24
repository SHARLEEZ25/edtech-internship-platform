import AuthLayout from "@/components/auth/AuthLayout";
import ResetPasswordForm from "@/components/auth/reset-password/ResetPasswordForm";
import ResetPasswordVisual from "@/components/auth/reset-password/ResetVisual";

const ResetPasswordPage = () => {
  return (
    <AuthLayout visual={<ResetPasswordVisual />}>
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPasswordPage;
