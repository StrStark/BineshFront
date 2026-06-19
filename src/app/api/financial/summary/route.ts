import { NextRequest } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAuth } from "@/lib/server/middleware";
import { success, fail } from "@/lib/server/response";

export async function GET(request: NextRequest) {
  const { session, errorResponse } = await requireAuth(request);
  if (errorResponse) return errorResponse;

  try {
    const [totalSaleAgg, financialTxns] = await Promise.all([
      prisma.sale.aggregate({ _sum: { amount: true } }),
      prisma.financialTransaction.findMany(),
    ]);

    const totalSale = totalSaleAgg._sum.amount || 0;
    const totalExpenses = financialTxns
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    const totalIncome = financialTxns
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);

    const netProfit = totalSale - totalExpenses;
    const profitMargin = totalSale > 0 ? Math.round((netProfit / totalSale) * 10000) / 100 : 0;
    const liquidity = totalIncome - totalExpenses;

    return success({
      stateCards: {
        totalSale: { value: totalSale, growth: 0 },
        profitMargine: { value: profitMargin, growth: 0 },
        netProfit: { value: netProfit, growth: 0 },
        liquidity: { value: liquidity, growth: 0 },
      },
      balanceSheet: {
        stateCards: {
          assets: { value: totalSale + liquidity, growth: 0 },
          liability: { value: totalExpenses, growth: 0 },
          equities: { value: netProfit, growth: 0 },
        },
        items: { mainItems: [] },
      },
      profitLossSheet: {
        grossProfitLoss: {
          value: { title: "سود ناخالص", value: totalSale - totalExpenses },
          drtailed: [],
        },
        operationalProfitLoss: {
          value: { title: "سود عملیاتی", value: totalSale - totalExpenses },
          drtailed: [],
        },
        profitLossBeforTax: {
          value: { title: "سود قبل از مالیات", value: totalSale - totalExpenses },
          drtailed: [],
        },
        netProfitLoss: {
          value: { title: "سود خالص", value: netProfit },
          drtailed: [],
        },
        accumilatedProfitLoss: {
          value: { title: "سود انباشته", value: netProfit },
          drtailed: [],
        },
      },
    });
  } catch (error) {
    console.error("GetFinancialSummary error:", error);
    return fail("Error fetching financial summary", 500);
  }
}
