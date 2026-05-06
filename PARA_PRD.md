# **📄 1\. DOC DOCUMENT — FULL PRD (PARA)**

---

## **PARA — Product Requirements Document (PRD)**

**Version:** v1.0 MVP  
 **Platform:** Mobile (React Native)  
 **Prepared by:** Francis Jacob Delos Angeles

---

## **1\. Product Overview**

**PARA** is a mobile-first public transportation intelligence platform designed to improve commuting in the Philippines through:

* Multimodal route planning  
* Real-time vehicle visibility  
* Community-driven reporting  
* Driver demand intelligence

The system introduces a **two-sided ecosystem**:

* **Commuters** → plan trips \+ signal demand  
* **Drivers** → receive demand and competition insights

---

## **2\. Problem Statement**

Public transport in the Philippines is:

* Fragmented and informal  
* Lacking real-time visibility  
* Inefficient in matching supply (jeepneys) and demand (commuters)  
* Dependent on guesswork rather than data

Drivers do not know:

* Where passengers are waiting

Commuters do not know:

* When a vehicle will arrive

---

## **3\. Product Vision**

PARA aims to become the **real-time intelligence layer for public transportation**, enabling efficient movement of people and vehicles without disrupting existing systems.

---

## **4\. Target Users**

### **Primary Users**

* Daily commuters (students, workers)

### **Secondary Users**

* Jeepney drivers

### **Future Users**

* LGUs and transport planners

---

## **5\. Core Features**

---

### **5.1 PARA Map (Visibility Layer)**

* Displays nearby jeepneys  
* Shows direction and route  
* Enables real-time tracking

---

### **5.2 PARA Route Planner**

* Input origin → destination  
* Outputs:  
  * Mode chain (jeep, trike, bus)  
  * ETA and cost

---

### **5.3 PARA Report**

Users can report:

* Accidents  
* Potholes  
* Traffic

Includes:

* Image upload  
* GPS tagging

---

### **5.4 PARA Validate**

* Users confirm reports  
* Improves reliability

---

### **5.5 PARA Points & Leaderboard**

Gamification:

* Reporting → points  
* Validation → points  
* Rankings

---

### **5.6 PARA Driver Intelligence (CORE DIFFERENTIATOR)**

Driver sees ONLY:

1. **Demand Ahead**  
   * “👥 6 passengers ahead”  
2. **Jeepneys Ahead**  
   * “🚐 2 vehicles ahead”  
3. *(Future)* Estimated capacity

---

## **6\. System Architecture**

* Frontend: React Native (Expo)  
* Backend: FastAPI  
* Database: PostgreSQL \+ PostGIS (Supabase)  
* Storage: Cloudflare R2  
* Maps: Google Maps SDK

---

## **7\. Data Flow**

* GPS → Backend → Map  
* Reports → DB → Map  
* Demand signals → Aggregation → Driver UI

---

## **8\. Development Phases**

## **Phase 1 (“Jeepney Awareness System”)**

Commuter sees:

* Nearby jeepneys  
* Route direction  
* Approx arrival


* NO booking (yet)  
* NO driver interaction (yet)  
  ---

  ## **Phase 2**

Add:

* “Signal intent” (soft, not binding)

Example:

“3 people waiting ahead”

Driver sees:

* Demand density, not individual request  
  ---

  ## **Phase 3 (Advanced)**

Only THEN:

* Add ride requests  
* Add capacity estimation

---

## **9\. Risks**

* Driver adoption  
* Data sparsity  
* GPS accuracy  
* Network effect

---

## **10\. Success Metrics**

* **Active Commuter Users (DAU/MAU):** Track the number of unique commuters using the PARA Map or Route Planner at least once per day/month. *Goal: Achieve 10,000 MAU in 6 months.*  
* **Reports Submitted & Validated:** Measure the volume of user-submitted reports (Accidents, Potholes, Traffic) per week. Also track the ratio of validated reports (using PARA Validate feature) to total reports, indicating data quality. *Goal: 100 daily reports with \>80% validation rate.*  
* **Driver Adoption & Retention Rate:** Track the percentage of targeted jeepney drivers registered and logging into the Driver Intelligence interface daily. *Goal: 50% driver adoption on key routes within 9 months.*  
* **Demand Signal Conversion Rate:** Measure the number of times commuters signal intent (Phase 2 feature) and that signal leads to a driver viewing/acting on the demand. *Goal: 70% of 'Demand Ahead' signals lead to a driver route adjustment.*

---

## **11\. Product Philosophy**

PARA enhances the current system instead of replacing it.

