document.getElementById("bmr-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const age = parseInt(document.getElementById("age").value);
  const height = parseInt(document.getElementById("height").value);
  const weight = parseInt(document.getElementById("weight").value);
  const gender = document.getElementById("gender").value;
  const activityLevel = parseFloat(document.getElementById("activity-level").value);

  let bmr;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const tef = bmr * 0.1;
  const tdee = bmr * activityLevel + tef;

  const result = `
    <h2>Tu Tasa Metabólica Basal (BMR) es: ${bmr.toFixed(2)} kcal/día</h2>
    <h2>Tu Gasto Energético Total Diario (TDEE) es: ${tdee.toFixed(2)} kcal/día</h2>
    <p>Con base en el SME, se recomienda consumir:</p>
    <ul>
      <li>${(tdee * 0.55 / 4).toFixed(1)} equivalentes de cereales y tubérculos</li>
      <li>${(tdee * 0.15 / 4).toFixed(1)} equivalentes de frutas</li>
      <li>${(tdee * 0.10 / 4).toFixed(1)} equivalentes de leguminosas</li>
      <li>${(tdee * 0.10 / 4).toFixed(1)} equivalentes de alimentos de origen animal</li>
      <li>${(tdee * 0.10 / 9).toFixed(1)} equivalentes de grasas</li>
    </ul>
  `;

  document.getElementById("result").innerHTML = result;
});

// Function to update slider values and maintain 100% total
function updateSlider(slider, valueElement) {
  valueElement.textContent = slider.value;

  const carbsSlider = document.getElementById("carbs");
  const proteinsSlider = document.getElementById("proteins");
  const lipidsSlider = document.getElementById("lipids");

  const carbsValue = parseFloat(carbsSlider.value);
  const proteinsValue = parseFloat(proteinsSlider.value);
  const lipidsValue = parseFloat(lipidsSlider.value);

  const total = carbsValue + proteinsValue + lipidsValue;
  const diff = total - 100;

  if (diff !== 0) {
    const otherSliders = [
      { id: "carbs", slider: carbsSlider, value: carbsValue },
      { id: "proteins", slider: proteinsSlider, value: proteinsValue },
      { id: "lipids", slider: lipidsSlider, value: lipidsValue },
    ].filter(s => s.id !== slider.id);

    const totalOtherSliders = otherSliders[0].value + otherSliders[1].value;
    otherSliders.forEach(s => {
      const adjustedValue = s.value - (s.value / totalOtherSliders) * diff;
      s.slider.value = adjustedValue;
      document.getElementById(s.id + "-value").textContent = adjustedValue.toFixed(0);
      });
      }
      }
      
  document.getElementById("carbs").addEventListener("input", function () {
  updateSlider(this, document.getElementById("carbs-value"));
  });
  
  document.getElementById("proteins").addEventListener("input", function () {
  updateSlider(this, document.getElementById("proteins-value"));
  });
  
  document.getElementById("lipids").addEventListener("input", function () {
  updateSlider(this, document.getElementById("lipids-value"));
  });
