"use client";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"; // update your path if different

interface BreadcrumbLink {
  label: string;
  href?: string; // If no href, we treat it as current page
}

interface CommonBreadcrumbProps {
  items: BreadcrumbLink[];
}

const CommonBreadcrumb: React.FC<CommonBreadcrumbProps> = ({ items }) => {
  const router = useRouter();

  return (
    <Breadcrumb>
      <BreadcrumbList className="md:text-sm text-xs items-center">
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbPage
                  className="cursor-pointer hover:text-grey hover:underline"
                  onClick={() => router.push(item.href!)}
                >
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbPage className="cursor-default text-gray-600">
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>

            {/* Add separator if it's not the last item */}
            {index !== items.length - 1 && (
              <BreadcrumbSeparator className="md:size-6 size-2 md:scale-100 scale-75 h-fit md:mr-0 mr-2" />
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CommonBreadcrumb;
