import {
  useQueryState,
  useQueryStates,
  parseAsInteger,
  parseAsString,
} from "nuqs";

export function useProductFilters() {
  const [search, setSearchRaw] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({
      shallow: true,
      clearOnDefault: true,
    }),
  );

  const [{ page, category }, setFilters] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      category: parseAsString.withDefault(""),
    },
    {
      history: "push",
      clearOnDefault: true,
    },
  );

  const setSearch = (s: string) => {
    setSearchRaw(s);
    if (page !== 1) setFilters({ page: 1 });
  };

  const setCategory = (c: string) => setFilters({ category: c, page: 1 });

  const setPage = (p: number) => setFilters({ page: p });

  const clearAll = () => {
    setSearchRaw("");
    setFilters({ category: "", page: 1 });
  };

  return { page, search, category, setSearch, setCategory, setPage, clearAll };
}
