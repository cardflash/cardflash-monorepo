import { CardStack } from "@/components/CardStack";
import { useI18nContext } from "@/i18n/i18n-react";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/study")({
  component: Study,
});

const CARDS = Array(10)
  .fill(1)
  .map((_, i) => ({
    id: i,
    front: (
      <p>
        Who was the {i} president of the{" "}
        {i % 2 === 0 ? "United States" : "Germany"}?
      </p>
    ),
    back: (
      <p>
        {i % 2 === 0
          ? "Born on 19.03.2000 George Musterman was the " + i + " president."
          : "While there is some discussion amongs historians, the technically correct answer is Max Mustermann"}
        {i === 5 && (
          <span>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minima aut
            quo unde necessitatibus, iste, consequatur ducimus cupiditate atque
            amet vitae odit voluptatum explicabo eaque? Voluptates, ipsum! Quo
            quos beatae numquam.
          </span>
        )}
      </p>
    ),
  }));

function Study() {
  const { LL } = useI18nContext();
  return (
    <div className="flex flex-col justify-center items-start max-w-xl mx-auto">
      <h1 className="text-3xl xl:text-5xl font-black mt-4">
        {LL.ROUTES.STUDY()}
      </h1>
      <div className="h-full w-full">
        <div className="text-center w-full max-w-xl">
          <CardStack items={CARDS} />
        </div>
      </div>
    </div>
  );
}
