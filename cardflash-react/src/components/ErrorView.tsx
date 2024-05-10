import { useI18nContext } from "@/i18n/i18n-react";
import { Button } from "./ui/button";
import { Link, ReactNode } from "@tanstack/react-router";

export default function ErrorView(props: {
  code?: string;
  description?: string;
  showHomeButton: boolean;
  children?: ReactNode;
}) {
  const { LL } = useI18nContext();
  return (
    <div className="flex flex-col justify-center items-center h-full text-center">
      <h1 className="text-5xl font-black text-transparent bg-gradient-to-tr from-green-500 to-cyan-500 bg-clip-text">
        {props.code ?? "400"}
      </h1>
      <h1 className="text-4xl font-black">
        {props.description ?? LL.ERROR_PAGE.ERROR()}
      </h1>
      {props.children}
      {props.showHomeButton && (
        <Link to="/">
          <Button className="my-2 block">{LL.ROUTES.HOME()}</Button>
        </Link>
      )}
    </div>
  );
}
