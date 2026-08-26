function RecentActivity({ activities }) {
  return (
    <div className="relative">
      <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gray-200 dark:bg-white/10" />

      <div className="space-y-0">
        {activities.map((item, index) => {
          const ItemIcon = item.icon
          return (
            <div key={index} className="relative flex items-start gap-4 pl-8 pb-6 last:pb-0">
              <div
                className={`relative z-10 flex-shrink-0 w-6 h-6 rounded-full ${item.color} flex items-center justify-center ring-4 ring-white dark:ring-[#07111F]`}
              >
                <ItemIcon className="w-3 h-3 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecentActivity
