export default function FeaturesBanner({ features }) {
    return (
      <div className="w-full bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center items-start gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center min-w-[200px] flex-1">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-wide">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  