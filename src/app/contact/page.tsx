'use client'
import React, { useState, useEffect } from "react";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { useAuth } from "@/app/context/AuthContext";
import { isAuthFailure, parseApiErrorMessage } from "@/lib/authSession";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";
const MAPS_APP_URL = "https://maps.app.goo.gl/PaL5kMkERPGg97bJA?g_st=iw";
const MAPS_EMBED_URL =
  "https://www.google.com/maps?q=Janouli%20Palwal%20Haryana%20121102&output=embed";

const SUBJECT_CHIPS: { value: string; label: string }[] = [
  { value: "general", label: "General" },
  { value: "product", label: "Product" },
  { value: "order", label: "Order help" },
  { value: "feedback", label: "Feedback" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Something else" },
];

const PAGE_X = "px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16";

const inputClass =
  "w-full rounded-lg border border-[#e8e4dc] bg-white px-3.5 py-2.5 text-[15px] text-[#2D2D2D] placeholder:text-[#4b2e19]/35 focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/40 focus:border-[#f5d26a] transition-shadow";

export default function ContactPage() {
  const { user, jwt, userProfile, profileRevision, redirectToLogin } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  useEffect(() => {
    if (!user || !userProfile) {
      setIsLoadingUser(false);
      return;
    }
    setIsLoadingUser(true);
    setFormData((prev) => ({
      ...prev,
      name: userProfile.username || prev.name,
      email: userProfile.email || prev.email,
      phone: userProfile.phone || prev.phone,
    }));
    setIsLoadingUser(false);
  }, [user, userProfile, profileRevision]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const cleanPhone = formData.phone.replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 10) {
        setErrorMessage('Please add a valid 10-digit mobile number.');
        setSubmitStatus('error');
        setIsSubmitting(false);
        return;
      }
      const phoneNumber = parseInt(cleanPhone, 10);
      
      if (isNaN(phoneNumber)) {
        setErrorMessage('Please add a valid mobile number.');
        setSubmitStatus('error');
        setIsSubmitting(false);
        return;
      }

      if (!formData.subject) {
        setErrorMessage('Pick a topic so we can route your message.');
        setSubmitStatus('error');
        setIsSubmitting(false);
        return;
      }
      
      const inquiryData = {
        Name: formData.name,
        Email: formData.email || null,
        Phone: phoneNumber,
        Subject: formData.subject,
        Messages: formData.message
      };

      const response = await fetch(`${BACKEND}/api/inquires`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(jwt && { 'Authorization': `Bearer ${jwt}` })
        },
        body: JSON.stringify({ data: inquiryData })
      });

      if (!response.ok) {
        const errorMsg = await parseApiErrorMessage(response, "Failed to submit inquiry");
        if (jwt && isAuthFailure(response.status, errorMsg)) {
          redirectToLogin("/contact");
          return;
        }
        setErrorMessage(errorMsg);
        throw new Error(errorMsg);
      }

      setSubmitStatus('success');
      
      if (user && userProfile) {
        setFormData({
          name: userProfile.username || '',
          email: userProfile.email || '',
          phone: userProfile.phone || '',
          subject: '',
          message: '',
        });
      } else {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <TopBar />
      <main className="min-h-screen w-full bg-[#fdfbf7] relative overflow-hidden pt-3 md:pt-4">
        <section className={`w-full pb-6 md:pb-8 ${PAGE_X}`}>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-[Pacifico] text-[#4b2e19] mb-3">
              Get in <span className="text-[#f5d26a]">touch</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-[#2D2D2D]/70 leading-relaxed max-w-3xl mx-auto">
              Questions about ghee, honey, or your order? Drop a note — we read every message and usually reply within a day or two.
            </p>
          </div>
        </section>

        <section className={`w-full pb-8 md:pb-10 border-t border-[#f0ebe3] ${PAGE_X}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-20 items-start">
            <div className="order-2 lg:order-1">
              <div className="mb-5 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-[#4b2e19]">Write to us</h2>
                <p className="text-sm md:text-base text-[#2D2D2D]/65 mt-1">
                  A name, email, and phone are enough — then tell us what&apos;s on your mind.
                </p>
              </div>

{isLoadingUser && (
                      <p className="mb-4 text-sm text-[#4b2e19]/70 flex items-center gap-2">
                        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#4b2e19]/30 border-t-[#4b2e19]" aria-hidden />
                        Filling in your saved details…
                      </p>
                    )}

                    {submitStatus === 'success' && (
                      <div className="mb-5 flex gap-3 rounded-xl bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900 ring-1 ring-emerald-200/80">
                        <span className="text-lg leading-none" aria-hidden>✓</span>
                        <p>Thanks — we&apos;ve got your message and will reply soon.</p>
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="mb-5 flex gap-3 rounded-xl bg-amber-50/90 px-4 py-3 text-sm text-amber-950 ring-1 ring-amber-200/80">
                        <span className="text-lg leading-none" aria-hidden>!</span>
                        <p>{errorMessage || 'Something went wrong. Please try again in a moment.'}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-xs font-medium uppercase tracking-wide text-[#4b2e19]/55 mb-1.5">
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            autoComplete="name"
                            className={inputClass}
                            placeholder="How should we address you?"
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-xs font-medium uppercase tracking-wide text-[#4b2e19]/55 mb-1.5">
                            Mobile
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            autoComplete="tel"
                            className={inputClass}
                            placeholder="10-digit number"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wide text-[#4b2e19]/55 mb-1.5">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          autoComplete="email"
                          className={inputClass}
                          placeholder="you@example.com"
                        />
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-[#4b2e19]/55 mb-2">
                          What&apos;s this about?
                        </p>
                        <div className="flex flex-wrap gap-2" role="group" aria-label="Message topic">
                          {SUBJECT_CHIPS.map((chip) => {
                            const selected = formData.subject === chip.value;
                            return (
                              <button
                                key={chip.value}
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({ ...prev, subject: chip.value }))
                                }
                                className={
                                  'rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ' +
                                  (selected
                                    ? 'bg-[#4b2e19] text-white shadow-sm ring-2 ring-[#4b2e19] ring-offset-1'
                                    : 'bg-[#f5f2ea] text-[#4b2e19]/85 ring-1 ring-[#e8e4dc] hover:ring-[#4b2e19]/25')
                                }
                              >
                                {chip.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-xs font-medium uppercase tracking-wide text-[#4b2e19]/55 mb-1.5">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className={`${inputClass} resize-y min-h-[120px]`}
                          placeholder="A sentence or two is perfect — add order ID if it’s about a purchase."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto sm:min-w-[200px] rounded-full bg-[#4b2e19] text-white px-8 py-3 text-[15px] font-semibold hover:bg-[#2f4f2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Sending…' : 'Send message'}
                      </button>
                    </form>

            </div>

            <div className="order-1 lg:order-2 lg:pt-2">
              <h2 className="text-xl md:text-2xl font-bold text-[#4b2e19] mb-6">Reach us directly</h2>
              <ul className="text-[15px] md:text-base">
                <li className="flex gap-4 py-5 border-t border-[#f0ebe3] first:border-t-0 first:pt-0">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5d26a]/40 text-[#4b2e19]" aria-hidden>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </span>
                  <div>
                    <a href="mailto:support@yugafarms.com" className="text-[#4b2e19] font-semibold hover:underline">support@yugafarms.com</a>
                    <p className="text-sm text-[#2D2D2D]/55 mt-1">We reply to email in 24–48 hrs on working days</p>
                  </div>
                </li>
                <li className="flex gap-4 py-5 border-t border-[#f0ebe3]">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5d26a]/40 text-[#4b2e19]" aria-hidden>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </span>
                  <div>
                    <a href="tel:+919671012177" className="text-[#4b2e19] font-semibold hover:underline">+91 96710 12177</a>
                    <p className="text-sm text-[#2D2D2D]/55 mt-1">Mon–Sat, 9am–6pm IST</p>
                  </div>
                </li>
                <li className="flex gap-4 py-5 border-t border-[#f0ebe3]">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5d26a]/40 text-[#4b2e19]" aria-hidden>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </span>
                  <p className="text-[#4b2e19] font-semibold leading-snug">Janouli, Palwal<br />Haryana 121102</p>
                </li>
              </ul>
              <p className="mt-8 text-sm md:text-base text-[#2D2D2D]/70 leading-relaxed border-t border-[#f0ebe3] pt-6">
                <span className="font-semibold text-[#4b2e19]">Need something urgent?</span>
                {' '}Call during business hours — for order issues, include your order number in the form and we&apos;ll prioritise it.
              </p>
            </div>
          </div>
        </section>

        <section className={`w-full py-8 md:py-10 border-t border-[#f0ebe3] bg-white ${PAGE_X}`}>
          <h2 className="text-xl md:text-2xl font-bold text-[#4b2e19] text-center mb-2">Visit us</h2>
          <p className="text-center text-sm md:text-base text-[#2D2D2D]/65 mb-6">Janouli, Palwal, Haryana 121102</p>
          <div className="flex justify-center w-full">
            <div className="w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(75,46,25,0.08)]">
              <iframe title="YugaFarms location map" src={MAPS_EMBED_URL} className="w-full aspect-[21/9] min-h-[220px] md:min-h-[280px] border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
          <div className="mt-5 text-center">
            <a href={MAPS_APP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full bg-[#4b2e19] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#2f4f2f] transition-colors">Open in Google Maps</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
