import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { useIsMobile } from "@/hooks/useMobile";
import { BarChart3, Bell, BookOpen, Boxes, ClipboardList, FileText, Landmark, LayoutDashboard, LogOut, PanelLeft, Plus, Search, Settings2, ShieldAlert, Users, UserRound, WalletCards } from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from './DashboardLayoutSkeleton';
import { Button } from "./ui/button";

const menuItems = [
  { icon: Settings2, label: "معلومات الشركة", path: "/company-settings" },
  { icon: Landmark, label: "البنوك والخزائن", path: "/banks-cash" },
  { icon: LayoutDashboard, label: "لوحة التنفيذ", path: "/" },
  { section: true, label: "التشغيل الأساسي" },
  { icon: ClipboardList, label: "المشاريع والمراحل", path: "/projects" },
  { icon: Boxes, label: "مراقبة المخزون والكميات", path: "/inventory" },
  { icon: WalletCards, label: "المبيعات والتحصيلات", path: "/sales" },
  { icon: FileText, label: "التكاليف والمصروفات", path: "/expenses" },
  { icon: ClipboardList, label: "الموردون والمقاولون", path: "/operations?tab=vendors" },
  { icon: FileText, label: "العقود والمستخلصات", path: "/operations?tab=certificates" },
  { icon: FileText, label: "كشوف حساب الموردين", path: "/supplier-statements" },
  { icon: UserRound, label: "دليل الموظفين", path: "/employees" },
  { icon: WalletCards, label: "مسير الرواتب", path: "/payroll" },
  { icon: WalletCards, label: "تسجيل / صرف عهدة", path: "/custody" },
  { icon: FileText, label: "كشوف حساب العهد", path: "/custody?tab=custodyStatement" },
  { section: true, label: "التقارير المحاسبية" },
  { icon: BarChart3, label: "مركز التكلفة", path: "/cost-center" },
  { icon: BarChart3, label: "قائمة الدخل", path: "/income-statement" },
  { icon: BarChart3, label: "التقارير", path: "/reports" },
  { section: true, label: "المحاسبة" },
  { icon: Landmark, label: "المستندات المحاسبية", path: "/accounting" },
  { section: true, label: "إعدادات المحاسبة" },
  { icon: BookOpen, label: "شجرة الحسابات", path: "/accounting-settings#chart-of-accounts" },
  { icon: Boxes, label: "الأصول الثابتة", path: "/accounting-settings#fixed-assets" },
  { section: true, label: "الإدارة والمتابعة" },
  { icon: ClipboardList, label: "الحضور والانصراف", path: "/attendance" },
  { icon: ClipboardList, label: "المهام اليومية", path: "/tasks" },
  { icon: FileText, label: "طلباتي", path: "/my-requests" },
  { icon: FileText, label: "الموافقات والمستندات", path: "/approvals" },
  { icon: Users, label: "المستخدمون والصلاحيات", path: "/users" },
  { icon: ShieldAlert, label: "مركز جودة البيانات", path: "/data-quality" },
  { icon: Settings2, label: "الإعدادات", path: "/settings" },
  { icon: BarChart3, label: "المؤشرات التنفيذية", path: "/indicators" },
];

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) {
    return <DashboardLayoutSkeleton />
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-semibold tracking-tight text-center">
              تسجيل الدخول للمتابعة
            </h1>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              يتطلب الوصول إلى نظام إدارة المشاريع تسجيل الدخول الآمن.
            </p>
          </div>
          <Button
            onClick={() => startLogin()}
            size="lg"
            className="w-full shadow-lg hover:shadow-xl transition-all"
          >
            تسجيل الدخول
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
        } as CSSProperties
      }
    >
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

type DashboardLayoutContentProps = {
  children: React.ReactNode;
  setSidebarWidth: (width: number) => void;
};

function DashboardLayoutContent({
  children,
  setSidebarWidth,
}: DashboardLayoutContentProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const { data: availableCompanies = [] } = trpc.erp.companies.list.useQuery();
  const { data: currentCompany } = trpc.erp.companies.current.useQuery();
  const { data: notifications = [] } = trpc.erp.controls.notifications.useQuery();
  const unreadNotifications = notifications.filter((notification) => !notification.readAt).length;
  const switchCompany = trpc.erp.companies.switch.useMutation({ onSuccess: () => { utils.erp.companies.current.invalidate(); utils.erp.company.get.invalidate(); utils.erp.projects.list.invalidate(); } });
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const sidebarRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const activeMenuItem = menuItems.find(item => item.path && (item.path === location || (item.path.includes("?") && location.startsWith(item.path.split("?")[0]))));
  const isMobile = useIsMobile();
  const normalizedSearch = globalSearch.trim().toLowerCase();
  const quickActions = [
    { label: "إضافة تكلفة أو مصروف", path: "/expenses" },
    { label: "تسجيل / صرف عهدة", path: "/custody?tab=custody" },
    { label: "فاتورة شراء", path: "/accounting?type=purchase_invoice" },
    { label: "فاتورة بيع", path: "/accounting?type=sales_invoice" },
    { label: "فتح عقد أو مستخلص", path: "/operations?tab=certificates" },
    { label: "إنشاء سند صرف أو قبض", path: "/accounting" },
    { label: "فتح مسير الرواتب", path: "/payroll" },
    { label: "تسجيل طلب شراء", path: "/operations" },
    { label: "مراقبة المخزون والكميات", path: "/inventory" },
    { label: "إسناد مهمة للفريق", path: "/tasks" },
  ];
  const roleLabelAllowList: Record<string, string[] | undefined> = {
    general_manager: ["لوحة التنفيذ", "الموافقات والمستندات", "مركز التكلفة", "قائمة الدخل", "المبيعات والتحصيلات", "العقود والمستخلصات", "مراقبة المخزون والكميات"],
    project_manager: ["لوحة التنفيذ", "المشاريع والمراحل", "العقود والمستخلصات", "الموردون والمقاولون", "الموافقات والمستندات"],
    procurement_manager: ["لوحة التنفيذ", "مراقبة المخزون والكميات", "التكاليف والمصروفات", "الموافقات والمستندات"],
  };
  const allowedLabels = roleLabelAllowList[user?.role || ""];
  const visibleMenuItems = allowedLabels ? menuItems.filter((item) => "section" in item || allowedLabels.includes(item.label)) : menuItems;
  const visibleQuickActions = user?.role === "general_manager" ? quickActions.filter((action) => action.path === "/operations?tab=certificates" || action.path === "/inventory") : allowedLabels ? quickActions.filter((action) => action.path.includes("/operations") || action.path.includes("/tasks") || action.path.includes("/accounting?type=sales_invoice")) : quickActions;
  const searchResults = normalizedSearch ? visibleMenuItems.filter((item): item is Extract<(typeof menuItems)[number], { path: string }> => "path" in item && item.label.toLowerCase().includes(normalizedSearch)).slice(0, 6) : [];

  useEffect(() => {
    const handleGlobalShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleGlobalShortcut);
    return () => window.removeEventListener("keydown", handleGlobalShortcut);
  }, []);

  useEffect(() => {
    if (isCollapsed) {
      setIsResizing(false);
    }
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <>
      <div className="relative" ref={sidebarRef}>
        <Sidebar
          collapsible="icon"
          className="border-r-0"
          disableTransition={isResizing}
        >
          <SidebarHeader className="h-16 justify-center">
            <div className="flex items-center gap-3 px-2 transition-all w-full">
              <button
                onClick={toggleSidebar}
                className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
                aria-label="فتح أو طي القائمة"
              >
                <PanelLeft className="h-4 w-4 text-muted-foreground" />
              </button>
              {!isCollapsed ? (
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-semibold tracking-tight truncate">
                    نظام إدارة المشاريع
                  </span>
                </div>
              ) : null}
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-0">
            <SidebarMenu className="px-2 py-1">
              {visibleMenuItems.map((item, index) => {
                if ("section" in item) return <li key={`section-${index}`} className="px-3 pb-1 pt-4 text-xs font-bold text-[#b28a3b]">{item.label}</li>;
                const isActive = location === item.path || (item.path.includes("?") && location.startsWith(item.path.split("?")[0]) && location.includes(item.path.split("?")[1] || ""));
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={`h-10 transition-all font-normal`}
                    >
                      <a href={item.path} aria-label={item.label}>
                        <item.icon
                          className={`h-4 w-4 ${isActive ? "text-primary" : ""}`}
                        />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-lg px-1 py-1 hover:bg-accent/50 transition-colors w-full text-left group-data-[collapsible=icon]:justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="h-9 w-9 border shrink-0">
                    <AvatarFallback className="text-xs font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-medium truncate leading-none">
                      {user?.name || "-"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-1.5">
                      {user?.email || "-"}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors ${isCollapsed ? "hidden" : ""}`}
          onMouseDown={() => {
            if (isCollapsed) return;
            setIsResizing(true);
          }}
          style={{ zIndex: 50 }}
        />
      </div>

      <SidebarInset>
        {isMobile && (
          <div className="flex border-b h-14 items-center justify-between bg-background/95 px-2 backdrop-blur supports-[backdrop-filter]:backdrop-blur sticky top-0 z-40">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-9 w-9 rounded-lg bg-background" />
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-1">
                  <span className="tracking-tight text-foreground">
                    {activeMenuItem?.label ?? "Menu"}
                  </span>
                </div>
                {availableCompanies.length > 0 && <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="sm" className="max-w-[150px] gap-1 border-[#b28a3b]/40 text-[#18324b]"><Landmark className="h-4 w-4 shrink-0 text-[#b28a3b]" /><span className="truncate">{currentCompany?.company?.tradeName || currentCompany?.company?.legalName || "الشركة"}</span></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-64">{availableCompanies.map((company) => <DropdownMenuItem key={company.id} disabled={switchCompany.isPending || company.id === currentCompany?.company?.id} onClick={() => switchCompany.mutate({ companyId: company.id })} className="cursor-pointer">{company.tradeName || company.legalName}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>}
              </div>
            </div>
          </div>
        )}
        <div className="sticky top-0 z-30 hidden items-center justify-between gap-3 border-b bg-background/95 px-5 py-3 backdrop-blur supports-[backdrop-filter]:backdrop-blur md:flex" dir="rtl">
          <div className="relative min-w-0 flex-1 max-w-2xl">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input ref={searchInputRef} value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && searchResults[0]) { setLocation(searchResults[0].path); setGlobalSearch(""); } }} placeholder="ابحث عن صفحة أو عملية..." aria-label="البحث العام" className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-4 text-sm outline-none transition focus:border-[#b28a3b] focus:bg-white focus:ring-2 focus:ring-[#b28a3b]/20" />
            {searchResults.length > 0 && <div className="absolute right-0 top-12 z-50 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-xl">{searchResults.map((item) => <button key={item.path} type="button" onClick={() => { setLocation(item.path); setGlobalSearch(""); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-right text-sm text-slate-700 hover:bg-slate-50"><item.icon className="h-4 w-4 text-[#b28a3b]" />{item.label}</button>)}</div>}
          </div>
          <div className="flex items-center gap-2">
            {availableCompanies.length > 0 && <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="sm" className="max-w-[220px] gap-2 border-[#b28a3b]/40 text-[#18324b]"><Landmark className="h-4 w-4 shrink-0 text-[#b28a3b]" /><span className="truncate">{currentCompany?.company?.tradeName || currentCompany?.company?.legalName || "اختيار الشركة"}</span></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-72"><div className="border-b border-slate-100 px-3 py-2 text-xs text-slate-500">الشركة الحالية · اختر شركة مصرحًا بها</div>{availableCompanies.map((company) => <DropdownMenuItem key={company.id} disabled={switchCompany.isPending || company.id === currentCompany?.company?.id} onClick={() => switchCompany.mutate({ companyId: company.id })} className="cursor-pointer"><div className="flex min-w-0 flex-col"><span className="truncate font-semibold">{company.tradeName || company.legalName}</span><span className="truncate text-xs text-slate-500">{company.commercialRegistration || company.taxNumber || "بيانات الشركة"}</span></div></DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>}
            <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="sm" className="gap-2 border-[#b28a3b]/40 text-[#18324b]"><Plus className="h-4 w-4" /> إجراء سريع</Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-56">{visibleQuickActions.map((action) => <DropdownMenuItem key={action.path} onClick={() => setLocation(action.path)} className="cursor-pointer">{action.label}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>
            <Button variant="outline" size="icon" aria-label="فتح التنبيهات والموافقات" title={unreadNotifications ? `${unreadNotifications} إشعار غير مقروء` : "التنبيهات والموافقات"} onClick={() => setLocation("/approvals")} className="relative border-slate-200"><Bell className="h-4 w-4 text-[#b28a3b]" />{unreadNotifications > 0 && <Badge className="absolute -right-2 -top-2 min-w-5 justify-center rounded-full bg-rose-600 px-1 text-[10px] text-white">{unreadNotifications > 99 ? "99+" : unreadNotifications}</Badge>}</Button>
          </div>
        </div>
        <main className="flex-1 p-4">{children}</main>
      </SidebarInset>
    </>
  );
}
