import SelectDisplay from "./select.module";

export default function Page() {
  return (
    <main className="flex flex-col min-h-screen p-8 md:p-20">
      <h1 className="text-3xl font-semibold">Select Songs</h1>
      <SelectDisplay />
    </main>
  );
}