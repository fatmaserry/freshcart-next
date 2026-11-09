import { Icon } from "@/components/ui/icons";

const socials = [
  { name: "Facebook", Icon: "facebook" },
  { name: "Twitter", Icon: "twitter" },
  { name: "Instagram", Icon: "instagram" },
  { name: "YouTube", Icon: "youtube" },
] as const;

export function SocialIcons() {
  return (
    <div className="flex gap-3">
      {socials.map(({ name, Icon: icon }) => (
        <span
          key={name}
          aria-label={name}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-footer transition hover:bg-brand-600 hover:text-white"
        >
          <Icon name={icon} size={16} />
        </span>
      ))}
    </div>
  );
}
