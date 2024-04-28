import { useI18nContext } from "@/i18n/i18n-react";
import { Flashcard } from "@/lib/storage";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import SimpleEditor from "./SimpleEditor";
import { SourceLinkAttributes } from "./simple-editor/SourceLink";

interface CardProps {
  flipped: boolean;
  index?: number;
  card: Flashcard;
  visitSource?: (source: SourceLinkAttributes) => unknown;
}

const spring = {
  type: "spring",
  stiffness: 300,
  damping: 40,
  duration: 1.0,
};

export default function Card(props: CardProps) {
  const { LL } = useI18nContext();
  return (
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
        className="border p-2 h-full overflow-auto text-left rounded-lg border-gray-300 dark:border-neutral-800 bg-gray-50 dark:bg-slate-950 shadow-xl"
        animate={{ rotateY: props.flipped ? -180 : 0 }}
        transition={spring}
        style={{
          width: "100%",
          height: "100%",
          zIndex: props.flipped ? 0 : 1,
          backfaceVisibility: "hidden",
          position: "absolute",
        }}
      >
        <SimpleEditor
          editable={false}
          content={props.card.front}
          visitSource={props.visitSource}
        />
        {/* {typeof props.card.front === "string" && (
          <div
            className="pl-1 pt-1 editor-prose h-full"
            dangerouslySetInnerHTML={{ __html: props.card.front }}
          ></div>
        )} */}
      </motion.div>
      <motion.div
        className="border flex flex-col p-2 h-full overflow-auto text-left rounded-lg border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 shadow-lg"
        initial={{ rotateY: 180 }}
        animate={{ rotateY: props.flipped ? 0 : 180 }}
        transition={spring}
        style={{
          width: "100%",
          height: "100%",
          zIndex: props.flipped ? 1 : 0,
          backfaceVisibility: "hidden",
          position: "absolute",
        }}
      >
        <SimpleEditor
          editable={false}
          content={props.card.back}
          visitSource={props.visitSource}
        />
        {/* {typeof props.card.back === "string" && (
          <div
            className="pl-1 pt-1 editor-prose"
            dangerouslySetInnerHTML={{ __html: props.card.back }}
          ></div>
        )} */}
        {props.card.pdfDocumentID && (
          <Link
            className="underline decoration-foreground/20 hover:decoration-foreground text-gray-800 dark:text-gray-200 mx-auto block mt-auto"
            to="/collections/documents/$docID"
            params={{ docID: props.card.pdfDocumentID }}
            onClick={(ev) => ev.stopPropagation()}
          >
            {LL.VIEW_PDF()}
          </Link>
        )}
      </motion.div>
    </div>
  );
}
