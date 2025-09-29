"use client";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

type Address = {
  id?: number;
  AddressLine1: string;
  AdressLine2?: string;
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
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!jwt) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BACKEND}/api/users/me?populate=Address`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        if (!res.ok) throw new Error("Failed to load profile");
        const me = await res.json();
        setUsername(me.username || "");
        setEmail(me.email || "");
        setPhone(me.Phone != null ? String(me.Phone) : "");
        setAddresses(
          Array.isArray(me.Address)
            ? me.Address.map((a: any) => ({
                id: a.id,
                AddressLine1: a.AddressLine1,
                AdressLine2: a.AdressLine2,
                City: a.City,
                State: a.State,
                Pin: a.Pin,
              }))
            : []
        );
      } catch (e: any) {
        setError(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [jwt]);

  const stateOptions = useMemo(
    () => [
      "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
    ],
    []
  );

  const addAddress = () => {
    setAddresses((prev) => [
      ...prev,
      { AddressLine1: "", AdressLine2: "", City: "", State: "Maharashtra", Pin: "" },
    ]);
  };

  const updateAddress = (index: number, field: keyof Address, value: any) => {
    setAddresses((prev) => prev.map((a, i) => (i === index ? { ...a, [field]: value } : a)));
  };

  const removeAddress = (index: number) => {
    setAddresses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !jwt) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload: any = {};
      if (username?.trim()) payload.username = username.trim();
      if (phone && /\d{6,}/.test(phone)) payload.Phone = Number(phone);
      const cleanedAddresses = addresses
        .map((a) => ({
          id: a.id,
          AddressLine1: a.AddressLine1?.trim() || "",
          AdressLine2: (a.AdressLine2 || "").trim(),
          City: a.City?.trim() || "",
          State: a.State,
          Pin: String(a.Pin || "").replace(/[^0-9]/g, ""),
        }))
        .filter((a) => a.AddressLine1 && a.City && a.State && a.Pin && a.Pin.length >= 4);
      if (cleanedAddresses.length > 0) {
        payload.Address = cleanedAddresses.map((a) => {
          const out: any = {
            AddressLine1: a.AddressLine1,
            AdressLine2: a.AdressLine2,
            City: a.City,
            State: a.State,
            Pin: Number(a.Pin),
          };
          if (a.id) out.id = a.id;
          return out;
        });
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
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-[#4b2e19]">Addresses</h2>
              <button type="button" onClick={addAddress} className="text-sm bg-[#4b2e19] text-[#f5d26a] px-3 py-1 rounded-lg hover:opacity-90">Add address</button>
            </div>
            <div className="space-y-4">
              {addresses.map((addr, idx) => (
                <div key={idx} className="border border-[#2D2D2D]/10 rounded-lg p-4 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#2D2D2D]/80 mb-1">Address line 1</label>
                      <input
                        type="text"
                        value={addr.AddressLine1}
                        onChange={(e) => updateAddress(idx, "AddressLine1", e.target.value)}
                        className="w-full rounded-lg border border-[#2D2D2D]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5d26a] bg-white"
                        placeholder="House / Street"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#2D2D2D]/80 mb-1">Address line 2</label>
                      <input
                        type="text"
                        value={addr.AdressLine2 || ""}
                        onChange={(e) => updateAddress(idx, "AdressLine2", e.target.value)}
                        className="w-full rounded-lg border border-[#2D2D2D]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5d26a] bg-white"
                        placeholder="Area / Landmark (optional)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#2D2D2D]/80 mb-1">City</label>
                      <input
                        type="text"
                        value={addr.City}
                        onChange={(e) => updateAddress(idx, "City", e.target.value)}
                        className="w-full rounded-lg border border-[#2D2D2D]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5d26a] bg-white"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#2D2D2D]/80 mb-1">State</label>
                      <select
                        value={addr.State}
                        onChange={(e) => updateAddress(idx, "State", e.target.value as Address["State"])}
                        className="w-full rounded-lg border border-[#2D2D2D]/20 px-3 py-2 bg-white"
                      >
                        {stateOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-[#2D2D2D]/80 mb-1">PIN</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={String(addr.Pin ?? "")}
                        onChange={(e) => updateAddress(idx, "Pin", e.target.value.replace(/[^0-9]/g, ""))}
                        className="w-full rounded-lg border border-[#2D2D2D]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5d26a] bg-white"
                        placeholder="6-digit PIN"
                      />
                    </div>
                  </div>
                  <div className="mt-3 text-right">
                    <button type="button" onClick={() => removeAddress(idx)} className="text-sm text-[#7a1a1a] border border-[#7a1a1a]/30 px-3 py-1 rounded-lg hover:bg-[#fdf7f2]">Delete</button>
                  </div>
                </div>
              ))}
              {addresses.length === 0 && (
                <div className="text-sm text-[#2D2D2D]/70">No addresses yet. Click "Add address" to create one.</div>
              )}
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
  );
}


