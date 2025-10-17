"use client";

import type React from "react";

import { Suspense, useEffect, useState } from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

function generateReferralCode(email: string): string {
  const timestamp = Date.now().toString(36);
  const emailHash = email.split("@")[0].substring(0, 4).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${emailHash}${random}${timestamp}`.substring(0, 12);
}

export default function WaitlistPage() {
  // Extracted inner client logic to a component inside Suspense
  function WaitlistForm() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [referredBy, setReferredBy] = useState("");
    const [hasReferralParam, setHasReferralParam] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const searchParams = useSearchParams();

    useEffect(() => {
      const refCode = searchParams.get("ref");
      if (refCode) {
        setReferredBy(refCode);
        setHasReferralParam(true);
        localStorage.setItem("referredBy", refCode);
      } else {
        const storedRef = localStorage.getItem("referredBy");
        if (storedRef) {
          setReferredBy(storedRef);
          setHasReferralParam(true);
        }
      }
    }, [searchParams]);

    const clearReferralParams = () => {
      localStorage.removeItem("referredBy");
      setReferredBy("");
      setHasReferralParam(false);
    };

    // ✅ Prevent duplicate emails using the same API used for leaderboard
    const checkDuplicateEmail = async (email: string): Promise<boolean> => {
      try {
        const apiKey = process.env.NEXT_PRIVATE_PROFORMS_API_KEY;
        const token = process.env.NEXT_PRIVATE_PROFORMS_TOKEN;
        const url = `https://API.proforms.top/v1/access_form.php?api_key=${apiKey}&access_token=${token}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch existing emails");

        const json = await response.json();

        if (json.status !== "success" || !json.submissions?.data) return false;

        const submissions = json.submissions.data as {
          submitted_data: string;
        }[];

        const emails = submissions
          .map((item) => {
            try {
              const data = JSON.parse(item.submitted_data || "{}");
              return data.email?.toLowerCase();
            } catch {
              return null;
            }
          })
          .filter(Boolean);

        return emails.includes(email.toLowerCase());
      } catch (err) {
        console.error("Error checking duplicate email:", err);
        return false;
      }
    };

    const handleBeforeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");
      setIsSubmitting(true);

      const alreadyExists = await checkDuplicateEmail(email);
      if (alreadyExists) {
        setError("This email has already joined the waitlist.");
        setIsSubmitting(false);
        return;
      }

      const referralCode = generateReferralCode(email);
      sessionStorage.setItem("waitlistEmail", email);
      sessionStorage.setItem("waitlistName", name);
      sessionStorage.setItem("referralCode", referralCode);

      // Submit to ProForms
      e.currentTarget.submit();
    };

    return (
      <form
        action={`https://app.proforms.top/f/${process.env.NEXT_PRIVATE_PROFORMS_API_KEY}`}
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
          />

          {error && (
            <p className='mt-1 text-red-500 text-sm text-center'>{error}</p>
          )}

          <div className='relative'>
            <Input
              type='text'
              id='referral_input'
              name='referral_input'
              placeholder='Referral code (optional)'
              value={referredBy}
              onChange={(e) => setReferredBy(e.target.value)}
              disabled={hasReferralParam}
              className={`h-12 text-base bg-background/80 backdrop-blur-sm border-border focus:border-[#2db56b] focus:ring-[#2db56b] ${
                hasReferralParam ? "opacity-70 cursor-not-allowed" : ""
              }`}
            />
            {hasReferralParam && (
              <div className='top-1/2 right-3 absolute flex items-center space-x-2 -translate-y-1/2'>
                <span className='font-medium text-[#2db56b] text-xs'>
                  ✓ Applied
                </span>
                <Button
                  type='button'
                  onClick={clearReferralParams}
                  className='bg-[#2db56b] hover:bg-[#25a05d] shadow-[#2db56b]/20 shadow-lg px-3 h-8 font-semibold text-white transition-all'
                >
                  X
                </Button>
              </div>
            )}
          </div>

          <input
            type='hidden'
            name='referral_code'
            value={generateReferralCode(email)}
          />
          <input type='hidden' name='referred_by' value={referredBy} />

          <Button
            type='submit'
            disabled={isSubmitting}
            className='bg-[#2db56b] hover:bg-[#25a05d] shadow-[#2db56b]/20 shadow-lg px-8 h-12 font-semibold text-white transition-all'
          >
            {isSubmitting ? "Checking..." : "Join Waitlist"}
          </Button>
        </div>

        <p className='mt-3 text-muted-foreground text-xs text-center'>
          🚀 Sign up to explore Muba • Fast and secure access
        </p>
      </form>
    );
  }

  return (
    <BackgroundBeamsWithCollision className='min-h-screen'>
      <div
        className='w-full'
        style={{
          backgroundImage: "url('/girl.png')",
          backgroundSize: "contain", // or "auto" if you don't want it cropped
          backgroundPosition: "-120px bottom",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className='z-20 relative mx-auto px-4 py-12 md:py-20 max-w-4xl'>
          {/* Logo/Brand */}
          <div className='mb-8 text-center'>
            <div className='flex justify-center items-center gap-2'>
              <Image
                src='/MubaXpress.png'
                alt='MubaXpress Logo'
                width={80} // adjust to your logo’s size
                height={80}
                className='object-contain -rotate-12'
                priority
              />
              <h1 className='mb-1 font-bold text-foreground text-4xl md:text-5xl'>
                MubaXpress
              </h1>
            </div>
            <div className='inline-block bg-[#2db56b]/10 px-4 py-1 rounded-full'>
              <span className='font-semibold text-[#2db56b] text-sm'>
                Coming Soon to Your Campus
              </span>
            </div>
          </div>

          {/* Hero Section */}
          <div className='bg-background/60 backdrop-blur-sm mb-12 border border-border rounded-xl text-center'>
            <h2 className='mb-6 font-bold text-foreground text-3xl md:text-5xl lg:text-6xl text-balance leading-tight'>
              Your trusted,{" "}
              <span className='inline-block relative'>
                <span className='z-10 relative text-[#2db56b]'>
                  student-only
                </span>
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
              {Array.from({ length: 4 }).map((_, i) => {
                const randomLetter = String.fromCharCode(
                  65 + Math.floor(Math.random() * 26)
                ); // A–Z
                return (
                  <div
                    key={i}
                    className='flex justify-center items-center bg-gradient-to-br from-[#2db56b] to-[#25a05d] border-2 border-background rounded-full w-8 h-8 font-semibold text-white text-xs'
                  >
                    {randomLetter}
                  </div>
                );
              })}
            </div>
            <p className='text-muted-foreground text-sm'>
              <span className='font-semibold text-foreground'>28 students</span>{" "}
              already joined
            </p>
          </div>

          {/* Waitlist Form */}
          <Suspense
            fallback={<div className='text-center'>Loading form...</div>}
          >
            <WaitlistForm />
          </Suspense>

          {/* Trust Badge */}
          <div className='mt-2 text-center'>
            <div className='inline-flex items-center gap-2 text-muted-foreground text-sm'>
              <CheckCircle2 className='w-4 h-4 text-[#2db56b]' />
              <span>Launching at 50+ universities nationwide</span>
            </div>
          </div>
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  );
}
