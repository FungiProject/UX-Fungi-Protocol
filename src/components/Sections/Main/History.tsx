import React, { useState } from "react";

import Spinner from "../../Loader/SpinnerLoader";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLongLeftIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function History() {
  const [activityArrayCopy, setActivityArrayCopy] = useState<any[]>([
    // ...activities,
  ]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 5;
  const totalItems = activityArrayCopy.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleClickNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleClickPrevious = () => {
    setCurrentPage(currentPage - 1);
  };

  // const renderPageNumbers = () => {
  //   const pageNumbers = [];
  //   for (let i = 1; i <= totalPages; i++) {
  //     if (
  //       i === 1 ||
  //       i === currentPage ||
  //       i === currentPage - 1 ||
  //       i === currentPage + 1 ||
  //       i === totalPages
  //     ) {
  //       pageNumbers.push(i);
  //     } else if (i === currentPage - 2 || i === currentPage + 2) {
  //       pageNumbers.push("...");
  //     }
  //   }

  //   return pageNumbers.map((pageNumber, index) =>
  //     pageNumber.toString() !== "..." ? (
  //       <button
  //         key={index}
  //         className={
  //           pageNumber === currentPage
  //             ? "bg-main py-0.5 px-2 rounded-lg text-white"
  //             : "mx-2.5"
  //         }
  //         onClick={() => handlePageChange(Number(pageNumber))}
  //       >
  //         {pageNumber}
  //       </button>
  //     ) : (
  //       <span className="mx-1" key={index}>
  //         {pageNumber}
  //       </span>
  //     )
  //   );
  // };

  return (
    <main>
      <Link className="mt-[32px] font-bold flex items-center text-2xl" href="/">
        {" "}
        <ArrowLongLeftIcon
          className=" w-[36px] h-[36px] text-black mr-[12px]"
          aria-hidden="true"
        />
        Back
      </Link>
      {!loading ? (
        <div className="w-full h-[574px] pt-[23px] px-[20px] bg-white rounded-lg flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        // <ActivityViewTable
        //   activities={activities}
        //   startIndex={startIndex}
        //   endIndex={endIndex}
        // />
        <div></div>
      )}
      <div className="flex items-center mt-4 relative">
        <span>
          Showing {startIndex + 1}-{endIndex} out of {activityArrayCopy.length}
        </span>
        <div className="flex justify-center items-center absolute inset-x-0 bottom-0 top-3">
          {currentPage !== 1 && (
            <button onClick={() => handleClickPrevious()}>
              <ChevronLeftIcon
                className=" w-[45px] h-[36px] text-black"
                aria-hidden="true"
              />
            </button>
          )}
          {/* {renderPageNumbers()}{" "} */}
          {currentPage < activityArrayCopy.length / 5 && (
            <button onClick={() => handleClickNext()}>
              <ChevronRightIcon
                className=" w-[45px] h-[36px] text-black"
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
