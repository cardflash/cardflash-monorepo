import { useI18nContext } from "@/i18n/i18n-react";
import { type InputHTMLAttributes, useId, ReactNode } from "react";
import { FiUpload } from "react-icons/fi";
interface FileDropZoneProps {
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  hintText?: string | ReactNode;
  onFilesSelected?: (files: File[]) => unknown;
}
export default function FileDropZone(props: FileDropZoneProps) {
  const { LL } = useI18nContext();
  const id = useId();
  return (
    <div
      className="flex items-center justify-center w-full"
      onDragOver={(ev) => {
        ev.preventDefault();
      }}
      onDrop={(ev) => {
        ev.preventDefault();
        const files = [...ev.dataTransfer.items]
          .map((f) => f.getAsFile())
          .filter((f) => f != null) as File[];
        if (props.onFilesSelected) {
          props.onFilesSelected(files);
        }
      }}
    >
      <label
        htmlFor={id}
        className="flex flex-col items-center justify-center w-full min-h-32 xl:min-h-56 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50/50 dark:bg-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-600 dark:hover:bg-gray-800"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-700 dark:text-gray-300">
          <FiUpload size={32} style={{ marginBottom: "0.5rem" }} />
          <p className="mb-2 text-sm">
            <span className="font-semibold">
              {LL.COMPONENTS.FILE_DROP_ZONE.CLICK_TO_SELECT()}
            </span>{" "}
            {LL.COMPONENTS.FILE_DROP_ZONE.OR_DROP()}
          </p>
          <p className="text-xs ">{props.hintText}</p>
        </div>
        <input
          id={id}
          type="file"
          className="hidden"
          {...props.inputProps}
          onChange={(ev) => {
            if (ev.currentTarget.files !== null) {
              if (props.onFilesSelected !== undefined) {
                props.onFilesSelected([...ev.currentTarget.files]);
              }
            }
          }}
        />
      </label>
    </div>
  );
}
