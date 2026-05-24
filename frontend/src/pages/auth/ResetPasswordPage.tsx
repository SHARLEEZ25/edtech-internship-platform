import React from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import ResetPasswordForm from "@/components/auth/reset-password/ResetPasswordForm";
import ResetVisual from "@/components/auth/reset-password/ResetVisual";

const ResetPasswordPage: React.FC = () => {
  return (
    <AuthLayout visual={<ResetVisual />}>
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPasswordPage;

