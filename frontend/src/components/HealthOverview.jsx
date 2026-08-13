function HealthOverview({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="card p-5">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-3">
            <stat.icon className="w-5 h-5 text-primary-600" />
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">{stat.value}</p>
          <p className="text-sm font-medium text-gray-500 mt-1">{stat.label}</p>
          {stat.subtext && <p className="text-xs text-gray-400 mt-1 leading-snug">{stat.subtext}</p>}
        </div>
      ))}
    </div>
  )
}

export default HealthOverview