import { Progress } from "@/components/ui/progress";
import { useI18nContext } from "@/i18n/i18n-react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  IoCheckmarkCircleOutline,
  IoCheckmarkDoneCircleOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { TiArrowBackOutline } from "react-icons/ti";
import { Button } from "./ui/button";

import { Flashcard, updateFlashcard } from "@/lib/storage";
import renderMathInElement from "katex/contrib/auto-render";
import "katex/dist/katex.min.css";
import { LuDices } from "react-icons/lu";
import Card from "./Card";
const MAX_NUMBER_OF_CARDS_SHOWN = 7;
const spring = {
  type: "spring",
  stiffness: 300,
  damping: 40,
  duration: 1.0,
};
function getStudyDate(d: Date) {
  return new Date(d.toDateString());
}

function getDate(d: Date) {
  // TODO: Decide whether to use UTC here
  // return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function daysBetween(d1: Date, d2: Date) {
  const utc1 = getDate(d1);
  const utc2 = getDate(d2);
  return Math.round((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

function getLocalScore(card: Flashcard, studyAhead = 0) {
  const now = new Date();
  const date = getStudyDate(new Date(card.scheduling.lastReview));
  const dayDiff = daysBetween(date, now) + studyAhead;
  const expScore = Math.min(
    Math.min(Math.pow(1.5, card.scheduling.score), 13 * 1.5) / (dayDiff * 1.5),
    card.scheduling.score,
  );
  // For debugging/tweaking score
  // TODO: Remove at some point
  console.log({ card, expScore, dayDiff, score: card.scheduling.score });
  // If last updated today
  if (dayDiff === 0 && card.scheduling.score >= 1.0) {
    return 1;
  }
  return expScore;
}

const CardStack = ({
  items,
  offset,
  scaleFactor,
}: {
  items: Flashcard[];
  offset?: number;
  scaleFactor?: number;
}) => {
  const CARD_OFFSET = offset || 6;
  const SCALE_FACTOR = scaleFactor || 0.04;

  function updateCurrentFlashcardScore(
    ease: EASE_OPTIONS,
    info: { card: Flashcard; localScore: number },
  ) {
    let newScore = info.localScore;
    const globalScoreBefore = info.card.scheduling.score;
    let newGlobalScore = globalScoreBefore;
    switch (ease) {
      case "AGAIN":
        newScore = -0.1;
        if (globalScoreBefore > 2) {
          newGlobalScore = globalScoreBefore / 4 - 1;
        } else {
          newGlobalScore = -2;
        }
        break;
      case "HARD":
        newScore += 0.3334;
        newGlobalScore += 0.3334;
        break;
      case "GOOD":
        newScore += 0.5;
        newGlobalScore += 0.5;
        break;
      case "EASY":
        newScore += 1;
        newGlobalScore += 1;
        break;
    }
    info.card.scheduling = { score: newGlobalScore, lastReview: Date.now() };
    info.localScore = newScore;
    updateFlashcard(info.card);

    const newCards = cards.filter((c) => c.localScore < 1);
    let newIndex = Math.floor(newCards.length * Math.random());
    if (newIndex <= 2) {
      newIndex = newCards.length - 1;
    }
    const nextCard = newCards[newIndex];
    newCards[newIndex] = { ...info };
    newCards[0] = { ...nextCard };
    setCards([...newCards]);
  }
  const memoItems = useMemo(
    () =>
      items
        // TODO: Update scoring
        .map((card) => ({ card, localScore: getLocalScore(card) }))
        .filter(({ localScore }) => localScore < 1)
        .map((c) => {
          console.log("useState");
          return c;
        }),
    [items],
  );
  const [cards, setCards] = useState(memoItems);
  const [flipped, setFlipped] = useState(false);

  const totalNumberOfCards = useMemo(() => {
    return items
      .map((card) => ({ card, localScore: getLocalScore(card) }))
      .filter(({ localScore }) => localScore < 1).length;
  }, [items]);
  const { LL } = useI18nContext();

  const activeCardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setCards(
      items
        .map((card) => ({ card, localScore: getLocalScore(card) }))
        .filter(({ localScore }) => localScore < 1),
    );
  }, [items]);
  useEffect(() => {
    if (activeCardRef.current) {
      renderMathInElement(activeCardRef.current, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true },
        ],
      });
    }
  }, [cards]);

  return (
    <div className="w-full" ref={activeCardRef}>
      <h2 className="text-lg text-left mb-2">
        {cards.length === totalNumberOfCards
          ? LL.NUM_CARDS_SCHEDULED(totalNumberOfCards)
          : LL.OF_NUM_CARDS_DONE({
              numDone: totalNumberOfCards - cards.length,
              numTotal: totalNumberOfCards,
            })}
      </h2>
      <Progress value={100 * (1 - cards.length / totalNumberOfCards)} />
      <div className="relative h-64 sm:h-52 md:h-60 xl:h-[21rem] w-[25rem] mx-auto max-w-full sm:mx-auto sm:w-80md:w-96 xl:w-[32rem] mt-[4rem]">
        {cards.length === 0 && <div>{LL.STUDY.NO_CARDS()}</div>}
        {cards.map(({ card }, index) =>
          index > MAX_NUMBER_OF_CARDS_SHOWN || card == null ? null : (
            <motion.div
              key={card.id}
              className="absolute flex flex-col justify-between w-full h-full"
              style={{
                transformOrigin: "top center",
              }}
              animate={{
                top: index * -CARD_OFFSET,
                scale: 1 - index * SCALE_FACTOR,
                zIndex:
                  Math.min(cards.length, MAX_NUMBER_OF_CARDS_SHOWN) - index,
              }}
            >
              <motion.div
                className="cursor-pointer"
                onClick={
                  index === 0
                    ? () => {
                        if (flipped === true) {
                          setFlipped(false);
                        } else {
                          setFlipped(true);
                        }
                      }
                    : undefined
                }
                transition={spring}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <Card
                  card={card}
                  index={index}
                  flipped={index === 0 && flipped}

                  // visitSource={(source) => {
                  //   navigate({
                  //     to: "/collections/documents/$docID",
                  //     params: { docID: source.documentID },
                  //     search: { source: { ...source } },
                  //   });
                  // }}
                />
              </motion.div>
            </motion.div>
          ),
        )}
      </div>
      {cards.length > 0 && (
        <>
          <AnswerBar
            show={flipped}
            onFlip={() => setFlipped((f) => !f)}
            onAnswer={(answer) => {
              updateCurrentFlashcardScore(answer, cards[0]);
              setFlipped(false);
            }}
          />
          <Button
            variant="outline"
            className="mt-2 flex mx-auto gap-x-1.5"
            onClick={() => {
              const firstCards = cards
                .slice(0, MAX_NUMBER_OF_CARDS_SHOWN)
                .filter((c) => c.localScore < 1)
                .map((inner) => ({ inner, random: Math.random() }));
              firstCards.sort((a, b) => a.random - b.random);
              const laterCards = cards
                .slice(MAX_NUMBER_OF_CARDS_SHOWN)
                .map((inner) => ({ inner, random: Math.random() }));
              laterCards.sort((a, b) => a.random - b.random);
              setCards([
                ...firstCards.map(({ inner }) => inner),
                ...laterCards.map(({ inner }) => inner),
              ]);
              setFlipped(false);
            }}
          >
            {LL.SHUFFLE()} <LuDices size={18} />
          </Button>
        </>
      )}
    </div>
  );
};

type EASE_OPTIONS = "AGAIN" | "HARD" | "GOOD" | "EASY";

const ANSWER_OPTIONS = [
  {
    name: "AGAIN",
    color: "#ef4c4f",
    bg: "#fcddde",
    darkBg: "#311112",
    icon: TiArrowBackOutline,
  },
  {
    name: "HARD",
    color: "#f49953",
    bg: "#fdecdf",
    darkBg: "#322013",
    icon: IoTimeOutline,
  },
  {
    name: "GOOD",
    color: "#36ed88",
    bg: "#d9fce9",
    darkBg: "#0e301d",
    icon: IoCheckmarkCircleOutline,
  },
  {
    name: "EASY",
    color: "#31dd0b",
    bg: "#dffee0",
    darkBg: "#143214",
    icon: IoCheckmarkDoneCircleOutline,
  },
] as const;
type AnswerOption = (typeof ANSWER_OPTIONS)[number]["name"];
function AnswerBar(props: {
  show: boolean;
  onAnswer: (answer: AnswerOption) => unknown;
  onFlip: () => unknown;
}) {
  const [selected, setSelected] = useState<AnswerOption>();
  const showAnswerButton = useRef<HTMLButtonElement>(null);
  const { LL } = useI18nContext();

  useEffect(() => {
    showAnswerButton.current?.focus();
  }, []);
  return (
    <div
      className="h-[5rem] relative text-center"
      onKeyUpCapture={(ev) => {
        console.log(ev);
        if (ev.ctrlKey || ev.shiftKey || ev.metaKey) {
          return;
        }
        const number = parseInt(ev.key);
        if (
          isFinite(number) &&
          number >= 1 &&
          number <= ANSWER_OPTIONS.length
        ) {
          const answerOption = ANSWER_OPTIONS[number - 1];
          setSelected(answerOption.name);
          props.onAnswer(answerOption.name);
        }
      }}
    >
      <motion.div
        className={clsx(
          "z-10 absolute w-full h-[5rem] pt-4 ",
          props.show && "pointer-events-none",
        )}
        initial={{ opacity: 0.0 }}
        animate={{ opacity: !props.show ? 1.0 : 0.0 }}
        exit={{ opacity: 0.0 }}
        transition={{ duration: props.show ? 0.1 : 0.5 }}
      >
        <Button
          ref={showAnswerButton}
          size="lg"
          className="w-full max-w-sm h-[3.5rem]"
          onClick={() => {
            props.onFlip();
          }}
        >
          {LL.STUDY.SHOW_ANSWER()}
        </Button>
      </motion.div>
      <motion.div
        initial={false}
        className={clsx(
          "pt-4 flex justify-center gap-x-2 w-full h-[5rem]",
          !props.show && "pointer-events-none",
        )}
        animate={{ opacity: props.show || selected !== undefined ? 1 : 0.0 }}
        transition={{ duration: 0.1 }}
      >
        {ANSWER_OPTIONS.map((answerOption) => (
          <motion.button
            disabled={!props.show}
            key={answerOption.name}
            className={clsx(
              "z-20 flex flex-col items-center w-[4.5rem] text-xs font-semibold p-2 rounded-lg border",
              "border-[var(--color-bg-hover)] dark:bg-[var(--color-bg-dark)] bg-[var(--color-bg)]",
              "hover:bg-[--color-bg-hover]",
            )}
            style={
              {
                "--color-bg": answerOption.bg,
                "--color-bg-dark": answerOption.darkBg,
                "--color-bg-hover": answerOption.color + "50",
                "--color": answerOption.color,
              } as React.CSSProperties
            }
            onAnimationComplete={() => {
              if (selected === answerOption.name) {
                setSelected(undefined);
              }
            }}
            transition={{ duration: 0.4 }}
            animate={
              selected === answerOption.name
                ? { scale: 1.15, y: -100 }
                : selected === undefined
                ? { scale: 1 }
                : { opacity: 0 }
            }
            onClick={() => {
              setSelected(answerOption.name);
              props.onAnswer(answerOption.name);
              showAnswerButton.current?.focus();
            }}
          >
            <answerOption.icon
              size={32}
              className="text-[var(--color-bg-dark)] dark:text-[var(--color)]"
            />
            {LL.STUDY.ANSWER_OPTIONS[answerOption.name]()}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

export default CardStack;
