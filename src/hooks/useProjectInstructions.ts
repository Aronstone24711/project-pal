import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Component, Project, ProjectInstructions } from "@/types/arduino";
import type { EnglishLevel } from "@/components/EnglishLevelSelector";
import {
  instructionCacheKey,
  readCachedInstructions,
  writeCachedInstructions,
} from "@/hooks/useInstructionCache";

interface Args {
  project: Project;
  components: Component[];
  language: string;
  englishLevel: EnglishLevel;
}

/** Owns fetching + offline caching so the view layer stays presentational. */
export const useProjectInstructions = ({ project, components, language, englishLevel }: Args) => {
  const [instructions, setInstructions] = useState<ProjectInstructions | null>(null);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);
  const { toast } = useToast();

  const load = useCallback(async () => {
    const cacheKey = instructionCacheKey(project.name, language, englishLevel);
    const cached = readCachedInstructions(cacheKey);

    if (cached) {
      setInstructions(cached);
      setCode(cached.project.code?.code || "");
      setFromCache(true);
      setIsLoading(false);
      if (!navigator.onLine) return;
    }

    if (!navigator.onLine) {
      setIsLoading(false);
      toast({
        title: "You are offline",
        description: "This project has not been saved for offline use yet.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-components", {
        body: {
          action: "get_instructions",
          projectId: `${project.name} - ${project.description}`,
          components: components.map((c) => ({ name: c.name, type: c.type, quantity: c.quantity })),
          language,
          englishLevel,
        },
      });

      if (error) throw error;

      if (data?.project) {
        setInstructions(data);
        setCode(data.project.code?.code || "");
        setFromCache(false);
        writeCachedInstructions(cacheKey, data);
      }
    } catch (error: any) {
      if (cached) return;
      toast({
        title: "Failed to Load Instructions",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, components, language, englishLevel]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  const applyFixedCode = useCallback((next: string) => {
    setCode(next);
    setInstructions((prev) =>
      prev
        ? { ...prev, project: { ...prev.project, code: { ...prev.project.code, code: next } } }
        : prev
    );
  }, []);

  return { instructions, code, isLoading, fromCache, reload: load, applyFixedCode };
};
