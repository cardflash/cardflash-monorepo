import LanguageSelector from "@/components/LanguageSelector";
import { useI18nContext } from "@/i18n/i18n-react";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  const { LL } = useI18nContext();
  return (
    <div className="flex flex-col justify-center items-start max-w-xl mx-auto">
      <h1 className="text-3xl xl:text-5xl font-black mt-4">
        {LL.ROUTES.SETTINGS()}
      </h1>
      <div className="w-full">
        <div className="h-full pl-2 mt-4">
          <LanguageSelector />
          {/* {Array(1000).fill(1).map((_,i) => <span>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Praesentium iusto delectus provident ut. Eos, eaque numquam quaerat quis blanditiis molestiae neque voluptates! Veritatis iure nobis eos nesciunt, error maiores aspernatur.</span>)} */}
        </div>
      </div>
    </div>
  );
}
