import { navigatorDetector } from "typesafe-i18n/detectors";
import { LOCAL_STORAGE_LANG_KEY } from "./components/LanguageSelector";
import { Locales } from "./i18n/i18n-types";
import { loadLocaleAsync } from "./i18n/i18n-util.async";
import { useEffect, useState } from "react";
import TypesafeI18n from "./i18n/i18n-react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { TooltipProvider } from "./components/ui/tooltip";
import { detectLocale } from "./i18n/i18n-util";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const locale: Locales =
    (localStorage.getItem(LOCAL_STORAGE_LANG_KEY) as Locales | null) ||
    detectLocale(navigatorDetector);

  const [localesLoaded, setLocalesLoaded] = useState(false);
  useEffect(() => {
    loadLocaleAsync(locale as Locales).then(() => setLocalesLoaded(true));
  }, [locale]);

  if (!localesLoaded) {
    return null;
  }

  return (
    <TooltipProvider>
      <TypesafeI18n locale={locale}>
        <RouterProvider router={router} />
        {/* <TanStackRouterDevtools position="top-right" /> */}
      </TypesafeI18n>
    </TooltipProvider>
  );
}
