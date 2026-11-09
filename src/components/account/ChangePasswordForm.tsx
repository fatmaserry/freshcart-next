"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@/components/ui/icons";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/lib/utils";
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "@/lib/validation/schemas/changePassword";
import { Spinner } from "@/components/ui/Spinner";
import { FormError } from "@/components/auth/FormError";
import { useChangePassword } from "@/hooks/useAuthMutations";
import {
  SettingsField,
  SettingsSection,
  settingsButton,
} from "./SettingsSection";

export function ChangePasswordForm() {
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onTouched",
  });
  const { errors } = form.formState;

  const mutation = useChangePassword({
    onSuccess: () => {
      form.reset({ currentPassword: "", password: "", rePassword: "" });
      toast.success("Password changed successfully");
    },
  });

  return (
    <SettingsSection
      icon="lock"
      title="Change Password"
      description="Update your account password"
    >
      <form
        onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
        className="space-y-5"
        noValidate
      >
        {mutation.error && (
          <FormError message={getErrorMessage(mutation.error)} />
        )}
        <SettingsField
          label="Current Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your current password"
          error={errors.currentPassword?.message}
          {...form.register("currentPassword")}
        />
        <SettingsField
          label="New Password"
          type="password"
          autoComplete="new-password"
          placeholder="Enter your new password"
          error={errors.password?.message}
          {...form.register("password")}
        />
        <SettingsField
          label="Confirm New Password"
          type="password"
          autoComplete="new-password"
          placeholder="Confirm your new password"
          error={errors.rePassword?.message}
          {...form.register("rePassword")}
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
              <Icon name="lock" size={18.8} />
            )}
            Change Password
          </button>
        </div>
      </form>
    </SettingsSection>
  );
}
