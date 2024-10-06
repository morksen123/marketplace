import { useState, useMemo } from 'react';

interface UsePaginatedDataProps<T> {
  data: T[];
  itemsPerPage: number;
  searchTerm?: string;
  searchFields?: (keyof T)[];
}

interface UsePaginatedDataResult<T> {
  paginatedData: T[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
}

export function usePaginatedData<T>({
  data,
  itemsPerPage,
  searchTerm = '',
  searchFields = [],
}: UsePaginatedDataProps<T>): UsePaginatedDataResult<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearchTerm, setSearchTerm] = useState(searchTerm);

  const filteredData = useMemo(() => {
    if (!currentSearchTerm || searchFields.length === 0) return data;
    return data.filter((item) =>
      searchFields.some((field) =>
        String(item[field])
          .toLowerCase()
          .includes(currentSearchTerm.toLowerCase()),
      ),
    );
  }, [data, currentSearchTerm, searchFields]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  return {
    paginatedData,
    currentPage,
    totalPages,
    setCurrentPage,
    setSearchTerm,
  };
}
