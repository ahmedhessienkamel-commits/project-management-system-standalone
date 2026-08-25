import DashboardLayout from "@/components/DashboardLayout";
import { MaterialRequestWorkspace } from "@/components/MaterialRequestWorkspace";

export default function MaterialRequests() {
  return (
    <DashboardLayout>
      <main dir="rtl" className="min-h-screen bg-[#f7f8fa] px-4 py-6 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <MaterialRequestWorkspace />
        </div>
      </main>
    </DashboardLayout>
  );
}
