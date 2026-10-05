import { useCallback, useState } from "react";

export type FormErrors<T extends object> = Partial<Record<keyof T, string>>;
export type FormValidator<T extends object> = (
  values: T,
) => FormErrors<T>;

export function useFormValidation<T extends object>(
  initialValues: T,
  validate: FormValidator<T>,
) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});

  const setValue = useCallback(
    <Key extends keyof T>(key: Key, value: T[Key]) => {
      setValues((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const validateForm = useCallback(() => {
    const nextErrors = validate(values);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [validate, values]);

  return { values, setValues, setValue, errors, validateForm };
}
