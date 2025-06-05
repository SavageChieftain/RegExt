# RegExt Usage Examples

This document provides practical examples of using RegExt in real-world scenarios.

## Log Analysis

```javascript
const logRegex = new RegExt('\\[(\\d{4}-\\d{2}-\\d{2})\\] (\\w+): (.+)', 'g');
const logs = `
[2023-12-01] INFO: System started
[2023-12-01] ERROR: Connection failed
[2023-12-01] DEBUG: Processing data
`;

// Count error logs
const errorCount = new RegExt('ERROR', 'g').count(logs); // 1

// Extract all log entries
const entries = logRegex.loopExec(logs);
entries?.forEach(entry => {
  const [fullMatch, date, level, message] = entry;
  console.log(`${date}: [${level}] ${message}`);
});
```

## HTML Tag Processing

```javascript
const tagRegex = new RegExt('<(\\w+)[^>]*>', 'g');
const html = '<div class="container"><p>Hello</p><span>World</span></div>';

// Extract tag names only
const tags = tagRegex.extractGroups(html); // [['div'], ['p'], ['span']]

// Count tags
const tagCount = tagRegex.count(html); // 3
```

## URL Processing

```javascript
const urlRegex = new RegExt('https?://([^/\\s]+)', 'g');
const text = 'Visit https://example.com and http://test.org for more info';

// Extract domain names only
const domains = urlRegex.extractGroups(text); // [['example.com'], ['test.org']]

// Mask URLs
const masked = urlRegex.replaceAll(text, '[URL]');
// "Visit [URL] and [URL] for more info"
```

## Email Validation and Extraction

```javascript
const emailRegex = new RegExt('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', 'g');
const text = 'Contact us at support@example.com or admin@test.org';

// Extract all emails
const emails = emailRegex.extract(text);
// ['support@example.com', 'admin@test.org']

// Count emails
const emailCount = emailRegex.count(text); // 2

// Check if text contains emails
const hasEmails = emailRegex.safeTest(text); // true
```

## Phone Number Processing

```javascript
const phoneRegex = new RegExt('(\\d{3})-(\\d{3})-(\\d{4})', 'g');
const text = 'Call 123-456-7890 or 987-654-3210 for support';

// Extract phone numbers with formatting
const phones = phoneRegex.extractGroups(text);
// [['123', '456', '7890'], ['987', '654', '3210']]

// Reformat phone numbers
const formatted = phoneRegex.replaceAll(text, '($1) $2-$3');
// "Call (123) 456-7890 or (987) 654-3210 for support"
```

## Data Parsing

```javascript
const csvRegex = new RegExt('([^,]+),([^,]+),([^,\\n]+)', 'g');
const csvData = `
John,Doe,30
Jane,Smith,25
Bob,Johnson,35
`;

// Parse CSV data
const records = csvRegex.extractGroups(csvData);
// [['John', 'Doe', '30'], ['Jane', 'Smith', '25'], ['Bob', 'Johnson', '35']]

// Get the last record
const lastRecord = csvRegex.findLast(csvData);
// ['Bob,Johnson,35', 'Bob', 'Johnson', '35']
```

## Text Cleaning

```javascript
const whitespaceRegex = new RegExt('\\s+', 'g');
const multiSpaceText = 'This   has    multiple    spaces';

// Normalize whitespace
const cleaned = whitespaceRegex.replaceAll(multiSpaceText, ' ');
// "This has multiple spaces"

// Count whitespace sequences
const spaceCount = whitespaceRegex.count(multiSpaceText); // 3
```

## Number Extraction and Processing

```javascript
const numberRegex = new RegExt('\\d+(?:\\.\\d+)?', 'g');
const text = 'The price is $29.99 and shipping is $5.00';

// Extract all numbers
const numbers = numberRegex.extract(text);
// ['29.99', '5.00']

// Calculate total
const total = numbers.reduce((sum, num) => sum + parseFloat(num), 0);
// 34.99

// Replace with currency format
const currencyRegex = new RegExt('\\$(\\d+(?:\\.\\d+)?)', 'g');
const formatted = currencyRegex.replaceAll(text, 'USD $1');
// "The price is USD 29.99 and shipping is USD 5.00"
```

## Template Processing

```javascript
const templateRegex = new RegExt('\\{\\{(\\w+)\\}\\}', 'g');
const template = 'Hello {{name}}, your order {{orderId}} is ready!';

// Extract template variables
const variables = templateRegex.extractGroups(template);
// [['name'], ['orderId']]

// Replace template variables
const data = { name: 'John', orderId: '12345' };
const result = templateRegex.replaceAll(template, (match, varName) => {
  return data[varName] || match;
});
// "Hello John, your order 12345 is ready!"
```

## Word Processing

```javascript
const wordRegex = new RegExt('\\b\\w+\\b', 'g');
const text = 'The quick brown fox jumps over the lazy dog';

// Count words
const wordCount = wordRegex.count(text); // 9

// Extract words
const words = wordRegex.extract(text);
// ['The', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog']

// Find the last word
const lastWord = wordRegex.findLast(text);
// ['dog', index: 40, ...]
```

## Advanced Pattern Matching

```javascript
const ipRegex = new RegExt('(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})', 'g');
const logFile = `
192.168.1.1 - GET /index.html
10.0.0.1 - POST /api/login
172.16.0.100 - GET /assets/style.css
`;

// Extract IP addresses
const ips = ipRegex.extract(logFile);
// ['192.168.1.1', '10.0.0.1', '172.16.0.100']

// Validate and categorize IPs
const privateIps = ips.filter(ip => {
  const match = ipRegex.loopExec(ip)?.[0];
  if (!match) return false;

  const [, a, b, c, d] = match;
  const first = parseInt(a);
  const second = parseInt(b);

  return (first === 10) ||
         (first === 172 && second >= 16 && second <= 31) ||
         (first === 192 && second === 168);
});
// ['192.168.1.1', '10.0.0.1', '172.16.0.100']
```
