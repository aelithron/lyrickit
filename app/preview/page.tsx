import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preview"
};

export default function Page() {
  return (
    <main className="flex flex-col min-h-screen p-8 md:p-20">
      <h1 className="text-3xl font-semibold">Preview</h1>
    </main>
  );
}