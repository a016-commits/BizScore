import React, { createContext, useContext, useId } from 'react';
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  useFormContext,
} from 'react-hook-form';

interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
}

const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormItemContext = createContext<{ id: string }>({ id: '' });

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

export function useFormField() {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

export function FormItem({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const id = useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={`space-y-2 ${className}`}>{children}</div>
    </FormItemContext.Provider>
  );
}

export function FormLabel({
  className = '',
  children,
  required,
}: {
  className?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  const { error, formItemId } = useFormField();
  return (
    <label
      htmlFor={formItemId}
      className={`block text-sm font-semibold leading-snug ${
        error ? 'text-[#B91C1C]' : 'text-[#0F172A]'
      } ${className}`}
    >
      {children}
      {required && (
        <span className="ml-1 text-[#EF4444]" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

export function FormControl({
  children,
}: {
  children: React.ReactElement<{
    id?: string;
    'aria-describedby'?: string;
    'aria-invalid'?: boolean;
  }>;
}) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return React.cloneElement(children, {
    id: formItemId,
    'aria-describedby': !error
      ? formDescriptionId
      : `${formDescriptionId} ${formMessageId}`,
    'aria-invalid': Boolean(error),
  });
}

export function FormDescription({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { formDescriptionId } = useFormField();
  return (
    <p
      id={formDescriptionId}
      className={`text-xs leading-relaxed text-[#64748B] ${className}`}
    >
      {children}
    </p>
  );
}

export function FormMessage({ className = '' }: { className?: string }) {
  const { error, formMessageId } = useFormField();
  if (!error?.message) return null;

  return (
    <p
      id={formMessageId}
      role="alert"
      className={`flex items-center gap-1.5 text-xs font-medium text-[#B91C1C] ${className}`}
    >
      <span
        className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#EF4444]"
        aria-hidden="true"
      />
      <span>{String(error.message)}</span>
    </p>
  );
}
