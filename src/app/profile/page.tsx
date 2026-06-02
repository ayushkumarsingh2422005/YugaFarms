"use client";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { messageFromError } from "@/lib/authSession";
import { ApiAuthError } from "@/lib/apiAuthError";
import { profileFormToStrapiPayload } from "@/lib/userProfile";
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

export default function ProfilePage() {
  const { user, userProfile, profileRevision, profileReady, updateUserProfile } = useAuth();
  const { jwt, isLoading, isAuthed, handleAuthFailure } = useRequireAuth("/profile");
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
    if (!isAuthed || !userProfile) return;
    setUsername(userProfile.username || "");
    setEmail(userProfile.email || "");
    setPhone(userProfile.phone || "");
    setAddress({
      AddressLine1: userProfile.addressLine1 || "",
      AddressLine2: userProfile.addressLine2 || "",
      City: userProfile.city || "",
      State: (userProfile.state || "Maharashtra") as Address["State"],
      Pin: userProfile.pin || "",
    });
  }, [isAuthed, userProfile, profileRevision]);

  const stateOptions = useMemo(
    () => [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    ],
    []
  );

  const updateAddress = (field: keyof Address, value: string | number) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !jwt) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = profileFormToStrapiPayload({
        username,
        email,
        addressLine1: address.AddressLine1,
        addressLine2: address.AddressLine2,
        city: address.City,
        state: address.State,
        pin: address.Pin,
      });

      await updateUserProfile(payload);
      setSuccess("Profile updated");
    } catch (e) {
      const status = e instanceof ApiAuthError ? e.status : undefined;
      const message = messageFromError(e, "Save failed");
      if (handleAuthFailure(status, message)) return;
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !jwt || (isAuthed && !profileReady)) {
    return (
      <>
        <TopBar />
        <div className="min-h-[70vh] bg-[#fdf7f2] flex items-center justify-center px-4">
          <p className="text-[#4b2e19]">Loading...</p>
        </div>
      </>
    );
  }

  if (isAuthed && profileReady && !userProfile) {
    return (
      <>
        <TopBar />
        <div className="min-h-[70vh] bg-[#fdf7f2] flex items-center justify-center px-4">
          <p className="text-[#4b2e19] text-center">
            Could not load your profile. Please sign in again.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar />
      <div className="min-h-[70vh] bg-[#fdf7f2] flex items-start justify-center px-4 py-4 md:py-6">
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
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-[#2D2D2D]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5d26a] bg-white"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm text-[#2D2D2D]/80 mb-1">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  disabled
                  className="w-full rounded-lg border border-[#2D2D2D]/20 px-3 py-2 bg-[#fdf7f2] text-[#2D2D2D]/70 cursor-not-allowed"
                  placeholder="Phone number cannot be changed"
                />
                <p className="text-xs text-[#2D2D2D]/60 mt-1">Phone number cannot be changed for security reasons</p>
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


