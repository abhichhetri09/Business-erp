import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

interface NavigationProps {
  items: {
    href: string;
    label: string;
    icon?: keyof typeof Icons;
  }[];
}

export default function Navigation({ items }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {items.map((item) => {
        const Icon = item.icon ? Icons[item.icon] : null;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary-500",
              isActive ? "text-primary-500" : "text-gray-500 dark:text-gray-400"
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
