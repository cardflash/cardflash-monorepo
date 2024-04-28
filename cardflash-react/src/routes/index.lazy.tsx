import { CardStack } from "@/components/CardStack";
import { useI18nContext } from "@/i18n/i18n-react";
import { getSampleCards } from "@/lib/sample-cards";
import { Link, createLazyFileRoute } from "@tanstack/react-router";

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
      <div className="h-full w-full text-4xl mt-12">
        <h2 className="text-3xl font-bold">
          {LL.HOME.WELCOME()}{" "}
          <span className="font-black bg-gradient-to-tr from-orange-500 to-yellow-400 text-transparent bg-clip-text ">
            cardflash
          </span>
          !
        </h2>
        <br />
        <p className="text-2xl">
          {LL.HOME.ADD_FIRST_COLLECTION()}{" "}
          <Link to="/collections" className="underline hover:text-blue-600">
            {LL.HOME.HERE()}
          </Link>
          .
        </p>
        <br />
        <p className="text-2xl">
          {LL.HOME.STUDY_FLASHCARDS()}{" "}
          <Link to="/study" className="underline hover:text-blue-600">
            {LL.HOME.HERE()}
          </Link>
          .
        </p>
      </div>

      <div className="h-full w-full mt-12 pb-2 border-t-2 pt-12">
        <h3 className="text-2xl font-bold">{LL.HOME.EXAMPLE_FLASHCARDS()}</h3>
        <p className="text-xl mt-1">{LL.HOME.EXAMPLE_FLASHCARDS_DESC()}</p>
        <div className="text-center w-full mt-2">
          <CardStack items={getSampleCards(LL)} />
        </div>
      </div>
    </div>
  );
}
