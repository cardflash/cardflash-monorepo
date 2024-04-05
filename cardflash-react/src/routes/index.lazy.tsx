import { useI18nContext } from "@/i18n/i18n-react";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const { LL } = useI18nContext();
  return (
    <div className="flex flex-col justify-center items-start max-w-xl mx-auto">
      <h1 className="text-3xl xl:text-5xl font-black mt-4">
        {LL.ROUTES.HOME()}
      </h1>
      <div className="h-full w-full">Hi!</div>
    </div>
  );
}
