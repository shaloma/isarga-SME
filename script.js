document.getElementById("bmr-form").addEventListener("submit", function (event) {
  event.preventDefault();

  //Defining constants to make the calculation. Info gathered from the html inputs
  const age = parseInt(document.getElementById("age").value);
  const height = parseInt(document.getElementById("height").value);
  const weight = parseInt(document.getElementById("weight").value);
  const gender = document.getElementById("gender").value;
  const activityLevel = parseFloat(document.getElementById("activity-level").value);

  const neck = parseFloat(document.getElementById("neck").value);
  const waist = parseFloat(document.getElementById("waist").value);
  const hips = gender === "female" ? parseFloat(document.getElementById("hip").value) : 0;

  //Calculate Basal Metabolic Rate BMR
  let bmr;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  //Taking into account the themic effect of food (10%) and activity level, suming them to the BMR, this gives the Toatal Daily Energy Expenditure TDEE
  const tef = bmr * 0.1;
  const tdee = bmr * activityLevel + tef;

  // Calculate BMI
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  // Get BMI interpretation
  const bmiInterpretation = getBMIInterpretation(bmi);

  // Calculate body fat percentage
  const bodyFatPercentage = calculateBodyFatPercentage(gender, weight, height, age, neck, waist, hips);

  // Determine ACE classification
  const aceClassification = getACEClassification(gender, bodyFatPercentage);
  
  //Write your results
  const result = `
    <h2>Tu Tasa Metabólica Basal (BMR) es: ${bmr.toFixed(2)} kcal/día</h2>
    <h2>Tu Gasto Energético Total Diario (TDEE) es: ${tdee.toFixed(2)} kcal/día</h2>
    <h2>Tu Índice de Masa Corporal (IMC) es: ${bmi.toFixed(1)} - ${bmiInterpretation}</h2>
    <h2>Tu porcentaje de grasa corporal es: ${bodyFatPercentage.toFixed(1)}% - ${aceClassification}</h2>
  `;

  // Update the slider value and position
  updateSlider(bodyFatPercentage);

  document.getElementById("result").innerHTML = result;
});

//Funtion used in the "Wite your results" part to interpret what every percetnage of BMI means
function getBMIInterpretation(bmi) {
  if (bmi < 18.5) {
    return "Bajo peso";
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    return "Peso normal";
  } else if (bmi >= 25 && bmi <= 29.9) {
    return "Sobrepeso";
  } else if (bmi >= 30 && bmi <= 34.9) {
    return "Obesidad (Clase 1)";
  } else if (bmi >= 35 && bmi <= 39.9) {
    return "Obesidad (Clase 2)";
  } else {
    return "Obesidad (Clase 3)";
  }
}

// Will show or hide the hip measurement input and label depending on the selected gender
function toggleHipInput() {
  const gender = document.getElementById("gender").value;
  const hipLabel = document.getElementById("hip-label");
  const hipInput = document.getElementById("hip");
  
  if (gender === "female") {
    hipLabel.style.display = "block";
    hipInput.style.display = "block";
    hipInput.required = true;
  } else {
    hipLabel.style.display = "none";
    hipInput.style.display = "none";
    hipInput.required = false;
  }
}


//Funtion to calculate Body fat percentage yaking into account gender
function calculateBodyFatPercentage(gender, weight, height, age, neck, waist, hips) {
  let bodyFatPercentage;
  if (gender === "male") {
    bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
  } else {
    bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waist + hips - neck) + 0.22100 * Math.log10(height)) - 450;
  }
  return bodyFatPercentage;
}

//Interpretation of body fat percentage accodring to the ACE, first for men and then form women
function getACEClassification(gender, bodyFatPercentage) {
  const maleCategories = [
    { min: 2, max: 5, label: "Grasa esencial" },
    { min: 6, max: 13, label: "Atletas" },
    { min: 14, max: 17, label: "En forma" },
    { min: 18, max: 24, label: "Promedio" },
    { min: 25, label: "Obeso" },
  ];

  const femaleCategories = [
    { min: 10, max: 13, label: "Grasa esencial" },
    { min: 14, max: 20, label: "Atletas" },
    { min: 21, max: 24, label: "En forma" },
    { min: 25, max: 31, label: "Promedio" },
    { min: 32, label: "Obeso" },
  ];

  const categories = gender === "male" ? maleCategories : femaleCategories;

  for (const category of categories) {
    if (bodyFatPercentage >= category.min && (category.max === undefined || bodyFatPercentage <= category.max)) {
      return category.label;
    }
  }

  return "Indeterminado";
}

//This part of your JavaScript code is responsible for updating the position and display of the bullet (a small circular element) on the range slider, which represents the body fat percentage.
const circle = document.getElementById('circle');
const input = document.getElementById('input');
const labels = {
  essentialFat: document.getElementById('essential-fat'),
  athlete: document.getElementById('athlete'),
  inShape: document.getElementById('in-shape'),
  obese: document.getElementById('obese'),
};

const labelColors = {
  essentialFat: 'blue',
  athlete: 'green',
  inShape: 'orange',
  obese: 'red',
};

rangeSlider.addEventListener("input", showSliderValue);

function updateSlider(percentage) {
  const position = ((percentage - 2) / 33) * 100;
  circle.style.left = `calc(${position}% - 10px)`;

  if (percentage >= 2 && percentage <= 5) {
    setActiveLabel('essentialFat');
  } else if (percentage >= 6 && percentage <= 13) {
    setActiveLabel('athlete');
  } else if (percentage >= 14 && percentage <= 24) {
    setActiveLabel('inShape');
  } else {
    setActiveLabel('obese');
  }
}

function setActiveLabel(activeLabel) {
  const activeColor = labelColors[activeLabel];
  circle.style.borderColor = activeColor;

  Object.entries(labels).forEach(([key, label]) => {
    label.style.color =(key === activeLabel) ? activeColor : 'black';
});
}

showSliderValue();
