export const mockSupabaseClient = {
  auth: {
    getUser: async () => ({
      data: {
        user: {
          id: "mock-user",
          email: "elbek@example.com",
        },
      },
    }),
    signOut: async () => ({ error: null }),
    signInWithOAuth: async () => ({ error: null }),
  },
  storage: {
    from: () => ({
      upload: async () => ({ data: { path: "mock" }, error: null }),
      getPublicUrl: () => ({
        data: {
          publicUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400",
        },
      }),
    }),
  },
  from: (table: string) => {
    return {
      select: () => {
        return {
          order: () => {
            return {
              data: [
                {
                  id: "1",
                  image_url: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400",
                  item_name: "Coca-Cola Plastic Bottle",
                  category: "Plastic",
                  material: "PET Plastic",
                  recyclable: true,
                  confidence: 96,
                  decomposition_time: "450 years / 450 yil",
                  disposal_bin: "Yellow recycling bin / Sariq konteyner",
                  not_to_do: ["Do not burn / Yoqib yubormang", "Do not throw with caps on / Qopqog'ini yopgan holda tashlamang"],
                  environmental_impact: "Microplastics harm sealife / Mikroplastik atrof-muhitni zararlaydi",
                  fun_fact: "PET is 100% recyclable / PET 100% qayta ishlanadi",
                  advice: "Crush before disposal / Tashlashdan oldin maydalang",
                  summary: "Plastic bottle detected / Plastik idish aniqlandi.",
                  created_at: new Date(Date.now() - 3600000).toISOString(),
                },
                {
                  id: "2",
                  image_url: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=400",
                  item_name: "Daily Newspaper",
                  category: "Paper",
                  material: "Newsprint paper",
                  recyclable: true,
                  confidence: 92,
                  decomposition_time: "2-6 weeks / 2-6 hafta",
                  disposal_bin: "Blue paper recycling bin / Moviy konteyner",
                  not_to_do: ["Do not wet / Ho'l qilmang", "Remove plastic wraps / Plastik qoplamalarni yechib oling"],
                  environmental_impact: "Reduces deforestation / Daraxtlar kesilishini kamaytiradi",
                  fun_fact: "Paper can be recycled up to 7 times / Qog'oz 7 martagacha qayta ishlanadi",
                  advice: "Keep dry / Quruq holda saqlang",
                  summary: "Newspaper paper detected / Gazeta qog'ozi aniqlandi.",
                  created_at: new Date(Date.now() - 7200000).toISOString(),
                },
              ],
              error: null,
            };
          },
          eq: (field: string, value: any) => {
            return {
              single: () => {
                if (table === "profiles") {
                  return {
                    data: {
                      id: "mock-user",
                      full_name: "Alisherov Elbek",
                      eco_score: 285,
                      level: 3,
                      avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80",
                    },
                    error: null,
                  };
                }
                return { data: null, error: null };
              },
              maybeSingle: () => {
                if (table === "user_stats") {
                  return {
                    data: {
                      user_id: "mock-user",
                      total_scans: 18,
                      plastic_count: 8,
                      paper_count: 4,
                      glass_count: 3,
                      organic_count: 2,
                    },
                    error: null,
                  };
                }
                return { data: null, error: null };
              },
            };
          },
        };
      },
      insert: () => {
        return {
          select: () => {
            return {
              single: () => {
                return {
                  data: { id: "new-scan-id" },
                  error: null,
                };
              },
            };
          },
        };
      },
    };
  },
} as any;
