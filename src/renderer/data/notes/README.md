# Notes content format

Each module exports an array of **sections**. A section is a self-contained
study topic that can be marked complete for progress tracking.

```js
{
  id: 'unique-stable-id',      // used by the progress tracker — never reuse/rename
  title: 'Human readable title',
  blocks: [ /* ordered content blocks */ ],
}
```

A **block** is one of:

| type       | shape                                             | renders as |
|------------|---------------------------------------------------|------------|
| `p`        | `{ type:'p', text }`                              | paragraph  |
| `h`        | `{ type:'h', text }`                              | sub-heading|
| `list`     | `{ type:'list', items:[...] }`                    | bullet list|
| `steps`    | `{ type:'steps', items:[...] }`                   | numbered   |
| `table`    | `{ type:'table', head:[...], rows:[[...], ...] }` | table      |
| `diagram`  | `{ type:'diagram', code:'<mermaid>' }`            | Mermaid SVG|
| `tip`      | `{ type:'tip', text }`                            | 💡 exam tip |
| `warn`     | `{ type:'warn', text }`                           | ⚠️ gotcha   |
| `note`     | `{ type:'note', text }`                           | ℹ️ callout  |

All content is **original**, written for this project. Diagrams are defined as
Mermaid code so they are crisp, offline, and tiny.
```
