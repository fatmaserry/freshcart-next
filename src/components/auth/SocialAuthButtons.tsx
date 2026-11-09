"use client";

import { toast } from "react-toastify";
import { Icon } from "@/components/ui/icons";
import { socialSignUpMethods } from "@/lib/auth/social";
import { cn } from "@/lib/utils";

export function SocialAuthButtons({
  action,
}: {
  action: "sign in" | "sign up";
}) {
  const isSignIn = action === "sign in";

  return (
    <div className={isSignIn ? "mb-6 space-y-3" : "my-10 flex gap-2"}>
      {socialSignUpMethods.map((method) => (
        <button
          key={method.id}
          type="button"
          onClick={() =>
            toast.info(`${method.label} sign-in isn't available yet`)
          }
          className={cn(
            "flex items-center justify-center transition-all duration-200",
            isSignIn
              ? "w-full gap-3 rounded-xl border-2 border-line-strong px-4 py-3 hover:border-brand-300 hover:bg-brand-50"
              : "grow rounded-lg border border-line-strong px-4 py-2 font-semibold text-heading hover:bg-surface-muted",
          )}
        >
          <Icon
            name={method.icon}
            size={isSignIn ? 21.2 : 18.8}
            className={cn("w-5", !isSignIn && "me-2", method.iconClassName)}
          />
          {isSignIn ? (
            <span className="font-medium text-body">
              Continue with {method.label}
            </span>
          ) : (
            <span>{method.label}</span>
          )}
        </button>
      ))}
    </div>
  );
}
