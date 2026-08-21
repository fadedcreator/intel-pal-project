import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getHnStats } from "./hn.server";

export const getDiscussion = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ urls: z.array(z.string()).max(80) }).parse(data))
  .handler(async ({ data }) => getHnStats(data.urls));
