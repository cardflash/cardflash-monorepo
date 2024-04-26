import { CardStack } from "@/components/CardStack";
import { useI18nContext } from "@/i18n/i18n-react";
import { listFlashcards } from "@/lib/storage";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/study")({
  component: Study,
});

function Study() {
  const { LL } = useI18nContext();

  const { isPending, error, data } = useQuery({
    queryKey: ["flashcards"],
    queryFn: () => listFlashcards(),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="flex flex-col justify-center items-start max-w-xl mx-auto">
      <h1 className="text-3xl xl:text-5xl font-black mt-4">
        {LL.ROUTES.STUDY()}
      </h1>
      <div className="h-full w-full">
        <div className="text-center w-full">
          <CardStack items={data.length === 0 ? [] : data} />
        </div>
      </div>
    </div>
  );
}
