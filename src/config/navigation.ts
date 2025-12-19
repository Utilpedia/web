export interface NavLink {
  href: string;
  labelKey: string;
  isPrimary?: boolean;
}

/**
 * Main navigation links shared across Header and MobileNav.
 * Labels are translation keys from the "nav" namespace.
 */
export const navLinks: NavLink[] = [
  { href: "/tools", labelKey: "browseTools" },
  { href: "/mission", labelKey: "ourMission" },
  { href: "/developers", labelKey: "forDevelopers" },
  { href: "/business", labelKey: "forBusiness" },
  { href: "/login", labelKey: "login", isPrimary: true },
];
