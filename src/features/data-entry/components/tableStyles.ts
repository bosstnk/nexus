export const HEAD_CELL =
  "px-4 py-3 text-left text-body-3 font-semibold truncate text-neutral-600";

export const CELL =
  "px-4 py-3 text-left text-body-2 truncate text-neutral-900";

export const NUMERIC_CELL = `${CELL} font-eng tabular-nums`;

export const ACTION_BUTTON =
  "grid size-8 cursor-pointer place-items-center rounded-lg border border-neutral-300 bg-white text-neutral-500 transition-colors";

export const ACTIONS_WIDTH = 104;

export const columnWidth = (weight: number, total: number) =>
  `calc((100% - ${ACTIONS_WIDTH}px) * ${weight} / ${total})`;

export const sumWeights = (weights: number[]) =>
  weights.reduce((sum, weight) => sum + weight, 0);
