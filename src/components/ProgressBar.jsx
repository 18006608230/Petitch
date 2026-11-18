export default function ProgressBar({ index, total }) {
  const percent = Math.round(((index + 1) / total) * 100)

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-ink-soft">
        第 {index + 1} / {total} 题
      </p>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-warm-100"
        role="progressbar"
        aria-valuenow={index + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`答题进度，第 ${index + 1} 题，共 ${total} 题`}
      >
        <div className="h-full rounded-full bg-warm-500 transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
