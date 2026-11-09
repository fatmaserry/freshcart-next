"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@/components/ui/icons";
import { Spinner } from "@/components/ui/Spinner";
import {
  contactSchema,
  type ContactValues,
} from "@/lib/validation/schemas/contact";

const subjects = [
  { value: "general", label: "General Inquiry" },
  { value: "order", label: "Order Support" },
  { value: "shipping", label: "Shipping Question" },
  { value: "returns", label: "Returns & Refunds" },
  { value: "product", label: "Product Information" },
  { value: "feedback", label: "Feedback & Suggestions" },
  { value: "other", label: "Other" },
];

const labelClass = "mb-2 block text-sm font-medium text-body";
const fieldClass =
  "w-full rounded-xl border border-line-strong bg-surface-card px-4 py-3 text-heading transition-all placeholder:text-hint focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-sm text-red-600">{message}</p>;
}

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, reset, formState } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { subject: "" },
  });
  const { errors, isSubmitting } = formState;

  const submit = handleSubmit(async () => {
    // Route has no contact endpoint, so nothing is delivered yet. Send the
    // values to a real service here once there is one.
    await new Promise((resolve) => setTimeout(resolve, 1500));
    reset();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  });

  return (
    <div className="rounded-2xl border border-line-soft bg-surface-card p-6 shadow-sm lg:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Icon name="headset" size={21.2} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-heading">Send us a Message</h2>
          <p className="text-sm text-muted">
            Fill out the form and we&apos;ll get back to you
          </p>
        </div>
      </div>

      {sent && (
        <div
          role="status"
          className="mb-6 flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 p-4"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
            <Icon name="check" size={16.5} />
          </div>
          <div>
            <p className="font-medium text-green-800">
              Message sent successfully!
            </p>
            <p className="text-sm text-green-600">
              We&apos;ll get back to you as soon as possible.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={submit} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>
              Full Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              aria-invalid={!!errors.name}
              className={fieldClass}
              {...register("name")}
            />
            <FieldError message={errors.name?.message} />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="john@example.com"
              aria-invalid={!!errors.email}
              className={fieldClass}
              {...register("email")}
            />
            <FieldError message={errors.email?.message} />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className={labelClass}>
            Subject
          </label>
          <select
            id="subject"
            aria-invalid={!!errors.subject}
            className={fieldClass}
            {...register("subject")}
          >
            <option value="">Select a subject</option>
            {subjects.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <FieldError message={errors.subject?.message} />
        </div>

        <div>
          <label htmlFor="message" className={labelClass}>
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            placeholder="How can we help you?"
            aria-invalid={!!errors.message}
            className={`${fieldClass} resize-none`}
            {...register("message")}
          />
          <FieldError message={errors.message?.message} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-8 py-3.5 font-semibold text-white shadow-sm shadow-brand-600/20 transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
        >
          {isSubmitting ? (
            <>
              <Spinner className="h-4 w-4" /> Sending...
            </>
          ) : (
            <>
              <Icon name="paper-plane" size={18.8} className="w-5" /> Send
              Message
            </>
          )}
        </button>
      </form>
    </div>
  );
}
