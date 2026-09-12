import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-border bg-background sticky top-0 z-10 border-b">
      <div className="mx-auto flex h-16 max-w-5xl items-center px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/logo-icon.png"
            alt="UniConnect"
            width={32}
            height={34}
            priority
          />
          <span className="text-lg font-semibold tracking-tight">
            UniConnect
          </span>
        </Link>
      </div>
    </header>
  );
}
