import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <Link href="/" className="flex flex-col items-center gap-2">
        <Image
          src="/logo-icon.png"
          alt="UniConnect"
          width={56}
          height={59}
          priority
        />
        <span className="text-xl font-semibold tracking-tight">
          UniConnect
        </span>
      </Link>
      {children}
    </div>
  );
}
