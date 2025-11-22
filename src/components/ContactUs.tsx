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
          className="text-4xl md:text-6xl font-extrabold mb-6 text-center"
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
            href="https://wa.me/4917682360647"
            target="_blank"
            rel="noopener noreferrer"
            className="
    w-full py-3 rounded-full
    flex items-center justify-center gap-2
    font-medium text-white
    bg-[#25D366]
    hover:bg-[#1ebe5d]
    transition-all
  "
          >
            {/* Perfectly centered official WhatsApp Logo */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="inline-block"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.472-.149-.67.149-.198.297-.767.968-.94 1.166-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.173.198-.297.297-.495.099-.198.05-.372-.025-.521-.074-.148-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51a12.32 12.32 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.693.626.712.226 1.36.194 1.873.118.571-.085 1.758-.718 2.007-1.413.248-.695.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347m-5.471 5.505h-.001a9.87 9.87 0 0 1-5.032-1.378l-.361-.214-3.741.974.998-3.648-.237-.374a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.436-9.884 9.889-9.884 2.64 0 5.122 1.03 6.988 2.897a9.825 9.825 0 0 1 2.896 6.993c-.004 5.45-4.438 9.884-9.889 9.884m8.413-18.297A11.815 11.815 0 0 0 11.998 0C5.372 0 0 5.37 0 11.993c0 2.113.552 4.177 1.607 5.998L0 24l6.134-1.597a12 12 0 0 0 5.864 1.497h.005c6.626 0 11.998-5.37 11.998-11.993a11.88 11.88 0 0 0-3.527-8.42" />
            </svg>
            Chat via WhatsApp
          </a>
        </form>
      </div>
    </section>
  );
}
