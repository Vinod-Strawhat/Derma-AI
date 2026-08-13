function PredictionList({ predictions }) {
  return (
    <div className="space-y-3">
      {predictions.map((prediction, index) => {
        const percentage = (prediction.probability * 100).toFixed(1)
        const isTop = index === 0

        return (
          <div
            key={`${prediction.className}-${index}`}
            className={`rounded-xl border p-4 transition-colors ${
              isTop
                ? 'border-primary-100 bg-primary-50/60'
                : 'border-gray-100 bg-gray-50/60'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-bold text-primary-400 flex-shrink-0">
                  #{index + 1}
                </span>
                <span className={`text-sm font-medium truncate ${isTop ? 'text-gray-900' : 'text-gray-700'}`}>
                  {prediction.className}
                </span>
              </div>
              <span className={`text-sm font-semibold flex-shrink-0 ${isTop ? 'text-primary-700' : 'text-gray-500'}`}>
                {percentage}%
              </span>
            </div>

            <div className="h-2 rounded-full bg-gray-200/70 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  isTop
                    ? 'bg-gradient-to-r from-primary-500 to-medical-500'
                    : 'bg-gray-400/60'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PredictionList