"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

function generateReferralCode(email: string): string {
  const timestamp = Date.now().toString(36);
  const emailHash = email.split("@")[0].substring(0, 4).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${emailHash}${random}${timestamp}`.substring(0, 12);
}

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      setReferredBy(refCode);
      // Store in localStorage so it persists
      localStorage.setItem("referredBy", refCode);
    } else {
      // Check if we have a stored referral code
      const storedRef = localStorage.getItem("referredBy");
      if (storedRef) {
        setReferredBy(storedRef);
      }
    }
  }, [searchParams]);

  const handleBeforeSubmit = () => {
    const referralCode = generateReferralCode(email);
    sessionStorage.setItem("waitlistEmail", email);
    sessionStorage.setItem("waitlistName", name);
    sessionStorage.setItem("referralCode", referralCode);
  };
  return (
    <BackgroundBeamsWithCollision>
      <div className='z-20 relative mx-auto px-4 py-12 md:py-20 max-w-4xl'>
        {/* Logo/Brand */}
        <div className='mb-8 text-center'>
          <h1 className='mb-2 font-bold text-foreground text-4xl md:text-5xl'>
            MubXpress
          </h1>
          <div className='inline-block bg-[#2db56b]/10 px-4 py-1 rounded-full'>
            <span className='font-semibold text-[#2db56b] text-sm'>
              Coming Soon to Your Campus
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div className='mb-12 text-center'>
          <h2 className='mb-6 font-bold text-foreground text-3xl md:text-5xl lg:text-6xl text-balance leading-tight'>
            Your trusted,{" "}
            <span className='inline-block relative'>
              <span className='z-10 relative text-[#2db56b]'>student-only</span>
              <div className='absolute inset-0 bg-[#2db56b]/10 blur-xl' />
            </span>{" "}
            campus marketplace
          </h2>
          <p className='mx-auto max-w-2xl text-muted-foreground text-lg md:text-xl leading-relaxed'>
            Buy, sell, and trade within your local campus community. Safe,
            simple, and built exclusively for students.
          </p>
        </div>

        {/* Social Proof */}
        <div className='flex justify-center items-center gap-2 mb-8'>
          <div className='flex -space-x-2'>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className='flex justify-center items-center bg-gradient-to-br from-[#2db56b] to-[#25a05d] border-2 border-background rounded-full w-8 h-8 font-semibold text-white text-xs'
              >
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <p className='text-muted-foreground text-sm'>
            <span className='font-semibold text-foreground'>28 students</span>{" "}
            already joined
          </p>
        </div>

        {/* Waitlist Form */}
        <form
          action={`https://app.proforms.top/f/${process.env.NEXT_PUBLIC_PROFORMS_API_KEY}`}
          method='POST'
          onSubmit={handleBeforeSubmit}
          className='mx-auto mb-4 max-w-md'
        >
          <div className='flex flex-col gap-3'>
            <Input
              type='text'
              id='name'
              name='name'
              placeholder='Enter your name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className='bg-background/80 backdrop-blur-sm focus:border-[#2db56b] border-border focus:ring-[#2db56b] h-12 text-base'
              title='Please enter your name'
            />
            <Input
              type='email'
              id='email'
              name='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='bg-background/80 backdrop-blur-sm focus:border-[#2db56b] border-border focus:ring-[#2db56b] h-12 text-base'
              title='Please use your email address'
            />
            <input
              type='hidden'
              name='referral_code'
              value={generateReferralCode(email)}
            />
            <input type='hidden' name='referred_by' value={referredBy} />

            <Button
              type='submit'
              className='bg-[#2db56b] hover:bg-[#25a05d] shadow-[#2db56b]/20 shadow-lg px-8 h-12 font-semibold text-white transition-all'
            >
              Join Waitlist
            </Button>
          </div>
          <p className='mt-3 text-muted-foreground text-xs text-center'>
            🚀 Sign up to explore Muba • Fast and secure access
          </p>
        </form>

        {/* Trust Badge */}
        <div className='mt-2 text-center'>
          <div className='inline-flex items-center gap-2 text-muted-foreground text-sm'>
            <CheckCircle2 className='w-4 h-4 text-[#2db56b]' />
            <span>Launching at 50+ universities nationwide</span>
          </div>
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  );
}
