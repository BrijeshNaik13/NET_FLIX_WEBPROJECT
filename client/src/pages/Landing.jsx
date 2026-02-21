import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, ChevronRight } from 'lucide-react'

export default function Landing() {
    const navigate = useNavigate()
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setTimeout(() => setLoaded(true), 100)
    }, [])

    const features = [
        { icon: "🎬", title: "Unlimited Movies", desc: "Stream thousands of titles" },
        { icon: "📱", title: "Watch Anywhere", desc: "On TV, laptop, tablet, phone" },
        { icon: "⬇️", title: "Download & Go", desc: "Save your favorites easily" },
        { icon: "👪", title: "Create Profiles", desc: "For everyone in your household" }
    ]

    return (
        <div className="min-h-screen bg-netflix-black overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-netflix-red/20 via-netflix-black to-purple-900/20 animate-pulse-slow" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1920&q=80')] bg-cover bg-center opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-netflix-black/80" />
                <div className="absolute inset-0 bg-gradient-to-r from-netflix-black/60 via-transparent to-netflix-black/60" />
            </div>

            {/* Navbar */}
            <nav className={`relative z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-netflix-red rounded-lg flex items-center justify-center transform rotate-12">
                        <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                    <span className="text-2xl font-bold text-white tracking-tight">STREAMFLIX</span>
                </div>
                <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-medium hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                    Sign In
                </button>
            </nav>

            {/* Hero Section */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 text-center">
                <div className={`transition-all duration-1000 delay-300 transform ${loaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
                        Unlimited Movies,
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-netflix-red via-pink-500 to-purple-600 animate-gradient">
                            Anytime, Anywhere
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Stream the latest movies, TV shows, and originals. Cancel anytime.
                    </p>

                    {/* CTA Button */}
                    <button
                        onClick={() => navigate('/login')}
                        className="group relative px-10 py-4 bg-netflix-red text-white text-xl font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-[0_0_40px_rgba(229,9,20,0.5)]"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            Get Started
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-netflix-red via-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                </div>

                {/* Features */}
                <div className={`mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto transition-all duration-1000 delay-500 transform ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-netflix-red/50 transition-all duration-300 hover:-translate-y-2"
                        >
                            <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-white text-lg font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-400 text-sm">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-netflix-black to-transparent z-10" />

            {/* Footer CTA */}
            <div className={`relative z-20 text-center pb-12 transition-all duration-1000 delay-700 transform ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <p className="text-gray-500 text-sm">
                    Ready to watch? Enter your email to create or restart your membership.
                </p>
            </div>
        </div>
    )
}
