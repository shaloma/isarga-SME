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

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}
