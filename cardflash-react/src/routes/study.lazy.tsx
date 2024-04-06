import { CardContext } from "@/card-context";
import { CardStack } from "@/components/CardStack";
import { useI18nContext } from "@/i18n/i18n-react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useContext } from "react";

export const Route = createLazyFileRoute("/study")({
  component: Study,
});

function Study() {
  const { LL } = useI18nContext();
  const { cards } = useContext(CardContext);
  return (
    <div className="flex flex-col justify-center items-start max-w-xl mx-auto">
      <h1 className="text-3xl xl:text-5xl font-black mt-4">
        {LL.ROUTES.STUDY()}
      </h1>
      <div className="h-full w-full">
        <div className="text-center w-full">
          <CardStack items={cards} />
        </div>
      </div>
    </div>
  );
}
