import RegisterForm from "@/components/modules/Auth/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - Smart Care",
  description: "Create an account with Smart Care to access personalized healthcare services.",
};

const RegisterPage = () => {
  return (
    <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[calc(100vh-140px)]">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;