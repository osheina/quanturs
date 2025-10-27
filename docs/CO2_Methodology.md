# CO₂ Calculation Methodology

## Overview

Quanturs calculates per-visit CO₂ emissions for each venue in the database using scientifically-backed values from peer-reviewed sources and industry standards. All values are in **kg CO₂e** (carbon dioxide equivalent), which includes all greenhouse gases converted to CO₂ equivalent impact.

## Rating Scale

Each venue receives a CO₂ rating from **1 (Ultra low)** to **6 (Very high)** based on the calculated emissions:

| Rating | Label | CO₂ Range (kg) |
|--------|-------|----------------|
| 1 | Ultra low | ≤ 0.9 |
| 2 | Low | 0.9 - 1.5 |
| 3 | Medium | 1.5 - 3.0 |
| 4 | Elevated | 3.0 - 5.0 |
| 5 | High | 5.0 - 20.0 |
| 6 | Very high | > 20.0 |

---

## Emission Categories

### 1. Food & Beverages

**Scope:** Restaurants, cafes, brunch spots, rooftop bars  
**Unit:** Per ~700 kcal meal (average meal portion)  
**Source:** [Our World in Data (2023) - Environmental Impacts of Food Production](https://ourworldindata.org/environmental-impacts-of-food)

| Diet Type | CO₂e (kg) | Rationale |
|-----------|-----------|-----------|
| Vegan | 0.49 | Plant-based proteins (legumes, tofu) have minimal land use and methane emissions |
| Vegetarian | 0.84 | Includes dairy products, which have moderate emissions from cattle |
| Pescatarian | 1.12 | Fish farming and fishing operations have moderate carbon footprint |
| Poultry | 1.40 | Chicken production is more efficient than red meat but higher than plant-based |
| Keto (high protein/fat) | 2.10 | High consumption of animal products and fats |
| Beef | 4.90 | Beef has the highest emissions due to methane from cattle and extensive land use |
| Mixed diet | 1.75 | Average across typical American diet composition |

**Calculation Example:**
- A vegan café meal: **0.49 kg CO₂e** → Rating: **1 (Ultra low)**
- A steakhouse meal: **4.90 kg CO₂e** → Rating: **4 (Elevated)**

---

### 2. Hotels

**Scope:** Accommodation per night stay  
**Unit:** Per night  
**Source:** [Cornell Hotel Sustainability Benchmarking Study (2023)](https://ecommons.cornell.edu/handle/1813/75)

| Hotel Type | CO₂e (kg) | Rationale |
|------------|-----------|-----------|
| Green certified (LEED, eco-labeled) | 8.5 | Energy-efficient systems, renewable energy, water conservation |
| Standard/Mid-range | 15.0 | Typical HVAC, lighting, and laundry operations |
| Luxury/5-star | 24.0 | High energy use for amenities, large rooms, extensive services |

**Factors included:**
- HVAC (heating, ventilation, air conditioning)
- Hot water heating
- Lighting and electronics
- Laundry services
- Kitchen operations

---

### 3. Sustainable Shopping

**Scope:** Secondhand stores, eco boutiques, sustainable fashion  
**Unit:** Per visit (avg. purchase)  
**Source:** [EPA (2023) - Greenhouse Gas Equivalencies Calculator](https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator)

| Store Type | CO₂e (kg) | Rationale |
|------------|-----------|-----------|
| Secondhand/Thrift | -5.0 | **Negative emissions** - Buying used clothing avoids manufacturing new items, which saves 5-10 kg CO₂e per garment |

**Note:** The negative value represents **avoided emissions** compared to buying new clothing.

---

### 4. Farmers Markets

**Scope:** Local food markets  
**Unit:** Per visit  
**Source:** [EPA (2023) - Sustainable Management of Food](https://www.epa.gov/sustainable-management-food)

| Market Type | CO₂e (kg) | Rationale |
|-------------|-----------|-----------|
| Local farmers market | 1.5 | Minimal transportation ("food miles"), seasonal produce, reduced packaging |

**Why lower than grocery stores?**
- Food travels an average of 1,500 miles to reach conventional grocery stores
- Local markets reduce transport emissions by 80-90%

---

### 5. Outdoor Activities

**Scope:** Hiking, parks, trails  
**Unit:** Per visit  
**Source:** [EPA (2023) - Greenhouse Gas Equivalencies](https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator)

| Activity Type | CO₂e (kg) | Rationale |
|---------------|-----------|-----------|
| Hiking/Parks/Trails | 0.45 | Minimal impact - primarily from transportation to the site (avg. 10-mile drive) |

**Calculation:**
- Average car emits **0.45 kg CO₂e per 10 miles**
- Activity itself has near-zero emissions

---

### 6. Cultural Venues

**Scope:** Museums, galleries, art experiences  
**Unit:** Per visit  
**Source:** [Julie's Bicycle (2023) - Creative Green Tools](https://juliesbicycle.com/resource/creative-green-tools/)

| Venue Type | CO₂e (kg) | Rationale |
|------------|-----------|-----------|
| Museums/Galleries | 2.0 | Building operations (HVAC, lighting, climate control for art preservation) |

**Factors included:**
- Climate control for artifact preservation
- Lighting (often 24/7 for security)
- Visitor flow management
- Exhibition infrastructure

---

### 7. Wellness & Spa

**Scope:** Spa treatments, wellness centers  
**Unit:** Per session  
**Source:** [International Tourism Partnership (2023)](https://www.tourismpartnership.org/)

| Service Type | CO₂e (kg) | Rationale |
|--------------|-----------|-----------|
| Spa/Wellness | 6.5 | High energy use for water heating, steam rooms, saunas, HVAC for comfort |

**Factors included:**
- Hot water heating (significant energy demand)
- Steam rooms and saunas
- Climate control
- Laundry (towels, robes)

---

## Implementation Details

### Database Function

The CO₂ calculation is performed by the PostgreSQL function `compute_co2_kg(p_type, p_vibe, p_diet)`:

```sql
SELECT compute_co2_kg('restaurant', NULL, 'vegan') AS co2_kg;
-- Returns: 0.49
```

### Automatic Rating

The rating is computed automatically using the `compute_co2_rating(co2_kg)` function:

```sql
SELECT compute_co2_rating(0.49) AS co2_rating;
-- Returns: 1 (Ultra low)
```

---

## Limitations & Disclaimers

1. **Estimates Only:** Values are industry averages and may vary by specific venue operations
2. **Transportation Not Included:** User's travel to the venue is not factored in (except for outdoor activities)
3. **Regional Variations:** Energy grid carbon intensity varies by location (California has cleaner energy than coal-dependent states)
4. **Seasonal Changes:** Emissions can vary by season (e.g., heating in winter)

---

## References

1. **Our World in Data (2023):** [Environmental Impacts of Food Production](https://ourworldindata.org/environmental-impacts-of-food)
2. **EPA (2023):** [Greenhouse Gas Equivalencies Calculator](https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator)
3. **Cornell Hotel Sustainability Study (2023):** [Hotel Benchmarking](https://ecommons.cornell.edu/handle/1813/75)
4. **Julie's Bicycle (2023):** [Creative Green Tools](https://juliesbicycle.com/resource/creative-green-tools/)
5. **International Tourism Partnership (2023):** [Sustainable Hospitality](https://www.tourismpartnership.org/)

---

## Updates

- **Last updated:** January 27, 2025
- **Version:** 1.0
- **Maintainer:** Quanturs Team

For questions or suggestions, contact: support@quanturs.com
