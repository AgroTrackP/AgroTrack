import { useMemo } from "react";

export const DOTS = "...";

const range = (start: number, end: number) => {
	const length = end - start + 1;
	return Array.from({ length }, (_, idx) => idx + start);
};

export const usePagination = ({ totalPages }: { totalPages: number }) => {
	const paginationRange = useMemo(() => {
		// Si hay 5 páginas o menos, muéstralas todas.
		if (totalPages <= 5) {
			return range(1, totalPages);
		}

		// Si hay más de 5 páginas, muestra 1, 2, 3, ... y la última.
		return [1, 2, 3, DOTS, totalPages];
	}, [totalPages]);

	return paginationRange;
};
