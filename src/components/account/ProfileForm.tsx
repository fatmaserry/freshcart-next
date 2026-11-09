"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@/components/ui/icons";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/lib/utils";
import {
  profileSchema,
  type ProfileValues,
} from "@/lib/validation/schemas/profile";
import { useAuth } from "@/providers/AuthProvider";
import { Spinner } from "@/components/ui/Spinner";
import { FormError } from "@/components/auth/FormError";
import { useUpdateMe } from "@/hooks/useAuthMutations";
import {
  SettingsField,
  SettingsSection,
  settingsButton,
} from "./SettingsSection";

export function ProfileForm() {
  const { user, updateUser } = useAuth();
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", email: "", phone: "" },
  });
  const { errors, dirtyFields } = form.formState;

  useEffect(() => {
    if (user)
      form.reset({
        name: user.name,
        email: user.email,
        phone: "",
      });
  }, [user, form]);

  const mutation = useUpdateMe({
    onSuccess: ({ user: updated }) => {
      updateUser({ name: updated.name, email: updated.email });
      toast.success("Profile updated");
    },
  });

  const save = (values: ProfileValues) => {
    // The API rejects re-submitting the current email, so only changed fields are sent.
    const changed = Object.fromEntries(
      Object.entries(values).filter(
        ([k]) => dirtyFields[k as keyof ProfileValues],
      ),
    );
    if (Object.keys(changed).length === 0)
      return void toast.info("No changes to save");
    mutation.mutate(changed);
  };

  return (
    <SettingsSection
      icon={{ name: "user", filled: true }}
      title="Profile Information"
      description="Update your personal details"
    >
      <form onSubmit={form.handleSubmit(save)} className="space-y-5" noValidate>
        {mutation.error && (
          <FormError message={getErrorMessage(mutation.error)} />
        )}
        <SettingsField
          label="Full Name"
          placeholder="Enter your name"
          error={errors.name?.message}
          {...form.register("name")}
        />
        <SettingsField
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          {...form.register("email")}
        />
        <SettingsField
          label="Phone Number"
          type="tel"
          placeholder="01xxxxxxxxx"
          error={errors.phone?.message}
          {...form.register("phone")}
        />
        <div className="pt-1">
          <button
            type="submit"
            disabled={mutation.isPending}
            className={settingsButton}
          >
            {mutation.isPending ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <Icon name="floppy-disk" size={18.8} />
            )}
            Save Changes
          </button>
        </div>
      </form>
    </SettingsSection>
  );
}
