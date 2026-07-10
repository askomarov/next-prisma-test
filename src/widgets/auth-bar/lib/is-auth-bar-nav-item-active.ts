export function getActiveAuthBarNavItemHref(
  pathname: string,
  hrefs: string[],
): string | null {
  let activeHref: string | null = null;

  for (const href of hrefs) {
    const matches =
      href === "/"
        ? pathname === "/"
        : pathname === href || pathname.startsWith(`${href}/`);

    if (!matches) {
      continue;
    }

    if (!activeHref || href.length > activeHref.length) {
      activeHref = href;
    }
  }

  return activeHref;
}
