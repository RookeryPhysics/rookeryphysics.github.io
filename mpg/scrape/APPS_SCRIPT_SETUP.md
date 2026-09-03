# Chronogolf Scraper: Web Form & Google Apps Script Setup

This setup connects the web interface in [teetime_picker.html](file:///c:/Users/miked/rookeryphysics.github.io/mpg/scrape/teetime_picker.html) to Google Sheets via [Code.gs](file:///c:/Users/miked/rookeryphysics.github.io/mpg/scrape/Code.gs).

---

## 1. Setup Your Google Sheet and Apps Script

### Step 1: Open Google Sheets
1. Go to [Google Sheets](https://sheets.new) and create a new spreadsheet.
2. Name it (e.g. *BC Golf Tee Times*).

### Step 2: Open Apps Script Editor
1. In the top menu, click **Extensions** > **Apps Script**.
2. Erase any default code in the editor.
3. Copy all code from [Code.gs](file:///c:/Users/miked/rookeryphysics.github.io/mpg/scrape/Code.gs) and paste it into the editor.
4. Press **Save** (💾 or `Ctrl + S`).

### Step 3: Run Initial Authorization
1. In the toolbar dropdown at the top, select the function **`scrapeToday`**.
2. Click **▶ Run**.
3. When prompted with **Authorization Required**:
   - Click **Review permissions**.
   - Select your Google account.
   - Click **Advanced** (at bottom-left) -> Click **Go to Chronogolf Scraper (unsafe)**.
   - Click **Allow**.
4. Check your Google Sheet — you should see the *Tee Times* tab created and filled!

---

## 2. Deploy as a Web App (Required for the HTML form)

To let [teetime_picker.html](file:///c:/Users/miked/rookeryphysics.github.io/mpg/scrape/teetime_picker.html) talk to your Google Sheet:

1. In the Apps Script editor, click the blue **Deploy** button (top right) > **New deployment**.
2. Click the gear icon ⚙️ next to *Select type* and pick **Web app**.
3. Configure the fields:
   - **Description:** `BC Golf Scraper API`
   - **Execute as:** `Me (your_email@gmail.com)` *(Important! This ensures the script has permission to write to your sheet)*
   - **Who has access:** `Anyone` *(Important! This allows your browser form to call the endpoint)*
4. Click **Deploy**.
5. Copy the **Web app URL** that ends with `/exec` (example: `https://script.google.com/macros/s/AKfycb.../exec`).

> [!NOTE]
> If you ever make edits to `Code.gs` in the future, remember to click **Deploy** > **Manage deployments** > Edit ✏️ > Version: **New version** > **Deploy** so the published Web App picks up your latest code.

---

## 3. Using the Web App ([teetime_picker.html](file:///c:/Users/miked/rookeryphysics.github.io/mpg/scrape/teetime_picker.html))

The Web App URL (`https://script.google.com/macros/s/AKfycbzix6ZwFnNDeMVjJ-Aj5VAgkqy22rnJqNb-xCfTtg0vYKYYUKw6w5IuDc4wfRYCb1Gefg/exec`) is already baked directly into [teetime_picker.html](file:///c:/Users/miked/rookeryphysics.github.io/mpg/scrape/teetime_picker.html), so no manual URL entry is needed:

1. Open [teetime_picker.html](file:///c:/Users/miked/rookeryphysics.github.io/mpg/scrape/teetime_picker.html) in your browser.
2. Under **Select Golf Course**:
   - 3 randomly chosen BC golf courses will be displayed (from a curated list of top BC Chronogolf courses including Tsawwassen Springs, Fraserview, Langara, McCleery, University Golf Club, Northlands, Whistler, Big Sky, Predator Ridge, Olympic View, etc.).
   - Click any card to select it.
   - Click **🎲 Re-roll 3 Courses** at any time to draw 3 new BC courses.
3. Select your desired play date.
4. Click **🚀 Scrape & Update Sheet**:
   - The web app contacts your Apps Script deployment.
   - Live tee times and pricing are retrieved, filtered (removing sold out and N/A price slots), written cleanly to your Google Sheet, and **displayed immediately on the page** in an interactive, filterable table.
5. Click **📊 View Current Sheet Data**:
   - Reads whatever tee times are currently stored in your Google Sheet and displays them on screen without re-scraping Chronogolf.
   - You can also filter the displayed tee times in real-time by time (e.g., `AM`, `PM`, `09`) or format/hole (`18`, `9`).

---

## 4. Updating Apps Script Code (Required for the live table)

Because we added the `readSheetTeeTimes()` function and returned row data in `Code.gs`:

1. Copy the updated code from [Code.gs](file:///c:/Users/miked/rookeryphysics.github.io/mpg/scrape/Code.gs) into your Apps Script editor and save (💾 or `Ctrl + S`).
2. Click **Deploy** > **Manage deployments**.
3. Click the ✏️ **Edit** icon next to your active deployment.
4. Under **Version**, choose **New version**.
5. Click **Deploy**. *(This ensures Google Apps Script runs the new code without changing your URL!)*
