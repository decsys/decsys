import { useState } from "react";

const useWordlistSortingAndFiltering = () => {
  const [sorting, setSorting] = useState({
    key: "", // Initial sorting key (e.g., "Value", "Type")
    ascending: true, // Initial sorting order
  });

  // Handle sorting by a specific key
  const handleSort = (key) => {
    const ascending = sorting.key === key ? !sorting.ascending : true;
    setSorting({ key, ascending });
  };

  return {
    sorting,
    setSorting,
    handleSort,
  };
};

export default useWordlistSortingAndFiltering;
