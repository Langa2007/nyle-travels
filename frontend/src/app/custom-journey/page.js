'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiCompass,
  FiHeart,
  FiMapPin,
  FiSend,
  FiShield,
  FiStar,
  FiUsers,
} from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { contactAPI } from '@/lib/api';

const journeyStyles = [
  'Safari and wildlife',
  'Beach and island escape',
  'Honeymoon romance',
  'Family celebration',
  'Culture and food',
  'Wellness and slow travel',
];

const promiseCards = [
  {
    icon: FiCompass,
    title: 'Bespoke Route Design',
    copy: 'Every stop earns its place, from private transfers to the quiet hour before sunset.',
  },
  {
    icon: FiShield,
    title: 'Handled End to End',
    copy: 'Hotels, guides, flights, excursions, and local details are coordinated with a single brief.',
  },
  {
    icon: FiStar,
    title: 'Luxury Without Guesswork',
    copy: 'We match the mood you want, not just the destination you name.',
  },
];

const initialForm = {
  name: '',
  email: '',
  phone: '',
  destination: '',
  travelWindow: '',
  travelers: '',
  budget: '',
  pace: 'Balanced luxury',
  occasion: '',
  planningStage: 'I have a dream destination',
  styles: [],
  message: '',
};

export default function CustomJourneyPage() {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const toggleStyle = (style) => {
    setFormData((current) => {
      const hasStyle = current.styles.includes(style);
      return {
        ...current,
        styles: hasStyle
          ? current.styles.filter((item) => item !== style)
          : [...current.styles, style],
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const message = [
      'Custom journey request',
      `Destination: ${formData.destination}`,
      `Travel window: ${formData.travelWindow || 'Flexible'}`,
      `Travelers: ${formData.travelers || 'Not specified'}`,
      `Budget range: ${formData.budget || 'Not specified'}`,
      `Preferred pace: ${formData.pace}`,
      `Occasion: ${formData.occasion || 'Not specified'}`,
      `Planning stage: ${formData.planningStage}`,
      `Journey style: ${formData.styles.length ? formData.styles.join(', ') : 'Not specified'}`,
      `Notes: ${formData.message || 'No extra notes shared.'}`,
    ].join('\n');

    try {
      await contactAPI.submitContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        interest: 'Custom Journey Request',
        message,
      });
      setIsSubmitted(true);
      setFormData(initialForm);
      toast.success('Your private journey brief has been sent.');
    } catch (error) {
      console.error('Failed to submit custom journey:', error);
      toast.error(error.response?.data?.message || 'We could not send your brief. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-white via-primary-50/45 to-white text-gray-950">
      <section className="relative min-h-[92vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1920&q=85"
          alt="Luxury safari landscape at golden hour"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 via-secondary-900/65 to-primary-900/20" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />

        <div className="relative z-10 flex min-h-[92vh] items-center">
          <div className="container mx-auto px-4 py-28">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              className="max-w-3xl text-white"
            >
              <Link
                href="/"
                className="mb-8 inline-flex min-h-[44px] items-center rounded-full border border-white/25 bg-white/10 px-4 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <FiArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Back to Nyle
              </Link>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-200">
                Private Journey Atelier
              </p>
              <h1 className="mt-5 font-serif text-5xl font-bold leading-[1.05] md:text-7xl">
                Your place is not missing. It is waiting to be designed.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 md:text-xl">
                Tell us where your imagination is pointing, even if it is not listed on our site. We will shape the route, rhythm, stays, and signature moments into a tailor-made Nyle proposal.
              </p>
              <div className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-3">
                {[
                  ['48h', 'proposal direction'],
                  ['Private', 'travel consult'],
                  ['End-to-end', 'itinerary care'],
                ].map(([value, label]) => (
                  <div key={value} className="border-l border-primary-300/80 pl-4">
                    <div className="font-serif text-3xl font-bold">{value}</div>
                    <div className="mt-1 text-sm uppercase tracking-[0.18em] text-white/70">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <motion.aside
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary-700">
                  Beyond the Catalogue
                </p>
                <h2 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-5xl">
                  Begin with a wish. We will make it travel-ready.
                </h2>
                <p className="mt-5 text-lg leading-8 text-gray-700">
                  This brief is for the trip you almost closed the tab for because you could not find the exact place, pace, or feeling. Give us the raw idea. Our consultants will refine the rest.
                </p>
              </div>

              <div className="grid gap-4">
                {promiseCards.map(({ icon: Icon, title, copy }) => (
                  <div key={title} className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-50 to-secondary-50 text-primary-700">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-bold">{title}</h3>
                        <p className="mt-2 leading-7 text-gray-600">{copy}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.aside>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7 }}
              className="rounded-[2rem] border border-primary-100 bg-white p-5 shadow-2xl shadow-primary-900/10 sm:p-8 lg:p-10"
            >
              {isSubmitted ? (
                <div className="flex min-h-[620px] flex-col items-center justify-center text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-700">
                    <FiCheckCircle className="h-10 w-10" aria-hidden="true" />
                  </div>
                  <h2 className="font-serif text-4xl font-bold">Your brief is on our desk.</h2>
                  <p className="mt-4 max-w-lg text-lg leading-8 text-gray-600">
                    Thank you. A Nyle consultant will review your destination, travel style, and timing, then reach out with the next steps.
                  </p>
                  <Button
                    variant="outline"
                    size="lg"
                    className="mt-8"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Send Another Brief
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-7">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-secondary-700">
                      Custom Trip Brief
                    </p>
                    <h2 className="mt-3 font-serif text-3xl font-bold md:text-4xl">
                      Where should we take you?
                    </h2>
                    <p className="mt-3 leading-7 text-gray-600">
                      Share as much as you know. Flexible answers are welcome.
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Full name" htmlFor="name" required>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Your name"
                      />
                    </Field>
                    <Field label="Email address" htmlFor="email" required>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="you@example.com"
                      />
                    </Field>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Phone number" htmlFor="phone">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="+254 ..."
                      />
                    </Field>
                    <Field label="Who is traveling?" htmlFor="travelers">
                      <input
                        id="travelers"
                        name="travelers"
                        type="text"
                        value={formData.travelers}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="2 adults, 1 child, friends, solo..."
                      />
                    </Field>
                  </div>

                  <Field label="Place you want to go" htmlFor="destination" required>
                    <div className="relative">
                      <FiMapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-600" aria-hidden="true" />
                      <input
                        id="destination"
                        name="destination"
                        type="text"
                        required
                        value={formData.destination}
                        onChange={handleChange}
                        className="input-field pl-12"
                        placeholder="A destination, hotel, island, reserve, country, or dream idea"
                      />
                    </div>
                  </Field>

                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="When are you thinking?" htmlFor="travelWindow">
                      <div className="relative">
                        <FiCalendar className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-600" aria-hidden="true" />
                        <input
                          id="travelWindow"
                          name="travelWindow"
                          type="text"
                          value={formData.travelWindow}
                          onChange={handleChange}
                          className="input-field pl-12"
                          placeholder="Dates, month, season, or flexible"
                        />
                      </div>
                    </Field>
                    <Field label="Comfortable budget range" htmlFor="budget">
                      <input
                        id="budget"
                        name="budget"
                        type="text"
                        value={formData.budget}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Per person or total estimate"
                      />
                    </Field>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <Field label="How should the trip feel?" htmlFor="pace">
                      <select
                        id="pace"
                        name="pace"
                        value={formData.pace}
                        onChange={handleChange}
                        className="input-field cursor-pointer bg-white"
                      >
                        <option>Balanced luxury</option>
                        <option>Slow and private</option>
                        <option>Adventure packed</option>
                        <option>Family friendly</option>
                        <option>Ultra-luxury and seamless</option>
                      </select>
                    </Field>
                    <Field label="Planning stage" htmlFor="planningStage">
                      <select
                        id="planningStage"
                        name="planningStage"
                        value={formData.planningStage}
                        onChange={handleChange}
                        className="input-field cursor-pointer bg-white"
                      >
                        <option>I have a dream destination</option>
                        <option>I know the dates, not the route</option>
                        <option>I need suggestions from scratch</option>
                        <option>I want to upgrade an existing plan</option>
                      </select>
                    </Field>
                  </div>

                  <Field label="Occasion or reason for travel" htmlFor="occasion">
                    <div className="relative">
                      <FiHeart className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-600" aria-hidden="true" />
                      <input
                        id="occasion"
                        name="occasion"
                        type="text"
                        value={formData.occasion}
                        onChange={handleChange}
                        className="input-field pl-12"
                        placeholder="Birthday, honeymoon, anniversary, retreat, family break..."
                      />
                    </div>
                  </Field>

                  <fieldset>
                    <legend className="mb-3 text-sm font-semibold text-gray-800">
                      What should we include?
                    </legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {journeyStyles.map((style) => {
                        const selected = formData.styles.includes(style);
                        return (
                          <label
                            key={style}
                            className={`flex min-h-[52px] cursor-pointer items-center rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                              selected
                                ? 'border-primary-500 bg-primary-50 text-primary-800'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => toggleStyle(style)}
                              className="mr-3 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            {style}
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  <Field label="Details that would make it unforgettable" htmlFor="message">
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="input-field resize-none"
                      placeholder="Tell us about must-see places, hotel style, dietary needs, accessibility needs, preferred flight class, surprise moments, or anything you want handled quietly."
                    />
                  </Field>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isSubmitting}
                    icon={FiSend}
                    iconPosition="right"
                  >
                    Send My Journey Brief
                  </Button>

                  <p className="text-center text-xs leading-6 text-gray-500">
                    By submitting this form, you agree to our{' '}
                    <Link href="/privacy" className="underline transition-colors hover:text-primary-700">
                      Privacy Policy
                    </Link>
                    . Your brief is used only to prepare your travel consultation.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 rounded-[2rem] bg-gradient-to-r from-primary-900 via-secondary-900 to-primary-800 p-6 text-white shadow-2xl shadow-primary-900/20 md:grid-cols-3 md:p-8">
            {[
              [FiMapPin, 'Name the place', 'A country, lodge, coast, event, or half-formed idea is enough.'],
              [FiUsers, 'Share the people', 'We tune the pace for couples, families, solo guests, or groups.'],
              [FiCheckCircle, 'Receive the direction', 'A consultant follows up with a refined route and next steps.'],
            ].map(([Icon, title, copy]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <Icon className="h-6 w-6 text-primary-200" aria-hidden="true" />
                <h3 className="mt-4 font-serif text-2xl font-bold">{title}</h3>
                <p className="mt-2 leading-7 text-white/70">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, htmlFor, required = false, children }) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-gray-800">
        {label}
        {required && <span className="ml-1 text-primary-700">*</span>}
      </label>
      {children}
    </div>
  );
}
