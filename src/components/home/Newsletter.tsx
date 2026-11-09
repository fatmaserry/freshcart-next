"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/icons";
import { toast } from "react-toastify";
import { Reveal } from "@/components/ui/Reveal";

const perks = [
  { icon: "leaf", label: "Fresh Picks Weekly" },
  { icon: "truck", label: "Free Delivery Codes" },
  { icon: "tag", label: "Members-Only Deals" },
] as const;

const stores = [
  { small: "Download on", big: "App Store", Icon: "apple" },
  { small: "Get it on", big: "Google Play", Icon: "google-play" },
] as const;

export function Newsletter() {
  const [email, setEmail] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email))
      return toast.error("Please enter a valid email");
    toast.success("You're subscribed! Check your inbox for deals.");
    setEmail("");
  };

  return (
    <section className="bg-linear-to-b from-surface-card to-surface-alt py-16">
      <div className="container-page">
        <Reveal className="px-4" distance={50} duration={0.8}>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-100/50 bg-linear-to-br from-emerald-50 via-surface-card to-teal-50 shadow-2xl shadow-emerald-500/10">
            <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 -translate-y-1/2 translate-x-1/4 rounded-full bg-linear-to-br from-emerald-200/40 to-transparent blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/4 translate-y-1/2 rounded-full bg-linear-to-tr from-teal-200/30 to-transparent blur-3xl" />

            <div className="relative grid gap-8 p-8 lg:grid-cols-5 lg:p-14">
              <div className="space-y-6 lg:col-span-3">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
                    <Icon
                      name="mail"
                      filled
                      size={23.5}
                      className="text-white"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                      Newsletter
                    </p>
                    <p className="text-xs text-muted">50,000+ subscribers</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold leading-snug text-heading lg:text-4xl">
                    Get the Freshest Updates{" "}
                    <span className="text-emerald-600">Delivered Free</span>
                  </h2>
                  <p className="mt-3 text-lg text-muted">
                    Weekly recipes, seasonal offers &amp; exclusive member
                    perks.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {perks.map(({ icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2.5 rounded-full border border-emerald-100 bg-surface-card/80 px-4 py-2.5 shadow-sm backdrop-blur-sm"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
                        <Icon
                          name={icon}
                          size={14}
                          className="text-emerald-600"
                        />
                      </div>
                      <span className="text-sm font-medium text-body">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <form
                    onSubmit={onSubmit}
                    className="flex flex-col gap-3 sm:flex-row"
                  >
                    <div className="relative flex-1">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        aria-label="Email address"
                        className="w-full rounded-2xl border-2 border-line-strong bg-surface-card py-4 pl-5 pr-5 text-base text-heading shadow-sm transition-all placeholder:text-hint focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>
                    <button
                      type="submit"
                      className="group flex items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-(--fc-emerald-600) to-emerald-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-500/40"
                    >
                      Subscribe
                      <Icon
                        name="arrow-right"
                        size={16.5}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  </form>
                  <p className="mt-3 pl-1 text-xs text-hint">
                    ✨ Unsubscribe anytime. No spam, ever.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2 lg:border-l lg:border-emerald-100 lg:pl-8">
                <div className="flex h-full flex-col justify-center">
                  <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-gray-900 to-gray-800 p-8 text-white">
                    <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-500/20 blur-2xl" />
                    <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-teal-500/20 blur-2xl" />
                    <div className="relative space-y-5">
                      <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                        📱 MOBILE APP
                      </span>
                      <h3 className="text-2xl font-bold leading-tight text-white!">
                        Shop Faster on Our App
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-400">
                        Get app-exclusive deals &amp; 15% off your first order.
                      </p>
                      <div className="flex flex-col gap-3 pt-2">
                        {stores.map(({ small, big, Icon: icon }) => (
                          <div
                            key={big}
                            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm transition-all hover:scale-[1.02] hover:bg-white/15"
                          >
                            <Icon name={icon} size={23.5} className="w-6.25" />
                            <div className="text-left">
                              <div className="text-[10px] uppercase tracking-wide text-gray-400">
                                {small}
                              </div>
                              <div className="-mt-0.5 text-sm font-semibold">
                                {big}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 pt-2 text-sm">
                        <span className="text-yellow-400">★★★★★</span>
                        <span className="text-gray-400">
                          4.9 • 100K+ downloads
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
