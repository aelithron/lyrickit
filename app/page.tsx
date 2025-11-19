import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen p-8 md:p-20 gap-2">
      <h1 className="text-3xl font-semibold">Welcome to Lyric Kit</h1>
      <p>Get started by selecting some songs.</p>
      <Link href={"/select"} className="text-black bg-violet-300 p-1 px-2 rounded-lg w-fit hover:text-sky-500"><FontAwesomeIcon icon={faPlay} /> Get Started</Link>
      <p className="mt-8 text-slate-500"><FontAwesomeIcon icon={faGithub} /> <a href="https://github.com/aelithron/lyrickit" rel="noopener" target="_blank" className="underline hover:text-sky-500">LyricKit</a> {process.env.IMAGE_TAG || "Unknown Version"}</p>
    </main>
  );
}