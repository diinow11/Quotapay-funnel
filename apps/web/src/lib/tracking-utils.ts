export function getOrCreateExternalId(): string {
  if (typeof window === "undefined") return "";
  const key = "qp_external_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}
