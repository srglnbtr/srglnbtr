"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const CyberSceneLazy = dynamic(
  () => import("./CyberScene").then((m) => m.CyberScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[300px] w-full items-center justify-center md:h-[400px]">
        <div className="h-40 w-40 animate-pulse rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-600/20 blur-xl" />
      </div>
    ),
  },
);

export type CyberSceneDynamicProps = ComponentProps<typeof CyberSceneLazy>;

export function CyberSceneDynamic(props: CyberSceneDynamicProps) {
  return <CyberSceneLazy {...props} />;
}
