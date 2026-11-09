import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center animate-fade-in">
      <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-surface-muted text-hint [&_svg]:h-10 [&_svg]:w-10">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
      <p className="font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 font-semibold underline underline-offset-4"
        >
          Try again
        </button>
      )}
    </div>
  );
}
