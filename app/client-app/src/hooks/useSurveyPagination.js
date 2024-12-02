import { useEffect, useState } from "react";
import { useNavigate } from "@reach/router";

export function useSurveyPagination(initialPage, initialLimit) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemLimit, setItemLimit] = useState(initialLimit);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams({
      page: currentPage + 1,
      limit: itemLimit,
    });
    navigate(`/admin/surveys?${params.toString()}`, { replace: true });
  }, [currentPage, itemLimit, navigate]);

  return { currentPage, setCurrentPage, itemLimit, setItemLimit };
}
