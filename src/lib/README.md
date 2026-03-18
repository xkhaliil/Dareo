# lib/

Contains a single barrel required by **shadcn/ui**:

- `utils.ts` — re-exports `cn()` from `src/shared/lib/utils.ts`.  
  shadcn's generated components import from `@/lib/utils` and this cannot be changed.

All other utilities live in `src/shared/lib/`.
