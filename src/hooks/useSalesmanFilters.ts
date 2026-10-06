import {
  useQueryState,
  useQueryStates,
  parseAsInteger,
  parseAsString,
} from "nuqs";

export function useSalesmanFilters() {
  const [search, setSearchRaw] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({
      shallow: true,
      clearOnDefault: true,
    }),
  );

  const [{ page }, setFilters] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
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

  const setPage = (p: number) => setFilters({ page: p });

  const clearAll = () => {
    setSearchRaw("");
    setFilters({ page: 1 });
  };

  return { page, search, setSearch, setPage, clearAll };
}
