import { RegisterForm } from "@/components/auth/register-form";

export default function BuyerRegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Register as a Buyer
        </h1>
        <p className="text-sm text-muted-foreground">
          Browse the marketplace and order fresh produce from farmers
        </p>
      </div>
      <RegisterForm role="BUYER" />
    </div>
  );
}
