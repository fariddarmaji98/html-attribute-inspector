# Chrome Web Store listing copy

Paste these into the CWS developer dashboard when creating the item.

## Name (max 45 chars)
HTML Attribute Inspector

## Short description (max 132 chars)
Hover any element to see all its HTML attributes in a popup. Ctrl+right-click to lock. Copy values with one click.

## Category
Developer Tools

## Detailed description

See every HTML attribute on any element — instantly, without opening DevTools.

Hover over any part of a page and HTML Attribute Inspector shows a popup with all of that element's attributes and their values. No layers of markup to dig through, no context switching.

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
Displays the HTML attributes of the element currently under the user's cursor on any web page, in a read-only popup. The user switches the inspector on from the toolbar popup, hovers to see attributes, and can copy individual values. No page content is modified and no data leaves the browser.

## Permission justifications

### Justifikasi storage
```
The extension stores a single boolean flag recording whether the inspector is
switched on or off. It is read when the popup opens so the toggle shows the
state the user last chose, and written when the user presses Activate or
Deactivate. No page content, URLs, or personal data are stored.
```

### Justifikasi activeTab
```
The extension's single purpose is to show the HTML attributes of the element
under the user's cursor. activeTab grants access to the current tab only after
the user clicks the extension icon, which is exactly when the extension needs
to read that page. It is used to inject the content script into the tab the
user is actively viewing and to read that tab's URL, so the extension can
refuse to run on browser-internal pages. No access is requested to any other
tab, and none is requested before the user clicks the icon.
```

### Justifikasi scripting
```
The content script is injected on demand with chrome.scripting.executeScript
into the active tab only, after the user clicks the extension icon. The
extension deliberately avoids declaring a content script with an <all_urls>
match pattern, so that it never runs on a page the user has not explicitly
chosen to inspect. The injected script reads the attribute names and values of
one element at a time and renders them locally in an on-page popup. Nothing is
transmitted anywhere.
```

### Justifikasi Izin host
```
No host permission is requested. The manifest declares no host_permissions and
no content_scripts match patterns. Page access comes solely from activeTab,
which the user grants per tab by clicking the extension icon.
```

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
