import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CalendarIcon,
  InboxIcon,
  CircleStackIcon,
  UserCircleIcon,
  ChevronDownIcon,
  XMarkIcon,
  Bars3Icon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserPlusIcon,
  ClockIcon,
  BriefcaseIcon,
  CreditCardIcon,
  DocumentDuplicateIcon,
  ChartPieIcon,
  ListBulletIcon,
  ClipboardIcon,
  BuildingOfficeIcon,
  ReceiptPercentIcon,
  BanknotesIcon,
  PresentationChartLineIcon,
  EnvelopeIcon,
  TableCellsIcon,
  SunIcon,
  MoonIcon,
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

// Main Navigation Icons
export const Icons = {
  // Dashboard
  home: HomeIcon,

  // HR Management
  users: UsersIcon,
  userPlus: UserPlusIcon,
  clock: ClockIcon,
  calendar: CalendarIcon,
  creditCard: CreditCardIcon,

  // Project Management
  projects: ClipboardDocumentListIcon,
  tasks: ListBulletIcon,
  timeline: ClockIcon,
  reports: DocumentDuplicateIcon,

  // Finance
  finance: CurrencyDollarIcon,
  invoice: ReceiptPercentIcon,
  expenses: BanknotesIcon,
  budget: CreditCardIcon,

  // Analytics & Reports
  analytics: ChartBarIcon,
  charts: ChartPieIcon,
  presentation: PresentationChartLineIcon,

  // Document Management
  documents: DocumentTextIcon,
  clipboard: ClipboardIcon,

  // Communication
  messages: InboxIcon,
  email: EnvelopeIcon,

  // Organization
  company: BuildingOfficeIcon,
  department: BuildingOfficeIcon,

  // System
  database: CircleStackIcon,
  settings: Cog6ToothIcon,
  table: TableCellsIcon,

  // UI Elements
  chevronDown: ChevronDownIcon,
  close: XMarkIcon,
  menu: Bars3Icon,
  trendUp: ArrowTrendingUpIcon,
  trendDown: ArrowTrendingDownIcon,
  briefcase: BriefcaseIcon,
  user: UserCircleIcon,
  loading: ArrowPathIcon,

  // Form Elements
  eye: EyeIcon,
  eyeOff: EyeSlashIcon,
  search: MagnifyingGlassIcon,
  error: ExclamationCircleIcon,
  success: CheckCircleIcon,

  // Theme
  sun: SunIcon,
  moon: MoonIcon,
};

export type IconKeys = keyof typeof Icons;
