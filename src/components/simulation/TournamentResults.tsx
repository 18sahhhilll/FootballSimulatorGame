import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TournamentState } from '../../types/football';
import { calculateLiveAwardRankings } from '../../engine/tournamentSimulator';
import { getTeamLogoUrl } from '../../utils/teamLogos';
import { Trophy, Star, Flame, RotateCcw, Flag, Shield } from 'lucide-react';

interface TournamentResultsProps {
  state: TournamentState;
  onRestart: () => void;
}

export const TournamentResults: React.FC<TournamentResultsProps> = ({
  state,
  onRestart,
}) => {
  const finalMatch = state.knockouts.final[0];
  const ACCENT = '#C9F31D';
  const GOLD = '#F2B705';

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
    });
  }, []);

  let winnerName = 'CHAMPION';
  let winnerFlag = '🏆';
  let winnerTeamId: string | undefined = undefined;
  let isUserChampion = false;

  if (finalMatch && finalMatch.completed) {
    const isHomeWinner =
      finalMatch.homeScore > finalMatch.awayScore ||
      (finalMatch.homePenalties !== undefined && finalMatch.homePenalties > (finalMatch.awayPenalties || 0));

    winnerName = isHomeWinner ? finalMatch.homeTeamName : finalMatch.awayTeamName;
    winnerFlag = isHomeWinner ? finalMatch.homeTeamFlag : finalMatch.awayTeamFlag;
    winnerTeamId = isHomeWinner ? finalMatch.homeTeamId : finalMatch.awayTeamId;
    isUserChampion = isHomeWinner ? finalMatch.isUserHome || false : finalMatch.isUserAway || false;
  }

  const winnerLogo = getTeamLogoUrl(winnerTeamId, winnerName);
  const { goldenBall, goldenBoot, goldenGlove } = calculateLiveAwardRankings(state.stats);

  const goldenBallWinner = goldenBall.length > 0 ? goldenBall[0] : null;
  const goldenBootWinner = goldenBoot.length > 0 ? goldenBoot[0] : null;
  const goldenGloveWinner = goldenGlove.length > 0 ? goldenGlove[0] : null;

  return (
    <div className="min-h-screen fx-turf fx-vignette px-6 py-16 flex items-center justify-center">
      <div className="max-w-3xl w-full text-center space-y-8 animate-fade-in">
        {/* Champion Trophy Display */}
        {isUserChampion ? (
          <>
            <Trophy size={64} style={{ color: GOLD }} className="mx-auto mb-2 animate-bounce" />
            <div className="text-xs fx-display font-extrabold tracking-widest uppercase" style={{ color: GOLD }}>
              WORLD CUP CHAMPIONS
            </div>
            <h2 className="fx-display font-extrabold text-4xl sm:text-5xl text-white mt-1">Your XI</h2>
          </>
        ) : (
          <>
            <Flag size={52} className="mx-auto mb-2 text-white/40" />
            <div className="text-xs fx-display font-extrabold tracking-widest text-white/40 uppercase">TOURNAMENT CONCLUDED</div>
            <h2 className="fx-display font-extrabold text-4xl sm:text-5xl text-white mt-1 flex items-center justify-center gap-3">
              {winnerLogo ? (
                <img src={winnerLogo} alt="" className="w-14 h-9 object-cover rounded shadow-md inline-block" />
              ) : (
                <span>{winnerFlag}</span>
              )}
              <span>{winnerName}</span>
            </h2>
          </>
        )}

        {/* Official Tournament Awards derived from stored match data */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {/* Golden Ball */}
          <div className="fx-panel p-5 space-y-2 border border-purple-500/40 bg-gradient-to-b from-purple-500/10 to-transparent">
            <div className="flex items-center justify-between">
              <span className="text-xs fx-display font-bold uppercase tracking-wider text-purple-400">
                ⭐ Golden Ball
              </span>
              <Star className="w-5 h-5 text-purple-400" />
            </div>
            {goldenBallWinner ? (
              <div>
                <div className="flex items-center gap-2">
                  {getTeamLogoUrl(goldenBallWinner.teamId || goldenBallWinner.nationality, goldenBallWinner.teamName) ? (
                    <img
                      src={getTeamLogoUrl(goldenBallWinner.teamId || goldenBallWinner.nationality, goldenBallWinner.teamName)}
                      alt=""
                      className="w-7 h-4.5 rounded shadow-sm object-cover shrink-0"
                    />
                  ) : (
                    <span className="text-base">{goldenBallWinner.flag}</span>
                  )}
                  <h4 className="fx-display font-extrabold text-base text-white truncate">{goldenBallWinner.name}</h4>
                </div>
                <p className="text-[11px] text-white/40 font-mono truncate">{goldenBallWinner.teamName}</p>
                <div className="mt-3 fx-display text-2xl font-extrabold text-purple-400">
                  {goldenBallWinner.ratingAverage.toFixed(2)} <span className="text-xs font-normal text-white/40">AVG RATING</span>
                </div>
                <p className="text-[10px] text-white/50 font-mono mt-1">
                  {goldenBallWinner.goals}G | {goldenBallWinner.assists}A | {goldenBallWinner.motmCount} MOTM
                </p>
              </div>
            ) : (
              <p className="text-xs text-white/40">N/A</p>
            )}
          </div>

          {/* Golden Boot */}
          <div className="fx-panel p-5 space-y-2 border border-[#F2B705]/40 bg-gradient-to-b from-[#F2B705]/10 to-transparent">
            <div className="flex items-center justify-between">
              <span className="text-xs fx-display font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                🥇 Golden Boot
              </span>
              <Flame className="w-5 h-5 text-[#F2B705]" />
            </div>
            {goldenBootWinner ? (
              <div>
                <div className="flex items-center gap-2">
                  {getTeamLogoUrl(goldenBootWinner.teamId || goldenBootWinner.nationality, goldenBootWinner.teamName) ? (
                    <img
                      src={getTeamLogoUrl(goldenBootWinner.teamId || goldenBootWinner.nationality, goldenBootWinner.teamName)}
                      alt=""
                      className="w-7 h-4.5 rounded shadow-sm object-cover shrink-0"
                    />
                  ) : (
                    <span className="text-base">{goldenBootWinner.flag}</span>
                  )}
                  <h4 className="fx-display font-extrabold text-base text-white truncate">{goldenBootWinner.name}</h4>
                </div>
                <p className="text-[11px] text-white/40 font-mono truncate">{goldenBootWinner.teamName}</p>
                <div className="mt-3 fx-display text-2xl font-extrabold" style={{ color: GOLD }}>
                  {goldenBootWinner.goals} <span className="text-xs font-normal text-white/40">GOALS</span>
                </div>
                <p className="text-[10px] text-white/50 font-mono mt-1">
                  {goldenBootWinner.assists} assists in {goldenBootWinner.matchesPlayed} matches
                </p>
              </div>
            ) : (
              <p className="text-xs text-white/40">No goals recorded</p>
            )}
          </div>

          {/* Golden Glove */}
          <div className="fx-panel p-5 space-y-2 border border-[#C9F31D]/40 bg-gradient-to-b from-[#C9F31D]/10 to-transparent">
            <div className="flex items-center justify-between">
              <span className="text-xs fx-display font-bold uppercase tracking-wider" style={{ color: ACCENT }}>
                🧤 Golden Glove
              </span>
              <Shield className="w-5 h-5 text-[#C9F31D]" />
            </div>
            {goldenGloveWinner ? (
              <div>
                <div className="flex items-center gap-2">
                  {getTeamLogoUrl(goldenGloveWinner.teamId || goldenGloveWinner.nationality, goldenGloveWinner.teamName) ? (
                    <img
                      src={getTeamLogoUrl(goldenGloveWinner.teamId || goldenGloveWinner.nationality, goldenGloveWinner.teamName)}
                      alt=""
                      className="w-7 h-4.5 rounded shadow-sm object-cover shrink-0"
                    />
                  ) : (
                    <span className="text-base">{goldenGloveWinner.flag}</span>
                  )}
                  <h4 className="fx-display font-extrabold text-base text-white truncate">{goldenGloveWinner.name}</h4>
                </div>
                <p className="text-[11px] text-white/40 font-mono truncate">{goldenGloveWinner.teamName}</p>
                <div className="mt-3 fx-display text-2xl font-extrabold" style={{ color: ACCENT }}>
                  {goldenGloveWinner.cleanSheets} <span className="text-xs font-normal text-white/40">CLEAN SHEETS</span>
                </div>
                <p className="text-[10px] text-white/50 font-mono mt-1">
                  {goldenGloveWinner.saves} saves in {goldenGloveWinner.matchesPlayed} matches
                </p>
              </div>
            ) : (
              <p className="text-xs text-white/40">N/A</p>
            )}
          </div>
        </div>

        {/* Restart Action */}
        <div className="pt-4">
          <button
            onClick={onRestart}
            className="fx-btn px-8 py-4 text-black font-bold flex items-center gap-2 mx-auto text-lg shadow-2xl"
            style={{ background: ACCENT }}
          >
            <RotateCcw size={18} /> START ANOTHER GAME
          </button>
        </div>
      </div>
    </div>
  );
};
