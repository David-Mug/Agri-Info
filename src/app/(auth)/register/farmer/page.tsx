import { RegisterForm } from "@/components/auth/register-form";

export default function FarmerRegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Register as a Farmer
        </h1>
        <p className="text-sm text-muted-foreground">
          Start listing your products and selling directly to buyers
        </p>
      </div>
      <RegisterForm role="FARMER" />
    </div>
  );
}
