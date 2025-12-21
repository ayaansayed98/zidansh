import { motion } from 'framer-motion';

function Hero() {
  const heroVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <motion.section className="relative bg-[#FFD1DC] pt-8 pb-10 sm:pt-10 sm:pb-12 md:pt-14 md:pb-16 px-4 hidden md:block" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={heroVariants}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Your Body,<br />
              Your Rules
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-md mx-auto">
              Discover the finest collection of kurtis, kurti set, suits and dress
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default Hero;
