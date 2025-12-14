# Unused Data in Search API Response

This document identifies data fields in the search API response that are currently not being used in the application.

## Root Level

### Used

- `status` ✅ (displayed in page.tsx)
- `variants` ✅ (rendered as segments)
- `context.search.pointFrom.title` ✅ (Header component)
- `context.search.pointTo.title` ✅ (Header component)
- `minPrice.forward` ✅ (Header component, transformed in API)

### Unused

- `activePartners` - Array of partner identifiers (e.g., `["im"]`)
- `context.isChanged` - Boolean indicating if search parameters changed
- `context.original` - Original search parameters (nearest, pointFrom, pointTo)
- `context.search.nearest` - Boolean for nearest station search
- `context.transportTypes` - Array of transport types (e.g., `["train"]`)
- `context.latestDatetime` - Latest available datetime for booking

## Variant Level

### Used

- `forward` ✅ (rendered as segments)
- `backward` ✅ (rendered as segments)

### Unused

- `id` - Variant identifier
- `orderUrl` - Object with booking URL information (e.g., `{ "owner": "TRAINS" }`)

## Segment Level

### Used

- `departure` ✅ (formatted and displayed)
- `arrival` ✅ (formatted and displayed)
- `duration` ✅ (formatted and displayed, used for fastest badge)
- `stationFrom.title` ✅ (displayed)
- `stationFrom.settlement.title` ✅ (displayed)
- `stationTo.title` ✅ (displayed)
- `stationTo.settlement.title` ✅ (displayed)
- `company.title` ✅ (displayed)
- `train.displayNumber` ✅ (displayed)
- `train.title` ✅ (displayed as fallback)
- `features.namedTrain.title` ✅ (displayed)
- `tariffs.classes` ✅ (all tariff data used)

### Unused

- `id` - Segment identifier
- `provider` - Provider identifier (e.g., `"P1"`)
- `facilities` - Array of facilities at segment level (only tariff-level facilities are used)

## Station Object

### Used

- `title` ✅
- `settlement.title` ✅

### Unused

- `id` - Station identifier
- `country.id` - Country ID
- `country.code` - Country code (e.g., `"RU"`)
- `timezone` - Timezone (e.g., `"Europe/Moscow"`)
- `railwayTimezone` - Railway timezone
- `slug` - Station slug

## Settlement Object

### Used

- `title` ✅

### Unused

- `id` - Settlement ID
- `preposition` - Preposition for the settlement name
- `titleAccusative` - Accusative case title
- `titleGenitive` - Genitive case title
- `titleLocative` - Locative case title
- `titlePrepositional` - Prepositional case title
- `slug` - Settlement slug

## Company Object

### Used

- `title` ✅

### Unused

- `id` - Company ID

## Train Object

### Used

- `displayNumber` ✅
- `title` ✅ (used as fallback)

### Unused

- `number` - Train number (redundant with displayNumber)

## Features Object

### Used

- `namedTrain.title` ✅

### Unused

- `eTicket` - Object indicating e-ticket availability (e.g., `{ "type": "eTicket" }`)
- `namedTrain.type` - Named train type
- `namedTrain.id` - Named train ID
- `namedTrain.isDeluxe` - Boolean indicating if train is deluxe
- `namedTrain.isHighSpeed` - Boolean indicating if train is high-speed
- `namedTrain.shortTitle` - Short title for named train

## Tariff Classes

### Used

- `price.value` ✅
- `price.currency` ✅
- `seats` ✅
- `hasNonRefundableTariff` ✅
- `placesDetails.lower.quantity` ✅
- `placesDetails.upper.quantity` ✅
- `facilities` ✅ (intersection used for segment facilities)

### Unused

- `type` - Tariff type string (only used for mapping to display names)
- `placesDetails.lowerSide` - Lower side places quantity (for platzkart)
- `placesDetails.upperSide` - Upper side places quantity (for platzkart)

## Context Point Object

### Used

- `title` ✅ (from `context.search.pointFrom` and `context.search.pointTo`)

### Unused

- `key` - Point key identifier (e.g., `"c213"`)
- `titleWithType` - Title with type prefix (e.g., `"г. Москва"`)
- `titleGenitive` - Genitive case title
- `titleAccusative` - Accusative case title
- `titleLocative` - Locative case title
- `preposition` - Preposition (e.g., `"в"`)
- `popularTitle` - Popular title
- `shortTitle` - Short title
- `slug` - Point slug

## Summary

**Total unused fields:** ~50+ fields across the response structure

**Key unused data categories:**

1. **IDs and identifiers** - Most `id` fields, `key`, `slug` fields
2. **Localization data** - Case variations (genitive, accusative, etc.), prepositions
3. **Metadata** - Timezones, transport types, latest datetime
4. **Additional place details** - Side places for platzkart, segment-level facilities
5. **Booking/ordering** - `orderUrl`, `activePartners`, `provider`
6. **Train features** - `isDeluxe`, `isHighSpeed`, `eTicket`, `shortTitle`
7. **Search context** - `isChanged`, `original`, `nearest`

**Potential use cases for unused data:**

- `orderUrl` - Could be used for booking functionality
- `eTicket` - Could indicate e-ticket availability
- `isDeluxe` / `isHighSpeed` - Could show special train indicators
- `lowerSide` / `upperSide` - Could show detailed seat availability for platzkart
- `timezone` / `railwayTimezone` - Could be used for accurate time display
- `context.original` - Could show search history or allow reverting search
- `activePartners` - Could show which partners are available
- `latestDatetime` - Could show booking deadline
