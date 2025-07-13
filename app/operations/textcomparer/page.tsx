'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useMotionValue, animate, useTransform, useScroll, useSpring } from 'framer-motion'

const SunIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const MoonIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
)
  
const TextWrapIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const CompareIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
)

const SparklingIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l1.5 1.5L5 6 3.5 4.5 5 3zM12 12l1.5 1.5L12 15l-1.5-1.5L12 12zM19 3l1.5 1.5L19 6l-1.5-1.5L19 3zM5 21l1.5-1.5L5 18l-1.5 1.5L5 21z" />
  </svg>
)

const ArrowRightIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

const ZapIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

export default function TextComparer() {
  const [theme, setTheme] = useState('light')
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll()

  const backgroundProgress = useMotionValue(theme === 'dark' ? 0 : 100)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const backgroundAngle = useTransform(backgroundProgress, [0, 100], [0, 360])
  const lightOpacity = useTransform(backgroundProgress, [0, 100], [0, 1])
  const darkOpacity = useTransform(backgroundProgress, [0, 100], [1, 0])
  const buttonRotation = useTransform(backgroundProgress, [0, 100], [0, 360])
  const parallaxY = useTransform(scrollY, [0, 1000], [0, -200])
  const scaleTransform = useTransform(scrollY, [0, 300], [1, 0.95])

  const springConfig = { stiffness: 300, damping: 30 }
  const smoothMouseX = useSpring(mouseX, springConfig)
  const smoothMouseY = useSpring(mouseY, springConfig)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  useEffect(() => {
    animate(backgroundProgress, theme === 'dark' ? 0 : 100, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1]
    })
  }, [theme, backgroundProgress])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      setMousePosition({ x: clientX, y: clientY })
      mouseX.set(clientX)
      mouseY.set(clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  const router = useRouter()

const handleGetStarted = () => {
  router.push('/components/transformation')
}

const playAudio = () => {
    const audio = document.getElementById("welcomeAudio") as HTMLAudioElement | null
    if (audio) {
      audio.muted = false
      audio.volume = 0
      audio.play().then(() => {
        const fadeIn = setInterval(() => {
          if (audio.volume < 1) {
            audio.volume = Math.min(audio.volume + 0.1, 1)
          } else {
            clearInterval(fadeIn)
          }
        }, 200)
      }).catch((err) => {
        console.warn("Autoplay failed:", err)
      })
    }
  }

  if (!mounted) return null

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const features = [
    { icon: TextWrapIcon, title: "Smart Text Analysis", desc: "Advanced algorithms detect differences instantly" },
    { icon: CompareIcon, title: "Side-by-Side View", desc: "Fast and accurate summary with real audio" },
    { icon: SparklingIcon, title: "AI-Powered", desc: "Machine learning enhances accuracy" },
    { icon: ZapIcon, title: "Lightning Fast", desc: "Real-time generation as per the given data" }
  ]

  return (
    <>
      <audio id="welcomeAudio" src="/welcome.mp3" preload="auto" />
      {/* Dynamic Background */}
      <motion.div
        className="fixed inset-0 -z-20"
        style={{
          background: `
            radial-gradient(circle at ${typeof window !== 'undefined' ? mousePosition.x / window.innerWidth * 100 : 50}% ${typeof window !== 'undefined' ? mousePosition.y / window.innerHeight * 100 : 50}%, 
              rgba(139, 92, 246, 0.3) 0%, 
              transparent 50%
            ),
            linear-gradient(
              ${backgroundAngle.get()}deg,
              hsl(210, 20%, 98%) 0%,
              hsl(0, 0%, 100%) 50%,
              hsl(240, 4.8%, 95.9%) 100%
            )
          `,
          opacity: lightOpacity
        }}
      />
      
      <motion.div
        className="fixed inset-0 -z-20"
        style={{
          background: `
            radial-gradient(circle at ${typeof window !== 'undefined' ? smoothMouseX.get() / window.innerWidth * 100 : 50}% ${typeof window !== 'undefined' ? smoothMouseY.get() / window.innerHeight * 100 : 50}%, 
              rgba(139, 92, 246, 0.2) 0%, 
              transparent 50%
            ),
            linear-gradient(
              ${backgroundAngle.get()}deg,
              hsl(240, 10%, 3.9%) 0%,
              hsl(240, 5.9%, 10%) 50%,
              hsl(240, 4.8%, 15.9%) 100%
            )
          `,
          opacity: darkOpacity
        }}
      />




      {/* Main Content */}
      <motion.div 
        className="min-h-screen relative overflow-hidden"
        style={{ scale: scaleTransform }}
      >
        {/* Navigation */}
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-0 right-0 z-50 p-6"
        >
          <div className="container mx-auto">
            <div className="flex justify-between items-center p-4 rounded-2xl bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl border border-white/20 shadow-2xl">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2"
              >
                <CompareIcon className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  PodifyAi
                </span>
              </motion.div>
              
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-full bg-white/20 dark:bg-gray-800/40 backdrop-blur-xl shadow-lg border border-white/30 hover:bg-white/30 dark:hover:bg-gray-700/50 transition-all duration-300"
                aria-label="Toggle theme"
                style={{ rotate: buttonRotation }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ scale: 0.8, opacity: 0, rotate: -180 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 1.2, opacity: 0, rotate: 180 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  >
                    {theme === 'dark' ? (
                      <SunIcon className="w-6 h-6 text-yellow-400" />
                    ) : (
                      <MoonIcon className="w-6 h-6 text-indigo-600" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <motion.section 
          className="pt-32 pb-20 px-6"
          style={{ y: parallaxY }}
        >
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8"
            >
              <motion.h1 
                className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-violet-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                Podify your boring blogs
                <br />
                <span className="text-5xl md:text-7xl">Like Never Before</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Experience the future of podcasts with AI-powered analysis, 
                real-time highlighting, and lightning-fast performance.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <motion.button
              onClick={() => {
                playAudio();
                handleGetStarted();
              }}
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-full font-semibold text-lg shadow-2xl hover:shadow-violet-500/25 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Start</span>
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/20 dark:bg-gray-800/40 backdrop-blur-xl text-gray-700 dark:text-gray-300 rounded-full font-semibold text-lg border border-white/30 hover:bg-white/30 dark:hover:bg-gray-700/50 transition-all duration-300"
              >
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Demo Card */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-6xl mx-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-blue-600/20 rounded-3xl blur-xl transform scale-105"></div>
              <div className="relative bg-white/10 dark:bg-gray-900/20 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="grid md:grid-cols-2 gap-8">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                      <TextWrapIcon className="w-6 h-6 mr-2 text-violet-600" />
                      Before PodifyAi
                    </h3>
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 h-32 border border-white/30">
                      <img src="https://plus.unsplash.com/premium_photo-1724061887290-8d78a124cd14?w=500&auto=format&fit=cover&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3RyZXNzJTIwc3R1ZHl8ZW58MHx8MHx8fDA%3D" alt="" className="h-full w-full object-cover" />
                    </div>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                      <CompareIcon className="w-6 h-6 mr-2 text-blue-600" />
                      After PodifyAi
                    </h3>
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 h-32 border border-white/30">
                      <img src="https://media.istockphoto.com/id/522372360/photo/having-fun-and-studying.webp?a=1&b=1&s=612x612&w=0&k=20&c=avHEzo0BLkDEAn239SCfJrGTZOlwjh8xRhZLDUi3r08=" alt="" className="h-full w-full object-cover" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-20 px-6"
        >
          <div className="container mx-auto">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Powerful Features
            </motion.h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    transition: { type: 'spring', stiffness: 400, damping: 25 }
                  }}
                  className="group"
                >
                  <div className="relative bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-blue-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-14 h-14 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300"
                      >
                        <feature.icon className="w-7 h-7 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-20 px-6"
        >
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative max-w-4xl mx-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-blue-600/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/10 dark:bg-gray-900/20 backdrop-blur-2xl rounded-3xl p-12 border border-white/20 shadow-2xl">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  Ready to Transform Your Workflow?
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of professionals who trust PodifyAi for their daily text analysis needs.
                </p>
                <motion.button
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)",
                    background: "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-10 py-5 bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-full font-semibold text-xl shadow-2xl hover:shadow-violet-500/25 transition-all duration-300 flex items-center space-x-3 mx-auto"
                >
                  <SparklingIcon className="w-6 h-6" />
                  <span onClick={() => {
                    handleGetStarted();
                    playAudio();
                    }}>Get Started Now</span>
                  <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-12 px-6 border-t border-white/20"
        >
          <div className="container mx-auto text-center">
            <p className="text-gray-600 dark:text-gray-400">
              © 2025 PodifyAi. Crafted with 💜 for AI learning enthusiasts.
            </p>
          </div>
        </motion.footer>
      </motion.div>
    </>
  )
}