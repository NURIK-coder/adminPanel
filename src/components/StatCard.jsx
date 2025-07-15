import { motion } from "motion/react";




export default function AnimatedCard({ title, value }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-2xl shadow border hover:shadow-lg transition"
    >
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-3xl font-semibold text-blue-700">{value ?? "-"}</p>
    </motion.div>   
  );
}
