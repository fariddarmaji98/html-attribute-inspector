# Chrome Web Store listing copy

Paste these into the CWS developer dashboard when creating the item.

## Name (max 45 chars)
Attribute Inspector

## Short description (max 132 chars)
Hover any element to see all its HTML attributes in a popup. Ctrl+right-click to lock. Copy values with one click.

## Category
Developer Tools

## Detailed description

See every HTML attribute on any element — instantly, without opening DevTools.

Hover over any part of a page and Attribute Inspector shows a popup with all of that element's attributes and their values. No layers of markup to dig through, no context switching.

FEATURES
• Hover to inspect — move your cursor over any element and its full attribute list appears
• Lock an element — press Ctrl + right-click to pin the popup, then move your cursor freely to read or copy values
• One-click copy — a copy icon at the end of every value copies it straight to your clipboard
• Clean popup — attributes shown in a compact, readable table with syntax highlighting
• Non-invasive — nothing on the page is modified
• Lightweight — no background service, no tracking, no data collection

HOW TO USE
1. Click the toolbar icon and press Activate
2. Hover any element to see its attributes
3. Ctrl + right-click to lock the element under your cursor
4. Click a copy icon to copy that attribute value
5. Press Esc to release the lock, or Esc again to deactivate

WHO IT'S FOR
Web developers debugging markup, QA engineers verifying data attributes and ARIA labels, designers inspecting how a site is built, and anyone curious about the HTML behind a page.

PRIVACY
This extension collects no data. It reads attributes from the page you are viewing, locally, and sends nothing anywhere.

## Single purpose description
Displays the HTML attributes of the page element currently under the user's cursor.

## Permission justifications

- **storage** — remembers whether the inspector is switched on, so the setting persists between popups and sessions.
- **activeTab** — checks whether the content script is running in the current tab and reloads that tab when the user clicks the reload button, so the extension can work on tabs opened before installation.

## Remote code
No. All logic ships inside the package.

## Data usage disclosures
- Does NOT collect or use user data — no checkbox needs to be enabled on the data-usage form.
- Not sold to third parties, not used for unrelated purposes, not used for creditworthiness.

## Assets checklist

| Asset | Requirement | File |
|---|---|---|
| Store icon | 128x128 PNG | `icon128.png` |
| Screenshot | 1280x800 PNG | `store/promo-1280x800.png` |
| Package | ZIP, no source/extra files | `build/html-attribute-inspector-v1.0.0.zip` |

Optional extras (not required to publish): 440x280 small promo tile, 1400x560 marquee.

## Version bump rule
Chrome Web Store rejects an upload whose `manifest.json` version is not higher than the live one. Bump before every upload:

```bash
python build.py 1.0.1    # rewrites manifest version, rebuilds the zip
```
