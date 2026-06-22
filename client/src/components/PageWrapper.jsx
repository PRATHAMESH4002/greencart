import { motion } from "framer-motion";

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      className="relative min-h-screen overflow-hidden bg-[#f5f5f7]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Soft Light Glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-r from-green-200/40 via-white to-green-200/40 blur-3xl rounded-full"></div>

      {/* Subtle Gradient Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f5f5f7] to-white"></div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default PageWrapper;
