import { PrismaClient } from "@prisma/client";
import { randomInt } from "crypto";

const db = new PrismaClient();

function generateShortCode(): string {
  // Short, readable alphabet (no 0/O/1/I/L).
  const alphabet = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
  const length = 6;
  let out = "";
  for (let i = 0; i < length; i++) {
    out += alphabet[randomInt(0, alphabet.length)];
  }
  return out;
}

function createUniqueCode(reserved: Set<string>): string {
  for (let attempt = 0; attempt < 50; attempt++) {
    const code = generateShortCode();
    if (reserved.has(code)) continue;
    reserved.add(code);
    return code;
  }
  throw new Error("Failed to generate a unique code after many attempts");
}

async function main(): Promise<void> {
  const all = await db.purchaseCode.findMany({
    select: { id: true, code: true, isUsed: true },
    orderBy: { createdAt: "asc" },
  });

  console.log(`Found ${all.length} purchase codes.`);

  const reserved = new Set<string>(
    all
      .map((c) => (typeof c.code === "string" ? c.code.toUpperCase() : ""))
      .filter(Boolean)
  );

  let updated = 0;

  for (let i = 0; i < all.length; i++) {
    const row = all[i];

    for (let attempt = 0; attempt < 50; attempt++) {
      const next = createUniqueCode(reserved);
      try {
        await db.purchaseCode.update({
          where: { id: row.id },
          data: { code: next },
        });
        updated += 1;
        break;
      } catch (err: any) {
        // If we somehow collide (unique constraint), retry.
        if (err?.code === "P2002") {
          continue;
        }
        throw err;
      }
    }

    if ((i + 1) % 200 === 0 || i + 1 === all.length) {
      console.log(`... ${i + 1}/${all.length}`);
    }
  }

  console.log(`Done. Updated ${updated} codes.`);
}

main()
  .then(async () => {
    await db.$disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error(err);
    await db.$disconnect();
    process.exit(1);
  });

