import React, { useState } from 'react';
import { Calendar, Clock, Phone, Mail, Users, CheckCircle } from 'lucide-react';

interface ReservationWidgetProps {
  onSuccess?: () => void;
}

export default function ReservationWidget({ onSuccess }: ReservationWidgetProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [persons, setPersons] = useState('1 Person');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !date || !time) return;
    setSubmitted(true);
    if (onSuccess) onSuccess();
  };

  if (submitted) {
    return (
      <div className="bg-[#1c1917] text-white p-8 rounded-3xl border border-neutral-800 shadow-2xl flex flex-col items-center justify-center text-center h-full min-h-[420px]">
        <div className="w-16 h-16 bg-amber-500/15 rounded-full border border-amber-500/35 flex items-center justify-center text-amber-500 mb-6 animate-bounce">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl font-bold mb-3 tracking-wide">Tavolo Riservato!</h3>
        <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
          Grazie, <strong className="text-amber-500">{name}</strong>. Your reservation for <strong className="text-white">{persons}</strong> on <strong className="text-white">{date}</strong> at <strong className="text-white">{time}</strong> is confirmed.
        </p>
        <p className="text-[10px] text-amber-500/70 mt-4 font-mono uppercase tracking-widest">
          Lekki Phase 1, Lagos
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setName('');
            setEmail('');
            setPhone('');
            setDate('');
            setTime('');
          }}
          className="mt-8 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs rounded-xl uppercase tracking-wider transition-colors"
        >
          Book Another Table
        </button>
      </div>
    );
  }

  return (
    <div id="reservation-widget" className="bg-[#18181b] text-white p-6 sm:p-8 rounded-3xl border border-neutral-800 shadow-2xl relative">
      <div className="absolute top-0 right-10 w-20 h-1 bg-amber-500" />
      <h3 className="font-serif text-xl sm:text-2xl font-bold mb-1 text-white tracking-wide">
        Take A
      </h3>
      <h3 className="font-serif text-2xl sm:text-3xl font-black text-amber-500 mb-6 tracking-wide">
        Reservation
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name input */}
        <div className="relative">
          <input
            type="text"
            required
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:border-amber-500 transition-colors"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
            <Users className="w-4 h-4" />
          </span>
        </div>

        {/* Email input */}
        <div className="relative">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:border-amber-500 transition-colors"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
            <Mail className="w-4 h-4" />
          </span>
        </div>

        {/* Phone input */}
        <div className="relative">
          <input
            type="tel"
            required
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:border-amber-500 transition-colors"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
            <Phone className="w-4 h-4" />
          </span>
        </div>

        {/* Persons selection */}
        <div className="relative">
          <select
            value={persons}
            onChange={(e) => setPersons(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 text-white text-xs rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:border-amber-500 transition-colors appearance-none"
          >
            <option value="1 Person">1 Person</option>
            <option value="2 Persons">2 Persons</option>
            <option value="3 Persons">3 Persons</option>
            <option value="4 Persons">4 Persons</option>
            <option value="5+ Persons">5+ Persons</option>
          </select>
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
            <Users className="w-4 h-4" />
          </span>
        </div>

        {/* Date input */}
        <div className="relative">
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:border-amber-500 transition-colors"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
            <Calendar className="w-4 h-4" />
          </span>
        </div>

        {/* Time input */}
        <div className="relative">
          <input
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:border-[#019993] transition-colors"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
            <Clock className="w-4 h-4" />
          </span>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-[#019993] hover:bg-[#00827d] text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-colors shadow-lg shadow-neutral-950/40"
        >
          BOOK A TABLE
        </button>
      </form>
    </div>
  );
}
