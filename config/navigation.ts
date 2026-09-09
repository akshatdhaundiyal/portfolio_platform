export type PopdownType = "doodle-stack" | "mini-tag" | "avatar-badge" | "custom";

export interface NavDoodleItem {
  id: string;
  label: string;
  iconType: "linkedin" | "twitter" | "github" | "email" | "custom";
  href: string;
  isExternal?: boolean;
}

export interface NavItemConfig {
  id: string;
  label: string;
  href: string;
  popdownType?: PopdownType;
  badgeText?: string;
  subTitle?: string;
  doodles?: NavDoodleItem[];
}

export const navigationConfig: NavItemConfig[] = [
  {
    id: "about",
    label: "about",
    href: "/about",
    popdownType: "avatar-badge",
    badgeText: "MBA '25 • Data Scientist",
    subTitle: "Bridging statistical rigor with commercial unit economics.",
  },
  {
    id: "work",
    label: "work",
    href: "/work",
    popdownType: "mini-tag",
    badgeText: "TAG // PROD-2024",
    subTitle: "+$12M Actuarial GLM • Claims NLP • Vertex AI",
  },
  {
    id: "writing",
    label: "writing",
    href: "/blog",
    popdownType: "custom",
    badgeText: "4 Papers",
    subTitle: "Technical papers on ML optimization & unit economics.",
  },
  {
    id: "connect",
    label: "connect",
    href: "#connect",
    popdownType: "doodle-stack",
    doodles: [
      {
        id: "linkedin",
        label: "in",
        iconType: "linkedin",
        href: "https://linkedin.com/in/akshatdhaundiyal",
        isExternal: true,
      },
      {
        id: "twitter",
        label: "𝕏",
        iconType: "twitter",
        href: "https://twitter.com/akshatdhaundiyal",
        isExternal: true,
      },
      {
        id: "github",
        label: "gh",
        iconType: "github",
        href: "https://github.com/akshatdhaundiyal",
        isExternal: true,
      },
      {
        id: "email",
        label: "mail",
        iconType: "email",
        href: "mailto:akshatdhaundiyal@gmail.com",
        isExternal: false,
      },
    ],
  },
];
