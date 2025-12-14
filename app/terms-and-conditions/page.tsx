"use client";

import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TermsAndConditionsPage() {
  return (
    <BackgroundBeamsWithCollision className='min-h-screen'>
      <div className='z-20 relative mx-auto px-4 py-16 md:py-24 max-w-4xl'>
        <h1 className='mb-8 font-bold text-foreground text-4xl text-center'>
          MubaXpress Referral Contest — Terms & Conditions
        </h1>

        <div className='space-y-8 text-muted-foreground leading-relaxed'>
          <section>
            <h2 className='mb-2 font-semibold text-foreground text-xl'>
              1. Eligibility
            </h2>
            <p>
              The MubaXpress Referral Contest is open to Nigerian residents aged
              16 or older. Participants must use a valid email address to join
              the waitlist. Employees, contractors, or affiliates of MubaXpress
              are not eligible to participate.
            </p>
          </section>

          <section>
            <h2 className='mb-2 font-semibold text-foreground text-xl'>
              2. How to Enter
            </h2>
            <p>
              Each participant receives a unique referral code upon joining the
              MubaXpress waitlist. A “successful referral” occurs when someone
              signs up using your unique referral code. Each verified referral
              counts as <strong>one (1) point</strong> toward your total.
            </p>
          </section>

          <section>
            <h2 className='mb-2 font-semibold text-foreground text-xl'>
              3. Contest Duration
            </h2>
            <p>
              The contest runs from <strong>15th December,2025</strong> to
              <strong>25th December, 2025</strong>. Referrals made before or
              after this period will not be counted.
            </p>
          </section>

          <section>
            <h2 className='mb-2 font-semibold text-foreground text-xl'>
              4. Rewards
            </h2>
            <p>
              The total prize pool is ₦10,000, distributed among the top three
              participants:
            </p>
            <ul className='mt-2 pl-6 list-disc'>
              <li>
                <strong>1st Place:</strong> ₦5,000
              </li>
              <li>
                <strong>2nd Place:</strong> ₦3,000
              </li>
              <li>
                <strong>3rd Place:</strong> ₦2,000
              </li>
            </ul>
            <p className='mt-2'>
              Prize eligibility is subject to minimum referral requirements: 1st
              place requires at least 20 verified referrals, 2nd place requires
              at least 15, and 3rd place requires at least 10.
            </p>

            <p className='mt-2'>
              In case of a tie, ranking will be determined by the earliest
              verified referral timestamp. Prizes are non-transferable and
              cannot be exchanged for cash.
            </p>
          </section>

          <section>
            <h2 className='mb-2 font-semibold text-foreground text-xl'>
              5. Verification
            </h2>
            <p>
              All referrals will be subject to verification. MubaXpress reserves
              the right to disqualify any participant engaging in fraudulent,
              duplicate, or suspicious activity (e.g., fake emails, bots, or
              self-referrals).
            </p>
          </section>

          <section>
            <h2 className='mb-2 font-semibold text-foreground text-xl'>
              6. Winner Announcement
            </h2>
            <p>
              Winners will be announced on <strong>25th December, 2025</strong>{" "}
              via
              <strong> MubaXpress social media and email</strong>. Winners must
              respond within
              <strong> 5 days</strong> to claim their prize, or the prize will
              be forfeited.
            </p>
          </section>

          <section>
            <h2 className='mb-2 font-semibold text-foreground text-xl'>
              7. Privacy
            </h2>
            <p>
              Participants’ personal information will be used solely for contest
              administration, reward distribution, and updates about the
              MubaXpress product launch. By participating, entrants agree to
              receive relevant notifications from MubaXpress.
            </p>
          </section>

          <section>
            <h2 className='mb-2 font-semibold text-foreground text-xl'>
              8. Rights and Publicity
            </h2>
            <p>
              By entering, participants consent to MubaXpress using their name
              or likeness for promotional purposes without additional
              compensation.
            </p>
          </section>

          <section>
            <h2 className='mb-2 font-semibold text-foreground text-xl'>
              9. Modification or Cancellation
            </h2>
            <p>
              MubaXpress reserves the right to modify, suspend, or cancel the
              contest at any time without prior notice if circumstances beyond
              its control occur (e.g., technical issues or fraud).
            </p>
          </section>

          <section>
            <h2 className='mb-2 font-semibold text-foreground text-xl'>
              10. Limitation of Liability
            </h2>
            <p>
              MubaXpress is not responsible for lost, delayed, or misdirected
              entries, technical issues, or any injury or damage resulting from
              participation.
            </p>
          </section>

          <section>
            <h2 className='mb-2 font-semibold text-foreground text-xl'>
              11. Agreement
            </h2>
            <p>
              By participating in this contest, entrants agree to be bound by
              these terms and the decisions of MubaXpress, which are final and
              binding.
            </p>
          </section>

          <div className='pt-8 text-center'>
            <Button
              asChild
              variant='outline'
              className='hover:bg-[#2db56b]/10 hover:border-[#2db56b]'
            >
              <Link href='/leaderboard'>← Back to Leaderboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  );
}
