'use client';

import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { 
  FiUsers, 
  FiMap, 
  FiStar, 
  FiAward,
  FiGlobe,
  FiHeart 
} from 'react-icons/fi';

const stats = [
  {
    id: 1,
    icon: FiUsers,
    value: 10000,
    suffix: '+',
    label: 'Happy Travelers',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    icon: FiMap,
    value: 150,
    suffix: '+',
    label: 'Destinations',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 3,
    icon: FiStar,
    value: 4.9,
    suffix: '/5',
    label: 'Customer Rating',
    color: 'from-yellow-500 to-orange-500',
    decimals: 1,
  },
  {
    id: 4,
    icon: FiAward,
    value: 25,
    suffix: '+',
    label: 'Awards Won',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 5,
    icon: FiGlobe,
    value: 50,
    suffix: '+',
    label: 'Partner Hotels',
    color: 'from-red-500 to-rose-500',
  },
  {
    id: 6,
    icon: FiHeart,
    value: 98,
    suffix: '%',
    label: 'Satisfaction Rate',
    color: 'from-indigo-500 to-blue-500',
  },
];

export default function Stats() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} className="bg-white rounded-3xl shadow-2xl p-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${stat.color} mb-3`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {inView ? (
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    suffix={stat.suffix}
                    decimals={stat.decimals || 0}
                  />
                ) : (
                  '0'
                )}
              </div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}