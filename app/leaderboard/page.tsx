"use client";

import { useEffect, useState } from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Medal,
  Award,
  Crown,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

interface Submission {
  name: string;
  email: string;
  referral_code: string;
  referred_by: string;
  timestamp: string;
}

interface LeaderboardEntry {
  name: string;
  email: string;
  referralCode: string;
  referralCount: number;
  rank: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    setError("");

    try {
      const apiKey = process.env.NEXT_PUBLIC_PROFORMS_API_KEY;
      const token = process.env.NEXT_PUBLIC_PROFORMS_TOKEN;
      const url = `https://API.proforms.top/v1/access_form.php?api_key=${apiKey}&token=${token}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch submissions");

      const submissions: Submission[] = await response.json();

      // Calculate referral counts
      const referralCounts = new Map<string, number>();
      const userDetails = new Map<string, { name: string; email: string }>();

      submissions.forEach((sub) => {
        // Store user details
        if (sub.referral_code) {
          userDetails.set(sub.referral_code, {
            name: sub.name,
            email: sub.email,
          });
        }

        // Count referrals
        if (sub.referred_by) {
          referralCounts.set(
            sub.referred_by,
            (referralCounts.get(sub.referred_by) || 0) + 1
          );
        }
      });

      // Build leaderboard
      const leaderboardData: LeaderboardEntry[] = [];
      userDetails.forEach((details, code) => {
        leaderboardData.push({
          name: details.name,
          email: details.email,
          referralCode: code,
          referralCount: referralCounts.get(code) || 0,
          rank: 0,
        });
      });

      // Sort by referral count and assign ranks
      leaderboardData.sort((a, b) => b.referralCount - a.referralCount);
      leaderboardData.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      setLeaderboard(leaderboardData);
    } catch (err) {
      console.error("[v0] Error fetching leaderboard:", err);
      setError("Unable to load leaderboard. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className='w-6 h-6 text-yellow-500' />;
      case 2:
        return <Medal className='w-6 h-6 text-gray-400' />;
      case 3:
        return <Award className='w-6 h-6 text-amber-600' />;
      default:
        return <Trophy className='w-5 h-5 text-muted-foreground' />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-br from-gray-300 to-gray-500 text-white";
      case 3:
        return "bg-gradient-to-br from-amber-400 to-amber-600 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <BackgroundBeamsWithCollision className='min-h-screen'>
      <div className='z-20 relative mx-auto px-4 py-12 md:py-20 max-w-4xl'>
        {/* Header */}
        <div className='mb-12 text-center'>
          <div className='flex justify-center items-center gap-3 mb-4'>
            <Trophy className='w-10 h-10 text-[#2db56b]' />
            <h1 className='font-bold text-foreground text-4xl md:text-5xl'>
              Referral Leaderboard
            </h1>
          </div>
          <p className='mx-auto max-w-2xl text-muted-foreground text-lg leading-relaxed'>
            See who&aos;s leading the race! Share your referral link to climb
            the ranks and unlock exclusive rewards.
          </p>
          <div className='flex justify-center gap-3 mt-6'>
            <Button
              asChild
              variant='outline'
              className='bg-transparent border-border'
            >
              <Link href='/' className='flex items-center gap-2'>
                <ArrowLeft className='w-4 h-4' />
                Back to Home
              </Link>
            </Button>
            <Button
              onClick={fetchLeaderboard}
              disabled={isLoading}
              className='flex items-center gap-2 bg-[#2db56b] hover:bg-[#25a05d] text-white'
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className='py-12 text-center'>
            <div className='inline-block mb-4 border-[#2db56b] border-4 border-t-transparent rounded-full w-8 h-8 animate-spin' />
            <p className='text-muted-foreground'>Loading leaderboard...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className='bg-red-500/10 p-6 border border-red-500/20 rounded-xl text-center'>
            <p className='text-red-500'>{error}</p>
          </div>
        )}

        {/* Leaderboard */}
        {!isLoading && !error && (
          <div className='space-y-3'>
            {leaderboard.length === 0 ? (
              <div className='bg-background/60 backdrop-blur-sm p-12 border border-border rounded-xl text-center'>
                <Trophy className='mx-auto mb-4 w-16 h-16 text-muted-foreground' />
                <p className='text-muted-foreground text-lg'>
                  No referrals yet. Be the first to share and climb the
                  leaderboard!
                </p>
              </div>
            ) : (
              leaderboard.map((entry) => (
                <div
                  key={entry.referralCode}
                  className={`bg-background/60 backdrop-blur-sm border rounded-xl p-6 transition-all hover:shadow-lg ${
                    entry.rank <= 3
                      ? "border-[#2db56b]/30 shadow-[#2db56b]/10"
                      : "border-border"
                  }`}
                >
                  <div className='flex items-center gap-4'>
                    {/* Rank Badge */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getRankBadgeColor(
                        entry.rank
                      )}`}
                    >
                      {entry.rank <= 3 ? (
                        getRankIcon(entry.rank)
                      ) : (
                        <span className='font-bold text-lg'>#{entry.rank}</span>
                      )}
                    </div>

                    {/* User Info */}
                    <div className='flex-1 min-w-0'>
                      <h3 className='font-semibold text-foreground text-lg truncate'>
                        {entry.name}
                      </h3>
                      <p className='text-muted-foreground text-sm truncate'>
                        {entry.email}
                      </p>
                      <p className='mt-1 font-mono text-muted-foreground text-xs'>
                        Code: {entry.referralCode}
                      </p>
                    </div>

                    {/* Referral Count */}
                    <div className='flex-shrink-0 text-right'>
                      <div className='font-bold text-[#2db56b] text-3xl'>
                        {entry.referralCount}
                      </div>
                      <p className='text-muted-foreground text-xs'>
                        {entry.referralCount === 1 ? "referral" : "referrals"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Rewards Info */}
        <div className='bg-gradient-to-br from-[#2db56b]/10 to-[#25a05d]/5 backdrop-blur-sm mt-12 p-8 border border-[#2db56b]/20 rounded-xl'>
          <h2 className='mb-4 font-bold text-foreground text-2xl text-center'>
            Unlock Exclusive Rewards
          </h2>
          <div className='gap-4 grid sm:grid-cols-3 text-center'>
            <div>
              <div className='mb-2 font-bold text-[#2db56b] text-3xl'>
                5+ Referrals
              </div>
              <p className='text-muted-foreground text-sm'>
                Early access + exclusive badge
              </p>
            </div>
            <div>
              <div className='mb-2 font-bold text-[#2db56b] text-3xl'>
                10+ Referrals
              </div>
              <p className='text-muted-foreground text-sm'>
                Premium features for 3 months
              </p>
            </div>
            <div>
              <div className='mb-2 font-bold text-[#2db56b] text-3xl'>
                25+ Referrals
              </div>
              <p className='text-muted-foreground text-sm'>
                Lifetime premium + campus ambassador
              </p>
            </div>
          </div>
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  );
}
