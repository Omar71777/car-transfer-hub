
/**
 * Marks transfers as billed
 */
export async function markTransfersBilled(
  transferIds: string[],
  updateTransfer: (id: string, data: any) => Promise<boolean>
) {
  console.log(`Marking ${transferIds.length} transfers as billed`);
  
  const results = [];
  for (const id of transferIds) {
    const result = await updateTransfer(id, { billed: true });
    if (!result) {
      console.warn(`Failed to mark transfer ${id} as billed`);
    }
    results.push(result);
  }
  
  return results.every(result => result === true);
}
