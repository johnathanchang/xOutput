"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function HighlightButton({
  className,
  variant = "default",
  size = "default",
  highlightColor = "color-mix(in oklab, currentColor 55%, transparent)",
  highlightSize = 56,
  borderColor = "color-mix(in oklab, currentColor 58%, transparent)",
  children,
  onClick,
  ...props
}) {
  const buttonRef = React.useRef(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = React.useState(false);
  const [isClicked, setIsClicked] = React.useState(false);
  const [clickPosition, setClickPosition] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = React.useCallback(
    (e) => {
      if (!buttonRef.current || isClicked) return;
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    [isClicked]
  );

  const handleMouseEnter = React.useCallback(() => setIsHovering(true), []);

  const handleMouseLeave = React.useCallback(() => {
    setIsHovering(false);
    setIsClicked(false);
  }, []);

  const handleClick = React.useCallback(
    (e) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      setClickPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setIsClicked(true);
      onClick?.(e);
    },
    [onClick]
  );

  return (
    <Button
      ref={buttonRef}
      variant={variant}
      size={size}
      className={cn(
        "relative overflow-hidden shadow-sm transition-[border-color,box-shadow,transform]",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        borderColor: isHovering ? borderColor : undefined,
        borderWidth: isHovering ? "1px" : undefined,
      }}
      {...props}
    >
      {isHovering && !isClicked && (
        <div
          className="pointer-events-none absolute rounded-full transition-transform duration-100 ease-out"
          style={{
            left: position.x,
            top: position.y,
            width: highlightSize,
            height: highlightSize,
            backgroundColor: highlightColor,
            transform: "translate(-50%, -50%)",
            filter: "blur(24px)",
          }}
        />
      )}

      <div className="pointer-events-none absolute inset-0 rounded-md bg-current/[0.04]" />

      {isClicked && (
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            left: clickPosition.x,
            top: clickPosition.y,
            backgroundColor: highlightColor,
            transform: "translate(-50%, -50%)",
            animation: "highlight-button-ripple 0.6s ease-out forwards",
          }}
        />
      )}

      <span className="relative z-10 inline-flex items-center justify-center text-inherit">
        {children}
      </span>
    </Button>
  );
}

export { HighlightButton };
export default HighlightButton;
