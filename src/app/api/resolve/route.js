import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  const today = new Date().toISOString().split("T")[0];

  const { data: pools } = await supabase
    .from("pools")
    .select("*")
    .eq("pool_date", today)
    .eq("status", "open");

  if (!pools || pools.length === 0) {
    return new Response(JSON.stringify({ message: "No pools to resolve" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const results = [];

  for (const pool of pools) {
    const { data: entries } = await supabase
      .from("pool_entries")
      .select("*")
      .eq("pool_id", pool.id);

    if (!entries || entries.length === 0) continue;

    const winners = entries.filter((e) => e.checked_in === true);
    const losers = entries.filter((e) => e.checked_in === false);
    const totalPot = entries.length * pool.stake_amount;

    if (winners.length > 0) {
      const winnerShare = totalPot / winners.length;

      for (const winner of winners) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("balance")
          .eq("id", winner.user_id)
          .single();

        if (profile) {
          await supabase
            .from("profiles")
            .update({ balance: profile.balance + winnerShare })
            .eq("id", winner.user_id);
        }
      }
    }

    await supabase
      .from("pools")
      .update({ status: "resolved" })
      .eq("id", pool.id);

    results.push({
      pool_id: pool.id,
      winners: winners.length,
      losers: losers.length,
      total_pot: totalPot,
    });
  }

  return new Response(JSON.stringify({ resolved: results }), {
    headers: { "Content-Type": "application/json" },
  });
}
