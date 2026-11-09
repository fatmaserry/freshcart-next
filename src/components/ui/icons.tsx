import type { CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import * as fas from "@fortawesome/free-solid-svg-icons";
import * as far from "@fortawesome/free-regular-svg-icons";
import * as fab from "@fortawesome/free-brands-svg-icons";

const SCALE = 0.85;

export type IconName = keyof typeof icons;
export type IconRef = IconName | { name: IconName; filled: true };

export interface IconProps {
  name: IconRef;
  size?: number;
  className?: string;
  style?: CSSProperties;
  filled?: boolean;
}

const icons = {
  "address-book": far.faAddressBook,
  "alert-circle": fas.faCircleExclamation,
  apple: fab.faApple,
  "apple-whole": fas.faAppleWhole,
  "arrow-left": fas.faArrowLeft,
  "arrow-right": fas.faArrowRight,
  banknote: fas.faMoneyBillWave,
  "calendar-days": fas.faCalendarDays,
  carrot: fas.faCarrot,
  "cc-amex": fab.faCcAmex,
  "cc-mastercard": fab.faCcMastercard,
  "cc-visa": fab.faCcVisa,
  check: fas.faCheck,
  "check-circle": fas.faCircleCheck,
  bookmark: fas.faBookmark,
  "chevron-down": fas.faChevronDown,
  "circle-info": fas.faCircleInfo,
  "circle-question": fas.faCircleQuestion,
  "chevron-left": fas.faChevronLeft,
  "chevron-right": fas.faChevronRight,
  "circle-user": far.faCircleUser,
  city: fas.faCity,
  "clipboard-list": fas.faClipboardList,
  clock: far.faClock,
  "credit-card": fas.faCreditCard,
  eye: far.faEye,
  "eye-off": far.faEyeSlash,
  facebook: fab.faFacebookF,
  filter: fas.faFilter,
  "floppy-disk": fas.faFloppyDisk,
  "folder-open": fas.faFolderOpen,
  gear: fas.faGear,
  gift: fas.faGift,
  google: fab.faGoogle,
  "google-play": fab.faGooglePlay,
  "grip-vertical": fas.faGripVertical,
  headset: fas.faHeadset,
  heart: far.faHeart,
  home: fas.faHouse,
  instagram: fab.faInstagram,
  linkedin: fab.faLinkedinIn,
  "key-round": fas.faKey,
  layers: fas.faLayerGroup,
  "layout-grid": fas.faTableCellsLarge,
  leaf: fas.faLeaf,
  lemon: fas.faLemon,
  list: fas.faList,
  lock: fas.faLock,
  "log-out": fas.faRightFromBracket,
  "mail-check": fas.faEnvelopeCircleCheck,
  mail: far.faEnvelope,
  map: fas.faMap,
  "map-pin": fas.faLocationDot,
  menu: fas.faBars,
  "message-square-text": far.faCommentDots,
  minus: fas.faMinus,
  moon: fas.faMoon,
  package: fas.faBox,
  "package-search": fas.faBoxOpen,
  pencil: fas.faPen,
  "paper-plane": fas.faPaperPlane,
  phone: fas.faPhone,
  plus: fas.faPlus,
  refresh: fas.faArrowsRotate,
  receipt: fas.faReceipt,
  "rotate-ccw": fas.faArrowRotateLeft,
  search: fas.faMagnifyingGlass,
  seedling: fas.faSeedling,
  share: fas.faShareNodes,
  "shield-check": fas.faShieldHalved,
  "shopping-bag": fas.faBagShopping,
  "shopping-cart": fas.faCartShopping,
  "sliders-horizontal": fas.faSliders,
  sparkles: fas.faWandMagicSparkles,
  spinner: fas.faSpinner,
  star: far.faStar,
  "star-half": far.faStarHalfStroke,
  sun: fas.faSun,
  tag: fas.faTag,
  tags: fas.faTags,
  trash: far.faTrashCan,
  truck: fas.faTruck,
  "truck-fast": fas.faTruckFast,
  twitter: fab.faTwitter,
  user: far.faUser,
  "user-plus": fas.faUserPlus,
  users: fas.faUsers,
  wallet: fas.faWallet,
  x: fas.faXmark,
  youtube: fab.faYoutube,
  zap: fas.faBolt,
} satisfies Record<string, IconDefinition>;

const filledIcons: Partial<Record<keyof typeof icons, IconDefinition>> = {
  clock: fas.faClock,
  eye: fas.faEye,
  "eye-off": fas.faEyeSlash,
  heart: fas.faHeart,
  mail: fas.faEnvelope,
  star: fas.faStar,
  trash: fas.faTrash,
  user: fas.faUser,
};

export function Icon({ name, size = 16, className, style, filled }: IconProps) {
  const ref = typeof name === "string" ? { name, filled } : name;
  return (
    <FontAwesomeIcon
      icon={(ref.filled && filledIcons[ref.name]) || icons[ref.name]}
      className={className}
      style={{ fontSize: size * SCALE, ...style }}
      aria-hidden
    />
  );
}
