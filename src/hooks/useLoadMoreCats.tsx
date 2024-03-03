import { useCallback, useEffect, useState } from "react";
import { CatImage, useGetOneCatQuery } from "../api/catApi";

export const useLoadMoreCats = (initialCats: CatImage[]) => {
  const [cats, setCats] = useState<CatImage[]>(initialCats);
  const [isQueryStarted, setIsQueryStarted] = useState(false);
  const {
    data: newCat,
    refetch: fetchNewCat,
    isLoading: isNewCatLoading,
  } = useGetOneCatQuery(undefined, {
    skip: !isQueryStarted,
  });

  const handleLoadMore = useCallback(() => {
    if (!isQueryStarted) {
      setIsQueryStarted(true);
    } else if (!isNewCatLoading) {
      fetchNewCat();
    }
  }, [fetchNewCat, isNewCatLoading, isQueryStarted]);

  useEffect(() => {
    if (newCat && newCat.length > 0) {
      setCats((prevCats) => [...prevCats, ...newCat]);
    }
  }, [newCat]);

  return { cats, handleLoadMore, isQueryStarted, isNewCatLoading };
};
