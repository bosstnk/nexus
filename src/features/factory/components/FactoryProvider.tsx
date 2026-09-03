"use client";

import { createContext, useContext, useMemo, useState } from "react";
import {
  DEFAULT_FACTORY_ID,
  FACTORIES,
  factoryById,
  type Factory,
} from "../factories";

type FactoryContextValue = {
  factory: Factory;
  factories: Factory[];
  selectFactory: (id: string) => void;
};

const FactoryContext = createContext<FactoryContextValue | null>(null);

export function FactoryProvider({
  children,
  defaultFactoryId = DEFAULT_FACTORY_ID,
}: {
  children: React.ReactNode;
  defaultFactoryId?: string;
}) {
  const [factoryId, setFactoryId] = useState(defaultFactoryId);

  const value = useMemo<FactoryContextValue>(
    () => ({
      factory: factoryById(factoryId),
      factories: FACTORIES,
      selectFactory: setFactoryId,
    }),
    [factoryId],
  );

  return (
    <FactoryContext.Provider value={value}>{children}</FactoryContext.Provider>
  );
}

export function useFactory() {
  const context = useContext(FactoryContext);
  if (!context)
    throw new Error("useFactory ต้องถูกเรียกภายใต้ <FactoryProvider>");
  return context;
}
