import { Button } from "@nextui-org/react";
import { useAtom } from "jotai";
import { isMiniSidebarOpenedAtom } from "~/atoms";


export default function Sub() {
  const [isMiniSidebarOpened, setIsMiniSidebarOpened] = useAtom(isMiniSidebarOpenedAtom);

  return (
    <Button 
          className=""
          onClick={() => setIsMiniSidebarOpened(!isMiniSidebarOpened)}
        > {
          isMiniSidebarOpened ? "Close" : "Open"
        }</Button>
  );
}