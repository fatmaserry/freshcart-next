import { Icon } from "@/components/ui/icons";

export function FormError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
    >
      <Icon name="alert-circle" size={18} className="mt-0.5 shrink-0" />
      {message}
    </div>
  );
}
