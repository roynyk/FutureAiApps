import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  generateChart,
  generateImage,
  generateVideo,
} from "@/features/ai/generative-content";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  ImageIcon,
  Loader2Icon,
  PieChartIcon,
  Sparkle,
  SparkleIcon,
  VideoIcon,
} from "lucide-react";
import { KeyboardEvent, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn, convertToIDR } from "@/lib/utils";
import Image from "next/image";

const formSchema = z.object({
  request: z.string().min(1, "request is required"),
});

const COLORS = [
  "#84cc16",
  "#f97316",
  "#ec4899",
  "#6366f1",
  "#14b8a6",
  "#d946ef",
  "#6b7280",
];

export default function GenerativeContent() {
  const [insightType, setInsightType] = useState<"chart" | "image" | "video">(
    "chart",
  );

  const [result, setResult] = useState<
    | {
        type: "chart";
        chartType: "pie" | "bar";
        data: { name: string; value: number }[];
      }
    | {
        type: "image";
        data: string;
      }
    | {
        type: "video";
        data: string;
      }
    | null
  >(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      request: "",
    },
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (request: string) => {
      switch (insightType) {
        case "chart":
          const result = await generateChart(request);
          return { ...result, type: "chart" };
        case "image":
          const resultImage = await generateImage(request);
          return {
            type: "image",
            data: resultImage,
          };
        case "video":
          const resultVideo = await generateVideo(request);
          return {
            type: "video",
            data: resultVideo,
          };
        default:
          return null;
      }
    },
    onSuccess: (response) => {
      setResult(response);
      toast.success(`Success generate ${insightType}`);
      form.reset();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to generate ${insightType}`,
      );
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    mutate(data.request);
  }

  // function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
  //   if (e.key === "Enter" && !e.shiftKey) {
  //     e.preventDefault();
  //     form.handleSubmit(onSubmit)();
  //     // onSubmit(form.getValues());
  //   }
  // }

  // console.log(result);

  return (
    <Card className="w-full relative overflow-hidden">
      <CardHeader>
        <div className="flex flex-col justify-between gap-4v lg:flex-row lg:items-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <SparkleIcon className="size-5 text-primary" />
            Generative AI
          </CardTitle>
          <form
            className="flex flex-col gap-2 lg:flex-row lg:items-center"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <ButtonGroup>
              <Button
                variant={insightType === "chart" ? "default" : "secondary"}
                type="button"
                size="icon"
                onClick={() => setInsightType("chart")}
              >
                <PieChartIcon className="size-5" />
              </Button>
              <Button
                variant={insightType === "image" ? "default" : "secondary"}
                type="button"
                size="icon"
                onClick={() => setInsightType("image")}
              >
                <ImageIcon className="size-5" />
              </Button>
              <Button
                variant={insightType === "video" ? "default" : "secondary"}
                type="button"
                size="icon"
                onClick={() => setInsightType("video")}
              >
                <VideoIcon className="size-5" />
              </Button>
            </ButtonGroup>
            <div className="flex flex-row gap-2">
              <Controller
                control={form.control}
                name="request"
                render={({ field }) => (
                  <Field>
                    <Input
                      {...field}
                      id="form-request"
                      placeholder="Insert Your request"
                      className="w-50 lg:w-70"
                      // onKeyDown={handleKeyDown}
                      disabled={isPending}
                    />
                  </Field>
                )}
              />
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader2Icon className="animate-spin size-4" />
                ) : (
                  <Sparkle className="size-4" />
                )}
                <span className="hidden lg:inline">
                  {result ? "Update" : "Generate"}
                </span>
              </Button>
            </div>
          </form>
        </div>
      </CardHeader>
      <CardContent className={cn(result?.type === "chart" && "h-75")}>
        {error && (
          <div className="p-4 text-sm border rounded-lg text-destructive border-destructive/50 bg-destructive/10">
            {error.message}
          </div>
        )}
        {!result ? (
          <div className="h-70 flex flex-row items-center justify-center border-2 border-dashed rounded-lg">
            {isPending ? (
              <div className="flex flex-col items-center">
                <Loader2Icon className="size-8 animate-spin" />
                <span>AI is generating insight</span>
              </div>
            ) : (
              <span className="text-lg text-muted-foreground/50">
                Generate insight content with AI
              </span>
            )}
          </div>
        ) : (
          <div className="h-full">
            {result.type === "chart" && (
              <ResponsiveContainer width="100%" height="100%">
                {result.chartType === "bar" ? (
                  <BarChart data={result.data}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) =>
                        convertToIDR(Number(value) || 0)
                      }
                      style={{
                        fontSize: "7.5px",
                      }}
                    />
                    <Tooltip
                      formatter={(value) => convertToIDR(Number(value) || 0)}
                      contentStyle={{
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="var(--color-primary)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={result.data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(props) => (
                        <text
                          x={props.x}
                          y={props.y}
                          fill={COLORS[props.index % COLORS.length]}
                          textAnchor={props.textAnchor}
                          dominantBaseline="central"
                          fontSize={14}
                        >
                          {`${props.name} (${((props.percent || 0) * 100).toFixed(0)}%)`}
                        </text>
                      )}
                      outerRadius={100}
                      dataKey="value"
                      shape={(props, index) => (
                        <Sector
                          {...props}
                          fill={COLORS[index % COLORS.length]}
                        />
                      )}
                    />
                    <Tooltip
                      formatter={(value) => convertToIDR(Number(value) || 0)}
                      contentStyle={{
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                )}
              </ResponsiveContainer>
            )}
            {result.type === "image" && (
              <div className="flex items-center">
                <Image
                  width={1928}
                  height={1080}
                  src={result.data}
                  alt="Generate AI Image"
                  className="rounded-xl"
                ></Image>
              </div>
            )}
            {result.type === "video" && (
              <div className="flex items-center">
                <video
                  src={result.data}
                  controls
                  className="w-full border rounded-xl aspect-video"
                >
                  Your browser doesnt support
                </video>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
