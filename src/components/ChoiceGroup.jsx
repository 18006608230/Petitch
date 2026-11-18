export default function ChoiceGroup({ options, value, onSelect }) {
  return (
    <div className="flex flex-col gap-3" role="radiogroup">
      {options.map((option) => {
        const selected = option.id === value
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onSelect(option.id)}
            className={`flex items-center justify-between gap-3 rounded-card border-2 px-5 py-4 text-left text-base leading-relaxed transition-colors ${
              selected
                ? 'border-warm-500 bg-warm-100 font-semibold text-warm-700'
                : 'border-warm-200 bg-white text-ink active:bg-warm-50'
            }`}
          >
            <span>{option.label}</span>
            {selected && <span aria-hidden="true">✓ 已选</span>}
          </button>
        )
      })}
    </div>
  )
}
