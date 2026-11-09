import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import type { PolicyContent } from "@/lib/policies/content";

export function PolicyPage({ policy }: { policy: PolicyContent }) {
  return (
    <div className="container-page max-w-5xl py-8 sm:py-12">
      <nav
        aria-label="Breadcrumb"
        className="mb-5 flex items-center gap-2 text-sm text-muted"
      >
        <Link href="/" className="transition-colors hover:text-brand-600">
          Home
        </Link>
        <Icon name="chevron-right" size={11} />
        <span aria-current="page" className="text-body">
          {policy.title}
        </span>
      </nav>

      <header className="mb-7 flex items-center gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <Icon name={policy.icon} size={26} />
        </span>
        <div>
          <h1 className="text-3xl font-bold text-heading">{policy.title}</h1>
          <p className="mt-1 text-sm text-muted">Last updated: February 2026</p>
        </div>
      </header>

      <section className="mb-6 flex gap-4 rounded-xl border border-brand-100 bg-brand-50/60 p-5 sm:p-6">
        <span className="mt-0.5 shrink-0 text-brand-600">
          <Icon name={policy.icon} size={21} />
        </span>
        <div>
          <h2 className="font-semibold text-heading">{policy.introTitle}</h2>
          <p className="mt-1 text-sm leading-6 text-body">{policy.intro}</p>
        </div>
      </section>

      <div className="space-y-4">
        {policy.articles.map((article, index) => {
          const isContact = article.items.some((item) => item.email);

          return (
            <section
              key={article.title}
              className="rounded-xl border border-line-soft bg-surface-card p-5 shadow-sm sm:p-6"
            >
              <header className="mb-4 flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Icon
                    name={isContact ? "mail" : policy.icon}
                    size={17}
                    filled={isContact}
                  />
                </span>
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-brand-600">
                    Article {index + 1}
                  </p>
                  <h2 className="text-base font-semibold text-heading">
                    {article.title}
                  </h2>
                </div>
              </header>

              <div className="space-y-3">
                {article.items.map((item) => (
                  <div
                    key={item.number ?? item.text}
                    className="flex items-start gap-3 text-sm leading-6 text-body"
                  >
                    {item.number && (
                      <span className="min-w-8 pt-0.5 text-xs font-semibold text-muted">
                        {item.number}
                      </span>
                    )}
                    <p>
                      {item.lead && (
                        <strong className="font-semibold text-heading">
                          {item.lead}{" "}
                        </strong>
                      )}
                      {item.email ? (
                        <>
                          {item.text}{" "}
                          <a
                            href={`mailto:${item.email}`}
                            className="font-medium text-brand-600 hover:underline"
                          >
                            {item.email}
                          </a>
                        </>
                      ) : (
                        item.text
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
