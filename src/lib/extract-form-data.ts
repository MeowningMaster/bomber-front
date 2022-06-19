export function extractFormData<T extends object>(form: HTMLFormElement): T {
  const formData = new FormData(form);
  const data = {};
  for (const field of formData) {
    const [key, value] = field;
    data[key] = value;
  }
  return data as T;
}
