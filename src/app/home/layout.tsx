import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CodeNaya — AI-Powered Code Editor in Your Browser",
  description:
    "Build, edit, and deploy code projects instantly with AI assistance. No setup, no installs — just code in the browser with CodeNaya.",
  openGraph: {
    title: "CodeNaya — AI-Powered Code Editor in Your Browser",
    description:
      "Build, edit, and deploy code projects instantly with AI assistance.",
    type: "website",
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
