"use client";

import {
  Controller,
  useWatch,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormSetValue,
} from "react-hook-form";
import { Icon } from "@/components/ui/icons";
import { useLocations } from "@/hooks/useLocations";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { ErrorState } from "@/components/ui/EmptyState";
import { getErrorMessage } from "@/lib/utils";

interface LocationFieldValues extends FieldValues {
  governorate: string;
  city: string;
}

export function LocationFields<T extends LocationFieldValues>({
  control,
  errors,
  setValue,
  prominent,
}: {
  control: Control<T>;
  errors: FieldErrors<T>;
  setValue: UseFormSetValue<T>;
  prominent?: boolean;
}) {
  const governorate =
    (useWatch({ control, name: "governorate" as Path<T> }) as
      string | undefined) ?? "";
  const { data: catalog, isLoading, error, refetch } = useLocations();

  if (error)
    return (
      <div className="sm:col-span-2">
        <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
      </div>
    );

  const governorateOptions = (catalog?.governorates() ?? []).map((g) => ({
    value: g.id,
    label: g.nameEn,
    hint: g.nameAr,
  }));
  const cityOptions = (catalog?.cities(governorate) ?? []).map((c) => ({
    value: c.id,
    label: c.nameEn,
    hint: c.nameAr,
  }));

  return (
    <>
      <Controller
        control={control}
        name={"governorate" as Path<T>}
        render={({ field }) => (
          <SearchableSelect
            label="Governorate"
            prominent={prominent}
            icon={prominent && <Icon name="map" size={16.5} />}
            value={field.value ?? ""}
            onChange={(v) => {
              field.onChange(v);
              // Cities depend on the governorate, so the previous choice is no longer valid.
              setValue("city" as Path<T>, "" as T[Path<T>], {
                shouldValidate: false,
              });
            }}
            options={governorateOptions}
            loading={isLoading}
            placeholder="Select governorate"
            searchPlaceholder="Search governorates"
            error={errors.governorate?.message as string | undefined}
          />
        )}
      />
      <Controller
        control={control}
        name={"city" as Path<T>}
        render={({ field }) => (
          <SearchableSelect
            label="City / Area"
            prominent={prominent}
            icon={prominent && <Icon name="city" size={16.5} />}
            value={field.value ?? ""}
            onChange={field.onChange}
            options={cityOptions}
            disabled={!governorate}
            loading={isLoading}
            placeholder={
              governorate ? "Select city or area" : "Select a governorate first"
            }
            searchPlaceholder="Search cities"
            error={errors.city?.message as string | undefined}
          />
        )}
      />
    </>
  );
}
