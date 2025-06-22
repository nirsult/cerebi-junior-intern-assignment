const sampleShipments = [
  {
    "id": "#A677",
    "destination": {
      "city": "West Hartford",
      "state": "CT",
      "country": "USA",
      "street": "Elmwood Rd 22",
      "postalCode": "06107"
    },
    "status": "Delivered",
    "expectedDelivery": "2025-06-24",
    "lastUpdate": {
      "timestamp": "2025-06-24T07:49:00Z",
      "content": "Shipment delivered to recipient"
    },
    "currentLocation": {
      "city": "West Hartford",
      "country": "USA",
      "coordinates": {
        "lat": 41.7620,
        "lon": -72.7420
      }
    },
    "routePlan": [
      "New York",
      "Springfield",
      "West Hartford"
    ],
    "expectedNext": null,
    "customsStatus": "Cleared",
    "riskLevel": "Low",
    "createdAt": "2025-06-20T10:00:00Z",
    "assignedCarrier": "UPS",
    "weightKg": 4.2,
    "deliveryType": "Regular"
  },
  {
    "id": "#B473",
    "destination": {
      "city": "Afula",
      "state": "IL",
      "country": "Israel",
      "street": "HaHistadrut 10",
      "postalCode": "18345"
    },
    "status": "Picked up",
    "expectedDelivery": "2025-06-25",
    "lastUpdate": {
      "timestamp": "2025-06-24T06:30:00Z",
      "content": "Package picked up from origin facility"
    },
    "currentLocation": {
      "city": "Haifa",
      "country": "Israel",
      "coordinates": {
        "lat": 32.7940,
        "lon": 34.9896
      }
    },
    "routePlan": [
      "Tel Aviv",
      "Haifa",
      "Afula"
    ],
    "expectedNext": "Afula",
    "customsStatus": "Not required",
    "riskLevel": "High",
    "createdAt": "2025-06-22T14:00:00Z",
    "assignedCarrier": "ILPost",
    "weightKg": 12.4,
    "deliveryType": "Regular"
  },
  {
    "id": "#C925",
    "destination": {
      "city": "Watsonville",
      "state": "CA",
      "country": "USA",
      "street": "Main St 451",
      "postalCode": "95076"
    },
    "status": "Arrived destination",
    "expectedDelivery": "2025-06-26",
    "lastUpdate": {
      "timestamp": "2025-06-23T09:15:00Z",
      "content": "Shipment arrived at final destination sorting center"
    },
    "currentLocation": {
      "city": "Watsonville",
      "country": "USA",
      "coordinates": {
        "lat": 36.9102,
        "lon": -121.7569
      }
    },
    "routePlan": [
      "Los Angeles",
      "San Jose",
      "Watsonville"
    ],
    "expectedNext": "Watsonville",
    "customsStatus": "Cleared",
    "riskLevel": "Medium",
    "createdAt": "2025-06-20T08:00:00Z",
    "assignedCarrier": "FedEx",
    "weightKg": 6.7,
    "deliveryType": "Regular"
  },
]

const HOUR = 1000 * 60 * 60
const EARLY_STAGES = ['Label created', 'Picked up', 'In transit']
const MAX_STAGE_HOUR_MAP = {
  'Label created': 4,
  'Picked up': 24,
  'In transit': 144,
  'Arrived destination': 24,
  'Local facility': 12,
  'Out for delivery': 8
}

function isShipmentAtRisk(shipmentData) {
  const { status, expectedDelivery, lastUpdate, routePlan, expectedNext } = shipmentData

  const now = new Date("2025-06-24T10:00:00Z")
  const expected = new Date(expectedDelivery)
  const lastActivity = new Date(lastUpdate.timestamp)
  const timeUntilDelivery = expected - now

  if (MAX_STAGE_HOUR_MAP[status]) {
    const maxAllowed = MAX_STAGE_HOUR_MAP[status] * HOUR
    if (now - lastActivity > maxAllowed) return true
  }

  if (timeUntilDelivery <= 48 * HOUR && EARLY_STAGES.includes(status)) return true

  if (expectedNext && !routePlan.includes(expectedNext)) return true

  return false
}

console.log('Shipment id:', sampleShipments[0].id)
console.log('EXPECTED:', false)
console.log('ACTUAL:', isShipmentAtRisk(sampleShipments[0]))

console.log('Shipment id:', sampleShipments[1].id)
console.log('EXPECTED:', true)
console.log('ACTUAL:', isShipmentAtRisk(sampleShipments[1]))

console.log('Shipment id:', sampleShipments[2].id)
console.log('EXPECTED:', true)
console.log('ACTUAL:', isShipmentAtRisk(sampleShipments[2]))