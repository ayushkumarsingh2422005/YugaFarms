"use client";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";

type Address = {
  AddressLine1: string;
  AddressLine2?: string;
  City: string;
  State:
    | "Andhra Pradesh" | "Arunachal Pradesh" | "Assam" | "Bihar" | "Chhattisgarh" | "Goa" | "Gujarat" | "Haryana" | "Himachal Pradesh" | "Jharkhand" | "Karnataka" | "Kerala" | "Madhya Pradesh" | "Maharashtra" | "Manipur" | "Meghalaya" | "Mizoram" | "Nagaland" | "Odisha" | "Punjab" | "Rajasthan" | "Sikkim" | "Tamil Nadu" | "Telangana" | "Tripura" | "Uttar Pradesh" | "Uttarakhand" | "West Bengal";
  Pin: number | string;
};

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

export default function ProfilePage() {
  const { user, jwt, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<Address>({
    AddressLine1: "",
    AddressLine2: "",
    City: "",
    State: "Maharashtra",
    Pin: "",
  });

  useEffect(() => {
    const load = async () => {
      if (!jwt) {
        console.log("No JWT token available");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        console.log("Loading profile with JWT:", jwt.substring(0, 20) + "...");
        const res = await fetch(`${BACKEND}/api/users/me`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        console.log("Profile API response status:", res.status);
        if (!res.ok) {
          const errorText = await res.text();
          console.log("Profile API error response:", errorText);
          throw new Error(`Failed to load profile: ${res.status} ${errorText}`);
        }
        const me = await res.json();
        console.log("Profile data loaded:", me);
        setUsername(me.username || "");
        setEmail(me.email || "");
        setPhone(me.Phone != null ? String(me.Phone) : "");
        setAddress({
          AddressLine1: me.AddressLine1 || "",
          AddressLine2: me.AddressLine2 || "",
          City: me.City || "",
          State: me.State || "Maharashtra",
          Pin: me.Pin || "",
        });
      } catch (e: any) {
        console.error("Profile loading error:", e);
        setError(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [jwt]);

  const stateOptions = useMemo(
    () => [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    ],
    []
  );

  const updateAddress = (field: keyof Address, value: any) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !jwt) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      // Prepare the complete payload with all fields
      const payload: any = {};
      if (username?.trim()) payload.username = username.trim();
      if (phone && /\d{6,}/.test(phone)) payload.Phone = Number(phone);
      
      // Add address fields directly to the payload
      if (address.AddressLine1?.trim()) payload.AddressLine1 = address.AddressLine1.trim();
      if (address.AddressLine2?.trim()) payload.AddressLine2 = address.AddressLine2.trim();
      if (address.City?.trim()) payload.City = address.City.trim();
      if (address.State) payload.State = address.State;
      if (address.Pin && String(address.Pin).replace(/[^0-9]/g, "").length >= 4) {
        payload.Pin = Number(String(address.Pin).replace(/[^0-9]/g, ""));
      }

      const res = await fetch(`${BACKEND}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || "Failed to save profile");
      }


      setSuccess("Profile updated");
      await refreshUser();

      // Reload the profile data to get updated address
      const reloadRes = await fetch(`${BACKEND}/api/users/me`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (reloadRes.ok) {
        const updatedUser = await reloadRes.json();
        setAddress({
          AddressLine1: updatedUser.AddressLine1 || "",
          AddressLine2: updatedUser.AddressLine2 || "",
          City: updatedUser.City || "",
          State: updatedUser.State || "Maharashtra",
          Pin: updatedUser.Pin || "",
        });
      }
    } catch (e: any) {
      setError(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!jwt) {
    return (
      <div className="min-h-[70vh] bg-[#fdf7f2] flex items-center justify-center px-4">
        <div className="bg-white/80 border border-[#2D2D2D]/10 rounded-xl p-6">Please log in to manage your profile.</div>
      </div>
    );
  }

  return (
    <>
      <TopBar />
      <div className="min-h-[70vh] bg-[#fdf7f2] flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-3xl bg-white/80 backdrop-blur rounded-xl shadow border border-[#2D2D2D]/10 p-6">
          <h1 className="text-2xl font-semibold text-[#4b2e19]">Manage profile</h1>
          <p className="text-sm text-[#2D2D2D]/70">Update your personal details and addresses</p>

          {error && (
            <div className="mt-4 text-sm text-[#7a1a1a] bg-[#fddedd] border border-[#7a1a1a]/20 rounded p-3">{error}</div>
          )}
          {success && (
            <div className="mt-4 text-sm text-[#2D2D2D] bg-[#f5d26a]/20 border border-[#f5d26a]/40 rounded p-3">{success}</div>
          )}

          <form onSubmit={handleSave} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#2D2D2D]/80 mb-1">Name</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-[#2D2D2D]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5d26a] bg-white"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm text-[#2D2D2D]/80 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full rounded-lg border border-[#2D2D2D]/20 px-3 py-2 bg-[#fdf7f2] text-[#2D2D2D]/70"
                />
              </div>
              <div>
                <label className="block text-sm text-[#2D2D2D]/80 mb-1">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full rounded-lg border border-[#2D2D2D]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5d26a] bg-white"
                  placeholder="10-digit phone"
                />
              </div>
            </div>

             <div>
               <h2 className="text-lg font-semibold text-[#4b2e19] mb-4">Address</h2>
               <div className="border border-[#2D2D2D]/10 rounded-lg p-4 bg-white">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm text-[#2D2D2D]/80 mb-1">Address line 1 *</label>
                     <input
                       type="text"
                       value={address.AddressLine1}
                       onChange={(e) => updateAddress("AddressLine1", e.target.value)}
                       className="w-full rounded-lg border border-[#2D2D2D]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5d26a] bg-white"
                       placeholder="House / Street"
                       required
                     />
                   </div>
                   <div>
                     <label className="block text-sm text-[#2D2D2D]/80 mb-1">Address line 2</label>
                     <input
                       type="text"
                       value={address.AddressLine2 || ""}
                       onChange={(e) => updateAddress("AddressLine2", e.target.value)}
                       className="w-full rounded-lg border border-[#2D2D2D]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5d26a] bg-white"
                       placeholder="Area / Landmark (optional)"
                     />
                   </div>
                   <div>
                     <label className="block text-sm text-[#2D2D2D]/80 mb-1">City *</label>
                     <input
                       type="text"
                       value={address.City}
                       onChange={(e) => updateAddress("City", e.target.value)}
                       className="w-full rounded-lg border border-[#2D2D2D]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5d26a] bg-white"
                       placeholder="City"
                       required
                     />
                   </div>
                   <div>
                     <label className="block text-sm text-[#2D2D2D]/80 mb-1">State *</label>
                     <select
                       value={address.State}
                       onChange={(e) => updateAddress("State", e.target.value as Address["State"])}
                       className="w-full rounded-lg border border-[#2D2D2D]/20 px-3 py-2 bg-white"
                       required
                     >
                       {stateOptions.map((s) => (
                         <option key={s} value={s}>{s}</option>
                       ))}
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm text-[#2D2D2D]/80 mb-1">PIN *</label>
                     <input
                       type="text"
                       inputMode="numeric"
                       value={String(address.Pin ?? "")}
                       onChange={(e) => updateAddress("Pin", e.target.value.replace(/[^0-9]/g, ""))}
                       className="w-full rounded-lg border border-[#2D2D2D]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5d26a] bg-white"
                       placeholder="6-digit PIN"
                       required
                     />
                   </div>
                 </div>
               </div>
             </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#4b2e19] text-[#f5d26a] font-semibold px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}


