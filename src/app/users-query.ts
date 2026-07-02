type UsersQueryParams = {
  page?: number;
  search?: string;
};

export function buildUsersUrl({ page, search }: UsersQueryParams) {
  const params = new URLSearchParams();
  const trimmedSearch = search?.trim();

  if (trimmedSearch) {
    params.set("search", trimmedSearch);
  }

  if (page && page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `/?${query}` : "/";
}
