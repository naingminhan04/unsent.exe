"use client";

const diceFaces: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

export function DiceFace({ face, position }: { face: number; position: string }) {
  return (
    <span className={`dice-face dice-face-${position}`}>
      {Array.from({ length: 9 }, (_, index) => (
        <i
          className={diceFaces[face].includes(index) ? "pip on" : "pip"}
          key={index}
        />
      ))}
    </span>
  );
}

export function Cat({ mood = "idle" }: { mood?: "idle" | "surprised" | "shy" }) {
  return (
    <div className={`cat cat-${mood}`} aria-label="A tiny pixel cat" role="img">
      <span className="cat-ear cat-ear-left" />
      <span className="cat-ear cat-ear-right" />
      <span className="cat-face">
        <i />
        <i />
      </span>
      <span className="cat-body" />
      <span className="cat-tail" />
    </div>
  );
}

export function Doodle() {
  return (
    <svg className="doodle" viewBox="0 0 180 140" aria-hidden="true">
      <path d="M23 93c21-31 48-49 78-42 29 6 36 31 57 25" />
      <path d="M37 78c7-13 14-23 27-31M105 54c9-9 18-15 30-17" />
      <circle cx="133" cy="34" r="5" />
      <path d="M45 111c10-8 21-8 31-1M94 109c13-9 28-8 39 0" />
    </svg>
  );
}
