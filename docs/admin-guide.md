# 🏎️ Showroom Admin User Guide

Welcome to the **UltraDrive Showroom Administration Portal**. This guide is designed for showroom managers, sales executives, and concierge staff to operate our CRM and inventory tools.

---

## 🧭 Navigating the Operations Center

Once logged in, your operational cockpit is located at `/dashboard`. It is divided into 4 cohesive, high-performance sections displaying **6 real-time database KPIs**:

1. **Estimated Revenue:** Dynamic tracking of all finalized showroom vehicle sales.
2. **Sell-Through Rate:** Shows current stock turn-over rates.
3. **Lead Volume:** A 30-day index of incoming customer inquiries.
4. **VIP Bookings:** Shows scheduled timeslots awaiting host assignments.
5. **Showroom Traffic:** Measures platform interaction metrics.
6. **Inventory Load:** Displays the count of registered vehicles in stock.

---

## 📋 1. Managing the Sales Pipeline (CRM Kanban)

The Leads Pipeline is located at `/dashboard/leads`. Here, digital inquiries are managed using a live Kanban board:

```txt
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ New Inquiry  │ ───► │  Contacted   │ ───► │ Interested   │
└──────────────┘      └──────────────┘      └──────────────┘
                                                    │
┌──────────────┐      ┌──────────────┐              │
│  Closed/Won  │ ◄─── │ Negotiating  │ ◄────────────┘
└──────────────┘      └──────────────┘
```

### Drag-and-Drop Operations
* To update an inquiry's state, **click and drag** its card into a different column. The status changes instantly and triggers background databases updates.

### CRM Metric Features
* **Aging Indicators:** Each card displays its duration on the floor (e.g. `3d aging`). Inquiries over `7d` are marked visually for priority followup.
* **Thermal Priority Selectors:** Click the tag dropdown on the card to categorize customer temperature:
  * 🔥 **HOT:** Imminent buyer, priority communication focus.
  * ⚡ **WARM:** Active negotiator, review daily.
  * ❄️ **COLD:** Initial inquiry, review weekly.
* **Inline Calendar:** Assign next contact schedules using the date selector on the bottom row of each card.

---

## 📅 2. Coordinating Showroom Slots (VIP Bookings)

Showroom viewing slots are managed at `/dashboard/bookings`. It provides full concierge assignment controls:

### Onboarding Steps for Incoming Bookings
1. **Dossier Preparation:** Click **`Update Dossier & Assignment`** to open client tracking fields. Write down private requests (e.g., *Client requests performance track testing specifications*).
2. **Advisor Assignment:** Select a specialist from the dropdown:
   * **Asitha L. Konara** (Showroom Director)
   * **Sarah Jenkins** (Hypercar Specialist)
   * **Marcus Vance** (VIP Concierge)
   * **Elena Rostova** (Track-day Liaison)
3. **Schedule Next Contact:** Assign the next follow-up call/email date.
4. **Confirm the Timeslot:** Click **`Confirm Booking`** on the bottom of the card. This instantly locks in the slot and fires an automated, beautiful VIP confirmation invitation to the client's email address.

---

## 🚘 3. Controlling Showroom Vehicles (Inventory)

The central fleet listing is located at `/dashboard/cars`:

* **2-Click Rapid Action Pills:** Toggle listing status directly from each vehicle card's top header pill.
  * **Draft:** Hide listing from public views while preparing photos.
  * **Published:** Instantly display the hypercar in the public inventory grid.
  * **Reserved:** Lock public booking keys for vehicle viewings.
  * **Sold:** Marks the supercar as sold.
* **Auto-Sold Celebration Trigger:** Setting status to **`Sold`** automatically sets the database `soldAt` timestamp, overlays a dark angled `'SOLD'` banner on public grids, and sends an automated deal celebration email to the entire showroom sales force!
