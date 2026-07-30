"use client";

import { useTransition } from "react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { startConversation } from "@/lib/actions/messages";
import { Button } from "@/components/ui/button";

export function ContactFarmerButton({ farmerUserId }: { farmerUserId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await startConversation(farmerUserId);
          if (result?.error) toast.error(result.error);
        })
      }
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      Contact Farmer
    </Button>
  );
}
