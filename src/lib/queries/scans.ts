import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useScanHistory(userId: string) {
  return useQuery({
    queryKey: ["scans", userId],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("scans")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
}

export function useUserStats(userId: string) {
  return useQuery({
    queryKey: ["stats", userId],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data || {
        user_id: userId,
        total_scans: 0,
        plastic_count: 0,
        paper_count: 0,
        glass_count: 0,
        organic_count: 0
      };
    },
    enabled: !!userId,
  });
}

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useSaveScan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (scanData: Record<string, any>) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("scans")
        .insert(scanData)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["scans"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
