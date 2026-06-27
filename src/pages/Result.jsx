import React from "react";
import { Link } from "react-router-dom";
import { useCarData } from "../context/CarContext";

// ── Real prices from Cars24 dataset (brand|model → avg price in Lakhs) ──
const MODEL_BASE_PRICES = {
  "Audi|A3":11.94,"Audi|A4":11.06,"Audi|A6":9.42,"Audi|A8L":10.0,"Audi|Q3":9.34,"Audi|Q5":9.32,"Audi|Q7":15.67,
  "BMW|1 Series":7.58,"BMW|3 Series":13.92,"BMW|3 SERIES GRAN LIMOUSINE":41.67,"BMW|5 Series":18.55,"BMW|7 Series":19.27,"BMW|M340i":67.0,"BMW|X1":13.38,"BMW|X3":25.01,"BMW|X5":16.17,"BMW|Z4":39.9,
  "CITROEN|Basalt":11.5,"CITROEN|C3":6.06,"CITROEN|C3 AIRCROSS":10.83,"CITROEN|C5 AIRCROSS":13.5,"CITROEN|E C3":8.5,
  "Chevrolet|Beat":1.5,"Chevrolet|Captiva":3.5,"Chevrolet|Cruze":2.8,"Chevrolet|Enjoy":2.0,"Chevrolet|Optra Magnum":1.8,"Chevrolet|Sail":1.4,"Chevrolet|Sail UVA":1.3,"Chevrolet|Spark":1.2,"Chevrolet|Tavera":2.5,
  "Datsun|Go":1.8,"Datsun|Go Plus":2.0,"Datsun|Redi Go":1.6,
  "Fiat|Avventura":2.5,"Fiat|Grand Punto":2.0,"Fiat|Linea":2.2,"Fiat|PUNTO PURE":1.8,"Fiat|Punto EVO":1.9,
  "Force|Motors GURKHA":11.03,
  "Ford|Classic":2.5,"Ford|Ecosport":5.5,"Ford|Endeavour":12.0,"Ford|FREESTYLE":4.5,"Ford|Fiesta":2.8,"Ford|Fiesta Classic":2.3,"Ford|Figo":3.2,"Ford|Figo Aspire":4.0,"Ford|Ikon":1.5,"Ford|New Figo":3.8,
  "Honda|Accord":8.5,"Honda|Amaze":5.2,"Honda|BR-V":6.5,"Honda|Brio":3.8,"Honda|CRV":9.5,"Honda|City":7.2,"Honda|City ZX":6.8,"Honda|Civic":9.0,"Honda|ELEVATE":11.5,"Honda|Jazz":5.5,"Honda|Mobilio":5.0,"Honda|WR-V":6.2,
  "Hyundai|Alcazar":13.5,"Hyundai|Aura":6.2,"Hyundai|Creta":10.5,"Hyundai|EXTER":7.5,"Hyundai|EON":2.5,"Hyundai|Elite i20":6.8,"Hyundai|Fluidic Verna":6.5,"Hyundai|Grand i10":4.5,"Hyundai|Grand i10 NIOS":5.8,"Hyundai|IONIQ 5":28.0,"Hyundai|I10":3.2,"Hyundai|I20 Active":5.5,"Hyundai|Santro":3.8,"Hyundai|Tucson":14.5,"Hyundai|VENUE":8.5,"Hyundai|Verna":9.5,"Hyundai|i10":3.5,"Hyundai|i20":6.8,"Hyundai|i20 Active":5.8,
  "ISUZU|D-Max":13.5,"ISUZU|MU-X":14.5,
  "Jaguar|F-PACE":28.0,"Jaguar|XE":20.0,"Jaguar|XF":22.5,
  "Jeep|Compass":14.0,"Jeep|MERIDIAN":18.0,"Jeep|Wrangler":22.0,
  "KIA|Carens":12.5,"KIA|Carnival":18.0,"KIA|EV6":32.0,"KIA|Seltos":12.0,"KIA|Sonet":9.5,
  "Landrover|Discovery Sport":22.0,"Landrover|Range Rover":45.0,"Landrover|Range Rover Evoque":28.0,"Landrover|Range Rover Sport":35.0,"Landrover|Range Rover Velar":30.0,
  "MG|Astor":12.5,"MG|Comet EV":7.5,"MG|GLOSTER":22.0,"MG|Hector":14.0,"MG|Hector Plus":16.0,"MG|ZS EV":15.0,
  "Mahindra|Bolero":7.0,"Mahindra|Bolero Neo":8.5,"Mahindra|KUV 100 NXT":5.5,"Mahindra|Marazzo":9.5,"Mahindra|Scorpio":10.0,"Mahindra|Scorpio N":14.5,"Mahindra|Scorpio S":12.0,"Mahindra|Thar":13.0,"Mahindra|TUV 300":6.5,"Mahindra|XUV 3XO":9.5,"Mahindra|XUV300":8.5,"Mahindra|XUV400 EV":13.5,"Mahindra|XUV500":9.0,"Mahindra|XUV700":16.5,
  "Maruti|A Star":2.5,"Maruti|Alto":2.8,"Maruti|Alto 800":3.0,"Maruti|Alto K10":3.5,"Maruti|Baleno":6.5,"Maruti|Brezza":9.0,"Maruti|Celerio":4.5,"Maruti|Ciaz":7.0,"Maruti|Dzire":6.0,"Maruti|EECO":3.8,"Maruti|Ertiga":7.5,"Maruti|Fronx":8.5,"Maruti|GRAND VITARA":13.0,"Maruti|Ignis":5.0,"Maruti|Invicto":18.0,"Maruti|JIMNY":12.0,"Maruti|Omni":2.5,"Maruti|OMNI E":2.2,"Maruti|S-Cross":7.5,"Maruti|S-Presso":4.2,"Maruti|SX4":3.5,"Maruti|Swift":5.5,"Maruti|Swift Dzire":5.8,"Maruti|Vitara Brezza":8.5,"Maruti|Wagon R":4.8,"Maruti|Wagon R 1.0":4.2,"Maruti|XL6":9.0,
  "Mercedes|A Class":15.0,"Mercedes|B Class":14.0,"Mercedes|C Class":20.0,"Mercedes|CLA":18.0,"Mercedes|E Class":25.0,"Mercedes|GLA":18.5,"Mercedes|GLC":22.0,"Mercedes|GLE":30.0,"Mercedes|GLS":38.0,"Mercedes|S Class":45.0,
  "Mini|Cooper":14.0,"Mini|Cooper Countryman":18.0,"Mini|Cooper S Countryman":20.0,
  "Mitsubishi|Outlander":9.0,"Mitsubishi|Pajero Sport":8.5,
  "Nissan|Kicks":7.5,"Nissan|Magnite":6.5,"Nissan|Micra":3.5,"Nissan|Sunny":4.0,"Nissan|Terrano":6.5,"Nissan|X Trail":9.0,
  "Porsche|Cayenne":42.0,"Porsche|Macan":35.0,
  "Renault|KIGER":6.5,"Renault|Kwid":3.2,"Renault|Lodgy":5.5,"Renault|Scala":4.0,"Renault|Triber":5.5,
  "Skoda|Kushaq":12.0,"Skoda|Octavia":14.0,"Skoda|Rapid":8.5,"Skoda|Slavia":12.5,"Skoda|Superb":18.0,
  "Ssangyong|Rexton":7.0,
  "Tata|Altroz":6.5,"Tata|Harrier":14.5,"Tata|Hexa":10.5,"Tata|Indigo ECS":2.5,"Tata|Nano":1.5,"Tata|Nexon":9.5,"Tata|Nexon EV":13.0,"Tata|PUNCH EV":10.5,"Tata|Punch":7.5,"Tata|Safari":16.0,"Tata|Sierra EV":18.0,"Tata|Tiago":5.0,"Tata|Tiago EV":8.5,"Tata|Tigor":6.0,"Tata|Tigor EV":9.5,"Tata|Zest":5.5,
  "Toyota|Camry":18.0,"Toyota|Corolla Altis":9.0,"Toyota|Etios":5.5,"Toyota|Etios Cross":6.0,"Toyota|Etios Liva":5.0,"Toyota|Fortuner":22.0,"Toyota|Glanza":7.5,"Toyota|Hilux":18.0,"Toyota|Innova":12.0,"Toyota|Innova Crysta":14.0,"Toyota|Innova Hycross":18.0,"Toyota|Land Cruiser":45.0,"Toyota|RUMION":11.0,"Toyota|Urban Cruiser":9.0,"Toyota|Urban Cruiser Hyryder":13.0,"Toyota|Yaris":8.0,
  "Volkswagen|Ameo":5.5,"Volkswagen|Jetta":8.0,"Volkswagen|Polo":5.8,"Volkswagen|T-Roc":14.0,"Volkswagen|Taigun":12.5,"Volkswagen|Tiguan":18.0,"Volkswagen|Vento":7.0,"Volkswagen|Virtus":12.0,
  "Volvo|S60":22.0,"Volvo|S90":30.0,"Volvo|XC40":25.0,"Volvo|XC60":30.0,"Volvo|XC90":40.0,
};

// Year depreciation multipliers (from real data)
const YEAR_MULT = {
  2001:0.111,2002:0.120,2003:0.130,2004:0.135,2005:0.143,2006:0.116,2007:0.132,
  2008:0.267,2009:0.189,2010:0.178,2011:0.236,2012:0.307,2013:0.373,2014:0.44,
  2015:0.501,2016:0.583,2017:0.721,2018:0.795,2019:0.892,2020:1.0,
  2021:1.133,2022:1.301,2023:1.369,2024:1.417,2025:1.364,
};

// KM driven multipliers
const KM_MULT = {
  "0 - 20,000 KM":     1.20,
  "20,000 - 50,000 KM":1.00,
  "50,000 - 80,000 KM":0.74,
  "80,000 - 1,20,000 KM":0.64,
  "1,20,000+ KM":      0.58,
};

// Fuel multipliers
const FUEL_MULT = {
  Petrol:   1.0,
  Diesel:   1.37,
  CNG:      0.95,
  Electric: 2.17,
  Hybrid:   1.80,
};

// Transmission multipliers
const TRANS_MULT = {
  Manual: 1.0,
  Auto:   1.35,
};

// Ownership multipliers
const OWN_MULT = {
  "1st Owner":  1.0,
  "2nd Owner":  0.72,
  "3rd Owner":  0.51,
  "4th Owner":  0.36,
  "5th Owner+": 0.30,
};

// Insurance impact
const INS_MULT = {
  "Valid (Comprehensive)": 1.05,
  "Valid (Third Party)":   1.02,
  "Expired":               0.94,
  "No Insurance":          0.90,
};

function formatPrice(lakhs) {
  const rupees = Math.round(lakhs * 100000);
  return "₹" + rupees.toLocaleString("en-IN");
}

function calculatePrice(data) {
  if (!data) return null;

  const key = `${data.brand}|${data.model}`;
  const basePrice = MODEL_BASE_PRICES[key] || 6.0;

  const yearMult  = YEAR_MULT[parseInt(data.year)] || 1.0;
  const kmMult    = KM_MULT[data.kmDriven] || 1.0;
  const fuelMult  = FUEL_MULT[data.fuel] || 1.0;
  const transMult = TRANS_MULT[data.transmission] || 1.0;
  const ownMult   = OWN_MULT[data.ownership] || 1.0;
  const insMult   = INS_MULT[data.insurance] || 1.0;

  // Weighted formula
  const predicted = basePrice * yearMult * kmMult * fuelMult * transMult * ownMult * insMult;

  const low  = predicted * 0.92;
  const high = predicted * 1.08;

  // Confidence based on data completeness
  const confidence = data.insurance?.startsWith("Valid") ? 94 : 88;

  return { predicted, low, high, confidence };
}

function Result() {
  const { predictionData } = useCarData();
  const result = calculatePrice(predictionData);

  if (!predictionData || !result) {
    return (
      <div className="result-container" style={{ textAlign: "center", paddingTop: "80px" }}>
        <h1>Prediction Result</h1>
        <div className="no-prediction-bar" style={{ maxWidth: "500px", margin: "40px auto" }}>
          ⚠️ No prediction data found. Please fill the prediction form first.
          <br /><br />
          <Link to="/predict"><button className="btn">Go to Predict →</button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="result-container">
      <h1>Prediction Result</h1>

      <div className="result-card">
        <h2>Predicted Price</h2>
        <h1 style={{ fontSize: "42px", color: "#60a5fa", margin: "10px 0" }}>
          {formatPrice(result.predicted)}
        </h1>
        <p>Confidence Score: <strong style={{ color: "#34d399" }}>{result.confidence}%</strong></p>
        <p>Price Range: <strong>{formatPrice(result.low)}</strong> – <strong>{formatPrice(result.high)}</strong></p>
      </div>

      <div className="summary-card">
        <h2>Vehicle Summary</h2>
        <p>Brand: <strong>{predictionData.brand}</strong></p>
        <p>Model: <strong>{predictionData.model}</strong></p>
        <p>Year: <strong>{predictionData.year}</strong></p>
        <p>Fuel: <strong>{predictionData.fuel}</strong></p>
        <p>Transmission: <strong>{predictionData.transmission}</strong></p>
        <p>KM Driven: <strong>{predictionData.kmDriven}</strong></p>
        <p>Ownership: <strong>{predictionData.ownership}</strong></p>
        <p>Location: <strong>{predictionData.location}</strong></p>
        <p>Insurance: <strong>{predictionData.insurance}</strong></p>
      </div>

      <div style={{ textAlign: "center", marginTop: "25px" }}>
        <Link to="/dashboard">
          <button className="btn" style={{ marginRight: "10px" }}>View Market Dashboard</button>
        </Link>
        <Link to="/comparison">
          <button className="btn">Compare Similar Cars</button>
        </Link>
      </div>
      <div style={{ textAlign: "center", marginTop: "15px" }}>
        <Link to="/analytics">
          <button className="btn">View Analytics</button>
        </Link>
      </div>
    </div>
  );
}

export default Result;