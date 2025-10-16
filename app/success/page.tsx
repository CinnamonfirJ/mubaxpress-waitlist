"use client";

import { useEffect, useState } from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Instagram,
  Twitter,
  MessageCircle,
  Copy,
  Check,
  Trophy,
} from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("waitlistEmail");
    const storedName = sessionStorage.getItem("waitlistName");
    const storedCode = sessionStorage.getItem("referralCode");

    if (storedEmail) setEmail(storedEmail);
    if (storedName) setName(storedName);
    if (storedCode) {
      setReferralCode(storedCode);
      const baseUrl = window.location.origin;
      setReferralLink(`${baseUrl}?ref=${storedCode}`);
    }
  }, []);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <BackgroundBeamsWithCollision className='min-h-screen'>
      <div className='z-20 relative mx-auto px-4 py-12 md:py-20 max-w-2xl text-center'>
        {/* Success Icon */}
        <div className='mb-8'>
          <div className='flex justify-center items-center bg-[#2db56b] shadow-[#2db56b]/30 shadow-lg mx-auto mb-6 rounded-full w-20 h-20'>
            <CheckCircle2 className='w-10 h-10 text-white' />
          </div>
          <h1 className='mb-4 font-bold text-foreground text-4xl md:text-5xl'>
            You&apos;re on the list! 🎉
          </h1>
          <p className='text-muted-foreground text-lg leading-relaxed'>
            {name && (
              <>
                Welcome,{" "}
                <span className='font-semibold text-foreground'>{name}</span>!
                <br />
              </>
            )}
            {email && (
              <>
                We&apos;ve sent a confirmation to{" "}
                <span className='font-semibold text-foreground'>{email}</span>.
                <br />
              </>
            )}
            You&apos;ll be among the first to know when MubXpress launches at
            your campus.
          </p>
        </div>

        {referralCode && (
          <div className='bg-gradient-to-br from-[#2db56b]/10 to-[#25a05d]/5 backdrop-blur-sm mb-8 p-6 border border-[#2db56b]/20 rounded-xl'>
            <h2 className='mb-3 font-bold text-foreground text-2xl'>
              Your Referral Code
            </h2>
            <div className='bg-background/80 mb-4 p-4 rounded-lg'>
              <code className='font-mono font-bold text-[#2db56b] text-2xl'>
                {referralCode}
              </code>
            </div>
            <p className='mb-4 text-muted-foreground text-sm'>
              Share your unique link with friends to climb the leaderboard and
              unlock exclusive rewards!
            </p>
            <div className='flex sm:flex-row flex-col gap-3'>
              <Button
                onClick={copyReferralLink}
                className='flex-1 bg-[#2db56b] hover:bg-[#25a05d] shadow-[#2db56b]/20 shadow-lg font-semibold text-white'
              >
                {copied ? (
                  <>
                    <Check className='mr-2 w-4 h-4' />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className='mr-2 w-4 h-4' />
                    Copy Referral Link
                  </>
                )}
              </Button>
              <Button
                asChild
                variant='outline'
                className='flex-1 bg-transparent hover:bg-[#2db56b]/10 border-[#2db56b] text-[#2db56b]'
              >
                <Link href='/leaderboard' className='flex items-center gap-2'>
                  <Trophy className='w-4 h-4' />
                  View Leaderboard
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* What's Next */}
        <div className='bg-background/60 backdrop-blur-sm mb-8 p-8 border border-border rounded-xl'>
          <h2 className='mb-4 font-bold text-foreground text-2xl'>
            What&apos;s Next?
          </h2>
          <div className='space-y-3 text-left'>
            <div className='flex items-start gap-3'>
              <div className='flex flex-shrink-0 justify-center items-center bg-[#2db56b]/10 mt-0.5 rounded-full w-6 h-6'>
                <span className='font-semibold text-[#2db56b] text-sm'>1</span>
              </div>
              <p className='text-muted-foreground leading-relaxed'>
                Check your email for confirmation and early access updates
              </p>
            </div>
            <div className='flex items-start gap-3'>
              <div className='flex flex-shrink-0 justify-center items-center bg-[#2db56b]/10 mt-0.5 rounded-full w-6 h-6'>
                <span className='font-semibold text-[#2db56b] text-sm'>2</span>
              </div>
              <p className='text-muted-foreground leading-relaxed'>
                Join our community to stay connected and get exclusive perks
              </p>
            </div>
            <div className='flex items-start gap-3'>
              <div className='flex flex-shrink-0 justify-center items-center bg-[#2db56b]/10 mt-0.5 rounded-full w-6 h-6'>
                <span className='font-semibold text-[#2db56b] text-sm'>3</span>
              </div>
              <p className='text-muted-foreground leading-relaxed'>
                Share your referral link to move up the waitlist and unlock
                rewards
              </p>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className='mb-8'>
          <h3 className='mb-4 font-semibold text-foreground text-xl'>
            Join Our Community
          </h3>
          <div className='flex sm:flex-row flex-col justify-center gap-3'>
            <Button
              asChild
              className='bg-[#2db56b] hover:bg-[#25a05d] shadow-[#2db56b]/20 shadow-lg font-semibold text-white'
            >
              <a
                href='https://wa.me/your-whatsapp-number'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2'
              >
                <MessageCircle className='w-5 h-5' />
                Join WhatsApp Group
              </a>
            </Button>
            <Button
              asChild
              variant='outline'
              className='bg-transparent hover:bg-accent border-border'
            >
              <a
                href='https://instagram.com/mubxpress'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2'
              >
                <Instagram className='w-5 h-5' />
                Follow on Instagram
              </a>
            </Button>
            <Button
              asChild
              variant='outline'
              className='bg-transparent hover:bg-accent border-border'
            >
              <a
                href='https://twitter.com/mubxpress'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2'
              >
                <Twitter className='w-5 h-5' />
                Follow on Twitter
              </a>
            </Button>
          </div>
          <p className='mt-4 text-muted-foreground text-sm'>
            Get insider updates, campus marketplace tips, and connect with other
            students
          </p>
        </div>

        {/* Back Link */}
        <Link
          href='/'
          className='text-muted-foreground hover:text-foreground text-sm transition-colors'
        >
          ← Back to home
        </Link>
      </div>
    </BackgroundBeamsWithCollision>
  );
}
