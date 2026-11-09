export function AuthHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-8 text-center">
      <div className="mb-4 flex items-center justify-center">
        <span className="text-3xl font-bold text-brand-600">
          Fresh<span className="text-heading">Cart</span>
        </span>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-heading">{title}</h1>
      <p className="text-body">{subtitle}</p>
    </div>
  );
}
