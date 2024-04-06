import { Progress } from "@/components/ui/progress";
import { useI18nContext } from "@/i18n/i18n-react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  IoCheckmarkCircleOutline,
  IoCheckmarkDoneCircleOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { TiArrowBackOutline } from "react-icons/ti";
import { Button } from "./ui/button";
import { Card } from "@/card-context";
const MAX_NUMBER_OF_CARDS_SHOWN = 7;
const spring = {
  type: "spring",
  stiffness: 300,
  damping: 40,
  duration: 1.0,
};

export const CardStack = ({
  items,
  offset,
  scaleFactor,
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
}) => {
  const CARD_OFFSET = offset || 6;
  const SCALE_FACTOR = scaleFactor || 0.04;
  const [cards, setCards] = useState(items.map((c) => ({ ...c, score: 0.0 })));
  const [flipped, setFlipped] = useState(false);

  const totalNumberOfCards = useMemo(() => {
    return items.length;
  }, [items]);
  const { LL } = useI18nContext();

  return (
    <div className="w-full h-full">
      <h2 className="text-lg text-left mb-2">
        {cards.length === totalNumberOfCards
          ? LL.NUM_CARDS_SCHEDULED(totalNumberOfCards)
          : LL.OF_NUM_CARDS_DONE({
              numDone: totalNumberOfCards - cards.length,
              numTotal: totalNumberOfCards,
            })}
      </h2>
      <Progress value={100 * (1 - cards.length / totalNumberOfCards)} />
      <div className="relative h-64 w-[25rem] mx-auto max-w-full sm:mx-auto sm:h-52 sm:w-80 md:h-60 md:w-96 xl:w-[32rem] xl:h-[21rem] mt-[4rem]">
        {cards.length === 0 && <div>{LL.STUDY.NO_CARDS()}</div>}
        {cards.map((card, index) =>
          index > MAX_NUMBER_OF_CARDS_SHOWN ? null : (
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
                <div
                  className="select-none h-full"
                  style={{
                    perspective: "1200px",
                    transformStyle: "preserve-3d",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <motion.div
                    className="border p-2 text-left rounded-lg border-gray-300 dark:border-neutral-800 bg-gray-50 dark:bg-slate-950 shadow-xl"
                    animate={{ rotateY: flipped && index === 0 ? -180 : 0 }}
                    transition={spring}
                    style={{
                      width: "100%",
                      height: "100%",
                      zIndex: flipped && index === 0 ? 0 : 1,
                      backfaceVisibility: "hidden",
                      position: "absolute",
                    }}
                  >
                    <h2 className="text-3xl font-semibold">
                      {LL.STUDY.QUESTION()}
                    </h2>
                    {typeof card.front === "string" && (
                      <div
                        className="pl-1 pt-1 max-h-full"
                        dangerouslySetInnerHTML={{ __html: card.front }}
                      ></div>
                    )}
                    {typeof card.front !== "string" && (
                      <div className="pl-1 pt-1 max-h-full">{card.front}</div>
                    )}
                  </motion.div>
                  <motion.div
                    className="border p-2 h-full overflow-auto text-left rounded-lg border-gray-300 dark:border-slate-700 bg-green-50 dark:bg-slate-900 shadow-lg"
                    initial={{ rotateY: 180 }}
                    animate={{ rotateY: flipped && index === 0 ? 0 : 180 }}
                    transition={spring}
                    style={{
                      width: "100%",
                      height: "100%",
                      zIndex: flipped ? 1 : 0,
                      backfaceVisibility: "hidden",
                      position: "absolute",
                    }}
                  >
                    <h2 className="text-3xl font-semibold">
                      {LL.STUDY.ANSWER()}
                    </h2>
                    {typeof card.back === "string" && (
                      <div
                        className="pl-1 pt-1 max-h-full"
                        dangerouslySetInnerHTML={{ __html: card.back }}
                      ></div>
                    )}
                    {typeof card.back !== "string" && (
                      <div className="pl-1 pt-1 max-h-full">{card.back}</div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ),
        )}
      </div>
      {cards.length > 0 && (
        <AnswerBar
          show={flipped}
          onFlip={() => setFlipped((f) => !f)}
          onAnswer={(answer) => {
            setCards((prevCards) => {
              const newArray = [...prevCards];
              newArray[0] = { ...newArray[0] };
              newArray[0].score +=
                answer === "EASY"
                  ? 1.0
                  : answer === "GOOD"
                  ? 0.5
                  : answer === "HARD"
                  ? -0.1
                  : -0.5;
              if (newArray[0].score >= 1.0) {
                newArray.shift();
              } else {
                newArray.push(newArray.shift()!);
              }
              return newArray;
            });
            setFlipped(false);
          }}
        />
      )}
    </div>
  );
};

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
  const { LL } = useI18nContext();
  return (
    <div className="h-[5rem] relative">
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
            }}
          >
            {answerOption.icon({
              size: 32,
              // Note: Those only work because they are also used above;
              // Otherwise tailwind would not pick them up
              className: "text-[var(--color-bg-dark)] dark:text-[var(--color)]",
            })}
            {LL.STUDY.ANSWER_OPTIONS[answerOption.name]()}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
