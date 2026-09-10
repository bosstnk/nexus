import type { ComponentType } from "react";
import { z } from "zod";
import {
  DropletsIcon,
  UsersIcon,
  ZapIcon,
  type IconProps,
} from "@/components/ui/icons";
import type { EntryKind } from "./types";

export type MetricField = {
  key: string;
  labelTh: string;
  labelEn: string;
  placeholder: string;
  prefix?: string;
  suffix?: string;
  min: number;
};

export type EntrySchema = {
  key: EntryKind;
  titleTh: string;
  titleEn: string;
  tabLabel: string;
  icon: ComponentType<IconProps>;
  tile: string;
  accent: string;
  metrics: MetricField[];
};

export const ENTRY_SCHEMAS: Record<EntryKind, EntrySchema> = {
  electricity: {
    key: "electricity",
    titleTh: "การใช้ไฟฟ้า",
    titleEn: "Electricity Consumption",
    tabLabel: "ไฟฟ้า",
    icon: ZapIcon,
    tile: "bg-warning-light text-warning-dark",
    accent: "text-warning-dark",
    metrics: [
      {
        key: "consumption_kwh",
        labelTh: "ปริมาณการใช้ไฟฟ้า",
        labelEn: "Usage",
        placeholder: "เช่น 48200",
        suffix: "kWh",
        min: 1,
      },
      {
        key: "cost",
        labelTh: "ค่าไฟฟ้า",
        labelEn: "Cost",
        placeholder: "เช่น 192800",
        prefix: "฿",
        min: 1,
      },
    ],
  },
  water: {
    key: "water",
    titleTh: "การใช้น้ำ",
    titleEn: "Water Consumption",
    tabLabel: "น้ำ",
    icon: DropletsIcon,
    tile: "bg-blue-50 text-blue-600",
    accent: "text-blue-600",
    metrics: [
      {
        key: "consumption_m3",
        labelTh: "ปริมาณการใช้น้ำ",
        labelEn: "Usage",
        placeholder: "เช่น 3200",
        suffix: "m³",
        min: 1,
      },
      {
        key: "cost",
        labelTh: "ค่าน้ำ",
        labelEn: "Cost",
        placeholder: "เช่น 19200",
        prefix: "฿",
        min: 1,
      },
    ],
  },
  workforce: {
    key: "workforce",
    titleTh: "จำนวนคนงาน",
    titleEn: "Workforce",
    tabLabel: "กำลังคน",
    icon: UsersIcon,
    tile: "bg-green-50 text-green-600",
    accent: "text-green-600",
    metrics: [
      {
        key: "headcount",
        labelTh: "จำนวนพนักงาน",
        labelEn: "Headcount",
        placeholder: "เช่น 45",
        suffix: "คน",
        min: 1,
      },
    ],
  },
};

export const ENTRY_KINDS = Object.keys(ENTRY_SCHEMAS) as EntryKind[];

export function metricHeader(metric: MetricField) {
  const unit = metric.suffix ?? metric.prefix;
  return unit ? `${metric.labelTh} (${unit})` : metric.labelTh;
}

export function formatMetric(metric: MetricField, value: number) {
  return `${metric.prefix ?? ""}${value.toLocaleString("en-US")}`;
}

const metricValue = (metric: MetricField) =>
  z
    .string()
    .trim()
    .min(1, { error: `กรุณากรอก${metric.labelTh}` })
    .refine((raw) => Number.isFinite(Number(raw)), { error: "กรอกเป็นตัวเลข" })
    .refine((raw) => Number(raw) >= metric.min, {
      error:
        metric.min > 0
          ? `${metric.labelTh}ต้องมากกว่า 0`
          : `${metric.labelTh}ต้องไม่ติดลบ`,
    });

export function buildEntryFormSchema(schema: EntrySchema) {
  return z.object({
    year: z.string(),
    month: z.string(),
    values: z.object(
      Object.fromEntries(
        schema.metrics.map((metric) => [metric.key, metricValue(metric)]),
      ),
    ),
  });
}

export type EntryFormValues = {
  year: string;
  month: string;
  values: Record<string, string>;
};
