import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SyntheticEvent, useEffect, useState } from "react";
import Spinner from "./Spinner";
import { useI18nContext } from "@/i18n/i18n-react";

type AlertHelperProps<T> =
  | {
      mode?: "normal";
      trigger: React.ReactNode;
      title: React.ReactNode;
      initialData: T;
      content: React.FC<{
        data: T;
        setData: (data: T) => unknown;
        submit: (ev: SyntheticEvent) => unknown;
      }>;
      submitAction: React.ReactNode;
      onCancel?: () => unknown;
      onSubmit: (data: T, ev: SyntheticEvent) => unknown;
    }
  | {
      mode: "promise";
      trigger: React.ReactNode;
      title: React.ReactNode;
      initialData: T;
      content: React.FC<{
        data: T;
        setData: (data: T) => unknown;
        submit: (ev: SyntheticEvent) => unknown;
      }>;
      submitAction: React.ReactNode;
      onCancel?: () => unknown;
      onSubmit: (data: T, ev: SyntheticEvent) => Promise<unknown>;
    };

export default function AlertHelper<T>(props: AlertHelperProps<T>) {
  const [data, setData] = useState<T>(props.initialData);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { LL } = useI18nContext();

  useEffect(() => {
    setData(props.initialData);
  }, [props.initialData]);

  function onSubmit(ev: SyntheticEvent) {
    if (props.mode === "promise") {
      ev.preventDefault();
      setLoading(true);
      void props
        .onSubmit(data, ev)
        .then((res) => {
          if (res !== false) {
            setOpen(false);
            setData(props.initialData);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      props.onSubmit(data, ev);
      setData(props.initialData);
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o && props.onCancel != null) {
          props.onCancel();
        }
        setData(props.initialData);
      }}
    >
      <AlertDialogTrigger
        asChild
        onClick={(ev) => {
          ev.preventDefault();
          setOpen((o) => !o);
        }}
      >
        {props.trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{props.title}</AlertDialogTitle>
          {/* <AlertDialogDescription> */}
          <div className="text-sm text-gray-700 dark:text-gray-100">
            {props.content({ data, setData, submit: (ev) => onSubmit(ev) })}
          </div>
          {/* </AlertDialogDescription> */}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{LL.CANCEL()}</AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={(ev) => onSubmit(ev)}>
            {loading && <Spinner />}
            {props.submitAction}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
