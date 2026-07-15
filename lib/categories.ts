import { Briefcase, HeartPulse, Sparkles, Users, type LucideIcon } from "lucide-react";
import type { GoalCategory } from "@prisma/client";

type CategoryConfig = {
  label: string;
  icon: LucideIcon;
  text: string;
  bg: string;
  softBg: string;
  border: string;
  ring: string;
};

export const CATEGORY_CONFIG: Record<GoalCategory, CategoryConfig> = {
  HEALTH: {
    label: "Health",
    icon: HeartPulse,
    text: "text-health",
    bg: "bg-health",
    softBg: "bg-health-soft",
    border: "border-health",
    ring: "ring-health",
  },
  CAREER: {
    label: "Career",
    icon: Briefcase,
    text: "text-career",
    bg: "bg-career",
    softBg: "bg-career-soft",
    border: "border-career",
    ring: "ring-career",
  },
  PERSONAL: {
    label: "Personal",
    icon: Sparkles,
    text: "text-personal",
    bg: "bg-personal",
    softBg: "bg-personal-soft",
    border: "border-personal",
    ring: "ring-personal",
  },
  SOCIAL: {
    label: "Social",
    icon: Users,
    text: "text-social",
    bg: "bg-social",
    softBg: "bg-social-soft",
    border: "border-social",
    ring: "ring-social",
  },
};

export const CATEGORY_ORDER: GoalCategory[] = ["HEALTH", "CAREER", "PERSONAL", "SOCIAL"];
