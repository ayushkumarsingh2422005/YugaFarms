/** Shared Strapi user profile shape used across checkout, profile, and contact. */

export type UserProfile = {
  id: number;
  username: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pin: string;
};

export type CheckoutAddressForm = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
};

/** Normalize to 10-digit Indian mobile (no country code). */
export function normalizePhone10(raw: string | number | null | undefined): string {
  if (raw == null || raw === "") return "";
  let digits = String(raw).replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) {
    digits = digits.slice(-10);
  }
  if (digits.length === 10) return digits;
  if (digits.length > 10) return digits.slice(-10);
  return digits;
}

export function parseStrapiUser(me: Record<string, unknown>): UserProfile {
  return {
    id: Number(me.id),
    username: String(me.username ?? ""),
    email: String(me.email ?? ""),
    phone: normalizePhone10(me.Phone as string | number | undefined),
    addressLine1: String(me.AddressLine1 ?? ""),
    addressLine2: String(me.AddressLine2 ?? ""),
    city: String(me.City ?? ""),
    state: String(me.State ?? ""),
    pin: me.Pin != null ? String(me.Pin) : "",
  };
}

export function profileToCheckoutAddress(profile: UserProfile): CheckoutAddressForm {
  return {
    fullName: profile.username || "",
    phone: profile.phone || "",
    addressLine1: profile.addressLine1 || "",
    addressLine2: profile.addressLine2 || "",
    city: profile.city || "",
    state: profile.state || "",
    pincode: profile.pin || "",
    landmark: "",
  };
}

export function checkoutAddressToStrapiPayload(
  address: CheckoutAddressForm
): Record<string, string | number> {
  const payload: Record<string, string | number> = {};
  const name = address.fullName.trim();
  if (name) payload.username = name;

  const phone = normalizePhone10(address.phone);
  if (phone.length === 10) payload.Phone = phone;

  if (address.addressLine1.trim()) payload.AddressLine1 = address.addressLine1.trim();
  if (address.addressLine2.trim()) payload.AddressLine2 = address.addressLine2.trim();
  if (address.city.trim()) payload.City = address.city.trim();
  if (address.state.trim()) payload.State = address.state.trim();

  const pinDigits = address.pincode.replace(/\D/g, "");
  if (pinDigits.length >= 4) payload.Pin = Number(pinDigits);

  return payload;
}

export function profileFormToStrapiPayload(input: {
  username?: string;
  email?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pin?: string | number;
}): Record<string, string | number> {
  const payload: Record<string, string | number> = {};
  if (input.username?.trim()) payload.username = input.username.trim();
  if (input.email?.trim()) payload.email = input.email.trim();
  if (input.addressLine1?.trim()) payload.AddressLine1 = input.addressLine1.trim();
  if (input.addressLine2?.trim()) payload.AddressLine2 = input.addressLine2.trim();
  if (input.city?.trim()) payload.City = input.city.trim();
  if (input.state) payload.State = input.state;
  const pinDigits = String(input.pin ?? "").replace(/\D/g, "");
  if (pinDigits.length >= 4) payload.Pin = Number(pinDigits);
  return payload;
}

export function hasCheckoutAddressData(address: CheckoutAddressForm): boolean {
  return Boolean(
    address.fullName.trim() ||
      address.phone.trim() ||
      address.addressLine1.trim() ||
      address.city.trim() ||
      address.state.trim() ||
      address.pincode.trim()
  );
}
