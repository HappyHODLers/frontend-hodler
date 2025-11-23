const Roadmap = () => {
  const phases = [
    {
      phase: "Phase 1",
      title: "Chatbot + Pyth Integration",
      status: "Completed ✅",
      date: "Current - ETH Global",
      items: [
        "Conversational AI Chatbot",
        "Pyth Network real-time prices",
        "Price queries in natural language",
        "Smart price alerts system"
      ],
      color: "from-green-500 to-emerald-500",
      statusColor: "bg-green-500"
    },
    {
      phase: "Phase 2",
      title: "Transactional Features",
      status: "In Progress",
      date: "Q1 2026",
      items: [
        "Execute swaps from chat",
        "Multi-asset price comparison",
        "Portfolio value tracking",
        "Transaction history"
      ],
      color: "from-blue-500 to-cyan-500",
      statusColor: "bg-blue-500"
    },
    {
      phase: "Phase 3",
      title: "HappyHODLers Wallet",
      status: "Planned",
      date: "Q2 2026",
      items: [
        "Built-in crypto wallet",
        "Seamless chat-to-wallet integration",
        "Multi-chain support",
        "Gasless transactions"
      ],
      color: "from-yellow-400 to-orange-400",
      statusColor: "bg-yellow-500"
    },
    {
      phase: "Phase 4",
      title: "WhatsApp Integration",
      status: "Future",
      date: "Q3 2026",
      items: [
        "WhatsApp Business API",
        "Trade via WhatsApp messages",
        "Price alerts on WhatsApp",
        "Wallet creation from chat"
      ],
      color: "from-purple-500 to-pink-500",
      statusColor: "bg-purple-500"
    },
    {
      phase: "Phase 5",
      title: "Multi-Platform",
      status: "Future",
      date: "Q4 2026",
      items: [
        "Telegram bot integration",
        "Discord bot",
        "Mobile apps (iOS/Android)",
        "Browser extension"
      ],
      color: "from-pink-400 to-rose-400",
      statusColor: "bg-pink-500"
    },
    {
      phase: "Phase 6",
      title: "DeFi Ecosystem",
      status: "Future",
      date: "2027",
      items: [
        "Yield farming via chat",
        "Lending/borrowing integration",
        "NFT trading support",
        "DAO governance participation"
      ],
      color: "from-indigo-500 to-blue-500",
      statusColor: "bg-indigo-500"
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-transparent text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-3 sm:mb-4 lg:mb-6">
            Our{" "}
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
              Roadmap
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto">
            From transactional chatbot to multi-platform DeFi assistant
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 via-purple-500 to-blue-500 transform -translate-x-1/2"></div>

          {/* Phases */}
          <div className="space-y-8 sm:space-y-10 lg:space-y-12">
            {phases.map((phase, index) => (
              <div
                key={index}
                className={`relative flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-6 sm:gap-8`}
              >
                {/* Timeline dot */}
                <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className={`w-6 h-6 ${phase.statusColor} rounded-full border-4 border-gray-900 shadow-lg shadow-white/20`}></div>
                </div>

                {/* Content card */}
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:text-left lg:pl-12'} w-full`}>
                  <div className="bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/20 group">
                    {/* Status badge */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${phase.statusColor} bg-opacity-20 border border-current mb-4`}>
                      <span className={`w-2 h-2 ${phase.statusColor} rounded-full animate-pulse`}></span>
                      <span className="text-sm font-semibold">{phase.status}</span>
                    </div>

                    {/* Phase number */}
                    <div className={`text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r ${phase.color} bg-clip-text text-transparent opacity-50 mb-2`}>
                      {phase.phase}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-orange-500 group-hover:to-amber-500 transition-all duration-300">
                      {phase.title}
                    </h3>

                    {/* Date */}
                    <p className="text-gray-400 mb-4 sm:mb-6">{phase.date}</p>

                    {/* Items */}
                    <ul className={`space-y-2 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                      {phase.items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-300">
                          <span className={`w-1.5 h-1.5 bg-gradient-to-r ${phase.color} rounded-full ${index % 2 === 0 ? 'lg:order-2' : ''}`}></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden lg:block flex-1"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-16 lg:mt-20 text-center">
          <p className="text-gray-400 mb-6">Join the future of conversational DeFi</p>
          <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 text-gray-900 rounded-full font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:shadow-orange-400/50 transition-all duration-300 hover:scale-105">
            Join the Community
          </button>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
