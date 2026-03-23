import { supabase } from "./supabase";

let currentProfileId: string | null = null;
let currentEmail: string | null = null;
let currentProfileData: any = null;

export async function initSync(email: string) {
  currentEmail = email;
  let { data: profile } = await supabase
    .from("puglife_profiles")
    .select("*")
    .eq("email", email)
    .single();

  if (!profile) {
    const { data: newProfile, error } = await supabase
      .from("puglife_profiles")
      .insert([
        {
          email,
          user_name: "Danielle",
          pet_name: "Lollie",
          partner_name: "Matt",
          settings: {}
        },
      ])
      .select()
      .single();
    if (error) console.error("Error creating profile", error);
    profile = newProfile;
  }

  if (profile) {
    currentProfileId = profile.id;
    currentProfileData = profile;
    if (typeof window !== "undefined") {
      localStorage.setItem("puglife-profile", JSON.stringify(profile));
    }
  }

  return profile;
}

export function getCurrentProfile() {
  return currentProfileData;
}

export function getCurrentProfileId() {
  return currentProfileId;
}

export async function syncToSupabase(type: string, data: any) {
  if (!currentProfileId) return; // Wait until initSync completes or skip if not logged in

  try {
    if (type === "tasks") {
      // Data is an array of tasks
      // Upsert tasks
      const tasksToUpsert = data.map((t: any) => ({
        id: t.id,
        profile_id: currentProfileId,
        label: t.label || t.text || "",
        icon: t.icon || "",
        is_recurring: t.isRecurring || false,
        section: t.section || "",
        completed: t.completed || false,
        completed_at: t.completedAt || null,
      }));
      if (tasksToUpsert.length > 0) {
        await supabase.from("puglife_tasks").upsert(tasksToUpsert, { onConflict: 'id' });
      }
    } else if (type === "rewards") {
      // Data is RewardsState
      await supabase.from("puglife_rewards").upsert({
        profile_id: currentProfileId,
        level: data.level,
        treats: data.treats,
        unlocked_outfits: data.unlockedOutfits || [],
        equipped_outfit: data.equippedOutfit || null,
        achievements: data.achievements || [],
      }, { onConflict: 'profile_id' });
    } else if (type === "water" || type === "mood" || type === "alcohol") {
      // Combine into puglife_habits_log
      // We will need date
      const date = data.date;
      if (!date) return;
      
      const updateData: any = {
        profile_id: currentProfileId,
        log_date: date,
      };

      if (type === "water") {
        updateData.water_oz = data.entries ? data.entries.reduce((a:number,b:any) => a + (b.amountOz||0), 0) : 0;
        updateData.water_goal_oz = data.goalOz || 64;
      } else if (type === "mood") {
        updateData.mood_level = data.mood;
      } else if (type === "alcohol") {
        updateData.alcohol_drinks = data.entries ? data.entries.length : 0;
      }

      // Upsert requires checking if it exists or using ON CONFLICT (profile_id, log_date)
      // Supabase standard way:
      await supabase.from("puglife_habits_log").upsert(updateData, { onConflict: 'profile_id,log_date' });
    }
  } catch (error) {
    console.error("Error syncing to Supabase:", error);
  }
}

export async function fetchCloudData() {
  if (!currentProfileId) return null;
  const [tasksRes, rewardsRes, habitsRes] = await Promise.all([
    supabase.from("puglife_tasks").select("*").eq("profile_id", currentProfileId),
    supabase.from("puglife_rewards").select("*").eq("profile_id", currentProfileId).single(),
    supabase.from("puglife_habits_log").select("*").eq("profile_id", currentProfileId)
  ]);
  
  return {
    tasks: tasksRes.data,
    rewards: rewardsRes.data,
    habits: habitsRes.data
  };
}
