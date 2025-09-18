import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface NavigationBreadcrumbProps {
  href: string;
  text: string;
}

export const NavigationBreadcrumb = ({
  href,
  text,
}: NavigationBreadcrumbProps) => {
  return (
    <div className="mb-6">
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        {text}
      </Link>
    </div>
  );
};
