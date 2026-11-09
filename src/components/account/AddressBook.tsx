"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@/components/ui/icons";
import {
  useAddAddress,
  useAddress,
  useAddresses,
  useRemoveAddress,
  useReplaceAddress,
} from "@/hooks/useAccount";
import { getErrorMessage } from "@/lib/utils";
import {
  addressSchemaFor,
  type AddressValues,
} from "@/lib/validation/schemas/address";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/Input";
import { EmptyState, ErrorState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { LocationFields } from "./LocationFields";
import { useLocations } from "@/hooks/useLocations";
import type { Address } from "@/types/api";

const actionTile =
  "flex h-9 w-9 items-center justify-center rounded-lg bg-surface-muted text-body transition-colors";

function AddressForm({
  initial,
  onDone,
}: {
  initial?: Address;
  onDone: () => void;
}) {
  const add = useAddAddress();
  const replace = useReplaceAddress();
  const { data: locations } = useLocations();
  const schema = useMemo(() => addressSchemaFor(locations), [locations]);
  const place = initial && locations?.findByLabel(initial.city);
  const form = useForm<AddressValues>({
    resolver: zodResolver(schema),
    defaultValues: initial && {
      name: initial.name,
      details: initial.details,
      phone: initial.phone,
      governorate: place?.governorate.id,
      city: place?.city.id,
    },
  });
  const e = form.formState.errors;

  const save = form.handleSubmit((v) => {
    // Non-null because the schema already validated this pair.
    const location = locations!.resolve(v.governorate, v.city)!;
    const payload = {
      name: v.name,
      details: v.details,
      phone: v.phone,
      city: location.label,
    };
    if (initial)
      replace.mutate({ id: initial._id, payload }, { onSuccess: onDone });
    else add.mutate(payload, { onSuccess: onDone });
  });

  return (
    <form
      onSubmit={save}
      className="mb-6 grid gap-4 rounded-2xl border border-line-soft bg-surface-card p-5 shadow-sm sm:grid-cols-2 animate-fade-in"
      noValidate
    >
      <Input
        label="Label"
        placeholder="Home, Work…"
        icon={<Icon name="home" size={17} />}
        error={e.name?.message}
        {...form.register("name")}
      />
      <div className="hidden sm:block" />
      <LocationFields
        control={form.control}
        errors={e}
        setValue={form.setValue}
      />
      <div className="sm:col-span-2">
        <Input
          label="Address details"
          placeholder="Street, building, apartment"
          icon={<Icon name="map-pin" size={17} />}
          error={e.details?.message}
          {...form.register("details")}
        />
      </div>
      <Input
        label="Phone"
        type="tel"
        placeholder="01012345678"
        icon={<Icon name="phone" size={17} />}
        error={e.phone?.message}
        {...form.register("phone")}
      />
      <div className="flex items-end gap-2">
        <Button type="submit" loading={add.isPending || replace.isPending}>
          {initial ? "Update address" : "Save address"}
        </Button>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function EditAddress({ id, onDone }: { id: string; onDone: () => void }) {
  const { data: address } = useAddress(id);
  const { data: locations } = useLocations();
  if (!address || !locations) return <Skeleton className="mb-6 h-64" />;
  return <AddressForm key={id} initial={address} onDone={onDone} />;
}

function AddressCard({
  address,
  onEdit,
}: {
  address: Address;
  onEdit: () => void;
}) {
  const remove = useRemoveAddress();
  const [confirming, setConfirming] = useState(false);

  return (
    <li className="rounded-2xl border border-line-soft bg-surface-card p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Icon name="map-pin" size={18.8} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-heading">{address.name}</p>
          <p className="mt-1 text-sm text-body">{address.details}</p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-2">
              <Icon name="phone" size={14} /> {address.phone}
            </span>
            <span className="flex items-center gap-2">
              <Icon name="city" size={14} /> {address.city}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={onEdit}
            aria-label={`Edit ${address.name}`}
            className={`${actionTile} hover:bg-brand-50 hover:text-brand-600`}
          >
            <Icon name="pencil" size={16.5} />
          </button>
          <button
            onClick={() => setConfirming(true)}
            disabled={remove.isPending}
            aria-label={`Delete ${address.name}`}
            className={`${actionTile} hover:bg-red-50 hover:text-red-500 disabled:opacity-50`}
          >
            <Icon name="trash" filled size={16.5} />
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirming}
        icon={
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
            <Icon name="trash" size={32} />
          </div>
        }
        title="Delete Address?"
        message={
          <>
            Delete{" "}
            <span className="font-semibold text-body">{address.name}</span> from
            your saved addresses?
          </>
        }
        confirmLabel="Delete"
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          remove.mutate(address._id);
        }}
      />
    </li>
  );
}

export function AddressBook() {
  const { data, isLoading, error, refetch } = useAddresses();
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const list = data?.data ?? [];

  return (
    <section className="animate-fade-in">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-heading">My Addresses</h1>
          <p className="mt-1 text-sm text-muted">
            Manage your saved delivery addresses
          </p>
        </div>
        {!adding && !editingId && (
          <button
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-brand-600/25 transition-all hover:bg-brand-700"
          >
            <Icon name="plus" size={16.5} className="w-5" /> Add Address
          </button>
        )}
      </div>

      {adding && <AddressForm onDone={() => setAdding(false)} />}
      {editingId && (
        <EditAddress id={editingId} onDone={() => setEditingId(null)} />
      )}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : error ? (
        <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
      ) : list.length === 0 ? (
        !adding && (
          <EmptyState
            icon={<Icon name="map-pin" size={28} />}
            title="No saved addresses"
            description="Add an address to speed up checkout."
          />
        )
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {list.map((a) => (
            <AddressCard
              key={a._id}
              address={a}
              onEdit={() => {
                setAdding(false);
                setEditingId(a._id);
              }}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
