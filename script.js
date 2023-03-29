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
  updateSlider(bodyFatPercentage, gender);

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

  updateSliderBackground(gender);
  
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
    { min: 2, max: 5.99, label: "Grasa esencial" },
    { min: 6, max: 13.99, label: "Atletas" },
    { min: 14, max: 17.99, label: "En forma" },
    { min: 18, max: 24.99, label: "Promedio" },
    { min: 25, label: "Obesidad" },
  ];

  const femaleCategories = [
    { min: 10, max: 13.99, label: "Grasa esencial" },
    { min: 14, max: 20.99, label: "Atletas" },
    { min: 21, max: 24.99, label: "En forma" },
    { min: 25, max: 31.99, label: "Promedio" },
    { min: 32, label: "Obesidad" },
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
//Different slider zones for each gender
const sliderBackgroundColors = {
  male: "linear-gradient(90deg, blue 12%, green 12%, green 36.5%, orange 36.5%, orange 70%, red 70%)",
  female: "linear-gradient(90deg, blue 37%, green 37%, green 56.5%, orange 56.5%, orange 90%, red 90%)",
};


const MIN_PERCENTAGE = 2;
const MAX_PERCENTAGE = 35;
const SLIDER_LENGTH = 100; // This is the percentage length of the slider, you can adjust this value.

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

function updateSlider(percentage, gender) {
  const circle = document.querySelector(".circle");

  let activeLabel;

  if (gender === "male") {
    if (percentage >= 2 && percentage <= 5.99) {
      activeLabel = 'essentialFat';
    } else if (percentage >= 6 && percentage <= 13.99) {
      activeLabel = 'athlete';
    } else if (percentage >= 14 && percentage <= 24.99) {
      activeLabel = 'inShape';
    } else {
      activeLabel = 'obese';
    }
  } else {
    if (percentage >= 10 && percentage <= 13.99) {
      activeLabel = 'essentialFat';
    } else if (percentage >= 14 && percentage <= 20.99) {
      activeLabel = 'athlete';
    } else if (percentage >= 21 && percentage <= 31.99) {
      activeLabel = 'inShape';
    } else {
      activeLabel = 'obese';
    }
  }

  setActiveLabel(activeLabel);

  // Add this line to update the slider background color
  updateSliderBackground(gender);

  // Update the slider circle position
  const position = ((percentage - MIN_PERCENTAGE) / (MAX_PERCENTAGE - MIN_PERCENTAGE)) * SLIDER_LENGTH;
  const limitedPosition = Math.min(position, SLIDER_LENGTH);
  circle.style.left = `calc(${limitedPosition}% - 10px)`;
}

function updateSliderBackground(gender) {
  const slider = document.querySelector(".slider");
  slider.style.background = sliderBackgroundColors[gender];
}

function setActiveLabel(activeLabel) {
  const activeColor = labelColors[activeLabel];
  circle.style.borderColor = activeColor;

  Object.entries(labels).forEach(([key, label]) => {
    label.style.color =(key === activeLabel) ? activeColor : 'black';
});
}

updateSliderBackground(document.getElementById("gender").value);