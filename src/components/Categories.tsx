import { Shirt, Shirt as KurtaIcon, Shirt as SuitIcon } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface CategoriesProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

function Categories({ selectedCategory, setSelectedCategory }: CategoriesProps) {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, ease: 'easeOut', duration: 0.5 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const categories = [
    {
      name: 'Kurtis',
      icon: Shirt,
      color: 'bg-pink-100',
      iconColor: 'text-pink-600',
      subcategories: []
    },
    {
      name: 'Co-ord Sets',
      icon: KurtaIcon,
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
      subcategories: []
    },
    {
      name: 'A line 2 piece sets',
      icon: SuitIcon,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
      subcategories: []
    },
    {
      name: '3 piece cotton sets',
      icon: Shirt,
      color: 'bg-green-100',
      iconColor: 'text-green-600',
      subcategories: []
    },
    {
      name: 'Plus size 3 piece cotton sets',
      icon: KurtaIcon,
      color: 'bg-orange-100',
      iconColor: 'text-orange-600',
      subcategories: []
    }
  ];

  return (
    <motion.section className="py-8 md:py-12 px-4 bg-[#FFD6E0] mt-8" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={containerVariants}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center">
          Shop by Category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isActive = activeCategory === index;
            const isSelected = selectedCategory === category.name;

            return (
              <motion.div
                key={index}
                className="relative group cursor-pointer"
                onMouseEnter={() => setActiveCategory(index)}
                onMouseLeave={() => setActiveCategory(null)}
                onClick={() => setSelectedCategory(isSelected ? null : category.name)} // Toggle off if already selected
                variants={cardVariants}
              >
                <div className={`flex flex-col items-center space-y-3 p-6 rounded-xl transform transition-all duration-200 ${isActive || isSelected ? 'bg-white shadow-lg -translate-y-0' : 'bg-white/50 hover:-translate-y-1 hover:shadow-lg'} ${isSelected ? 'ring-2 ring-pink-400' : ''}`}>
                  <div className={`${category.color} p-3 rounded-full group-hover:scale-110 transition transform ${(isActive || isSelected) ? 'scale-110 shadow-md' : 'shadow-sm'} hover:shadow-lg`}>
                    <Icon className={`h-7 w-7 ${category.iconColor}`} />
                  </div>
                  <span className={`text-lg font-semibold text-center ${isSelected ? 'text-pink-700' : 'text-gray-800'}`}>
                    {category.name}
                  </span>

                  {(isActive || isSelected) && category.subcategories && category.subcategories.length > 0 && (
                    <div className="w-full mt-3 pt-3 border-t border-gray-200">
                      <ul className="space-y-2">
                        {category.subcategories.map((subcategory, idx) => (
                          <li key={idx} className="text-center">
                            <a
                              href="#"
                              className="text-sm text-gray-700 hover:text-pink-600 transition block py-1"
                              onClick={(e) => e.preventDefault()}
                            >
                              {subcategory}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

export default Categories;
