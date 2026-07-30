"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { createCategory } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CategoryForm() {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const action = (formData: FormData) => {
    startTransition(async () => {
      const result = await createCategory(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Category created");
        formRef.current?.reset();
      }
    });
  };

  return (
    <form ref={formRef} action={action} className="flex gap-2">
      <Input name="name" placeholder="Category name" required />
      <Button type="submit" disabled={pending}>
        Add
      </Button>
    </form>
  );
}
