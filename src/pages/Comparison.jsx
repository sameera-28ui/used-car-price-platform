import React from "react";
import { useCarData } from "../context/CarContext";
import { Link } from "react-router-dom";

// Real Cars24 data: brand → list of {model, fuel, price, minYear, maxYear}
const COMPARISON_DATA = {
  "Audi":[{"model":"A3","fuel":"Diesel","price":11.94,"minYear":2014,"maxYear":2018},{"model":"A4","fuel":"Diesel","price":6.42,"minYear":2013,"maxYear":2019},{"model":"A4","fuel":"Petrol","price":20.35,"minYear":2017,"maxYear":2022},{"model":"A6","fuel":"Diesel","price":9.42,"minYear":2012,"maxYear":2018},{"model":"Q3","fuel":"Diesel","price":9.34,"minYear":2013,"maxYear":2021},{"model":"Q5","fuel":"Diesel","price":9.32,"minYear":2013,"maxYear":2020},{"model":"Q7","fuel":"Diesel","price":11.96,"minYear":2007,"maxYear":2020},{"model":"Q7","fuel":"Petrol","price":60.11,"minYear":2022,"maxYear":2023}],
  "BMW":[{"model":"1 Series","fuel":"Diesel","price":7.58,"minYear":2013,"maxYear":2013},{"model":"3 Series","fuel":"Diesel","price":13.92,"minYear":2010,"maxYear":2019},{"model":"5 Series","fuel":"Diesel","price":14.96,"minYear":2008,"maxYear":2019},{"model":"5 Series","fuel":"Petrol","price":34.7,"minYear":2016,"maxYear":2021},{"model":"X1","fuel":"Diesel","price":13.38,"minYear":2012,"maxYear":2022},{"model":"X3","fuel":"Diesel","price":25.01,"minYear":2011,"maxYear":2022},{"model":"X5","fuel":"Diesel","price":16.17,"minYear":2009,"maxYear":2019}],
  "Hyundai":[{"model":"Creta","fuel":"Diesel","price":10.19,"minYear":2015,"maxYear":2024},{"model":"Creta","fuel":"Petrol","price":11.13,"minYear":2015,"maxYear":2024},{"model":"i20","fuel":"Petrol","price":6.24,"minYear":2012,"maxYear":2024},{"model":"i20","fuel":"Diesel","price":6.76,"minYear":2012,"maxYear":2023},{"model":"Verna","fuel":"Petrol","price":9.56,"minYear":2017,"maxYear":2024},{"model":"VENUE","fuel":"Petrol","price":8.89,"minYear":2019,"maxYear":2024},{"model":"Grand i10","fuel":"Petrol","price":4.51,"minYear":2013,"maxYear":2023}],
  "Maruti":[{"model":"Swift","fuel":"Petrol","price":5.33,"minYear":2012,"maxYear":2024},{"model":"Baleno","fuel":"Petrol","price":6.18,"minYear":2015,"maxYear":2024},{"model":"Dzire","fuel":"Petrol","price":5.97,"minYear":2012,"maxYear":2024},{"model":"Brezza","fuel":"Petrol","price":8.96,"minYear":2016,"maxYear":2024},{"model":"Ertiga","fuel":"Petrol","price":7.42,"minYear":2012,"maxYear":2024},{"model":"Alto 800","fuel":"Petrol","price":3.09,"minYear":2012,"maxYear":2024},{"model":"Wagon R","fuel":"Petrol","price":4.8,"minYear":2013,"maxYear":2024}],
  "Tata":[{"model":"Nexon","fuel":"Petrol","price":8.95,"minYear":2017,"maxYear":2024},{"model":"Nexon","fuel":"Diesel","price":9.23,"minYear":2017,"maxYear":2024},{"model":"Nexon EV","fuel":"Electric","price":12.47,"minYear":2020,"maxYear":2024},{"model":"Harrier","fuel":"Diesel","price":13.97,"minYear":2019,"maxYear":2024},{"model":"Punch","fuel":"Petrol","price":7.52,"minYear":2021,"maxYear":2024},{"model":"Tiago","fuel":"Petrol","price":4.73,"minYear":2016,"maxYear":2024},{"model":"Safari","fuel":"Diesel","price":16.43,"minYear":2021,"maxYear":2024}],
  "Honda":[{"model":"City","fuel":"Petrol","price":7.27,"minYear":2012,"maxYear":2024},{"model":"City","fuel":"Diesel","price":7.08,"minYear":2014,"maxYear":2022},{"model":"Amaze","fuel":"Petrol","price":5.25,"minYear":2013,"maxYear":2024},{"model":"WR-V","fuel":"Petrol","price":6.37,"minYear":2017,"maxYear":2022},{"model":"Jazz","fuel":"Petrol","price":5.61,"minYear":2015,"maxYear":2022},{"model":"ELEVATE","fuel":"Petrol","price":13.5,"minYear":2023,"maxYear":2024}],
  "Mahindra":[{"model":"Scorpio","fuel":"Diesel","price":9.96,"minYear":2007,"maxYear":2022},{"model":"XUV500","fuel":"Diesel","price":8.95,"minYear":2011,"maxYear":2021},{"model":"Thar","fuel":"Diesel","price":13.06,"minYear":2015,"maxYear":2024},{"model":"XUV700","fuel":"Diesel","price":17.2,"minYear":2021,"maxYear":2024},{"model":"Bolero","fuel":"Diesel","price":7.03,"minYear":2007,"maxYear":2024},{"model":"Scorpio N","fuel":"Diesel","price":14.58,"minYear":2022,"maxYear":2024}],
  "Toyota":[{"model":"Innova Crysta","fuel":"Diesel","price":13.98,"minYear":2016,"maxYear":2024},{"model":"Fortuner","fuel":"Diesel","price":21.85,"minYear":2009,"maxYear":2024},{"model":"Glanza","fuel":"Petrol","price":7.52,"minYear":2019,"maxYear":2024},{"model":"Urban Cruiser Hyryder","fuel":"Petrol","price":12.73,"minYear":2022,"maxYear":2024},{"model":"Innova Hycross","fuel":"Petrol","price":18.12,"minYear":2022,"maxYear":2024}],
  "KIA":[{"model":"Seltos","fuel":"Petrol","price":11.51,"minYear":2019,"maxYear":2024},{"model":"Seltos","fuel":"Diesel","price":12.46,"minYear":2019,"maxYear":2023},{"model":"Sonet","fuel":"Petrol","price":9.37,"minYear":2020,"maxYear":2024},{"model":"Carens","fuel":"Petrol","price":12.45,"minYear":2022,"maxYear":2024},{"model":"Carnival","fuel":"Diesel","price":18.22,"minYear":2020,"maxYear":2024}],
  "Volkswagen":[{"model":"Polo","fuel":"Petrol","price":5.74,"minYear":2010,"maxYear":2022},{"model":"Vento","fuel":"Petrol","price":6.97,"minYear":2012,"maxYear":2022},{"model":"Taigun","fuel":"Petrol","price":13.3,"minYear":2021,"maxYear":2024},{"model":"Virtus","fuel":"Petrol","price":12.7,"minYear":2022,"maxYear":2024}],
};

const MODEL_PRICES = {
  "Audi|A3":11.94,"Audi|A4":11.06,"Audi|A6":9.42,"Audi|Q3":9.34,"Audi|Q5":9.32,"Audi|Q7":15.67,
  "BMW|1 Series":7.58,"BMW|3 Series":13.92,"BMW|5 Series":18.55,"BMW|X1":13.38,"BMW|X3":25.01,"BMW|X5":16.17,
  "Hyundai|Creta":10.5,"Hyundai|i20":6.8,"Hyundai|Verna":9.5,"Hyundai|VENUE":8.5,"Hyundai|Grand i10":4.5,
  "Maruti|Swift":5.5,"Maruti|Baleno":6.5,"Maruti|Dzire":6.0,"Maruti|Brezza":9.0,"Maruti|Ertiga":7.5,
  "Tata|Nexon":9.5,"Tata|Nexon EV":13.0,"Tata|Harrier":14.5,"Tata|Punch":7.5,"Tata|Safari":16.0,
  "Honda|City":7.2,"Honda|Amaze":5.2,"Honda|WR-V":6.2,"Honda|Jazz":5.5,"Honda|ELEVATE":11.5,
  "Mahindra|Scorpio":10.0,"Mahindra|XUV700":16.5,"Mahindra|Thar":13.0,"Mahindra|XUV500":9.0,
  "Toyota|Innova Crysta":14.0,"Toyota|Fortuner":22.0,"Toyota|Glanza":7.5,"Toyota|Innova Hycross":18.0,
  "KIA|Seltos":12.0,"KIA|Sonet":9.5,"KIA|Carens":12.5,"KIA|Carnival":18.0,
  "Volkswagen|Polo":5.8,"Volkswagen|Vento":7.0,"Volkswagen|Taigun":12.5,"Volkswagen|Virtus":12.0,
};

const YEAR_MULT = {2015:0.501,2016:0.583,2017:0.721,2018:0.795,2019:0.892,2020:1.0,2021:1.133,2022:1.301,2023:1.369,2024:1.417,2025:1.364};
const KM_MULT = {"0 - 20,000 KM":1.20,"20,000 - 50,000 KM":1.00,"50,000 - 80,000 KM":0.74,"80,000 - 1,20,000 KM":0.64,"1,20,000+ KM":0.58};
const OWN_MULT = {"1st Owner":1.0,"2nd Owner":0.72,"3rd Owner":0.51,"4th Owner":0.36,"5th Owner+":0.30};

function formatPrice(lakhs) {
  return "₹" + Math.round(lakhs * 100000).toLocaleString("en-IN");
}

function getSimilarCars(predictionData) {
  if (!predictionData) return [];
  const { brand, model, fuel, year, kmDriven, ownership } = predictionData;
  const brandData = COMPARISON_DATA[brand] || [];
  const userPrice = (MODEL_PRICES[`${brand}|${model}`] || 6.0) *
    (YEAR_MULT[parseInt(year)] || 1.0) *
    (KM_MULT[kmDriven] || 1.0) *
    (OWN_MULT[ownership] || 1.0);

  // Find similar cars: same brand, similar fuel, exclude same model
  let similar = brandData.filter(c => c.model !== model);

  // Prefer same fuel type
  const sameFuel = similar.filter(c => c.fuel === fuel);
  if (sameFuel.length >= 2) similar = sameFuel;

  // Sort by price proximity to user's car
  similar = similar
    .map(c => ({
      ...c,
      adjustedPrice: c.price * (YEAR_MULT[parseInt(year)] || 1.0) * (KM_MULT[kmDriven] || 1.0) * (OWN_MULT[ownership] || 1.0),
    }))
    .sort((a, b) => Math.abs(a.adjustedPrice - userPrice) - Math.abs(b.adjustedPrice - userPrice))
    .slice(0, 3);

  return { similar, userPrice };
}

function Comparison() {
  const { predictionData } = useCarData();

  if (!predictionData) {
    return (
      <div className="dashboard-container" style={{ textAlign:"center", paddingTop:"80px" }}>
        <h1>Car Comparison</h1>
        <div className="no-prediction-bar" style={{ maxWidth:"500px", margin:"40px auto" }}>
          ⚠️ No prediction made yet. Please fill the prediction form first.
          <br /><br />
          <Link to="/predict"><button className="btn">Go to Predict →</button></Link>
        </div>
      </div>
    );
  }

  const result = getSimilarCars(predictionData);
  const { similar, userPrice } = result;

  const ourCar = {
    model: `${predictionData.brand} ${predictionData.model}`,
    price: userPrice,
    fuel: predictionData.fuel,
    year: predictionData.year,
    isOurs: true,
  };

  const allCars = [ourCar, ...similar.map(c => ({
    model: `${predictionData.brand} ${c.model}`,
    price: c.adjustedPrice,
    fuel: c.fuel,
    year: `${c.minYear}–${c.maxYear}`,
    isOurs: false,
    diff: c.adjustedPrice - userPrice,
  }))];

  return (
    <div className="dashboard-container">
      <h1>Car Comparison</h1>

      <div className="prediction-summary-bar">
        📋 Comparing: <strong>{predictionData.brand} {predictionData.model}</strong> &nbsp;|&nbsp;
        {predictionData.year} &nbsp;|&nbsp; {predictionData.fuel} &nbsp;|&nbsp; {predictionData.kmDriven}
      </div>

      <div className="dashboard-cards" style={{ marginTop:"20px" }}>
        {allCars.map((car, i) => (
          <div className={`dashboard-card ${car.isOurs ? "our-app-card" : ""}`} key={i}>
            {car.isOurs && <div className="our-app-badge">⭐ Your Car (CarAI)</div>}
            <h3>{car.model}</h3>
            <p style={{ color:"#94a3b8", fontSize:"13px" }}>{car.fuel} &nbsp;|&nbsp; {car.year}</p>
            <h2 style={{ color: car.isOurs ? "#60a5fa" : "white" }}>{formatPrice(car.price)}</h2>
            {!car.isOurs && (
              <p style={{ color: car.diff > 0 ? "#f87171" : "#34d399", fontWeight:"bold" }}>
                {car.diff > 0 ? `+${formatPrice(car.diff)} costlier` : `${formatPrice(Math.abs(car.diff))} cheaper`}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="summary-card" style={{ marginTop:"30px" }}>
        <h2>Comparison Insight</h2>
        <p>
          Your <strong>{predictionData.brand} {predictionData.model}</strong> is priced at <strong>{formatPrice(userPrice)}</strong>.
          Compared to similar {predictionData.brand} models, your car is competitively priced based on its year, mileage, and ownership history.
          {predictionData.fuel === "Electric" && " Electric vehicles command a premium in the current market."}
          {predictionData.fuel === "Diesel" && " Diesel variants typically hold higher resale value."}
        </p>
      </div>
    </div>
  );
}

export default Comparison;