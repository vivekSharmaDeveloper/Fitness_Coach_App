"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = [
  { value: "fitness", label: "Fitness" },
  { value: "nutrition", label: "Nutrition" },
  { value: "mental_health", label: "Mental Health" },
  { value: "productivity", label: "Productivity" },
  { value: "sleep", label: "Sleep" },
  { value: "other", label: "Other" },
] as const;

interface CategoryTabsProps {
  categories: string[];
  categoryCounts: { [key: string]: number };
}

export function CategoryTabs({ categories, categoryCounts }: CategoryTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <Tabs
      value={currentCategory}
      onValueChange={handleCategoryChange}
      className="w-full mb-6"
    >
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
        <TabsTrigger value="all">
          All Goals ({Object.values(categoryCounts).reduce((a, b) => a + b, 0)})
        </TabsTrigger>
        {CATEGORIES.map((category) => (
          <TabsTrigger key={category.value} value={category.value}>
            {category.label} ({categoryCounts[category.value] || 0})
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
} 