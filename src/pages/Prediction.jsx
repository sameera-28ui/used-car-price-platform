import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCarData } from "../context/CarContext";

const modelsByBrand = {
  "Audi": ["A3","A4","A6","A8L","Q3","Q5","Q7"],
  "BMW": ["1 Series","3 Series","3 SERIES GRAN LIMOUSINE","5 Series","7 Series","M340i","X1","X3","X5","Z4"],
  "CITROEN": ["Basalt","C3","C3 AIRCROSS","C5 AIRCROSS","E C3"],
  "Chevrolet": ["Beat","Captiva","Cruze","Enjoy","Optra Magnum","Sail","Sail UVA","Spark","Tavera"],
  "Datsun": ["Go","Go Plus","Redi Go"],
  "Fiat": ["Avventura","Grand Punto","Linea","PUNTO PURE","Punto EVO"],
  "Force": ["Motors GURKHA"],
  "Ford": ["Classic","Ecosport","Endeavour","FREESTYLE","Fiesta","Fiesta Classic","Figo","Figo Aspire","Ikon","New Figo"],
  "Honda": ["Accord","Amaze","BR-V","Brio","CRV","City","City ZX","Civic","ELEVATE","Jazz","Mobilio","WR-V"],
  "Hyundai": ["Alcazar","Aura","Creta","EXTER","EON","Elite i20","Fluidic Verna","Grand i10","Grand i10 NIOS","IONIQ 5","I10","I20 Active","Santro","Tucson","VENUE","Verna","i10","i20","i20 Active"],
  "ISUZU": ["D-Max","MU-X"],
  "Jaguar": ["F-PACE","XE","XF"],
  "Jeep": ["Compass","MERIDIAN","Wrangler"],
  "KIA": ["Carens","Carnival","EV6","Seltos","Sonet"],
  "Landrover": ["Discovery Sport","Range Rover","Range Rover Evoque","Range Rover Sport","Range Rover Velar"],
  "MG": ["Astor","Comet EV","GLOSTER","Hector","Hector Plus","ZS EV"],
  "Mahindra": ["Bolero","Bolero Neo","KUV 100 NXT","Marazzo","Scorpio","Scorpio N","Scorpio S","Thar","TUV 300","XUV 3XO","XUV300","XUV400 EV","XUV500","XUV700"],
  "Maruti": ["A Star","Alto","Alto 800","Alto K10","Baleno","Brezza","Celerio","Ciaz","Dzire","EECO","Ertiga","Fronx","GRAND VITARA","Ignis","Invicto","JIMNY","Omni","OMNI E","S-Cross","S-Presso","SX4","Swift","Swift Dzire","Vitara Brezza","Wagon R","Wagon R 1.0","XL6"],
  "Mercedes": ["A Class","B Class","C Class","CLA","E Class","GLA","GLC","GLE","GLS","S Class"],
  "Mini": ["Cooper","Cooper Countryman","Cooper S Countryman"],
  "Mitsubishi": ["Outlander","Pajero Sport"],
  "Nissan": ["Kicks","Magnite","Micra","Sunny","Terrano","X Trail"],
  "Porsche": ["Cayenne","Macan"],
  "Renault": ["KIGER","Kwid","Lodgy","Scala","Triber"],
  "Skoda": ["Kushaq","Octavia","Rapid","Slavia","Superb"],
  "Ssangyong": ["Rexton"],
  "Tata": ["Altroz","Harrier","Hexa","Indigo ECS","Nano","Nexon","Nexon EV","PUNCH EV","Punch","Safari","Sierra EV","Tiago","Tiago EV","Tigor","Tigor EV","Zest"],
  "Toyota": ["Camry","Corolla Altis","Etios","Etios Cross","Etios Liva","Fortuner","Glanza","Hilux","Innova","Innova Crysta","Innova Hycross","Land Cruiser","RUMION","Urban Cruiser","Urban Cruiser Hyryder","Yaris"],
  "Volkswagen": ["Ameo","Jetta","Polo","T-Roc","Taigun","Tiguan","Vento","Virtus"],
  "Volvo": ["S60","S90","XC40","XC60","XC90"],
};

const allBrands = Object.keys(modelsByBrand);
const allYears = Array.from({length:25},(_,i)=>String(2025-i));

// ── Autocomplete input (side dropdown) ──
function AutocompleteInput({ label, value, onChange, options, placeholder, disabled }) {
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0 });
  const ref = useRef();
  const inputRef = useRef();
  useEffect(() => { setQuery(value || ""); }, [value]);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const calcPos = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropPos({ top: rect.top, left: rect.right + 10 });
    }
  };

  const filtered = options.filter(o => o.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (val) => {
    setQuery(val);
    onChange(val);
    setOpen(false);
  };

  const handleInput = (e) => {
    setQuery(e.target.value);
    onChange("");
    calcPos();
    setOpen(true);
  };

  return (
    <div className="field-group" ref={ref} style={{ position: "relative" }}>
      <label className="field-label">{label} <span className="required-star">*</span></label>
      <input
        ref={inputRef}
        className="autocomplete-input"
        type="text"
        value={query}
        onChange={handleInput}
        onFocus={() => { if (!disabled) { calcPos(); setOpen(true); } }}
        placeholder={disabled ? "Select Brand first" : placeholder}
        disabled={disabled}
        autoComplete="off"
      />
      {open && (
        <ul className="autocomplete-dropdown" style={{ top: dropPos.top, left: dropPos.left, position: "fixed" }}>
          {filtered.length > 0
            ? filtered.map((opt, i) => (
                <li key={i} className="autocomplete-item" onMouseDown={() => handleSelect(opt)}>{opt}</li>
              ))
            : <li className="autocomplete-item-empty">No results found</li>
          }
        </ul>
      )}
    </div>
  );
}

// ── Custom select with side dropdown ──
function SideSelect({ label, name, value, onChange, options, placeholder, required }) {
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0 });
  const ref = useRef();
  const btnRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropPos({ top: rect.top, left: rect.right + 10 });
    }
    setOpen(!open);
  };

  const handleSelect = (val) => {
    onChange({ target: { name, value: val } });
    setOpen(false);
  };

  return (
    <div className="field-group" ref={ref} style={{ position: "relative" }}>
      {label && (
        <label className="field-label">
          {label} {required && <span className="required-star">*</span>}
        </label>
      )}
      <button type="button" ref={btnRef} className="side-select-btn" onClick={handleOpen}>
        <span style={{ color: value ? "#111827" : "#6b7280" }}>{value || placeholder}</span>
        <span style={{ color: "#6b7280" }}>▾</span>
      </button>
      {open && (
        <ul className="autocomplete-dropdown" style={{ top: dropPos.top, left: dropPos.left, position: "fixed" }}>
          {options.map((opt, i) => (
            <li
              key={i}
              className="autocomplete-item"
              style={{ fontWeight: opt === value ? "bold" : "normal", color: opt === value ? "#60a5fa" : "#e2e8f0" }}
              onMouseDown={() => handleSelect(opt)}
            >
              {opt === value ? "✓ " : ""}{opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Main Prediction Component ──
function Prediction() {
  const navigate = useNavigate();
  const { setPredictionData } = useCarData();
  const [error, setError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [rcFileName, setRcFileName] = useState("");
  const [rcError, setRcError] = useState("");

  const [carData, setCarData] = useState({
    brand: "", model: "", year: "", fuel: "", transmission: "",
    kmDriven: "", ownership: "", location: "", electricRange: "",
    batteryCapacity: "", insurance: "", rcCard: null,
  });

  const isElectric = carData.fuel === "Electric";
  const availableModels = carData.brand ? (modelsByBrand[carData.brand] || []) : [];

  const isFormComplete = () => {
    const base = carData.brand && carData.model && carData.year && carData.fuel &&
      carData.transmission && carData.kmDriven && carData.ownership &&
      carData.location && carData.insurance && carData.rcCard;
    if (isElectric) return base && carData.electricRange && carData.batteryCapacity;
    return base;
  };

  const setField = (field) => (val) => {
    setCarData((prev) => ({
      ...prev,
      [field]: val,
      ...(field === "brand" ? { model: "" } : {}),
    }));
  };

  const handleChange = (e) => {
    setCarData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRCUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg","image/png","image/jpg","application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setRcError("❌ Invalid file type. Please upload JPG/PNG or PDF only.");
      setRcFileName("");
      setCarData((p) => ({ ...p, rcCard: null }));
      e.target.value = "";
      return;
    }
    const name = file.name.toLowerCase();
    const rcKw = ["rc","registration","regn","reg_cert","rc_card","rc-card","vehicle_reg","vehicle_registration"];
    const badKw = ["aadhar","aadhaar","pan","passport","license","dl","driving","voter","invoice","birth","salary","bank","statement","resume","cv"];
    if (badKw.some(k => name.includes(k))) {
      setRcError(`❌ "${file.name}" is not an RC Card. Please upload your Vehicle Registration Certificate.`);
      setRcFileName("");
      setCarData((p) => ({ ...p, rcCard: null }));
      e.target.value = "";
      return;
    }
    if (!rcKw.some(k => name.includes(k))) {
      setRcError("⚠️ Could not confirm this is an RC Card. Make sure you're uploading your Vehicle Registration Certificate.");
      setCarData((p) => ({ ...p, rcCard: file }));
      setRcFileName(file.name);
      return;
    }
    setRcError("");
    setCarData((p) => ({ ...p, rcCard: file }));
    setRcFileName(file.name);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) { alert("Geolocation not supported by your browser."); return; }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&accept-language=en`
          );
          const data = await res.json();
          // Try multiple fields to get the best city name
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.suburb ||
            data.address.county ||
            data.address.state_district ||
            data.address.state ||
            "Unknown";
          setCarData((p) => ({ ...p, location: city }));
          alert(`📍 Location detected: ${city}`);
        } catch {
          // Fallback: use coordinates as location
          const lat = pos.coords.latitude.toFixed(4);
          const lon = pos.coords.longitude.toFixed(4);
          setCarData((p) => ({ ...p, location: `${lat}, ${lon}` }));
          alert("Location detected using coordinates.");
        }
        setLocationLoading(false);
      },
      (err) => {
        setLocationLoading(false);
        if (err.code === 1) {
          alert("❌ Location permission denied. Please allow location access in your browser settings.");
        } else if (err.code === 2) {
          alert("❌ Location unavailable. Please select manually.");
        } else {
          alert("❌ Location request timed out. Please select manually.");
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleReset = () => {
    setCarData({ brand:"",model:"",year:"",fuel:"",transmission:"",kmDriven:"",ownership:"",location:"",electricRange:"",batteryCapacity:"",insurance:"",rcCard:null });
    setRcFileName("");
    setRcError("");
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormComplete()) {
      setError("⚠ Please fill all required fields before predicting the car price.");
      return;
    }
    setError("");
    setPredictionData(carData);
    navigate("/result");
  };

  const fixedCities = ["Hyderabad","Bangalore","Chennai","Mumbai","Delhi","Pune","Kolkata","Ahmedabad","Jaipur","Lucknow"];
  const locationOptions = [
    ...fixedCities,
    ...(carData.location && !fixedCities.includes(carData.location) && carData.location !== "" ? [carData.location] : [])
  ];

  return (
    <div className="prediction-container">
      <h1>Used Car Price Prediction</h1>
      <form className="prediction-form" onSubmit={handleSubmit}>

        {error && <p className="error-message">{error}</p>}

        <AutocompleteInput label="Brand" value={carData.brand} onChange={setField("brand")} options={allBrands} placeholder="Type brand name..." />
        <AutocompleteInput label="Model" value={carData.model} onChange={setField("model")} options={availableModels} placeholder="Type model name..." disabled={!carData.brand} />
        <AutocompleteInput label="Year" value={carData.year} onChange={setField("year")} options={allYears} placeholder="Type year e.g. 2020" />

        <SideSelect label="Fuel Type" name="fuel" value={carData.fuel} onChange={handleChange} placeholder="Select Fuel Type" required options={["Petrol","Diesel","CNG","Electric","Hybrid"]} />

        {isElectric && (
          <div className="electric-section">
            <div className="electric-badge">⚡ Electric Vehicle Details</div>
            <SideSelect label="Electric Range (km)" name="electricRange" value={carData.electricRange} onChange={handleChange} placeholder="Select Range" required options={["0 - 150 km","150 - 300 km","300 - 450 km","450+ km"]} />
            <SideSelect label="Battery Capacity (kWh)" name="batteryCapacity" value={carData.batteryCapacity} onChange={handleChange} placeholder="Select Capacity" required options={["Below 30 kWh","30 - 50 kWh","50 - 75 kWh","75+ kWh"]} />
          </div>
        )}

        <SideSelect label="Transmission" name="transmission" value={carData.transmission} onChange={handleChange} placeholder="Select Transmission" required options={["Manual","Auto"]} />
        <SideSelect label="KM Driven" name="kmDriven" value={carData.kmDriven} onChange={handleChange} placeholder="Select KM Driven" required options={["0 - 20,000 KM","20,000 - 50,000 KM","50,000 - 80,000 KM","80,000 - 1,20,000 KM","1,20,000+ KM"]} />
        <SideSelect label="No. of Owners" name="ownership" value={carData.ownership} onChange={handleChange} placeholder="Select Ownership" required options={["1st Owner","2nd Owner","3rd Owner","4th Owner","5th Owner+"]} />
        <SideSelect label="Insurance Status" name="insurance" value={carData.insurance} onChange={handleChange} placeholder="Select Insurance" required options={["Valid (Comprehensive)","Valid (Third Party)","Expired","No Insurance"]} />

        {/* Location */}
        <div className="field-group">
          <label className="field-label">Location <span className="required-star">*</span></label>
          <div className="location-row">
            <div style={{ flex: 1 }}>
              <SideSelect name="location" value={carData.location} onChange={handleChange} placeholder="Select Location" options={locationOptions} />
            </div>
            <button type="button" className="location-btn" onClick={handleCurrentLocation} disabled={locationLoading}>
              {locationLoading ? "Detecting..." : "📍 Use Current Location"}
            </button>
          </div>
        </div>

        {/* RC Card Upload */}
        <div className="field-group">
          <label className="field-label">RC Card (Registration Certificate) <span className="required-star">*</span></label>
          <label className="rc-upload-label">
            <input type="file" accept="image/*,application/pdf" onChange={handleRCUpload} className="rc-upload-input" />
            <span className="rc-upload-btn">📄 {rcFileName || "Upload RC Card"}</span>
          </label>
          {rcError && <p className={rcError.startsWith("⚠️") ? "rc-warning" : "rc-error"}>{rcError}</p>}
          {!rcError && rcFileName && <p className="rc-success">✅ RC Card uploaded successfully</p>}
        </div>

        <p className="required-note"><span className="required-star">*</span> Required fields</p>

        <div className="button-group">
          <button type="submit" className={isFormComplete() ? "btn-predict" : "btn-predict btn-predict-disabled"} disabled={!isFormComplete()}>
            {isFormComplete() ? "🔍 Predict Price" : "🔒 Predict Price"}
          </button>
          <button type="button" onClick={handleReset} className="btn-reset">Reset</button>
        </div>

      </form>
    </div>
  );
}

export default Prediction;