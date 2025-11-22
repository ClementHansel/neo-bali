"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// cSpell:ignore gohighlevel
export default function ContactUs() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/gohighlevel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();

      setSent(true);
      e.currentTarget.reset();
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="contact-form"
      className="w-full bg-white text-black py-20 px-6 flex justify-center"
    >
      <div className="w-full max-w-2xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-bold mb-6 text-center"
        >
          CONTACT US
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 text-center mb-10"
        >
          Fill the form and our team will get back to you shortly.
        </motion.p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 bg-gray-50 p-8 rounded-2xl shadow-lg"
        >
          {/* Name */}
          <div>
            <label htmlFor="name" className="block mb-1 text-sm font-medium">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              required
              placeholder="John Doe"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              required
              type="email"
              placeholder="email@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block mb-1 text-sm font-medium">
              Phone / WhatsApp
            </label>
            <input
              id="phone"
              name="phone"
              required
              type="tel"
              placeholder="+62 812 3456 7890"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block mb-1 text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              placeholder="Tell us how we can help you..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Success */}
          {sent && (
            <p className="text-green-600 text-sm">
              Your message has been sent!
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 rounded-full 
              text-white bg-black hover:bg-gray-900 
              transition-all font-medium disabled:opacity-60
            "
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          {/* WhatsApp Button */}
          <a
            href="https://wa.me/6281241960867"
            target="_blank"
            rel="noopener noreferrer"
            className="
              w-full py-3 rounded-full
              text-black border border-black
              text-center hover:bg-black hover:text-white
              transition-all font-medium
            "
          >
            Chat via WhatsApp
          </a>
        </form>
      </div>
    </section>
  );
}
