"use server";

import { db } from "@/app/_lib/prisma";
import { DeleteTransactionSchema } from "./schema";
import { revalidatePath } from "next/cache";

export default async function deleteTransaction({
  transactionId,
}: DeleteTransactionSchema) {
  await db.transaction.delete({
    where: {
      id: transactionId,
    },
  });

  revalidatePath("/transactions");
  revalidatePath("/");
}
