"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";

interface TablePaginationProps {
  totalPages: number;
  activePage: number;
  onPageChange: (page: number) => void;
}

export function TablePagination({
  totalPages,
  activePage,
  onPageChange,
}: TablePaginationProps) {
  const [currentPage, setCurrentPage] = useState(activePage);

  useEffect(()=> {
    setCurrentPage(activePage);
  },[activePage])
  // Function to handle page click
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      onPageChange(page);
    }
  };

  // Generate pagination items
  const getPaginationItems = () => {
    const pages = [];
    const showEllipsis = totalPages > 5; // Show "..." only if pages exceed 5

    if (showEllipsis) {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <Pagination className="flex justify-center">
      <PaginationContent className="flex items-center gap-2">
        <PaginationItem>
          <PaginationPrevious
            // href="#"
            className={`text-sm px-3 py-2 rounded-lg text-gray-500 bg-gray-100 hover:bg-gray-200 ${
              currentPage === 1
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }`}
            showArrow={false}
            onClick={(e) => {
              if (currentPage !== 1) {
                goToPage(currentPage - 1);
              } else {
                e.preventDefault(); // Prevent default action if disabled
              }
            }}
          />
        </PaginationItem>

        {getPaginationItems().map((page, index) =>
          page === "..." ? (
            <PaginationItem key={index}>
              <PaginationEllipsis className="px-3 py-2 rounded-lg text-gray-500" />
            </PaginationItem>
          ) : (
            <PaginationItem key={index}>
              <PaginationLink
                // href="#"
                isActive={currentPage === page}
                className={`text-sm px-3 py-2 rounded-lg ${
                  currentPage === page
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } cursor-pointer`}
                onClick={() => goToPage(Number(page))}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            // href="#"
            className={`text-sm px-3 py-2 rounded-lg text-gray-500 bg-gray-100 hover:bg-gray-200 ${
              currentPage === totalPages
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }`}
            showArrow={false}
            onClick={(e) => {
              if (currentPage !== totalPages) {
                goToPage(currentPage + 1);
              } else {
                e.preventDefault(); // Prevent default action if disabled
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
