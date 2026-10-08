<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Copilot chat actions run as AI tool calls in src/lib/copilot-tools.server.ts using the caller's RLS-scoped client — so the AI can only touch the signed-in user's own data.
- Interface localization uses a root language provider and shared source-key dictionaries; persist only the language preference and keep database values and patient content unchanged so switching languages cannot alter health data.
