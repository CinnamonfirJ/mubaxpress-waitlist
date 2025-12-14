"use client";

import { useEffect, useState } from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trophy,
  ArrowLeft,
  RefreshCw,
  Search,
  Instagram,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

interface ApiSubmission {
  submission_id: string;
  submitted_data: string;
  created_at: string;
}

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
  timestamp: string;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    setError("");

    try {
      const apiKey = process.env.NEXT_PUBLIC_PROFORMS_API_KEY;
      const token = process.env.NEXT_PUBLIC_PROFORMS_TOKEN;
      const url = `https://API.proforms.top/v1/access_form.php?api_key=${apiKey}&access_token=${token}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch submissions");

      const json = await response.json();

      if (json.status !== "success" || !json.submissions?.data) {
        throw new Error("Invalid API response");
      }

      const parsedSubmissions: Submission[] = (
        json.submissions.data as ApiSubmission[]
      )
        .map((item) => {
          try {
            const data = JSON.parse(item.submitted_data || "{}");
            return {
              name: data.name || "Unknown",
              email: data.email || "Unknown",
              referral_code: data.referral_code || "",
              referred_by: data.referred_by || "",
              timestamp: item.created_at,
            };
          } catch {
            return null;
          }
        })
        .filter((item): item is Submission => item !== null);

      const referralCounts = new Map<string, number>();
      const userDetails = new Map<
        string,
        { name: string; email: string; timestamp: string }
      >();

      parsedSubmissions.forEach((sub) => {
        if (sub.referral_code) {
          userDetails.set(sub.referral_code, {
            name: sub.name,
            email: sub.email,
            timestamp: sub.timestamp,
          });
        }

        if (sub.referred_by) {
          referralCounts.set(
            sub.referred_by,
            (referralCounts.get(sub.referred_by) || 0) + 1
          );
        }
      });

      const leaderboardData: LeaderboardEntry[] = [];
      userDetails.forEach((details, code) => {
        leaderboardData.push({
          name: details.name,
          email: details.email,
          referralCode: code,
          referralCount: referralCounts.get(code) || 0,
          rank: 0,
          timestamp: details.timestamp,
        });
      });

      leaderboardData.sort((a, b) => {
        if (b.referralCount !== a.referralCount) {
          return b.referralCount - a.referralCount;
        }
        return (
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      });

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

  const filteredLeaderboard = leaderboard.filter(
    (entry) =>
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topThree = filteredLeaderboard.slice(0, 3);
  const restOfLeaderboard = filteredLeaderboard.slice(3);

  const copyReferralLink = (code: string) => {
    const referralUrl = `${window.location.origin}?ref=${code}`;
    navigator.clipboard.writeText(referralUrl);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <BackgroundBeamsWithCollision className='min-h-screen'>
      <div className='z-20 relative mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 lg:py-20 max-w-6xl'>
        {/* Header */}
        <div className='mb-8 sm:mb-10 md:mb-12 text-center'>
          <div className='flex justify-center items-center gap-2 sm:gap-3 mb-3 sm:mb-4'>
            <Trophy className='w-8 sm:w-10 h-8 sm:h-10 text-[#2db56b]' />
            <h1 className='font-bold text-foreground text-2xl sm:text-3xl md:text-4xl lg:text-5xl'>
              Referral Leaderboard
            </h1>
          </div>
          <p className='mx-auto px-4 max-w-2xl text-muted-foreground text-base sm:text-lg leading-relaxed'>
            See who&apos;s leading the race! Share your referral link to climb
            the ranks.
          </p>
          <div className='flex sm:flex-row flex-col justify-center gap-3 mt-4 sm:mt-6'>
            <Button
              asChild
              variant='outline'
              className='bg-transparent border-border w-full sm:w-auto'
            >
              <Link href='/' className='flex justify-center items-center gap-2'>
                <ArrowLeft className='w-4 h-4' />
                Back to Home
              </Link>
            </Button>
            <Button
              onClick={fetchLeaderboard}
              disabled={isLoading}
              className='flex justify-center items-center gap-2 bg-[#2db56b] hover:bg-[#25a05d] w-full sm:w-auto text-white'
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
            <p className='text-muted-foreground text-sm sm:text-base'>
              Loading leaderboard...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className='bg-red-500/10 p-4 sm:p-6 border border-red-500/20 rounded-xl text-center'>
            <p className='text-red-500 text-sm sm:text-base'>{error}</p>
          </div>
        )}

        {/* Leaderboard */}
        {!isLoading && !error && (
          <>
            {leaderboard.length === 0 ? (
              <div className='bg-background/60 backdrop-blur-sm p-8 sm:p-12 border border-border rounded-xl text-center'>
                <Trophy className='mx-auto mb-4 w-12 sm:w-16 h-12 sm:h-16 text-muted-foreground' />
                <p className='text-muted-foreground text-base sm:text-lg'>
                  No referrals yet. Be the first to share and climb the
                  leaderboard!
                </p>
              </div>
            ) : (
              <>
                <div className='relative mb-6 sm:mb-8'>
                  <Search className='top-1/2 left-3 sm:left-4 absolute w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground -translate-y-1/2' />
                  <Input
                    type='text'
                    placeholder='Search by name or email...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='bg-background/60 backdrop-blur-sm pl-10 sm:pl-12 border-border h-11 sm:h-12 text-sm sm:text-base'
                  />
                </div>

                {topThree.length > 0 && (
                  <div className='mb-8 sm:mb-10 md:mb-12'>
                    <div className='flex md:flex-row flex-col justify-center items-center md:items-end gap-4 sm:gap-5 md:gap-4 mb-6 sm:mb-8'>
                      {/* Second Place */}
                      {topThree[1] && (
                        <div className='flex flex-col items-center w-full sm:w-64 md:w-40 max-w-xs'>
                          <div className='relative mb-3'>
                            <div className='flex justify-center items-center bg-gradient-to-br from-gray-300 to-gray-500 shadow-lg rounded-full w-16 sm:w-18 md:w-20 h-16 sm:h-18 md:h-20'>
                              <span className='font-bold text-white text-2xl sm:text-3xl'>
                                2
                              </span>
                            </div>
                            <div className='top-0 -right-2 absolute bg-[#2db56b] shadow-lg px-2 py-1 rounded-full text-white text-xs'>
                              👑
                            </div>
                          </div>

                          <div className='flex flex-col justify-between bg-gradient-to-br from-gray-300/20 to-gray-500/20 backdrop-blur-sm p-4 sm:p-5 border border-gray-400/30 rounded-xl w-full min-h-[160px] sm:min-h-[170px] text-center'>
                            <div>
                              <p className='px-2 font-semibold text-foreground text-sm sm:text-base truncate'>
                                {topThree[1].name}
                              </p>
                              <p className='mt-1 font-bold text-gray-400 text-2xl sm:text-3xl'>
                                {topThree[1].referralCount}
                              </p>
                              <p className='text-muted-foreground text-xs sm:text-sm'>
                                referrals
                              </p>
                            </div>

                            <Button
                              size='sm'
                              variant='ghost'
                              onClick={() =>
                                copyReferralLink(topThree[1].referralCode)
                              }
                              className='hover:bg-[#2db56b]/10 mt-2 w-full hover:text-[#2db56b] text-xs sm:text-sm'
                            >
                              {copiedCode === topThree[1].referralCode
                                ? "Copied!"
                                : "Copy Link"}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* First Place */}
                      {topThree[0] && (
                        <div className='flex flex-col items-center order-first md:order-none w-full sm:w-64 md:w-40 max-w-xs'>
                          <div className='relative mb-3'>
                            <div className='flex justify-center items-center bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-xl rounded-full w-20 sm:w-22 md:w-24 h-20 sm:h-22 md:h-24'>
                              <Trophy className='w-10 sm:w-11 md:w-12 h-10 sm:h-11 md:h-12 text-white' />
                            </div>
                            <div className='top-0 -right-2 absolute bg-[#2db56b] shadow-lg px-2 py-1 rounded-full text-white text-xs'>
                              👑
                            </div>
                          </div>

                          <div className='flex flex-col justify-between bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 backdrop-blur-sm p-4 sm:p-5 border border-yellow-500/30 rounded-xl w-full min-h-[180px] sm:min-h-[190px] text-center'>
                            <div>
                              <p className='px-2 font-bold text-foreground text-base sm:text-lg truncate'>
                                {topThree[0].name}
                              </p>
                              <p className='mt-2 font-bold text-yellow-500 text-3xl sm:text-4xl'>
                                {topThree[0].referralCount}
                              </p>
                              <p className='text-muted-foreground text-xs sm:text-sm'>
                                referrals
                              </p>
                            </div>

                            <Button
                              size='sm'
                              variant='ghost'
                              onClick={() =>
                                copyReferralLink(topThree[0].referralCode)
                              }
                              className='hover:bg-[#2db56b]/10 mt-2 w-full hover:text-[#2db56b] text-xs sm:text-sm'
                            >
                              {copiedCode === topThree[0].referralCode
                                ? "Copied!"
                                : "Copy Link"}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Third Place */}
                      {topThree[2] && (
                        <div className='flex flex-col items-center w-full sm:w-64 md:w-40 max-w-xs'>
                          <div className='relative mb-3'>
                            <div className='flex justify-center items-center bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg rounded-full w-16 sm:w-18 md:w-20 h-16 sm:h-18 md:h-20'>
                              <span className='font-bold text-white text-2xl sm:text-3xl'>
                                3
                              </span>
                            </div>
                          </div>

                          <div className='flex flex-col justify-between bg-gradient-to-br from-amber-400/20 to-amber-600/20 backdrop-blur-sm p-4 sm:p-5 border border-amber-500/30 rounded-xl w-full min-h-[150px] sm:min-h-[160px] text-center'>
                            <div>
                              <p className='px-2 font-semibold text-foreground text-sm sm:text-base truncate'>
                                {topThree[2].name}
                              </p>
                              <p className='mt-1 font-bold text-amber-500 text-2xl sm:text-3xl'>
                                {topThree[2].referralCount}
                              </p>
                              <p className='text-muted-foreground text-xs sm:text-sm'>
                                referrals
                              </p>
                            </div>

                            <Button
                              size='sm'
                              variant='ghost'
                              onClick={() =>
                                copyReferralLink(topThree[2].referralCode)
                              }
                              className='hover:bg-[#2db56b]/10 mt-2 w-full hover:text-[#2db56b] text-xs sm:text-sm'
                            >
                              {copiedCode === topThree[2].referralCode
                                ? "Copied!"
                                : "Copy Link"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {restOfLeaderboard.length > 0 && (
                  <div className='bg-background/60 backdrop-blur-sm border border-border rounded-xl overflow-hidden'>
                    <div className='overflow-x-auto'>
                      <table className='w-full'>
                        <thead className='bg-muted/50 border-border border-b'>
                          <tr>
                            <th className='px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold text-foreground text-xs sm:text-sm text-left'>
                              Rank
                            </th>
                            <th className='px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold text-foreground text-xs sm:text-sm text-left'>
                              Name
                            </th>
                            <th className='hidden lg:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold text-foreground text-xs sm:text-sm text-left'>
                              Email
                            </th>
                            <th className='px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold text-foreground text-xs sm:text-sm text-right'>
                              Referrals
                            </th>
                            <th className='px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold text-foreground text-xs sm:text-sm text-right'>
                              Share
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {restOfLeaderboard.map((entry) => (
                            <tr
                              key={entry.referralCode}
                              className='hover:bg-muted/30 border-border last:border-0 border-b transition-colors'
                            >
                              <td className='px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-medium text-muted-foreground text-xs sm:text-sm'>
                                #{entry.rank}
                              </td>
                              <td className='px-3 sm:px-4 md:px-6 py-3 sm:py-4 max-w-[120px] sm:max-w-none text-foreground text-xs sm:text-sm truncate'>
                                {entry.name}
                              </td>
                              <td className='hidden lg:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-muted-foreground text-xs sm:text-sm'>
                                {entry.email}
                              </td>
                              <td className='px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-bold text-[#2db56b] text-xs sm:text-sm text-right'>
                                {entry.referralCount}
                              </td>
                              <td className='px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-right'>
                                <Button
                                  size='sm'
                                  variant='ghost'
                                  onClick={() =>
                                    copyReferralLink(entry.referralCode)
                                  }
                                  className='hover:bg-[#2db56b]/10 px-2 sm:px-3 text-[10px] hover:text-[#2db56b] sm:text-xs'
                                >
                                  {copiedCode === entry.referralCode
                                    ? "Copied!"
                                    : "Copy"}
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {filteredLeaderboard.length === 0 && searchQuery && (
                  <div className='bg-background/60 backdrop-blur-sm p-8 sm:p-12 border border-border rounded-xl text-center'>
                    <Search className='mx-auto mb-4 w-12 sm:w-16 h-12 sm:h-16 text-muted-foreground' />
                    <p className='text-muted-foreground text-base sm:text-lg'>
                      No results found for &quot;{searchQuery}&quot;
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}

        <div className='bg-gradient-to-br from-[#2db56b]/10 to-[#25a05d]/5 backdrop-blur-sm mt-8 sm:mt-10 md:mt-12 p-6 sm:p-8 border border-[#2db56b]/20 rounded-xl text-center'>
          <h2 className='mb-2 sm:mb-3 font-bold text-foreground text-xl sm:text-2xl'>
            Thank You for Being Part of MubXpress!
          </h2>
          <p className='mb-4 sm:mb-6 px-2 text-muted-foreground text-base sm:text-lg text-balance leading-relaxed'>
            Follow us on social media for updates on the referral contest,
            exclusive rewards, and the latest development news.
          </p>
          <div className='flex sm:flex-row flex-col justify-center gap-3 sm:gap-4'>
            <Button
              asChild
              variant='outline'
              size='lg'
              className='bg-transparent hover:bg-[#2db56b]/10 border-border hover:border-[#2db56b] w-full sm:w-auto'
            >
              <a
                href='https://www.instagram.com/mubaxpress?utm_source=qr&igsh=MTkzZDRiMWtnc3RtdA=='
                target='_blank'
                rel='noopener noreferrer'
                className='flex justify-center items-center gap-2'
              >
                <Instagram className='w-4 sm:w-5 h-4 sm:h-5' />
                Instagram
              </a>
            </Button>
            <Button
              asChild
              size='lg'
              className='bg-[#25D366] hover:bg-[#20BA5A] shadow-lg hover:shadow-xl border-0 w-full sm:w-auto text-white transition-all'
            >
              <a
                href='https://chat.whatsapp.com/GnyHlJtMYZnJ3vaHjDA0YY?mode=wwt'
                target='_blank'
                rel='noopener noreferrer'
                className='flex justify-center items-center gap-2'
              >
                <MessageCircle className='w-4 sm:w-5 h-4 sm:h-5' />
                Join WhatsApp
              </a>
            </Button>
          </div>
          <div className='mt-6 sm:mt-8 text-muted-foreground text-xs sm:text-sm text-center'>
            <Link
              href='/terms-and-conditions'
              className='hover:text-[#2db56b] underline transition-colors'
            >
              View Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  );
}
