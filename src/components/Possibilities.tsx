"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const features = [
  { title: "Smart contracts", href: "#" },
  { title: "Cloud storage", href: "#" },
  { title: "Paying employees", href: "#" },
  { title: "Electronic voting", href: "#" },
];

export function Possibilities() {
  return (
    <div className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[#8B5CF6] font-medium"
            >
              POSSIBILITIES
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mt-4 mb-6"
            >
              What does it mean for Your business?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-400 mb-8"
            >
              We've worked with over 400 companies to build blockchain solutions for their business, and we are still growing.
            </motion.p>

            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.a
                  key={feature.title}
                  href={feature.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (index + 3) }}
                  className="text-gray-400 hover:text-white transition-colors underline underline-offset-4"
                >
                  {feature.title}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#a5f3fc]/20 to-[#8B5CF6]/20 rounded-2xl p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <span className="text-sm text-gray-400 mb-2 block">FEATURES</span>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                {process.env.NEXT_PUBLIC_APP_NAME} spreads Trust everywhere
              </h3>
              <p className="text-gray-400 mb-8">
                Our team has created blockchain solutions for over 400 companies, and we are still growing. From less paperwork and fewer disputes, to happier customers and entirely new business methods, a shared record of truth is invaluable.
              </p>
              <Link href="/register" className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
                Get Started
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3.33337 8H12.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M8 3.33337L12.6667 8.00004L8 12.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </motion.div>

            <div className="absolute opacity-20 bottom-0 -right-1/3 -translate-x-1/2 translate-y-1/4">
              <Image
                src="/bitcoin-stack.svg"
                alt="Bitcoin Stack"
                width={300}
                height={300}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}