"use client";

import * as React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
export default function ChartComponent() {
  const { data: session } = useSession();
  const [chartData, setChartData] = useState<
    { month: string; transaction: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!session?.user.access_token) return; // Hindari request sebelum token tersedia
      try {
        const token = session.user.access_token;
        const response = await axios.get<{
          message: string;
          data: { month: string; transaction: number }[];
        }>("http://localhost:8002/api/chart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("ini response data", response.data);
        const { data } = response.data;
        if (Array.isArray(data)) {
          setChartData(data);
        }
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [session]);

  const chartConfig = {
    transaction: {
      label: "Transactions",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  return (
    <div className="px-5 pt-[56px]">
      {loading ? (
        <p>Loading chart...</p>
      ) : (
        <ChartContainer config={chartConfig} className="h-[700px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="transaction"
              fill="var(--color-transaction)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
}
