# Number Formatting Utility - Usage Examples

This document provides examples of how to use the number formatting utility functions throughout the GateHide project.

## Basic Usage

### Import the utility functions

```typescript
import { 
  formatNumberWithCommas, 
  parseFormattedNumber, 
  formatPersianCurrency,
  formatEnglishCurrency,
  useFormattedNumber 
} from '../utils/numberFormat';
```

## Examples

### 1. Formatting Numbers with Thousand Separators

```typescript
// Basic formatting
formatNumberWithCommas(1234567) // "1,234,567"
formatNumberWithCommas("1234567") // "1,234,567"
formatNumberWithCommas("1,234,567") // "1,234,567"

// In a React component
const [price, setPrice] = useState(0);
const formattedPrice = formatNumberWithCommas(price); // "1,234,567"
```

### 2. Parsing Formatted Numbers

```typescript
// Parse formatted strings back to numbers
parseFormattedNumber("1,234,567") // 1234567
parseFormattedNumber("1234567") // 1234567
parseFormattedNumber("") // 0

// In form submission
const handleSubmit = (formattedValue: string) => {
  const numericValue = parseFormattedNumber(formattedValue);
  // Send numericValue to backend
};
```

### 3. Currency Formatting

```typescript
// Persian currency (Toman)
formatPersianCurrency(1234567) // "۱٬۲۳۴٬۵۶۷ تومان"

// English currency (USD)
formatEnglishCurrency(1234567) // "1,234,567 $"

// Custom currency
formatCurrency(1234567, "€", "en-US") // "1,234,567 €"
```

### 4. React Hook for Formatted Number Input

```typescript
import { useFormattedNumber } from '../utils/numberFormat';

const PriceInput = () => {
  const { rawValue, formattedValue, updateValue, reset } = useFormattedNumber(0);

  return (
    <div>
      <input
        type="text"
        value={formattedValue}
        onChange={(e) => updateValue(e.target.value)}
        placeholder="Enter price (e.g., 1,000,000)"
      />
      <p>Raw value: {rawValue}</p>
      <button onClick={reset}>Reset</button>
    </div>
  );
};
```

### 5. Form Input with Real-time Formatting

```typescript
const PriceForm = () => {
  const [formattedPrice, setFormattedPrice] = useState('');
  const [rawPrice, setRawPrice] = useState(0);

  const handlePriceChange = (value: string) => {
    const numericValue = parseFormattedNumber(value);
    const formatted = formatNumberWithCommas(value);
    
    setRawPrice(numericValue);
    setFormattedPrice(formatted);
  };

  const handleSubmit = () => {
    // rawPrice contains the numeric value for backend
    console.log('Sending to backend:', rawPrice);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formattedPrice}
        onChange={(e) => handlePriceChange(e.target.value)}
        placeholder="Enter price (e.g., 1,000,000)"
      />
      <button type="submit">Submit</button>
    </form>
  );
};
```

### 6. Display Formatting in Tables

```typescript
const PlanTable = ({ plans }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {plans.map(plan => (
          <tr key={plan.id}>
            <td>{plan.name}</td>
            <td>{formatPersianCurrency(plan.price)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

### 7. Persian/English Digit Conversion

```typescript
// Convert Persian digits to English
persianToEnglishDigits("۱۲۳۴۵۶۷") // "1234567"

// Convert English digits to Persian
englishToPersianDigits("1234567") // "۱۲۳۴۵۶۷"

// Use in form validation
const validatePrice = (value: string) => {
  const englishValue = persianToEnglishDigits(value);
  return isValidNumberString(englishValue);
};
```

### 8. Custom Number Formatting

```typescript
// Custom separators
formatNumberWithSeparators(1234567.89, " ", ",", 2) // "1 234 567,89"

// Different locales
formatPersianNumber(1234567) // "۱٬۲۳۴٬۵۶۷ تومان"
formatPersianNumber(1234567, false) // "۱٬۲۳۴٬۵۶۷"
```

## Integration with Existing Components

### Update existing price inputs

```typescript
// Before
<input type="number" value={price} onChange={handleChange} />

// After
<input 
  type="text" 
  value={formatNumberWithCommas(price)} 
  onChange={(e) => {
    const numericValue = parseFormattedNumber(e.target.value);
    setPrice(numericValue);
  }}
  placeholder="Enter price (e.g., 1,000,000)"
/>
```

### Update price display components

```typescript
// Before
<span>{price} تومان</span>

// After
<span>{formatPersianCurrency(price)}</span>
```

## Best Practices

1. **Always use `parseFormattedNumber` before sending to backend** to ensure numeric values
2. **Use `formatNumberWithCommas` for display** to show thousand separators
3. **Use `formatPersianCurrency` for Persian currency display** in the UI
4. **Use the `useFormattedNumber` hook** for complex form inputs
5. **Validate input with `isValidNumberString`** before processing

## Migration Guide

To migrate existing price inputs to use the utility functions:

1. Import the utility functions
2. Change input type from "number" to "text"
3. Use `formatNumberWithCommas` for display value
4. Use `parseFormattedNumber` in onChange handler
5. Update display components to use `formatPersianCurrency`
