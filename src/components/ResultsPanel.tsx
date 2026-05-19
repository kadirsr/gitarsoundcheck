import type { PracticeState } from "../types";

type Props = {
  state: PracticeState;
  totalNotes: number;
};

export function ResultsPanel({ state, totalNotes }: Props) {
  if (state.status !== "completed") {
    return null;
  }

  const accuracy =
    state.correctCount + state.wrongCount === 0
      ? 100
      : Math.round((state.correctCount / (state.correctCount + state.wrongCount)) * 100);

  return (
    <section className="rounded border border-action/40 bg-action/10 p-4">
      <h2 className="text-lg font-semibold text-white">Exercise complete</h2>
      <p className="mt-1 text-sm text-emerald-100">
        {state.correctCount}/{totalNotes} notes completed with {accuracy}% accuracy.
      </p>
    </section>
  );
}
