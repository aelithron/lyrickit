import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faClipboardList, faDownload, faEye, faMagnifyingGlass, faMusic, faPencil, faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="flex flex-col h-full p-2 w-20 bg-violet-300 text-black rounded-lg items-center absolute gap-4">
      <Link href={"/"} className="hover:text-sky-500"><FontAwesomeIcon icon={faMusic} className="mb-4" size="3x" /></Link>
      <SidebarLink icon={faClipboardList} link={"/select"} text={"Select"} />
      <SidebarLink icon={faMagnifyingGlass} link={"/find"} text={"Find"} />
      <SidebarLink icon={faPencil} link={"/edit"} text={"Edit"} />
      <SidebarLink icon={faSync} link={"/sync"} text={"Sync"} />
      <SidebarLink icon={faEye} link={"/preview"} text={"Preview"} />
      <SidebarLink icon={faDownload} link={"/export"} text={"Save"} />
    </div>
  )
}
function SidebarLink({ link, icon, text }: { link: Url, icon: IconProp, text?: string }) {
  return (
    <Link className="flex flex-col items-center hover:text-sky-500" href={link}>
      <FontAwesomeIcon icon={icon} size="xl" />
      {text && <p>{text}</p>}
    </Link>
  );
}