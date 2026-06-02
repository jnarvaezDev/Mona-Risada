import { type ElementType, Fragment } from "react";

import { cn } from "@/lib/utils";

type DecorativeTextProps<T extends ElementType> = {
  as?: T;
  className?: string;
  text: string;
};

export const DecorativeText = <T extends ElementType = "span">({
  as,
  className,
  text,
}: DecorativeTextProps<T>) => {
  const Component = as ?? "span";

  return (
    <Component className={cn("font-display", className)}>
      {text.split(/(\d+)/).map((part, index) => (
        /^\d+$/.test(part) ? (
          <span key={`${part}-${index}`} className="font-score">
            {part}
          </span>
        ) : (
          <Fragment key={`${part}-${index}`}>{part}</Fragment>
        )
      ))}
    </Component>
  );
};
