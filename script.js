document.getElementById("bmr-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const age = parseInt(document.getElementById("age").value);
  const height = parseInt(document.getElementById("height").value);
  const weight = parseInt(document.getElementById("weight").value);
  const gender = document.getElementById("gender").value;
  const activityLevel = parseFloat(document.getElementById("activity-level").value);

  const carbsPercent = parseFloat(document.getElementById("carbs").value);
  const proteinsPercent = parseFloat(document.getElementById("proteins").value);
  const lipidsPercent = parseFloat(document.getElementById("lipids").value);

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
      <li>${((tdee * carbsPercent / 100) / 4).toFixed(1)} equivalentes de cereales y tubérculos</li>
      <li>${((tdee * proteinsPercent / 100) / 4).toFixed(1)} equivalentes de frutas</li>
      <li>${((tdee * lipidsPercent / 100) / 4).toFixed(1)} equivalentes de leguminosas</li>
      <li>${((tdee * proteinsPercent / 100) / 4).toFixed(1)} equivalentes de alimentos de origen animal</li>
      <li>${((tdee * lipidsPercent / 100) / 9).toFixed(1)} equivalentes de grasas</li>
      </ul>
      `;
      
      document.getElementById("result").innerHTML = result;
      });
      
      // Add event listeners for sliders to update the displayed values
      document.getElementById("carbs").addEventListener("input", function () {
      document.getElementById("carbs-value").textContent = this.value;
      });
      
      document.getElementById("proteins").addEventListener("input", function () {
      document.getElementById("proteins-value").textContent = this.value;
      });
      
      document.getElementById("lipids").addEventListener("input", function () {
      document.getElementById("lipids-value").textContent = this.value;
      });
