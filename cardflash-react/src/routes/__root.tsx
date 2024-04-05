import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import {
  IoAlbums,
  IoAlbumsOutline,
  IoDuplicate,
  IoDuplicateOutline,
  IoHomeOutline,
  IoHomeSharp,
  IoSettings,
  IoSettingsOutline,
} from "react-icons/io5";

import { Button } from "@/components/ui/button";
import { useI18nContext } from "@/i18n/i18n-react";

function Root() {
  const { LL } = useI18nContext();
  const LINKS = [
    {
      to: "/",
      icon: IoHomeOutline,
      filledIcon: IoHomeSharp,
      name: LL.ROUTES.HOME(),
    },
    {
      to: "/documents",
      icon: IoDuplicateOutline,
      filledIcon: IoDuplicate,
      name: LL.ROUTES.DOCUMENTS(),
    },
    {
      to: "/study",
      icon: IoAlbumsOutline,
      filledIcon: IoAlbums,
      name: LL.ROUTES.STUDY(),
    },
    {
      to: "/settings",
      icon: IoSettingsOutline,
      filledIcon: IoSettings,
      name: LL.ROUTES.SETTINGS(),
    },
  ] as const;
  return (
    <div className="h-full flex flex-col lg:flex-row-reverse">
      <main className="h-full w-full overflow-auto pt-8 px-8 text-left">
        <Outlet />
      </main>
      <div>
        {/* Desktop */}
        <div className="hidden lg:block h-full pt-2 px-4 border-r border-gray-300 shadow">
          <nav className="flex flex-col items-center h-full gap-y-3">
            {LINKS.map((link) => (
              <Tooltip key={link.to} delayDuration={200}>
                <TooltipTrigger asChild>
                  <Link
                    key={link.to}
                    to={link.to}
                    className="[&.active]:text-white dark:[&.active]:text-black h-11 w-11 flex items-center justify-center rounded-full [&.active]:bg-slate-700 dark:[&.active]:bg-slate-100 hover:bg-slate-200 dark:hover:bg-stone-800 hover:outline hover:outline-1 hover:outline-slate-400 dark:hover:outline-stone-500"
                  >
                    {link.icon({ size: 24 })}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{link.name}</TooltipContent>
              </Tooltip>
            ))}
          </nav>
        </div>
        {/* Mobile: */}
        <div className="h-[4rem]">
          <div className="border-t border-gray-400 dark:border-gray-700 lg:hidden">
            <nav className="flex justify-around items-center gap-x-2 h-[4rem]">
              {LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="[&.active]:text-zinc-900 dark:[&.active]:text-zinc-100 flex flex-col text-xs gap-y-0.5 items-center justify-center"
                >
                  {({ isActive }) => (
                    <>
                      {(isActive ? link.filledIcon : link.icon)({ size: 24 })}
                      <span className="w-[4.5rem] text-center mx-auto text-ellipsis overflow-hidden">
                        {link.name}
                      </span>
                    </>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: Root,
  notFoundComponent: function NotFound() {
    const { LL } = useI18nContext();
    return (
      <div className="flex flex-col justify-center items-center h-full text-center">
        <h1 className="text-5xl font-black text-transparent bg-gradient-to-tr from-green-500 to-cyan-500 bg-clip-text">
          404
        </h1>
        <h1 className="text-4xl font-black">{LL.ERROR_PAGE.NOT_FOUND()}</h1>
        <Link to="/">
          <Button className="my-2 block">{LL.ROUTES.HOME()}</Button>
        </Link>
      </div>
    );
  },
  errorComponent: function ErrorComponent(props) {
    const { LL } = useI18nContext();
    return (
      <>
        <div className="flex flex-col justify-center items-center h-full text-center">
          <h1 className="text-5xl font-black text-transparent bg-gradient-to-tr from-orange-500 to-red-500 bg-clip-text">
            {LL.ERROR_PAGE.ERROR()}
          </h1>
          <Button onClick={props.reset} variant="outline">
            {LL.ERROR_PAGE.RESET()}
          </Button>
          <Link to="/">
            <Button className="my-2 block">{LL.ROUTES.HOME()}</Button>
          </Link>
        </div>
      </>
    );
  },
});
