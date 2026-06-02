"use client";
import React, { useState } from "react";

type Address = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
};

type AddressModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Address) => Promise<void>;
  initialPhone?: string;
  initialAddress?: Partial<Address>;
};

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal"
];

function buildInitialAddress(
  cleanPhone: string,
  initialAddress?: Partial<Address>
): Address {
  const phone =
    cleanPhone ||
    (initialAddress?.phone
      ? initialAddress.phone.replace(/\D/g, "").replace(/^91/, "").slice(0, 10)
      : "");
  return {
    fullName: initialAddress?.fullName || "",
    phone,
    addressLine1: initialAddress?.addressLine1 || "",
    addressLine2: initialAddress?.addressLine2 || "",
    city: initialAddress?.city || "",
    state: initialAddress?.state || "Maharashtra",
    pincode: initialAddress?.pincode || "",
    landmark: initialAddress?.landmark || "",
  };
}

export default function AddressModal({
  isOpen,
  onClose,
  onSave,
  initialPhone = "",
  initialAddress,
}: AddressModalProps) {
  const cleanPhone = initialPhone
    ? initialPhone.replace(/\D/g, "").replace(/^91/, "").slice(0, 10)
    : "";
  const isPhoneLocked = !!cleanPhone;

  const [address, setAddress] = useState<Address>(() =>
    buildInitialAddress(cleanPhone, initialAddress)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    setAddress(buildInitialAddress(cleanPhone, initialAddress));
  }, [isOpen, cleanPhone, initialAddress?.fullName, initialAddress?.phone, initialAddress?.addressLine1, initialAddress?.city, initialAddress?.state, initialAddress?.pincode]);

  const updateAddress = (field: keyof Address, value: string) => {
    // Don't allow phone to be changed if it's locked
    if (field === "phone" && isPhoneLocked) {
      return;
    }
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validateAddress = (): string[] => {
    const errors: string[] = [];
    
    if (!address.fullName.trim()) errors.push("Full name is required");
    if (!address.phone.trim()) errors.push("Phone number is required");
    if (!address.addressLine1.trim()) errors.push("Address line 1 is required");
    if (!address.city.trim()) errors.push("City is required");
    if (!address.state.trim()) errors.push("State is required");
    if (!address.pincode.trim()) errors.push("Pincode is required");
    
    // Phone validation
    if (address.phone && !/^[6-9]\d{9}$/.test(address.phone.replace(/\D/g, ''))) {
      errors.push("Please enter a valid 10-digit phone number");
    }
    
    // Pincode validation
    if (address.pincode && !/^\d{6}$/.test(address.pincode)) {
      errors.push("Please enter a valid 6-digit pincode");
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const errors = validateAddress();
    if (errors.length > 0) {
      setError(errors.join(", "));
      return;
    }

    setLoading(true);
    try {
      await onSave(address);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAddress(buildInitialAddress(cleanPhone, initialAddress));
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 my-8 p-8 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#2D2D2D]/50 hover:text-[#2D2D2D] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#4b2e19] mb-2">Delivery Address</h2>
          <p className="text-sm text-[#2D2D2D]/70">Please provide your delivery address</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">Full Name *</label>
              <input
                type="text"
                value={address.fullName}
                onChange={(e) => updateAddress("fullName", e.target.value)}
                className="w-full border border-[#4b2e19]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 focus:border-[#f5d26a]"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">Phone Number *</label>
              <div className="flex items-center border border-[#4b2e19]/20 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#f5d26a]/50 focus-within:border-[#f5d26a]">
                <span className="px-4 py-3 bg-[#f5d26a]/10 text-[#4b2e19] font-semibold border-r border-[#4b2e19]/20">
                  +91
                </span>
                <input
                  type="tel"
                  value={address.phone}
                  onChange={(e) => {
                    if (!isPhoneLocked) {
                      const digits = e.target.value.replace(/\D/g, '').replace(/^91/, '').slice(0, 10);
                      updateAddress("phone", digits);
                    }
                  }}
                  disabled={isPhoneLocked}
                  className={`flex-1 px-4 py-3 focus:outline-none ${
                    isPhoneLocked 
                      ? 'bg-[#fdf7f2] text-[#2D2D2D]/70 cursor-not-allowed' 
                      : 'bg-white'
                  }`}
                  placeholder="9876543210"
                  maxLength={10}
                  required
                />
              </div>
              {isPhoneLocked && (
                <p className="text-xs text-[#2D2D2D]/60 mt-1">Phone number verified and locked</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">Address Line 1 *</label>
            <input
              type="text"
              value={address.addressLine1}
              onChange={(e) => updateAddress("addressLine1", e.target.value)}
              className="w-full border border-[#4b2e19]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 focus:border-[#f5d26a]"
              placeholder="House/Flat No., Building Name, Street"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">Address Line 2</label>
            <input
              type="text"
              value={address.addressLine2}
              onChange={(e) => updateAddress("addressLine2", e.target.value)}
              className="w-full border border-[#4b2e19]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 focus:border-[#f5d26a]"
              placeholder="Area, Colony, Locality"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">City *</label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => updateAddress("city", e.target.value)}
                className="w-full border border-[#4b2e19]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 focus:border-[#f5d26a]"
                placeholder="City"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">State *</label>
              <select
                value={address.state}
                onChange={(e) => updateAddress("state", e.target.value)}
                className="w-full border border-[#4b2e19]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 focus:border-[#f5d26a]"
                required
              >
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">Pincode *</label>
              <input
                type="text"
                value={address.pincode}
                onChange={(e) => updateAddress("pincode", e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full border border-[#4b2e19]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 focus:border-[#f5d26a]"
                placeholder="Pincode"
                maxLength={6}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">Landmark (Optional)</label>
            <input
              type="text"
              value={address.landmark}
              onChange={(e) => updateAddress("landmark", e.target.value)}
              className="w-full border border-[#4b2e19]/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 focus:border-[#f5d26a]"
              placeholder="Nearby landmark for easy delivery"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 border-2 border-[#4b2e19] text-[#4b2e19] py-3 rounded-xl font-semibold hover:bg-[#4b2e19] hover:text-white transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#4b2e19] text-white py-3 rounded-xl font-semibold hover:bg-[#2f4f2f] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

