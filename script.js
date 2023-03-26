document.getElementById("bmr-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const age = parseInt(document.getElementById("age").value);
  const height = parseInt(document.getElementById("height").value);
  const weight = parseInt(document.getElementById("weight").value);
  const gender = document.getElementById("gender").value;
  const activityLevel = parseFloat(document.getElementById("activity-level").value);

  const neck = parseFloat(document.getElementById("neck").value);
  const waist = parseFloat(document.getElementById("waist").value);
  const hips = gender === "female" ? parseFloat(document.getElementById("hips").value) : 0;

  let bmr;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const tef = bmr * 0.1;
  const tdee = bmr * activityLevel + tef;

  // Calculate BMI
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  // Calculate body fat percentage
  const bodyFatPercentage = calculateBodyFatPercentage(gender, weight, height, age, neck, waist, hips);

  // Determine ACE classification
  const aceClassification = getACEClassification(gender, bodyFatPercentage);

  const result = `
    <h2>Tu Tasa Metabólica Basal (BMR) es: ${bmr.toFixed(2)} kcal/día</h2>
    <h2>Tu Gasto Energético Total Diario (TDEE) es: ${tdee.toFixed(2)} kcal/día</h2>
    <h2>Tu Índice de Masa Corporal (IMC) es: ${bmi.toFixed(1)}</h2>
    <h2>Tu porcentaje de grasa corporal es: ${bodyFatPercentage.toFixed(1)}% - ${aceClassification}</h2>
  `;
  
  // Update the slider value and position
  rangeSlider.value = bodyFatPercentage;
  showSliderValue();

  document.getElementById("result").innerHTML = result;
});

function calculateBodyFatPercentage(gender, weight, height, age, neck, waist, hips) {
  let bodyFatPercentage;
  if (gender === "male") {
    bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
  } else {
    bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waist + hips - neck) + 0.22100 * Math.log10(height)) - 450;
  }
  return bodyFatPercentage;
}

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

var rangeSlider = document.getElementById("bf-range-line");
var rangeBullet = document.getElementById("bf-range-bullet");

rangeSlider.addEventListener("input", showSliderValue, false);

function showSliderValue() {
  const sliderValue = rangeSlider.value;
  rangeBullet.innerHTML = sliderValue + "%";
  const bulletPosition = (rangeSlider.value / rangeSlider.max) * 100;
  rangeBullet.style.left = (bulletPosition - 8) + "%";
}

rangeSlider.addEventListener("input", showSliderValue);
showSliderValue();

