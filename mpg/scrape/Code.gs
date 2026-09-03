/**
 * Chronogolf Tee Times & Prices Scraper for Google Apps Script
 * Web App Endpoint & Sheets Updater
 */

var CONFIG = {
  DEFAULT_COURSE_SLUG: 'tsawwassen-springs-golf',
  BASE_URL: 'https://www.chronogolf.ca',
  DEFAULT_AFFILIATION_ID: 3089,
  SHEET_NAME: 'Tee Times',
  USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

/**
 * Handle HTTP GET requests (Web App endpoint for the HTML form).
 * Accepts query parameters:
 *   - ?action=read : Reads and returns the current tee times stored in the Google Sheet.
 *   - ?course=slug&date=YYYY-MM-DD : Scrapes Chronogolf, updates the sheet, and returns the tee times.
 */
function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action.toLowerCase() : 'scrape';
    
    if (action === 'read') {
      var sheetData = readSheetTeeTimes();
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Successfully loaded ' + sheetData.teeTimes.length + ' tee times from Google Sheet.',
        data: sheetData
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var course = (e && e.parameter && e.parameter.course) ? e.parameter.course.trim() : CONFIG.DEFAULT_COURSE_SLUG;
    var date = (e && e.parameter && e.parameter.date) ? e.parameter.date.trim() : Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'GMT', 'yyyy-MM-dd');
    
    var result = scrapeAndPopulateSheet(course, date);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Sheet successfully updated with ' + result.openSlots + ' tee times!',
      data: result
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Reads all tee times and metadata currently stored in the Google Sheet.
 */
function readSheetTeeTimes() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  
  if (!sheet) {
    return {
      clubName: 'No Data',
      courseName: '',
      dateStr: '',
      openSlots: 0,
      currency: 'CAD',
      teeTimes: []
    };
  }
  
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  
  if (lastRow < 9) {
    // No data rows present
    var titleVal = sheet.getRange('A1').getValue().toString();
    var clubName = titleVal.replace(/^[⛳\s]+/, '').replace(/\s*-\s*TEE TIMES.*$/i, '').trim();
    var dateVal = sheet.getRange('B2').getValue().toString();
    return {
      clubName: clubName || 'No Data',
      courseName: sheet.getRange('B3').getValue().toString(),
      dateStr: dateVal,
      openSlots: 0,
      currency: 'CAD',
      teeTimes: []
    };
  }
  
  // Read metadata
  var titleVal = sheet.getRange('A1').getValue().toString();
  var clubName = titleVal.replace(/^[⛳\s]+/, '').replace(/\s*-\s*TEE TIMES.*$/i, '').trim();
  var dateStr = sheet.getRange('B2').getDisplayValue().toString();
  var courseName = sheet.getRange('B3').getDisplayValue().toString();
  var location = sheet.getRange('B4').getDisplayValue().toString();
  
  // Read data rows (starts at row 9)
  var range = sheet.getRange(9, 1, lastRow - 8, Math.min(lastCol, 9));
  var values = range.getDisplayValues();
  var teeTimes = [];
  
  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    var time = row[0];
    if (!time || time.indexOf('No open tee times') !== -1) continue;
    
    teeTimes.push({
      time: row[0],
      hole: row[1],
      format: row[2],
      priceFormatted: row[3],
      currency: row[4] || 'CAD',
      status: row[5] || 'Open',
      club: row[6] || clubName,
      course: row[7] || courseName,
      date: row[8] || dateStr
    });
  }
  
  return {
    clubName: clubName,
    courseName: courseName,
    location: location,
    dateStr: dateStr,
    openSlots: teeTimes.length,
    currency: teeTimes.length > 0 ? teeTimes[0].currency : 'CAD',
    teeTimes: teeTimes
  };
}

/**
 * Handle HTTP POST requests (Web App endpoint for JSON or form data).
 */
function doPost(e) {
  try {
    var course = CONFIG.DEFAULT_COURSE_SLUG;
    var date = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'GMT', 'yyyy-MM-dd');
    
    if (e && e.postData && e.postData.contents) {
      try {
        var body = JSON.parse(e.postData.contents);
        if (body.course) course = body.course.trim();
        if (body.date) date = body.date.trim();
      } catch (jsonErr) {
        if (e.parameter && e.parameter.course) course = e.parameter.course.trim();
        if (e.parameter && e.parameter.date) date = e.parameter.date.trim();
      }
    } else if (e && e.parameter) {
      if (e.parameter.course) course = e.parameter.course.trim();
      if (e.parameter.date) date = e.parameter.date.trim();
    }
    
    var result = scrapeAndPopulateSheet(course, date);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Sheet successfully updated with ' + result.openSlots + ' tee times!',
      data: result
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Custom Menu for Google Sheets toolbar.
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('⛳ Golf Scraper')
    .addItem('Scrape Today\'s Tee Times', 'scrapeToday')
    .addItem('Scrape Specific Date/Course...', 'promptAndScrape')
    .addToUi();
}

function scrapeToday() {
  var today = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'GMT', 'yyyy-MM-dd');
  scrapeAndPopulateSheet(CONFIG.DEFAULT_COURSE_SLUG, today);
}

function promptAndScrape() {
  var ui = SpreadsheetApp.getUi();
  var defaultDate = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'GMT', 'yyyy-MM-dd');
  
  var courseResponse = ui.prompt(
    'Enter Course Slug or Chronogolf URL',
    'e.g. "tsawwassen-springs-golf" or "fraserview-golf-course":',
    ui.ButtonSet.OK_CANCEL
  );
  if (courseResponse.getSelectedButton() !== ui.Button.OK) return;
  var courseInput = courseResponse.getResponseText().trim() || CONFIG.DEFAULT_COURSE_SLUG;
  
  var dateResponse = ui.prompt(
    'Enter Target Date',
    'YYYY-MM-DD format (Default: ' + defaultDate + '):',
    ui.ButtonSet.OK_CANCEL
  );
  if (dateResponse.getSelectedButton() !== ui.Button.OK) return;
  var dateInput = dateResponse.getResponseText().trim() || defaultDate;
  
  scrapeAndPopulateSheet(courseInput, dateInput);
}

/**
 * Core function to parse inputs, scrape Chronogolf, and write to sheet.
 * @param {string} courseOrUrl Course slug or full Chronogolf club URL.
 * @param {string} dateStr Date in YYYY-MM-DD format.
 * @return {object} Summary metadata
 */
function scrapeAndPopulateSheet(courseOrUrl, dateStr) {
  var params = parseCourseAndUrl(courseOrUrl, dateStr);
  var slug = params.slug;
  var targetDate = params.dateStr;
  var clubPageUrl = params.fullUrl;
  
  Logger.log('Fetching club details from: ' + clubPageUrl);
  
  // 1. Fetch club metadata (__NEXT_DATA__)
  var clubMeta = getClubMetadata(clubPageUrl);
  var clubId = clubMeta.id;
  var clubName = clubMeta.name || slug.replace(/-/g, ' ').toUpperCase();
  var currency = clubMeta.currencyCode || 'CAD';
  var affiliationId = clubMeta.defaultAffiliationTypeId || CONFIG.DEFAULT_AFFILIATION_ID;
  var courseName = (clubMeta.courses && clubMeta.courses.length > 0 && clubMeta.courses[0].name) ? clubMeta.courses[0].name : clubName;
  var location = [clubMeta.address, clubMeta.city, clubMeta.province].filter(Boolean).join(', ');

  Logger.log('Club ID: ' + clubId + ', Name: ' + clubName + ', Affiliation: ' + affiliationId);
  
  // 2. Fetch Tee Times API
  var rawTeetimes = fetchTeetimes(clubId, affiliationId, targetDate, clubPageUrl);
  Logger.log('Total scheduled slots retrieved: ' + rawTeetimes.length);
  
  // 3. Filter & Process Rows
  var rows = [];
  var soldOutCount = 0;
  var naPriceCount = 0;
  var pastCount = 0;
  
  var todayStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'GMT', 'yyyy-MM-dd');
  var isToday = (targetDate === todayStr);
  var now = new Date();

  for (var i = 0; i < rawTeetimes.length; i++) {
    var tt = rawTeetimes[i];
    var isOut = tt.out_of_capacity || false;
    var isFrozen = tt.frozen || false;
    var rawTime = tt.start_time || '';
    
    // Check if slot is in the past for today
    var isPast = false;
    if (isToday && rawTime) {
      try {
        var timeParts = rawTime.split(':');
        var slotDt = new Date();
        slotDt.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10), 0, 0);
        if (slotDt < now) {
          isPast = true;
          pastCount++;
        }
      } catch (e) {}
    }
    
    if (isOut || isFrozen) {
      soldOutCount++;
      continue;
    }
    
    // Extract price
    var numericPrice = null;
    var fees = tt.green_fees || [];
    if (fees.length > 0) {
      var rawPrice = fees[0].price !== undefined ? fees[0].price : (fees[0].green_fee !== undefined ? fees[0].green_fee : fees[0].subtotal);
      if (rawPrice !== null && rawPrice !== undefined && !isNaN(rawPrice)) {
        numericPrice = Number(rawPrice);
      }
    }
    
    // Filter out N/A or missing prices
    if (numericPrice === null) {
      naPriceCount++;
      continue;
    }
    
    var timeFormatted = formatTime12h(rawTime);
    var hole = 'Hole ' + (tt.hole || 1);
    var format = tt.format ? (tt.format.charAt(0).toUpperCase() + tt.format.slice(1)) : 'Normal';
    var status = isPast ? 'Past' : 'Open';
    
    rows.push([
      timeFormatted,
      hole,
      format,
      numericPrice,
      currency,
      status,
      clubName,
      courseName,
      targetDate
    ]);
  }
  
  // Sort rows chronologically by time
  rows.sort(function(a, b) {
    return parseTimeSortValue(a[0]) - parseTimeSortValue(b[1]);
  });
  
  // Format objects for web client response
  var teeTimesData = rows.map(function(r) {
    return {
      time: r[0],
      hole: r[1],
      format: r[2],
      price: r[3],
      priceFormatted: '$' + Number(r[3]).toFixed(2),
      currency: r[4],
      status: r[5],
      club: r[6],
      course: r[7],
      date: r[8]
    };
  });

  // 4. Output to Google Sheet
  var metaSummary = {
    clubName: clubName,
    courseName: courseName,
    location: location,
    dateStr: targetDate,
    sourceUrl: clubPageUrl,
    totalSlots: rawTeetimes.length,
    openSlots: rows.length,
    soldOutCount: soldOutCount,
    naPriceCount: naPriceCount,
    pastCount: pastCount,
    currency: currency,
    teeTimes: teeTimesData
  };

  writeToSheet(rows, metaSummary);
  return metaSummary;
}

function parseCourseAndUrl(courseOrUrl, dateStr) {
  var url = courseOrUrl || '';
  var slug = CONFIG.DEFAULT_COURSE_SLUG;
  var finalDate = dateStr || Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'GMT', 'yyyy-MM-dd');
  
  if (url.indexOf('chronogolf') !== -1 || url.indexOf('http') === 0) {
    var match = url.match(/\/club\/([^/?#]+)/);
    if (match) {
      slug = match[1];
    }
    var dateMatch = url.match(/[?&]date=([^&#]+)/);
    if (dateMatch) {
      finalDate = dateMatch[1];
    }
  } else if (courseOrUrl) {
    slug = courseOrUrl.trim();
  }
  
  var canonicalUrl = CONFIG.BASE_URL + '/club/' + slug + '?date=' + finalDate;
  return {
    slug: slug,
    dateStr: finalDate,
    fullUrl: canonicalUrl
  };
}

function getClubMetadata(url) {
  var options = {
    method: 'get',
    muteHttpExceptions: true,
    headers: {
      'User-Agent': CONFIG.USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  };
  
  var response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() !== 200) {
    throw new Error('Failed to fetch club page. HTTP ' + response.getResponseCode());
  }
  
  var html = response.getContentText();
  var match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!match) {
    throw new Error('Could not locate __NEXT_DATA__ in page HTML. Club may not exist or URL is invalid.');
  }
  
  var data = JSON.parse(match[1]);
  var club = data.props && data.props.pageProps && data.props.pageProps.club;
  if (!club) {
    throw new Error('Club configuration not found in page data.');
  }
  return club;
}

function fetchTeetimes(clubId, affiliationTypeId, dateStr, refererUrl) {
  var apiUrl = CONFIG.BASE_URL + '/marketplace/clubs/' + clubId + '/teetimes'
    + '?date=' + dateStr + '&affiliation_type_ids[]=' + affiliationTypeId;
    
  var options = {
    method: 'get',
    muteHttpExceptions: true,
    headers: {
      'User-Agent': CONFIG.USER_AGENT,
      'Accept': 'application/json',
      'Referer': refererUrl
    }
  };
  
  var response = UrlFetchApp.fetch(apiUrl, options);
  if (response.getResponseCode() !== 200) {
    throw new Error('Chronogolf API error. HTTP ' + response.getResponseCode() + ': ' + response.getContentText());
  }
  
  return JSON.parse(response.getContentText());
}

function formatTime12h(timeStr) {
  if (!timeStr) return '';
  var parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  var h = parseInt(parts[0], 10);
  var m = parts[1];
  var ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return h + ':' + m + ' ' + ampm;
}

function parseTimeSortValue(timeStr) {
  if (!timeStr) return 0;
  var match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  var h = parseInt(match[1], 10);
  var m = parseInt(match[2], 10);
  var ampm = match[3].toUpperCase();
  if (ampm === 'PM' && h < 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

function writeToSheet(rows, meta) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  }
  
  // Completely clear the entire sheet: data, formatting, formulas, notes, validations, bandings, and merges
  sheet.clear({ contentsOnly: false, formatOnly: false, commentsOnly: false, validationsOnly: false, skipFilteredRows: false });
  sheet.clearContents();
  sheet.clearFormats();
  sheet.clearNotes();
  
  // Remove any existing banded ranges (zebra striping)
  var bandings = sheet.getBandings();
  for (var b = 0; b < bandings.length; b++) {
    bandings[b].remove();
  }
  
  // Clear any leftover conditional format rules
  sheet.clearConditionalFormatRules();
  
  // Unmerge any leftover merged cells across the entire sheet
  sheet.getDataRange().breakApart();
  
  // 1. Title Banner
  sheet.getRange('A1:I1').merge()
    .setValue('⛳ ' + meta.clubName.toUpperCase() + ' - TEE TIMES')
    .setBackground('#1b4332')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setFontSize(14)
    .setHorizontalAlignment('center');

  // 2. Metadata Block
  var nowStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'GMT', 'yyyy-MM-dd HH:mm:ss');
  var metaData = [
    ['Target Date:', meta.dateStr, '', 'Total Slots:', meta.totalSlots],
    ['Course:', meta.courseName, '', 'Open Slots:', meta.openSlots],
    ['Location:', meta.location || 'N/A', '', 'Sold Out / Frozen:', meta.soldOutCount],
    ['Source URL:', meta.sourceUrl, '', 'N/A Price Filtered:', meta.naPriceCount],
    ['Last Updated:', nowStr, '', 'Slots Already Past:', meta.pastCount]
  ];
  
  sheet.getRange(2, 1, metaData.length, 5).setValues(metaData);
  sheet.getRange('A2:A6').setFontWeight('bold').setFontColor('#555555');
  sheet.getRange('D2:D6').setFontWeight('bold').setFontColor('#555555');
  
  // 3. Table Headers
  var headers = [
    'Time',
    'Hole',
    'Format',
    'Price (' + meta.currency + ')',
    'Currency',
    'Status',
    'Club',
    'Course',
    'Date'
  ];
  
  var startRow = 8;
  sheet.getRange(startRow, 1, 1, headers.length)
    .setValues([headers])
    .setBackground('#2d6a4f')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // 4. Data Rows
  if (rows.length > 0) {
    var dataRange = sheet.getRange(startRow + 1, 1, rows.length, headers.length);
    dataRange.setValues(rows);
    
    sheet.getRange(startRow + 1, 4, rows.length, 1).setNumberFormat('$#,##0.00');
    sheet.getRange(startRow + 1, 1, rows.length, 3).setHorizontalAlignment('center');
    sheet.getRange(startRow + 1, 5, rows.length, 2).setHorizontalAlignment('center');
    sheet.getRange(startRow + 1, 9, rows.length, 1).setHorizontalAlignment('center');
    
    // Batch zebra-striping formatting in a single call
    var bgColors = [];
    for (var r = 0; r < rows.length; r++) {
      var rowColor = (r % 2 === 0) ? '#f8f9fa' : '#ffffff';
      var rowColors = [];
      for (var c = 0; c < headers.length; c++) {
        rowColors.push(rowColor);
      }
      bgColors.push(rowColors);
    }
    dataRange.setBackgrounds(bgColors);
  } else {
    sheet.getRange(startRow + 1, 1, 1, headers.length).merge()
      .setValue('No open tee times found for this date/criteria.')
      .setFontStyle('italic')
      .setFontColor('#777777')
      .setHorizontalAlignment('center');
  }

  // 5. Column widths (set fixed widths without expensive autoResizeColumn RPC loops)
  var colWidths = [95, 80, 100, 115, 85, 85, 190, 190, 100];
  for (var c = 0; c < colWidths.length; c++) {
    sheet.setColumnWidth(c + 1, colWidths[c]);
  }

  SpreadsheetApp.flush();
  Logger.log('Successfully updated sheet "' + CONFIG.SHEET_NAME + '" with ' + rows.length + ' rows.');
}
