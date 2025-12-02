"use client";

import { Player } from "@lottiefiles/react-lottie-player";
import Confettie from "../../../../../../../public/Confetti.json";

type ConfettiAnimationProps = {
  isActive: boolean;
  onComplete: () => void;
};

export function ConfettiAnimation({
  isActive,
  onComplete,
}: ConfettiAnimationProps) {
  if (!isActive) return null;

  return (
    <Player
      src={Confettie}
      autoplay
      className="fixed left-0 top-0 z-50 h-full w-full pointer-events-none"
      onEvent={(event) => {
        if (event === "complete") {
          onComplete();
        }
      }}
    />
  );
}
