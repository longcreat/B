"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "./utils";

function Switch({
  className,
  checked,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent transition-colors duration-200 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden",
        className,
      )}
      style={{
        backgroundColor: checked ? '#2563eb' : '#d1d5db',
      } as React.CSSProperties}
      checked={checked}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-white pointer-events-none block size-4 rounded-full ring-0 transition-transform duration-200 ease-in-out border border-gray-300 shadow-md",
        )}
        style={{
          transform: checked ? 'translateX(14px)' : 'translateX(0)',
        } as React.CSSProperties}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
